<?php
declare(strict_types=1);

/**
 * Diagnostika analytiky na serveru (CLI nebo přes PHP).
 *
 *   php scripts/diag-analytics.php
 *   # nebo na hostingu po deployi:
 *   php -d display_errors=1 public/api/../...  (z DocumentRoot:)
 *   php -r '$_SERVER["DOCUMENT_ROOT"]=getcwd(); require "api/lib/analytics.php"; print_r(wm_analytics_diag());'
 */

require dirname(__DIR__) . '/public/api/lib/analytics.php';

if (PHP_SAPI === 'cli' && empty($_SERVER['DOCUMENT_ROOT'])) {
    // Simulace DocumentRoot = public/ (jako na hostingu po rsyncu dist/)
    $_SERVER['DOCUMENT_ROOT'] = dirname(__DIR__) . '/public';
}

if (PHP_SAPI !== 'cli') {
    header('Content-Type: text/plain; charset=utf-8');
}

$diag = wm_analytics_diag();
echo "WalletMap analytics diagnostics\n";
echo str_repeat('-', 40) . "\n";
foreach ($diag as $key => $value) {
    if (is_bool($value)) {
        $value = $value ? 'yes' : 'no';
    } elseif ($value === null) {
        $value = '(null)';
    }
    echo str_pad($key, 22) . $value . "\n";
}

echo str_repeat('-', 40) . "\n";
try {
    $analytics = WalletMapAnalytics::fromGlobals();
    $stats = $analytics->stats(7);
    echo "OK connect + stats()\n";
    echo 'pageviews (7d): ' . ($stats['totals']['pageviews'] ?? '?') . "\n";
    echo 'visitors  (7d): ' . ($stats['totals']['visitors'] ?? '?') . "\n";
    exit(0);
} catch (Throwable $e) {
    echo "FAIL: " . $e::class . "\n";
    echo $e->getMessage() . "\n";
    wm_analytics_log('diag', $e);
    echo "Logged via wm_analytics_log (error_log + soubor vedle DB).\n";
    exit(1);
}
