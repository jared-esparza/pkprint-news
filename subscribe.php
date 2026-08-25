<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'message' => 'Método no permitido.']);
    exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw ?: '', true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'message' => 'Datos no válidos.']);
    exit;
}

$name = trim((string)($data['name'] ?? ''));
$email = trim((string)($data['email'] ?? ''));
$clientType = trim((string)($data['clientType'] ?? ''));
$sector = trim((string)($data['sector'] ?? ''));
$interests = $data['interests'] ?? [];
$consent = (bool)($data['consent'] ?? false);

if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || $clientType === '' || $sector === '' || !$consent) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'message' => 'Completa todos los campos obligatorios.']);
    exit;
}

if (!is_array($interests) || count($interests) === 0) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'message' => 'Selecciona al menos un área de interés.']);
    exit;
}

/*
  INTEGRACIÓN MAILRELAY
  ---------------------
  Este archivo está preparado como backend seguro.
  Falta completar endpoint, API key e IDs internos reales de tu cuenta.
  No pongas la API key en index.html ni script.js.
*/

$apiKey = getenv('MAILRELAY_API_KEY') ?: '';
$baseUrl = rtrim(getenv('MAILRELAY_BASE_URL') ?: '', '/');

if ($apiKey === '' || $baseUrl === '') {
    http_response_code(503);
    echo json_encode([
        'ok' => false,
        'message' => 'La integración con Mailrelay todavía no está configurada en el servidor.'
    ]);
    exit;
}

$groupMap = [
    'Construcción y reformas' => null,
    'Instaladores y mantenimiento' => null,
    'Hostelería' => null,
    'Industria' => null,
    'Automoción' => null,
    'Logística y transporte' => null,
    'Comercios' => null,
    'Sanidad / Estética' => null,
    'Asociaciones / Colectivos' => null,
    'Otros profesionales' => null,
];

$mailrelayPayload = [
    'name' => $name,
    'email' => $email,
    'client_type' => $clientType,
    'sector' => $sector,
    'interests' => array_values(array_map('strval', $interests)),
    'general_group' => '00-NEWS PK PRINT',
    'sector_group_id' => $groupMap[$sector] ?? null,
    'tag' => 'Origen web pk print',
    'consent' => true,
    'consent_timestamp' => gmdate('c'),
    'consent_ip' => $_SERVER['REMOTE_ADDR'] ?? null,
];

/*
  Sustituye '/subscribers' por el endpoint real de tu API de Mailrelay
  y adapta el payload al esquema exacto que indique Mailrelay.
*/
$endpoint = $baseUrl . '/subscribers';

$ch = curl_init($endpoint);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $apiKey,
    ],
    CURLOPT_POSTFIELDS => json_encode($mailrelayPayload, JSON_UNESCAPED_UNICODE),
    CURLOPT_TIMEOUT => 15,
]);

$responseBody = curl_exec($ch);
$curlError = curl_error($ch);
$statusCode = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($responseBody === false || $curlError !== '') {
    http_response_code(502);
    echo json_encode(['ok' => false, 'message' => 'No se ha podido conectar con Mailrelay.']);
    exit;
}

if ($statusCode < 200 || $statusCode >= 300) {
    http_response_code(502);
    echo json_encode([
        'ok' => false,
        'message' => 'Mailrelay ha rechazado la solicitud. Revisa la configuración de la API.'
    ]);
    exit;
}

echo json_encode(['ok' => true]);
