<?php
declare(strict_types=1);

require dirname(__DIR__) . '/public/api/lib/analytics.php';

$failures = 0;

function expect(bool $ok, string $message): void
{
    global $failures;
    if ($ok) {
        echo "OK  $message\n";
        return;
    }
    $failures++;
    echo "FAIL $message\n";
}

function analyticsHarness(string $dbPath, array $server = [], array $cookies = []): array
{
    $set = new ArrayObject();
    $defaults = [
        'HTTP_HOST' => 'walletmap.eu',
        'HTTP_ORIGIN' => 'https://walletmap.eu',
        'HTTP_USER_AGENT' => 'Mozilla/5.0 WalletMapTest',
        'HTTPS' => 'on',
    ];
    $analytics = new WalletMapAnalytics(
        WalletMapAnalytics::connect($dbPath),
        array_merge($defaults, $server),
        $cookies,
        function (string $name, string $value, array $opts) use ($set): void {
            $set[$name] = ['value' => $value, 'opts' => $opts];
        },
    );
    return [$analytics, $set];
}

$db = sys_get_temp_dir() . '/walletmap-analytics-test-' . bin2hex(random_bytes(4)) . '.sqlite';
register_shutdown_function(static function () use ($db): void {
    foreach (glob($db . '*') ?: [] as $file) {
        @unlink($file);
    }
});

expect(WalletMapAnalytics::normalizePath('/clanky/arf') === '/clanky/arf', 'platná cesta');
expect(WalletMapAnalytics::normalizePath('/clanky/arf?x=1') === '/clanky/arf', 'query se odřízne');
expect(WalletMapAnalytics::normalizePath('https://evil.test/') === null, 'absolutní URL se odmítne');
expect(WalletMapAnalytics::normalizePath('/../etc/passwd') === null, 'parent segment se odmítne');
expect(
    WalletMapAnalytics::referrerHost('https://example.org/cesta?q=1', 'walletmap.eu') === 'example.org',
    'referrer jen hostname',
);
expect(
    WalletMapAnalytics::referrerHost('https://walletmap.eu/clanky', 'walletmap.eu') === null,
    'vlastní web se do referreru neukládá',
);
expect(WalletMapAnalytics::isBotUa('Mozilla/5.0 Googlebot'), 'Googlebot je bot');
expect(!WalletMapAnalytics::isBotUa('Mozilla/5.0 Firefox/128.0'), 'Firefox není bot');

[$analytics, $set] = analyticsHarness($db);

$code = $analytics->collect(['path' => '/', 'consent' => 'granted']);
expect($code === 204, 'první pageview po souhlasu');
expect(($set[WM_VID_COOKIE]['value'] ?? '') !== '', 'nastaví se visitor cookie');
expect(($set[WM_VID_COOKIE]['opts']['httponly'] ?? false) === true, 'visitor cookie je HttpOnly');
expect(($set[WM_CONSENT_COOKIE]['value'] ?? '') === 'granted', 'souhlas se uloží do cookie');
$vid = $set[WM_VID_COOKIE]['value'];

[$again, $set2] = analyticsHarness($db, [], [
    WM_CONSENT_COOKIE => 'granted',
    WM_VID_COOKIE => $vid,
]);
$code = $again->collect(['path' => '/clanky', 'consent' => 'granted', 'referrer' => 'https://news.ycombinator.com/item?id=1']);
expect($code === 204, 'druhý pageview stejného návštěvníka');

[$denied] = analyticsHarness($db);
$code = $denied->collect(['path' => '/tajne', 'consent' => 'denied']);
expect($code === 403, 'bez souhlasu se neměří');

[$bot] = analyticsHarness($db, ['HTTP_USER_AGENT' => 'curl/8.0']);
$code = $bot->collect(['path' => '/', 'consent' => 'granted']);
expect($code === 204, 'bot se tiše ignoruje');

expect(WalletMapAnalytics::botName('Mozilla/5.0 (compatible; Googlebot/2.1)') === 'googlebot', 'Googlebot jméno');
expect(
    WalletMapAnalytics::pathFromReferer('https://walletmap.eu/clanky/arf', 'walletmap.eu') === '/clanky/arf',
    'cesta z Referer',
);

[$crawler] = analyticsHarness($db, [
    'HTTP_USER_AGENT' => 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    'HTTP_REFERER' => 'https://walletmap.eu/clanky/arf',
]);
$code = $crawler->recordCrawl(null);
expect($code === 204, 'crawler se zaznamená přes Referer');

[$humanCrawl] = analyticsHarness($db, [
    'HTTP_USER_AGENT' => 'Mozilla/5.0 Firefox/128.0',
    'HTTP_REFERER' => 'https://walletmap.eu/',
]);
$code = $humanCrawl->recordCrawl(null);
expect($code === 204, 'lidský UA se do crawler statistik nezapíše');

[$cross] = analyticsHarness($db, ['HTTP_ORIGIN' => 'https://evil.example']);
$code = $cross->collect(['path' => '/', 'consent' => 'granted']);
expect($code === 403, 'cizí origin se odmítne');

[$consent] = analyticsHarness($db);
$code = $consent->setConsent('denied');
expect($code === 204, 'odmítnutí souhlasu se zaznamená');
$code = $consent->setConsent('maybe');
expect($code === 400, 'neplatná volba souhlasu');

$stats = $again->stats(30);
expect($stats['totals']['pageviews'] === 2, 'dvě lidská zobrazení');
expect($stats['totals']['visitors'] === 1, 'jeden návštěvník se cookie');
expect($stats['totals']['newVisitors'] === 1, 'první návštěva je nový návštěvník');
expect($stats['totals']['returningVisitors'] === 0, 'v období ještě není jiný vracející se');
expect($stats['pages'][0]['path'] === '/' || $stats['pages'][1]['path'] === '/', 'homepage je v top stránkách');
expect($stats['referrers'][0]['host'] === 'news.ycombinator.com', 'externí referrer se agreguje');
expect($stats['crawlers']['totals']['hits'] === 1, 'jeden crawler zásah');
expect($stats['crawlers']['bots'][0]['name'] === 'googlebot', 'googlebot v souhrnu crawlerů');

[$older] = analyticsHarness($db);
$pdo = WalletMapAnalytics::connect($db);
$oldId = str_repeat('ab', 16);
$pdo->prepare('INSERT INTO visitors (id, first_seen, last_seen) VALUES (:id, :ts, :ts)')
    ->execute(['id' => $oldId, 'ts' => '2026-01-01T00:00:00Z']);
$today = (new DateTimeImmutable('now', new DateTimeZone('Europe/Prague')))->format('Y-m-d');
$pdo->prepare(
    'INSERT INTO pageviews (visitor_id, path, referrer_host, ts, day, is_returning)
     VALUES (:id, :path, NULL, :ts, :day, 1)',
)->execute([
    'id' => $oldId,
    'path' => '/soukromi',
    'ts' => '2026-09-30T12:00:00Z',
    'day' => $today,
]);

$stats = $older->stats(30);
expect($stats['totals']['visitors'] === 2, 'vracející se návštěvník se počítá zvlášť');
expect($stats['totals']['returningVisitors'] === 1, 'returningVisitors = 1');
expect($stats['totals']['newVisitors'] === 1, 'newVisitors zůstane 1');

if ($failures > 0) {
    fwrite(STDERR, "\n$failures test(ů) selhalo\n");
    exit(1);
}

echo "\nVšechny testy analytiky prošly.\n";
