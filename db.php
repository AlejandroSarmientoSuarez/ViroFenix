<?php
$host = "localhost";
$dbname = "2t"; // 👈 acá el nombre real de tu base
$user = "root";
$pass = "";

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die("Error en la conexión: " . $conn->connect_error);
}

$conn->set_charset("utf8");
?>
