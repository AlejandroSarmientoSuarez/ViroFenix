<?php
header('Content-Type: application/json');
require 'vendor/autoload.php';

use Stripe\Stripe;
use Stripe\Charge;

// Configura tu clave secreta aquí:
Stripe::setApiKey('sk_test_tuClaveSecretaStripeAquí');

// Configuración base de datos:
$host = 'localhost';
$db   = 'tu_base_de_datos';
$user = 'tu_usuario';
$pass = 'tu_contraseña';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error conexión DB: ' . $e->getMessage()]);
    exit;
}

try {
    $token = $_POST['stripeToken'] ?? null;
    $titular = $_POST['titular'] ?? 'Cliente';
    $direccion = $_POST['direccion'] ?? '';
    $total = $_POST['total'] ?? 0;

    if (!$token) {
        echo json_encode(['success' => false, 'message' => 'No se recibió token de Stripe']);
        exit;
    }

    $montoCentavos = (int)($total * 100);

    // Crear cargo en Stripe
    $charge = Charge::create([
        'amount' => $montoCentavos,
        'currency' => 'usd', // Cambia moneda si quieres
        'source' => $token,
        'description' => "Pago de compra - Titular: $titular",
        'metadata' => [
            'cliente' => $titular,
            'direccion' => $direccion
        ]
    ]);

    if ($charge->status === 'succeeded') {
        // Generar número de orden único (por ejemplo, prefijo + timestamp + aleatorio)
        $numeroOrden = 'MR-' . date('YmdHis') . '-' . random_int(1000, 9999);

        // Guardar en base de datos
        $stmt = $pdo->prepare("INSERT INTO ordenes (numero_orden, cliente, direccion, total, stripe_charge_id) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$numeroOrden, $titular, $direccion, $total, $charge->id]);

        echo json_encode(['success' => true, 'order_id' => $numeroOrden]);
    } else {
        echo json_encode(['success' => false, 'message' => 'El pago no fue exitoso']);
    }

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
