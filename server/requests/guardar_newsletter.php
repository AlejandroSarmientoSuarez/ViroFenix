<?php
require_once "../model/conexion.php"; // Ajustado a tu estructura

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $email = trim($_POST["email"]);
    $edad = intval($_POST["edad"]);

    // Validación de email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "EMAIL_INVALIDO";
        exit;
    }

    // Edad mínima
    if ($edad < 13) {
        echo "EDAD_INSUFICIENTE";
        exit;
    }

    try {
        $Conexion = conexion();
        $stmt = $Conexion->prepare("INSERT INTO newsletter (email, edad) VALUES (?, ?)");
        $stmt->bind_param("si", $email, $edad);

        if ($stmt->execute()) {
            echo "OK";
        } else {
            echo "ERROR_DB";
        }

    } catch (Exception $e) {
        echo "ERROR_SERVER";
    }
}
