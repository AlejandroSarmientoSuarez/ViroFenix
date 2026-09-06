<?php
session_start();
session_unset();
session_destroy();

// Redirigir al inicio
header("Location: views/login.php");
exit();
?>
