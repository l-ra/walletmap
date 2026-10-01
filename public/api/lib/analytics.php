<?php
declare(strict_types=1);

const WM_CONSENT_COOKIE = 'wm_consent';
const WM_VID_COOKIE = 'wm_vid';
const WM_CONSENT_GRANTED = 'granted';
const WM_CONSENT_DENIED = 'denied';
const WM_VID_MAX_AGE = 395 * 86400;
const WM_CONSENT_MAX_AGE = 183 * 86400;
const WM_RETENTION_DAYS = 395;
const WM_TZ = 'Europe/Prague';

final class WalletMapAnalytics
{
    public function __construct(
        private PDO $pdo,
        private array $server,
        private array $cookies,
        private $sendCookie = null,
    ) {
        $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $this->ensureSchema();
    }

    public static function dbPath(?string $override = null): string
    {
        if ($override) {
            return $override;
        }
        $env = getenv('WALLETMAP_ANALYTICS_DB');
        if (is_string($env) && $env !== '') {
            return $env;
        }
        $docRoot = $_SERVER['DOCUMENT_ROOT'] ?? '';
        if (is_string($docRoot) && $docRoot !== '') {
            $privateDir = dirname($docRoot) . '/private';
            if (is_dir($privateDir) && is_writable($privateDir)) {
                return $privateDir . '/walletmap-analytics.sqlite';
            }
        }
        return dirname(__DIR__, 2) . '/data/analytics.sqlite';
    }

    public static function connect(string $path): PDO
    {
        $dir = dirname($path);
        if (!is_dir($dir) && !mkdir($dir, 0770, true) && !is_dir($dir)) {
            throw new RuntimeException('Nelze vytvořit složku pro databázi analytiky.');
        }
        $pdo = new PDO('sqlite:' . $path);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->exec('PRAGMA journal_mode = WAL');
        $pdo->exec('PRAGMA foreign_keys = ON');
        $pdo->exec('PRAGMA busy_timeout = 5000');
        return $pdo;
    }

    public static function fromGlobals(?string $dbPath = null): self
    {
        return new self(
            self::connect(self::dbPath($dbPath)),
            $_SERVER,
            $_COOKIE,
            null,
        );
    }

    public function collect(array $input): int
    {
        if ($this->isBot()) {
            return 204;
        }
        if (!$this->isSameSiteRequest()) {
            return 403;
        }
        if (!$this->hasGrantedConsent($input)) {
            return 403;
        }

        $path = self::normalizePath((string) ($input['path'] ?? ''));
        if ($path === null) {
            return 400;
        }

        $referrerHost = self::referrerHost(
            (string) ($input['referrer'] ?? ''),
            (string) ($this->server['HTTP_HOST'] ?? ''),
        );

        $nowUtc = new DateTimeImmutable('now', new DateTimeZone('UTC'));
        $nowLocal = $nowUtc->setTimezone(new DateTimeZone(WM_TZ));
        $ts = $nowUtc->format('Y-m-d\TH:i:s\Z');
        $day = $nowLocal->format('Y-m-d');

        $existingId = $this->validVisitorId($this->cookies[WM_VID_COOKIE] ?? null);
        $isReturning = $existingId !== null;
        $visitorId = $existingId ?? bin2hex(random_bytes(16));

        $this->pdo->beginTransaction();
        try {
            if ($existingId === null) {
                $stmt = $this->pdo->prepare(
                    'INSERT INTO visitors (id, first_seen, last_seen) VALUES (:id, :ts, :ts)',
                );
                $stmt->execute(['id' => $visitorId, 'ts' => $ts]);
            } else {
                $stmt = $this->pdo->prepare(
                    'UPDATE visitors SET last_seen = :ts WHERE id = :id',
                );
                $stmt->execute(['id' => $visitorId, 'ts' => $ts]);
            }

            $stmt = $this->pdo->prepare(
                'INSERT INTO pageviews (visitor_id, path, referrer_host, ts, day, is_returning)
                 VALUES (:visitor_id, :path, :referrer_host, :ts, :day, :is_returning)',
            );
            $stmt->execute([
                'visitor_id' => $visitorId,
                'path' => $path,
                'referrer_host' => $referrerHost,
                'ts' => $ts,
                'day' => $day,
                'is_returning' => $isReturning ? 1 : 0,
            ]);
            $this->pdo->commit();
        } catch (Throwable $e) {
            $this->pdo->rollBack();
            throw $e;
        }

        $this->setCookie(WM_CONSENT_COOKIE, WM_CONSENT_GRANTED, WM_CONSENT_MAX_AGE, false);
        $this->setCookie(WM_VID_COOKIE, $visitorId, WM_VID_MAX_AGE, true);
        $this->maybePrune();
        return 204;
    }

    public function setConsent(string $action): int
    {
        if ($action !== WM_CONSENT_GRANTED && $action !== WM_CONSENT_DENIED) {
            return 400;
        }
        $ts = (new DateTimeImmutable('now', new DateTimeZone('UTC')))->format('Y-m-d\TH:i:s\Z');
        $stmt = $this->pdo->prepare(
            'INSERT INTO consent_events (ts, action) VALUES (:ts, :action)',
        );
        $stmt->execute(['ts' => $ts, 'action' => $action]);

        $this->setCookie(WM_CONSENT_COOKIE, $action, WM_CONSENT_MAX_AGE, false);
        if ($action === WM_CONSENT_DENIED) {
            $this->setCookie(WM_VID_COOKIE, '', 0, true);
        }
        return 204;
    }

    public function stats(int $days = 30): array
    {
        $days = max(1, min(WM_RETENTION_DAYS, $days));
        $today = (new DateTimeImmutable('now', new DateTimeZone(WM_TZ)))->format('Y-m-d');
        $start = (new DateTimeImmutable('now', new DateTimeZone(WM_TZ)))
            ->modify('-' . ($days - 1) . ' days')
            ->format('Y-m-d');

        $totals = $this->periodSummary($start, $today);
        $todayStats = $this->periodSummary($today, $today);

        $dayStmt = $this->pdo->prepare(
            'SELECT day,
                    COUNT(*) AS pageviews,
                    COUNT(DISTINCT visitor_id) AS visitors,
                    SUM(CASE WHEN is_returning = 0 THEN 1 ELSE 0 END) AS new_visits,
                    SUM(CASE WHEN is_returning = 1 THEN 1 ELSE 0 END) AS returning_visits
             FROM pageviews
             WHERE day BETWEEN :start AND :end
             GROUP BY day
             ORDER BY day',
        );
        $dayStmt->execute(['start' => $start, 'end' => $today]);
        $byDayRows = $dayStmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
        $byDayMap = [];
        foreach ($byDayRows as $row) {
            $byDayMap[$row['day']] = $row;
        }

        $daysOut = [];
        $cursor = new DateTimeImmutable($start, new DateTimeZone(WM_TZ));
        $endDate = new DateTimeImmutable($today, new DateTimeZone(WM_TZ));
        while ($cursor <= $endDate) {
            $key = $cursor->format('Y-m-d');
            $row = $byDayMap[$key] ?? null;
            $daysOut[] = [
                'date' => $key,
                'pageviews' => (int) ($row['pageviews'] ?? 0),
                'visitors' => (int) ($row['visitors'] ?? 0),
                'newVisits' => (int) ($row['new_visits'] ?? 0),
                'returningVisits' => (int) ($row['returning_visits'] ?? 0),
            ];
            $cursor = $cursor->modify('+1 day');
        }

        $pageStmt = $this->pdo->prepare(
            'SELECT path,
                    COUNT(*) AS pageviews,
                    COUNT(DISTINCT visitor_id) AS visitors
             FROM pageviews
             WHERE day BETWEEN :start AND :end
             GROUP BY path
             ORDER BY pageviews DESC, path ASC
             LIMIT 30',
        );
        $pageStmt->execute(['start' => $start, 'end' => $today]);
        $pages = array_map(static function (array $row): array {
            return [
                'path' => $row['path'],
                'pageviews' => (int) $row['pageviews'],
                'visitors' => (int) $row['visitors'],
            ];
        }, $pageStmt->fetchAll(PDO::FETCH_ASSOC) ?: []);

        $refStmt = $this->pdo->prepare(
            'SELECT referrer_host AS host,
                    COUNT(*) AS pageviews
             FROM pageviews
             WHERE day BETWEEN :start AND :end
               AND referrer_host IS NOT NULL
               AND referrer_host != \'\'
             GROUP BY referrer_host
             ORDER BY pageviews DESC, host ASC
             LIMIT 15',
        );
        $refStmt->execute(['start' => $start, 'end' => $today]);
        $referrers = array_map(static function (array $row): array {
            return [
                'host' => $row['host'],
                'pageviews' => (int) $row['pageviews'],
            ];
        }, $refStmt->fetchAll(PDO::FETCH_ASSOC) ?: []);

        return [
            'generatedAt' => (new DateTimeImmutable('now', new DateTimeZone('UTC')))->format('c'),
            'timezone' => WM_TZ,
            'rangeDays' => $days,
            'from' => $start,
            'to' => $today,
            'today' => $todayStats,
            'totals' => $totals,
            'days' => $daysOut,
            'pages' => $pages,
            'referrers' => $referrers,
        ];
    }

    public static function normalizePath(string $path): ?string
    {
        $path = trim($path);
        if ($path === '') {
            return null;
        }
        $path = explode('#', $path, 2)[0];
        $path = explode('?', $path, 2)[0];
        if (!str_starts_with($path, '/') || str_starts_with($path, '//')) {
            return null;
        }
        if (str_contains($path, '\\') || str_contains($path, '..')) {
            return null;
        }
        if (strlen($path) > 512) {
            return null;
        }
        if (!preg_match('#^/[A-Za-z0-9._~!$&\'()*+,;=:@%/\-]*$#', $path)) {
            return null;
        }
        return $path === '' ? '/' : $path;
    }

    public static function referrerHost(string $referrer, string $httpHost): ?string
    {
        $referrer = trim($referrer);
        if ($referrer === '') {
            return null;
        }
        $parts = parse_url($referrer);
        if (!is_array($parts) || empty($parts['host'])) {
            return null;
        }
        $host = strtolower($parts['host']);
        $own = strtolower(preg_replace('/:\d+$/', '', $httpHost) ?? '');
        if ($own !== '' && ($host === $own || $host === 'www.' . $own || 'www.' . $host === $own)) {
            return null;
        }
        return substr($host, 0, 253);
    }

    public static function isBotUa(?string $ua): bool
    {
        if ($ua === null || trim($ua) === '') {
            return true;
        }
        return (bool) preg_match(
            '/bot|crawler|spider|crawling|slurp|wget|curl|python-requests|php\/|httpclient|preview|facebookexternalhit|whatsapp|telegram|discordbot|linkedinbot|twitterbot|embedly|quora|pinterest|slackbot|vkshare|bingpreview/i',
            $ua,
        );
    }

    private function periodSummary(string $start, string $end): array
    {
        $stmt = $this->pdo->prepare(
            'SELECT COUNT(*) AS pageviews,
                    COUNT(DISTINCT visitor_id) AS visitors
             FROM pageviews
             WHERE day BETWEEN :start AND :end',
        );
        $stmt->execute(['start' => $start, 'end' => $end]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC) ?: ['pageviews' => 0, 'visitors' => 0];

        $newStmt = $this->pdo->prepare(
            'SELECT COUNT(DISTINCT visitor_id) AS n
             FROM pageviews
             WHERE day BETWEEN :start AND :end
               AND is_returning = 0',
        );
        $newStmt->execute(['start' => $start, 'end' => $end]);
        $newVisitors = (int) ($newStmt->fetch(PDO::FETCH_ASSOC)['n'] ?? 0);

        $retStmt = $this->pdo->prepare(
            'SELECT COUNT(DISTINCT visitor_id) AS n
             FROM pageviews
             WHERE day BETWEEN :start AND :end
               AND is_returning = 1
               AND visitor_id NOT IN (
                 SELECT visitor_id FROM pageviews
                 WHERE day BETWEEN :start2 AND :end2 AND is_returning = 0
               )',
        );
        $retStmt->execute([
            'start' => $start,
            'end' => $end,
            'start2' => $start,
            'end2' => $end,
        ]);
        $returningVisitors = (int) ($retStmt->fetch(PDO::FETCH_ASSOC)['n'] ?? 0);

        return [
            'pageviews' => (int) $row['pageviews'],
            'visitors' => (int) $row['visitors'],
            'newVisitors' => $newVisitors,
            'returningVisitors' => $returningVisitors,
        ];
    }

    private function ensureSchema(): void
    {
        $this->pdo->exec(
            'CREATE TABLE IF NOT EXISTS visitors (
                id TEXT PRIMARY KEY,
                first_seen TEXT NOT NULL,
                last_seen TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS pageviews (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                visitor_id TEXT NOT NULL,
                path TEXT NOT NULL,
                referrer_host TEXT,
                ts TEXT NOT NULL,
                day TEXT NOT NULL,
                is_returning INTEGER NOT NULL,
                FOREIGN KEY (visitor_id) REFERENCES visitors(id)
            );
            CREATE TABLE IF NOT EXISTS consent_events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ts TEXT NOT NULL,
                action TEXT NOT NULL
            );
            CREATE INDEX IF NOT EXISTS idx_pv_day ON pageviews(day);
            CREATE INDEX IF NOT EXISTS idx_pv_path ON pageviews(path);
            CREATE INDEX IF NOT EXISTS idx_pv_visitor ON pageviews(visitor_id);',
        );
    }

    private function hasGrantedConsent(array $input): bool
    {
        $cookie = $this->cookies[WM_CONSENT_COOKIE] ?? '';
        $body = (string) ($input['consent'] ?? '');
        return $cookie === WM_CONSENT_GRANTED || $body === WM_CONSENT_GRANTED;
    }

    private function validVisitorId(mixed $value): ?string
    {
        if (!is_string($value)) {
            return null;
        }
        if (!preg_match('/^[a-f0-9]{32}$/', $value)) {
            return null;
        }
        $stmt = $this->pdo->prepare('SELECT 1 FROM visitors WHERE id = :id');
        $stmt->execute(['id' => $value]);
        if (!$stmt->fetchColumn()) {
            return null;
        }
        return $value;
    }

    private function isBot(): bool
    {
        return self::isBotUa($this->server['HTTP_USER_AGENT'] ?? null);
    }

    private function isSameSiteRequest(): bool
    {
        $host = $this->server['HTTP_HOST'] ?? '';
        if ($host === '') {
            return false;
        }
        $origin = $this->server['HTTP_ORIGIN'] ?? '';
        $referer = $this->server['HTTP_REFERER'] ?? '';
        if ($origin !== '') {
            return $this->urlMatchesHost($origin, $host);
        }
        if ($referer !== '') {
            return $this->urlMatchesHost($referer, $host);
        }
        return true;
    }

    private function urlMatchesHost(string $url, string $host): bool
    {
        $parts = parse_url($url);
        if (!is_array($parts) || empty($parts['host'])) {
            return false;
        }
        $urlHost = strtolower($parts['host']);
        $own = strtolower(preg_replace('/:\d+$/', '', $host) ?? '');
        $urlHostBare = preg_replace('/:\d+$/', '', $urlHost) ?? $urlHost;
        return $urlHostBare === $own;
    }

    private function setCookie(string $name, string $value, int $maxAge, bool $httpOnly): void
    {
        $opts = [
            'expires' => $maxAge === 0 ? time() - 3600 : time() + $maxAge,
            'path' => '/',
            'secure' => $this->cookieSecure(),
            'httponly' => $httpOnly,
            'samesite' => 'Lax',
        ];
        if (is_callable($this->sendCookie)) {
            ($this->sendCookie)($name, $value, $opts);
            return;
        }
        setcookie($name, $value, $opts);
    }

    private function cookieSecure(): bool
    {
        $https = $this->server['HTTPS'] ?? '';
        if ($https !== '' && $https !== 'off') {
            return true;
        }
        $forwarded = strtolower((string) ($this->server['HTTP_X_FORWARDED_PROTO'] ?? ''));
        if ($forwarded === 'https') {
            return true;
        }
        $host = (string) ($this->server['SERVER_NAME'] ?? $this->server['HTTP_HOST'] ?? '');
        $host = strtolower(preg_replace('/:\d+$/', '', $host) ?? $host);
        return in_array($host, ['localhost', '127.0.0.1'], true);
    }

    private function maybePrune(): void
    {
        if (random_int(1, 50) !== 1) {
            return;
        }
        $cutoff = (new DateTimeImmutable('now', new DateTimeZone(WM_TZ)))
            ->modify('-' . WM_RETENTION_DAYS . ' days')
            ->format('Y-m-d');
        $stmt = $this->pdo->prepare('DELETE FROM pageviews WHERE day < :cutoff');
        $stmt->execute(['cutoff' => $cutoff]);
        $this->pdo->exec(
            'DELETE FROM visitors WHERE id NOT IN (SELECT DISTINCT visitor_id FROM pageviews)',
        );
        $consentCutoff = (new DateTimeImmutable('now', new DateTimeZone('UTC')))
            ->modify('-' . WM_RETENTION_DAYS . ' days')
            ->format('Y-m-d\TH:i:s\Z');
        $cStmt = $this->pdo->prepare('DELETE FROM consent_events WHERE ts < :cutoff');
        $cStmt->execute(['cutoff' => $consentCutoff]);
    }
}

function wm_json_input(): array
{
    $raw = file_get_contents('php://input');
    if (!is_string($raw) || trim($raw) === '') {
        return $_POST ?: [];
    }
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

function wm_send_status(int $code): void
{
    header_remove('X-Powered-By');
    http_response_code($code);
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
}

function wm_handle_collect(): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
        wm_send_status(405);
        header('Allow: POST');
        return;
    }
    try {
        $analytics = WalletMapAnalytics::fromGlobals();
        $code = $analytics->collect(wm_json_input());
        wm_send_status($code);
    } catch (Throwable $e) {
        wm_send_status(500);
    }
}

function wm_handle_consent(): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
        wm_send_status(405);
        header('Allow: POST');
        return;
    }
    $input = wm_json_input();
    try {
        $analytics = WalletMapAnalytics::fromGlobals();
        $code = $analytics->setConsent((string) ($input['action'] ?? ''));
        wm_send_status($code);
    } catch (Throwable $e) {
        wm_send_status(500);
    }
}

function wm_handle_stats(): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'GET') {
        wm_send_status(405);
        header('Allow: GET');
        return;
    }
    $days = isset($_GET['days']) ? (int) $_GET['days'] : 30;
    try {
        $analytics = WalletMapAnalytics::fromGlobals();
        $payload = $analytics->stats($days);
        wm_send_status(200);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    } catch (Throwable $e) {
        wm_send_status(500);
        header('Content-Type: application/json; charset=utf-8');
        echo '{"error":"stats_unavailable"}';
    }
}
