<?php
require_once '../model/conexion.php';
$conexion = conexion();

// ✅ Eliminar usuario si se envió el ID por GET
if (isset($_GET['id'])) {
    $id = intval($_GET['id']);
    $stmt = $conexion->prepare("DELETE FROM usuario WHERE ID = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $stmt->close();
    header("Location: eliminar_usuarios.php?mensaje=eliminado");
    exit;
}

// ✅ Obtener lista de usuarios
$resultado = $conexion->query("SELECT ID, usuario FROM usuario ORDER BY ID ASC");
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Eliminar Usuarios</title>

    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f6fa;
            color: #2f3640;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        /* ===========================
           NAV SUPER ESTILIZADO
        ============================ */
        header {
            width: 100%;
            background: linear-gradient(90deg, #273c75, #192a56);
            padding: 15px 0;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 1000;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .navbar {
            max-width: 1100px;
            margin: auto;
            padding: 0 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo a {
            color: #ffffff;
            font-size: 26px;
            font-weight: 800;
            text-decoration: none;
            transition: 0.3s;
        }

        .logo a:hover {
            opacity: 0.8;
        }

        .nav-links {
            list-style: none;
            display: flex;
            gap: 25px;
        }

        .nav-links a {
            color: #f5f6fa;
            font-size: 16px;
            font-weight: 500;
            text-decoration: none;
            padding: 8px 12px;
            border-radius: 8px;
            transition: 0.3s;
        }

        .nav-links a:hover {
            background: rgba(255, 255, 255, 0.15);
            transform: translateY(-2px);
        }

        /* ===========================
           CONTENEDOR
        ============================ */
        .container {
            margin-top: 140px;
            width: 90%;
            max-width: 700px;
            background: white;
            border-radius: 15px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
            padding: 25px;
            position: relative;
        }

        h2 {
            text-align: center;
            margin-bottom: 20px;
            color: #273c75;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th,
        td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #eee;
        }

        tr:hover {
            background-color: #f1f2f6;
        }

        .delete-btn {
            color: #e84118;
            font-weight: bold;
            text-decoration: none;
            font-size: 18px;
            transition: 0.3s;
        }

        .delete-btn:hover {
            color: #c23616;
            transform: scale(1.2);
        }

        .mensaje {
            text-align: center;
            color: green;
            margin-bottom: 15px;
            font-weight: 600;
        }

        /* Botón flotante "+" */
        .add-btn {
            position: absolute;
            top: 20px;
            right: 20px;
            background-color: #44bd32;
            color: white;
            font-size: 24px;
            font-weight: bold;
            text-decoration: none;
            width: 45px;
            height: 45px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
            transition: 0.3s;
        }

        .add-btn:hover {
            background-color: #2ecc71;
            transform: scale(1.1);
        }
    </style>

</head>

<body>

    <!-- NAV COMPLETO -->
    <header>
        <nav class="navbar">
            <div class="logo">
                <a href="index.php">MiPanel</a>
            </div>

            <ul class="nav-links">
                <li><a href="index.php">Inicio</a></li>
                <li><a href="agregar.php">Agregar Usuario</a></li>
                <li><a href="eliminar_usuarios.php">Eliminar Usuarios</a></li>
            </ul>
        </nav>
    </header>

    <!-- CONTENIDO -->
    <div class="container">
        <h2>Usuarios Registrados</h2>
        <a href="agregar.php" class="add-btn">+</a>

        <?php if (isset($_GET['mensaje']) && $_GET['mensaje'] == 'eliminado'): ?>
            <div class="mensaje">✅ Usuario eliminado correctamente</div>
        <?php endif; ?>

        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Usuario</th>
                    <th>Acción</th>
                </tr>
            </thead>
            <tbody>
                <?php while ($fila = $resultado->fetch_assoc()): ?>
                    <tr>
                        <td><?= htmlspecialchars($fila['ID']) ?></td>
                        <td><?= htmlspecialchars($fila['usuario']) ?></td>
                        <td>
                            <a href="?id=<?= $fila['ID'] ?>" class="delete-btn"
                                onclick="return confirm('¿Seguro que deseas eliminar este usuario?')">❌</a>
                        </td>
                    </tr>
                <?php endwhile; ?>
            </tbody>
        </table>

        <br><br>
        <h2>Suscriptores del Newsletter (LocalStorage)</h2>

        <table id="tabla-newsletter">
            <thead>
                <tr>
                    <th>Correo</th>
                    <th>Edad</th>
                    <th>Fecha</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>

        <script>
            document.addEventListener("DOMContentLoaded", () => {
                const tabla = document.querySelector("#tabla-newsletter tbody");

                let lista = JSON.parse(localStorage.getItem("newsletter")) || [];

                lista.forEach(item => {
                    let fila = document.createElement("tr");

                    fila.innerHTML = `
                        <td>${item.correo}</td>
                        <td>${item.edad}</td>
                        <td>${item.fecha}</td>
                    `;

                    tabla.appendChild(fila);
                });
            });
        </script>

    </div>

</body>

</html>
