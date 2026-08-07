<?php
header("Content-Type: application/json; charset=UTF-8");
include("../model/user.php");

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["user"]) || !isset($data["password"])) {
    echo json_encode([
        "status" => "error",
        "message" => "Faltan datos obligatorios"
    ]);
    exit;
}

$user = $data["user"];
$password = $data["password"];

$result = validateUser($user, $password);

if ($result === true) {
    // ✅ Login correcto → redirige al menú
    echo json_encode([
        "status" => "ok",
        "message" => "Usuario logeado correctamente"
    ]);
    exit();
}
 else {
    echo json_encode([
        "status" => "error",
        "message" => "No se pudo logear el usuario",
    ]);
    // ❌ Login incorrecto → muestra mensaje con estilos actualizados
    exit();
}
?>

