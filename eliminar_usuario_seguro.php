<?php

session_start(); 
header('Content-Type: application/json');
require_once 'db.php'; 


$userId = $_POST['id'] ?? null;

if (empty($userId) || !is_numeric($userId)) {
    echo json_encode(['success' => false, 'message' => 'ID de usuario inválido.']);
    exit();
}

try {
    $stmt = $pdo->prepare("DELETE FROM Usuarios WHERE UsuarioID = :id");
    $stmt->execute(['id' => $userId]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => true, 'message' => 'Usuario eliminado.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Usuario no encontrado o ya eliminado.']);
    }

} catch (PDOException $e) {
    error_log("Error DB Eliminación: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Error interno del servidor.']);
}
?>