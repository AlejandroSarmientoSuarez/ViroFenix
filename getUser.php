<?php
session_start();
require_once 'db.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'No hay sesión activa']);
    exit();
}

$stmt = $pdo->prepare("SELECT Nombre, Apellido FROM Usuarios WHERE UsuarioID = ?");
$stmt->execute([$_SESSION['user_id']]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user) {
    echo json_encode([
        'username' => $user['Nombre'] . ' ' . $user['Apellido']
    ]);
} else {
    echo json_encode(['error' => 'Usuario no encontrado']);
}
?>
