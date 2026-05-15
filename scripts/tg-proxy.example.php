<?php
/**
 * Прокси Telegram sendMessage для сайта на статике, когда api.telegram.org с браузера недоступен.
 *
 * 1) Скопируйте файл на хостинг (Timeweb), например: /public_html/api/tg-send.php
 * 2) Вставьте BOT_TOKEN и при необходимости поправьте CORS (домен сайта).
 * 3) В сборке сайта задайте: VITE_TELEGRAM_SEND_PROXY_URL=https://ваш-домен.ru/api/tg-send.php
 *
 * Запрос с фронта: POST application/x-www-form-urlencoded (те же поля, что у Telegram: chat_id, text, parse_mode, …).
 */
declare(strict_types=1);

$allowedOrigin = '*'; // или 'https://ermakcentr.ru' — точнее по безопасности

header('Access-Control-Allow-Origin: ' . $allowedOrigin);
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['ok' => false, 'description' => 'method not allowed']);
    exit;
}

/** @var string $BOT_TOKEN токен от @BotFather — только здесь, не в репозитории */
$BOT_TOKEN = 'PASTE_BOT_TOKEN_HERE';

$upstream = 'https://api.telegram.org/bot' . $BOT_TOKEN . '/sendMessage';
$rawBody = file_get_contents('php://input') ?: '';

$ch = curl_init($upstream);
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $rawBody,
    CURLOPT_HTTPHEADER => ['Content-Type: application/x-www-form-urlencoded; charset=UTF-8'],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CONNECTTIMEOUT => 15,
    CURLOPT_TIMEOUT => 30,
]);

$response = curl_exec($ch);
$errno = curl_errno($ch);
$code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($errno !== 0 || $response === false) {
    http_response_code(502);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['ok' => false, 'description' => 'proxy curl error ' . $errno]);
    exit;
}

http_response_code($code > 0 ? $code : 200);
header('Content-Type: application/json; charset=utf-8');
echo $response;
