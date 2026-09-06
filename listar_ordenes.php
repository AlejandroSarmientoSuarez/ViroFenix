<?php
session_start();
require_once 'db.php';
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'No hay sesión activa']);
    exit();
}

$stmt = $pdo->prepare("
  SELECT p.PedidoID, p.FechaPedido, p.Total, p.Estado, pg.MetodoPago, e.DireccionEnvio
  FROM Pedidos p
  LEFT JOIN Pagos pg ON p.PedidoID = pg.PedidoID
  LEFT JOIN Envios e ON p.PedidoID = e.PedidoID
  WHERE p.UsuarioID = ?
");
$stmt->execute([$_SESSION['user_id']]);
$ordenes = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode(['success' => true, 'ordenes' => $ordenes]);
?>
