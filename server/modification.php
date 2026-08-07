<?php
// 1️⃣ Incluimos el archivo donde está la función
include("../model/user.php");

// 2️⃣ Verificamos si el formulario se envió por método POST
if ($_SERVER["REQUEST_METHOD"] === "POST") {

    // 3️⃣ Obtenemos los valores que el usuario ingresó
    $currentPassword = $_POST['contraseñaActual'] ?? '';
    $newPassword = $_POST['nuevaContraseña'] ?? '';

    // 4️⃣ Verificamos que no estén vacíos
    if (empty($currentPassword) || empty($newPassword)) {
        echo "Debes completar todos los campos.";
        exit;
    }

    // 5️⃣ Llamamos a la función que creaste
    $resultado = changePassword($currentPassword, $newPassword);

    // 6️⃣ Mostramos el resultado
    echo "<!DOCTYPE html>
    <html lang='es'>
    <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <title>Resultado</title>
        <link rel='stylesheet' href='../php/css/modification.css'>
        <style>
            body { 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                height: 100vh; 
                flex-direction: column;
                font-family: Arial, sans-serif;
                background-color: #f2f2f2;
            }
            .result-box {
                background: white;
                padding: 25px;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                text-align: center;
            }
            .btn {
                display: inline-block;
                margin-top: 15px;
                padding: 10px 20px;
                border-radius: 6px;
                background-color: #007BFF;
                color: white;
                text-decoration: none;
                transition: background 0.3s;
            }
            .btn:hover {
                background-color: #0056b3;
            }
        </style>
    </head>
    <body>
        <div class='result-box'>
            <h2>$resultado</h2>
            <a href='../views/index.php' class='btn'>Volver al menú</a>
        </div>
    </body>
    </html>";
    
} else {
    echo "Acceso denegado.";
}
?>