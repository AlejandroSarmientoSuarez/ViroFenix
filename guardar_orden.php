<?php
header('Content-Type: application/json');
require_once 'db.php'; // ✅ Usamos la conexión central

$cliente = $_POST['cliente'] ?? 'Cliente sin nombre';
$direccion = $_POST['direccion'] ?? '';
$total = $_POST['total'] ?? 0;
$metodo_pago = $_POST['metodo_pago'] ?? 'efectivo';

// Generar número de orden
$numeroOrden = 'MR-' . date('YmdHis') . '-' . random_int(1000, 9999);

try {
    $stmt = $pdo->prepare("INSERT INTO ordenes (numero_orden, cliente, direccion, total, metodo_pago) 
                           VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$numeroOrden, $cliente, $direccion, $total, $metodo_pago]);

    echo json_encode(['success' => true, 'order_id' => $numeroOrden]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
