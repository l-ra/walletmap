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

        $candidates = [];
        $docRoot = $_SERVER['DOCUMENT_ROOT'] ?? '';
        if (is_string($docRoot) && $docRoot !== '') {
            // Preferováno mimo DocumentRoot (není veřejně servírováno).
            $privateDir = dirname($docRoot) . '/private';
            if (!is_dir($privateDir)) {
                @mkdir($privateDir, 0770, true);
            }
            $candidates[] = $privateDir . '/walletmap-analytics.sqlite';
            $candidates[] = $docRoot . '/data/analytics.sqlite';
        }
        $candidates[] = dirname(__DIR__, 2) . '/data/analytics.sqlite';

        foreach ($candidates as $path) {
            $dir = dirname($path);
            if (!is_dir($dir)) {
                @mkdir($dir, 0770, true);
            }
            if (is_dir($dir) && is_writable($dir)) {
                return $path;
            }
        }

        // Žádný kandidát není zapisovatelný — connect() vyhodí srozumitelnou chybu.
        return $candidates[0];
    }

    public static function connect(string $path): PDO
    {
        if (!extension_loaded('pdo_sqlite')) {
            throw new RuntimeException(
                'PHP rozšíření pdo_sqlite není načtené (potřeba pro SQLite analytiku).',
            );
        }
        $dir = dirname($path);
        if (!is_dir($dir) && !mkdir($dir, 0770, true) && !is_dir($dir)) {
            throw new RuntimeException('Nelze vytvořit složku pro databázi analytiky: ' . $dir);
        }
        if (!is_writable($dir)) {
            throw new RuntimeException('Složka pro databázi analytiky není zapisovatelná: ' . $dir);
        }
        if (is_file($path) && !is_writable($path)) {
            throw new RuntimeException('Soubor databáze analytiky není zapisovatelný: ' . $path);
        }
        try {
            $pdo = new PDO('sqlite:' . $path);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $pdo->exec('PRAGMA journal_mode = WAL');
            $pdo->exec('PRAGMA foreign_keys = ON');
            $pdo->exec('PRAGMA busy_timeout = 5000');
            return $pdo;
        } catch (Throwable $e) {
            throw new RuntimeException(
                'Nelze otevřít SQLite databázi analytiky (' . $path . '): ' . $e->getMessage(),
                0,
                $e,
            );
        }
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

    public function recordCrawl(?string $path = null): int
    {
        if (!$this->isBot()) {
            return 204;
        }

        if ($path === null || $path === '') {
            $path = self::pathFromReferer(
                (string) ($this->server['HTTP_REFERER'] ?? ''),
                (string) ($this->server['HTTP_HOST'] ?? ''),
            );
        }
        $path = self::normalizePath($path ?? '');
        if ($path === null) {
            return 400;
        }

        $nowUtc = new DateTimeImmutable('now', new DateTimeZone('UTC'));
        $nowLocal = $nowUtc->setTimezone(new DateTimeZone(WM_TZ));
        $ts = $nowUtc->format('Y-m-d\TH:i:s\Z');
        $day = $nowLocal->format('Y-m-d');
        $botName = self::botName((string) ($this->server['HTTP_USER_AGENT'] ?? ''));

        $stmt = $this->pdo->prepare(
            'INSERT INTO crawler_hits (path, bot_name, ts, day)
             VALUES (:path, :bot_name, :ts, :day)',
        );
        $stmt->execute([
            'path' => $path,
            'bot_name' => $botName,
            'ts' => $ts,
            'day' => $day,
        ]);
        $this->maybePrune();
        return 204;
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

        $crawlerTotals = $this->crawlerPeriodSummary($start, $today);
        $crawlerToday = $this->crawlerPeriodSummary($today, $today);

        $botStmt = $this->pdo->prepare(
            'SELECT bot_name,
                    COUNT(*) AS hits
             FROM crawler_hits
             WHERE day BETWEEN :start AND :end
             GROUP BY bot_name
             ORDER BY hits DESC, bot_name ASC
             LIMIT 15',
        );
        $botStmt->execute(['start' => $start, 'end' => $today]);
        $crawlerBots = array_map(static function (array $row): array {
            return [
                'name' => $row['bot_name'],
                'hits' => (int) $row['hits'],
            ];
        }, $botStmt->fetchAll(PDO::FETCH_ASSOC) ?: []);

        $crawlerPageStmt = $this->pdo->prepare(
            'SELECT path,
                    COUNT(*) AS hits
             FROM crawler_hits
             WHERE day BETWEEN :start AND :end
             GROUP BY path
             ORDER BY hits DESC, path ASC
             LIMIT 15',
        );
        $crawlerPageStmt->execute(['start' => $start, 'end' => $today]);
        $crawlerPages = array_map(static function (array $row): array {
            return [
                'path' => $row['path'],
                'hits' => (int) $row['hits'],
            ];
        }, $crawlerPageStmt->fetchAll(PDO::FETCH_ASSOC) ?: []);

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
            'crawlers' => [
                'today' => $crawlerToday,
                'totals' => $crawlerTotals,
                'bots' => $crawlerBots,
                'pages' => $crawlerPages,
            ],
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

    public static function botUaPattern(): string
    {
        return 'bot|crawler|spider|crawling|slurp|wget|curl|python-requests|php\\/|httpclient|preview|facebookexternalhit|whatsapp|telegram|discordbot|linkedinbot|twitterbot|embedly|quora|pinterest|slackbot|vkshare|bingpreview';
    }

    public static function isBotUa(?string $ua): bool
    {
        if ($ua === null || trim($ua) === '') {
            return true;
        }
        return (bool) preg_match('/' . self::botUaPattern() . '/i', $ua);
    }

    public static function botName(string $ua): string
    {
        $ua = trim($ua);
        if ($ua === '') {
            return 'unknown';
        }
        if (preg_match('/googlebot/i', $ua)) {
            return 'googlebot';
        }
        if (preg_match('/bingbot|bingpreview/i', $ua)) {
            return 'bingbot';
        }
        if (preg_match('/yandex/i', $ua)) {
            return 'yandex';
        }
        if (preg_match('/duckduckbot/i', $ua)) {
            return 'duckduckbot';
        }
        if (preg_match('/facebookexternalhit|facebot/i', $ua)) {
            return 'facebook';
        }
        if (preg_match('/linkedinbot/i', $ua)) {
            return 'linkedin';
        }
        if (preg_match('/twitterbot/i', $ua)) {
            return 'twitter';
        }
        if (preg_match('/slackbot/i', $ua)) {
            return 'slack';
        }
        if (preg_match('/telegrambot/i', $ua)) {
            return 'telegram';
        }
        if (preg_match('/discordbot/i', $ua)) {
            return 'discord';
        }
        if (preg_match('/whatsapp/i', $ua)) {
            return 'whatsapp';
        }
        if (preg_match('/([a-z0-9][a-z0-9._-]*bot)/i', $ua, $match)) {
            return strtolower($match[1]);
        }
        if (preg_match('/(crawler|spider|slurp|wget|curl|python-requests|httpclient)/i', $ua, $match)) {
            return strtolower($match[1]);
        }
        return 'other';
    }

    public static function pathFromReferer(string $referrer, string $httpHost): ?string
    {
        $referrer = trim($referrer);
        if ($referrer === '') {
            return null;
        }
        $parts = parse_url($referrer);
        if (!is_array($parts) || empty($parts['host']) || empty($parts['path'])) {
            return null;
        }
        $host = strtolower($parts['host']);
        $own = strtolower(preg_replace('/:\d+$/', '', $httpHost) ?? '');
        $hostBare = preg_replace('/:\d+$/', '', $host) ?? $host;
        if ($own === '' || ($hostBare !== $own && $hostBare !== 'www.' . $own && 'www.' . $hostBare !== $own)) {
            return null;
        }
        return self::normalizePath($parts['path']);
    }

    private function crawlerPeriodSummary(string $start, string $end): array
    {
        $stmt = $this->pdo->prepare(
            'SELECT COUNT(*) AS hits,
                    COUNT(DISTINCT bot_name) AS bots
             FROM crawler_hits
             WHERE day BETWEEN :start AND :end',
        );
        $stmt->execute(['start' => $start, 'end' => $end]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC) ?: ['hits' => 0, 'bots' => 0];

        return [
            'hits' => (int) $row['hits'],
            'bots' => (int) $row['bots'],
        ];
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
            CREATE TABLE IF NOT EXISTS crawler_hits (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                path TEXT NOT NULL,
                bot_name TEXT NOT NULL,
                ts TEXT NOT NULL,
                day TEXT NOT NULL
            );
            CREATE INDEX IF NOT EXISTS idx_pv_day ON pageviews(day);
            CREATE INDEX IF NOT EXISTS idx_pv_path ON pageviews(path);
            CREATE INDEX IF NOT EXISTS idx_pv_visitor ON pageviews(visitor_id);
            CREATE INDEX IF NOT EXISTS idx_crawl_day ON crawler_hits(day);
            CREATE INDEX IF NOT EXISTS idx_crawl_path ON crawler_hits(path);
            CREATE INDEX IF NOT EXISTS idx_crawl_bot ON crawler_hits(bot_name);',
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
        $cStmt = $this->pdo->prepare('DELETE FROM crawler_hits WHERE day < :cutoff');
        $cStmt->execute(['cutoff' => $cutoff]);
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

/**
 * Diagnostika cesty k DB a prostředí — bezpečné pro log (bez osobních údajů).
 *
 * @return array<string, mixed>
 */
function wm_analytics_diag(): array
{
    $path = WalletMapAnalytics::dbPath();
    $dir = dirname($path);
    $privateDir = null;
    $docRoot = $_SERVER['DOCUMENT_ROOT'] ?? '';
    if (is_string($docRoot) && $docRoot !== '') {
        $privateDir = dirname($docRoot) . '/private';
    }
    return [
        'phpVersion' => PHP_VERSION,
        'pdoSqlite' => extension_loaded('pdo_sqlite'),
        'sqlite3' => extension_loaded('sqlite3'),
        'documentRoot' => is_string($docRoot) && $docRoot !== '' ? $docRoot : null,
        'envDb' => (($env = getenv('WALLETMAP_ANALYTICS_DB')) && is_string($env) && $env !== '') ? $env : null,
        'dbPath' => $path,
        'dirExists' => is_dir($dir),
        'dirWritable' => is_dir($dir) && is_writable($dir),
        'fileExists' => is_file($path),
        'fileWritable' => is_file($path) && is_writable($path),
        'privateDir' => $privateDir,
        'privateDirExists' => is_string($privateDir) && is_dir($privateDir),
        'privateDirWritable' => is_string($privateDir) && is_dir($privateDir) && is_writable($privateDir),
        'cwd' => getcwd() ?: null,
        'user' => function_exists('posix_geteuid')
            ? ((string) (posix_getpwuid(posix_geteuid())['name'] ?? posix_geteuid()))
            : (get_current_user() ?: null),
    ];
}

/**
 * Zapíše chybu analytiky do PHP error_log a do souboru vedle DB (nebo fallback).
 *
 * Soubor: {dir DB}/walletmap-analytics.log
 * Fallback: sys_get_temp_dir()/walletmap-analytics.log a DocumentRoot/data/
 */
function wm_analytics_log(string $handler, Throwable $e): void
{
    $diag = wm_analytics_diag();
    $payload = [
        'handler' => $handler,
        'exception' => $e::class,
        'message' => $e->getMessage(),
        'file' => $e->getFile() . ':' . $e->getLine(),
        'diag' => $diag,
    ];
    $line = '[walletmap-analytics] ' . json_encode(
        $payload,
        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES,
    );
    error_log($line);

    $candidates = [];
    $dbDir = dirname((string) $diag['dbPath']);
    $candidates[] = $dbDir . '/walletmap-analytics.log';
    if (is_string($diag['documentRoot'] ?? null) && $diag['documentRoot'] !== '') {
        $candidates[] = $diag['documentRoot'] . '/data/walletmap-analytics.log';
    }
    $candidates[] = sys_get_temp_dir() . '/walletmap-analytics.log';

    $entry = date('c') . ' ' . $line . "\n";
    foreach (array_unique($candidates) as $logPath) {
        $logDir = dirname($logPath);
        if (!is_dir($logDir)) {
            @mkdir($logDir, 0770, true);
        }
        if (!is_dir($logDir) || !is_writable($logDir)) {
            continue;
        }
        if (@file_put_contents($logPath, $entry, FILE_APPEND | LOCK_EX) !== false) {
            // Jednou stačí — ať je jasné, kam se psalo.
            error_log('[walletmap-analytics] detail log: ' . $logPath);
            return;
        }
    }
    error_log('[walletmap-analytics] souborový log se nepodařilo zapsat (zkontrolujte práva)');
}

function wm_transparent_gif(): string
{
    return base64_decode('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', true) ?: '';
}

function wm_send_gif(int $code = 200): void
{
    header_remove('X-Powered-By');
    http_response_code($code);
    header('Content-Type: image/gif');
    header('Cache-Control: no-store, no-cache, must-revalidate');
    header('X-Content-Type-Options: nosniff');
    $body = wm_transparent_gif();
    header('Content-Length: ' . strlen($body));
    echo $body;
}

function wm_handle_crawl(): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'GET') {
        wm_send_status(405);
        header('Allow: GET');
        return;
    }
    try {
        $analytics = WalletMapAnalytics::fromGlobals();
        $path = isset($_GET['path']) ? (string) $_GET['path'] : null;
        $code = $analytics->recordCrawl($path);
        wm_send_gif($code >= 400 ? $code : 200);
    } catch (Throwable $e) {
        wm_analytics_log('crawl', $e);
        wm_send_gif(500);
    }
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
        wm_analytics_log('collect', $e);
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
        wm_analytics_log('consent', $e);
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
        wm_analytics_log('stats', $e);
        wm_send_status(500);
        header('Content-Type: application/json; charset=utf-8');
        echo '{"error":"stats_unavailable"}';
    }
}
