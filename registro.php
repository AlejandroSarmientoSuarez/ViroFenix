<?php
// Incluir conexión a la base de datos
require_once 'db.php'; // Asegúrate que aquí está tu $pdo

// Recibir y limpiar datos del formulario
$nombre = trim($_POST['username'] ?? '');
$apellido = trim($_POST['apellido'] ?? '');
$email = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';
$confirm_password = $_POST['confirm-password'] ?? '';

// Validaciones básicas
if (empty($nombre) || empty($apellido) || empty($email) || empty($password)) {
    die("Por favor, complete todos los campos.");
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    die("Correo electrónico inválido.");
}

if ($password !== $confirm_password) {
    die("Las contraseñas no coinciden.");
}

try {
    // Verificar si el email ya existe
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM Usuarios WHERE Email = :email");
    $stmt->execute(['email' => $email]);

    if ($stmt->fetchColumn() > 0) {
        die("El correo electrónico ya está en uso.");
    }

    // Hashear la contraseña
    $password_hash = password_hash($password, PASSWORD_DEFAULT);

    // Insertar nuevo usuario
    $stmt = $pdo->prepare("
        INSERT INTO Usuarios (Nombre, Apellido, Email, Contrasena)
        VALUES (:nombre, :apellido, :email, :contrasena)
    ");

    $result = $stmt->execute([
        'nombre' => $nombre,
        'apellido' => $apellido,
        'email' => $email,
        'contrasena' => $password_hash
    ]);

    if ($result) {
        // Redirigir a login
        header("Location: ../../../login.php");
        exit();
    } else {
        echo "Error al registrar el usuario.";
    }

} catch (PDOException $e) {
    die("Error en la base de datos: " . $e->getMessage());
}
?>