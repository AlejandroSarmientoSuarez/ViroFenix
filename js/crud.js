
function accessCRUD() {
    const password = prompt("🔒 Ingrese la contraseña de administrador para acceder al CRUD:");

    // Podés cambiar la contraseña por la que quieras
    const correctPassword = "123";

    if (password === correctPassword) {
        alert("✅ Acceso concedido. Redirigiendo al panel CRUD...");
        window.location.href = "eliminar_usuarios.php";
    } else if (password !== null) {
        alert("❌ Contraseña incorrecta. Acceso denegado.");
    }
}
