<?php
function conexion() {
    $base = "2t";
    $Conexion = mysqli_connect("localhost", "root", "", $base);
    return $Conexion;
}
?>
