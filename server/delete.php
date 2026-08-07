<?php
include("../model/user.php"); // o donde tengas la función deleteAccount()

header('Content-Type: application/json; charset=utf-8');

$result = deleteAccount();

echo json_encode(["message" => $result]);
?>