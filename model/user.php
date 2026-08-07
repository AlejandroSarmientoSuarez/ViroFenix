<?php
include("conexion.php"); // Incluimos la función conexion()

function insert($user, $password) {
    try {
        $Conexion = conexion();
        $stmt = $Conexion->prepare("INSERT INTO usuario(usuario, clave) VALUES (?, ?)");
        if (!$stmt) return false;
        $stmt->bind_param("ss", $user, $password);
        return $stmt->execute();
    } catch(Exception $e) {
        return false;
    }
}

function verifyUser($user) {
    try {
        $Conexion = conexion();
        $stmt = $Conexion->prepare("SELECT usuario FROM usuario WHERE usuario = ?");
        $stmt->bind_param("s", $user);
        $stmt->execute();
        $stmt->store_result();
        $result = $stmt->num_rows > 0;
        $stmt->close();
        return $result;
    } catch(Exception $e) {
        return false;
    }
}

function validateUser($user, $password){
    try {
        $Conexion = conexion();
        $stmt = $Conexion->prepare("SELECT clave FROM usuario WHERE usuario = ?");
        $stmt->bind_param("s", $user);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            $stmt->bind_result($dbPassword);
            $stmt->fetch();
            $stmt->close();

            // Si las contraseñas están en texto plano
            if ($password === $dbPassword) return true;

            // Si usas hash: password_verify($password, $dbPassword)
            return "USUARIO O CONTRASEÑA INCORRECTO";
        } else {
            $stmt->close();
            return "USUARIO O CONTRASEÑA INCORRECTO";
        }
    } catch(Exception $e) {
        return "USUARIO O CONTRASEÑA INCORRECTO";
    }
}

function changePassword($currentPassword, $newPassword){
    try {
        $Conexion = conexion();

        if (!isset($_COOKIE['user'])) return "No hay sesión activa.";

        $user = $_COOKIE['user'];

        $stmt = $Conexion->prepare("SELECT clave FROM usuario WHERE usuario = ?");
        $stmt->bind_param("s", $user);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows === 0) {
            $stmt->close();
            return "Usuario no encontrado.";
        }

        $stmt->bind_result($dbPassword);
        $stmt->fetch();

        if ($currentPassword !== $dbPassword) {
            $stmt->close();
            return "La contraseña actual es incorrecta.";
        }

        $stmt->close();

        $update = $Conexion->prepare("UPDATE usuario SET clave = ? WHERE usuario = ?");
        $update->bind_param("ss", $newPassword, $user);

        if ($update->execute()) {
            setcookie('password', $newPassword, time() + 3600, '/');
            $update->close();
            return "Contraseña modificada correctamente.";
        } else {
            $update->close();
            return "Error al modificar la contraseña.";
        }

    } catch(Exception $e) {
        return "Error interno al cambiar contraseña.";
    }
}

function deleteAccount(){
    try {
        $Conexion = conexion();

        if (!isset($_COOKIE['user'])) return "No hay sesión activa.";

        $user = $_COOKIE['user'];

        $stmt = $Conexion->prepare("DELETE FROM usuario WHERE usuario = ?");
        $stmt->bind_param("s", $user);

        if ($stmt->execute()) {
            setcookie('user', '', time() - 3600, '/');
            setcookie('password', '', time() - 3600, '/');
            $stmt->close();
            return "Cuenta eliminada correctamente.";
        } else {
            $stmt->close();
            return "Error al eliminar la cuenta.";
        }

    } catch(Exception $e) {
        return "Error interno al eliminar cuenta.";
    }
}
?>
