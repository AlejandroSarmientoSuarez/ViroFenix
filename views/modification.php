<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pinto Libros - Modificar contraseña</title>

    <script src="../js/reveral.js" defer></script>
    <link rel="stylesheet" href="../css/modification.css">
    <link rel="stylesheet" href="../css/reveral.css">
</head>
<body>
    <form class="mainbox reveal" action="../server/modification.php" method="POST" enctype="multipart/form-data">
        <p class="indtitle">Modificar Contraseña</p>

        <!-- Campo contraseña actual -->
        <input 
            type="password" 
            name="contraseñaActual" 
            id="contraseñaActual" 
            class="indform" 
            placeholder="Contraseña Actual" 
            required
        >

        <!-- Campo nueva contraseña -->
        <input 
            type="password" 
            name="nuevaContraseña" 
            id="nuevaContraseña" 
            class="indform" 
            placeholder="Nueva Contraseña" 
            required
        >

        <button type="submit" class="indbutton reveal">Modificar</button>
        <a class="AskButton" href="index.php">Volver al Menu</a>
    </form>
</body>
</html>

