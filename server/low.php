<?php
include("../model/user.php");

$result = deleteAccount();

if ($result === "Cuenta eliminada correctamente.") {
    // Redirigir al login o página de inicio
    header("Location: ../views/login.php?msg=deleted");
    exit();
} else {
    echo $result; // Muestra el mensaje de error si falla
}
?>