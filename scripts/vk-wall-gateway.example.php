<?php
/**
 * Альтернатива Node: залить на Timeweb как vk-lead.php, задать VK_GROUP_TOKEN в окружении или ниже.
 * Фронт: VITE_VK_LEAD_GATEWAY_URL=https://ваш-домен.ru/vk-lead.php
 *
 * POST / JSON тело — те же поля, что шлёт src/lib/vkLeadGateway.ts (см. VkWallLeadPayload).
 */
declare(strict_types=1);

$allowedOrigins = ['https://ermakcentr.ru', 'https://www.ermakcentr.ru', 'http://localhost:5173', 'http://127.0.0.1:5173'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allow = in_array($origin, $allowedOrigins, true) ? $origin : 'https://ermakcentr.ru';

header('Access-Control-Allow-Origin: ' . $allow);
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['ok' => false, 'error' => 'method']);
    exit;
}

$token = getenv('VK_GROUP_TOKEN') ?: 'PASTE_TOKEN_HERE';
if ($token === '' || $token === 'PASTE_TOKEN_HERE') {
    error_log('[vk-gateway] VK_GROUP_TOKEN missing');
    http_response_code(200);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['ok' => true]);
    exit;
}

$raw = file_get_contents('php://input') ?: '{}';
$body = json_decode($raw, true);
if (!is_array($body)) {
    $body = [];
}

$s = static function ($v, int $max = 6000): string {
    if (!is_string($v)) {
        return '';
    }
    $t = str_replace(["\r\n", "\r"], "\n", trim($v));
    return mb_strlen($t) > $max ? mb_substr($t, 0, $max) . '…' : $t;
};

$course = $s($body['course'] ?? '') ?: '—';
$name = $s($body['name'] ?? '', 300) ?: '—';
$phone = $s($body['phone'] ?? '', 80) ?: '—';
$mess = $s($body['messengers'] ?? '', 500);
$comment = $s($body['comment'] ?? '', 3500);
$page = $s($body['pageUrl'] ?? '', 2000);

$dt = (new DateTime('now', new DateTimeZone('Asia/Novosibirsk')))->format('d.m.Y, H:i:s');

$message = implode("\n", [
    '🔥 Новая заявка с сайта ЕРМАК',
    '',
    'Курс: ' . $course,
    'Имя: ' . $name,
    'Телефон: ' . $phone,
    'Telegram/WhatsApp: ' . ($mess !== '' ? $mess : '—'),
    'Комментарий: ' . ($comment !== '' ? $comment : '—'),
    'Страница заявки: ' . ($page !== '' ? $page : '—'),
    'Дата и время: ' . $dt . ' (Новосибирск)',
]);

$params = http_build_query([
    'owner_id' => -238725296,
    'from_group' => 1,
    'message' => $message,
    'access_token' => $token,
    'v' => '5.199',
], '', '&', PHP_QUERY_RFC3986);

$ch = curl_init('https://api.vk.com/method/wall.post');
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $params,
    CURLOPT_HTTPHEADER => ['Content-Type: application/x-www-form-urlencoded; charset=UTF-8'],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 25,
]);
$resp = curl_exec($ch);
$code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$data = json_decode((string) $resp, true);
if (!is_array($data) || isset($data['error'])) {
    error_log('[vk-gateway] wall.post fail ' . $code . ' ' . substr((string) $resp, 0, 2000));
}

header('Content-Type: application/json; charset=utf-8');
http_response_code(200);
echo json_encode(['ok' => true]);
