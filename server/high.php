<?php
header("Content-Type: application/json; charset=UTF-8");
include("../model/user.php");

// Decodificar datos enviados desde fetch()
$data = json_decode(file_get_contents("php://input"), true);

// Validar existencia de claves
if (!isset($data["user"]) || !isset($data["password"])) {
    echo json_encode([
        "status" => "error",
        "message" => "Faltan datos obligatorios"
    ]);
    exit;
}

$user = $data["user"];
$password = $data["password"];

// Validar campos vacíos
if ($user === "" || $password === "") {
    echo json_encode([
        "status" => "error",
        "message" => "Los campos usuario y contraseña no pueden estar vacíos"
    ]);
    exit;
}

// Verificar si ya existe antes de insertar
$exist = verifyUser($user);
if ($exist) {
    echo json_encode([
        "status" => "error",
        "message" => "Ya existe este usuario"
    ]);
    exit;
}

// Insertar usuario si no existe
$result = insert($user, $password);

if ($result) {
    echo json_encode([
        "status" => "ok",
        "message" => "Usuario registrado correctamente"
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "No se pudo registrar el usuario"
    ]);
}
?>