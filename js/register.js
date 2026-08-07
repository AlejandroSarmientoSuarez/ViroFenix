async function register(event) {

    event.preventDefault();

    const nombre =
        document.getElementById("nombre").value.trim();

    const apellido =
        document.getElementById("apellido").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;

    if (
        !nombre ||
        !apellido ||
        !email ||
        !password ||
        !confirmPassword
    ) {
        alert("Completa todos los campos");
        return;
    }

    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        alert("Ingresa un correo válido");
        return;
    }

    if (password.length < 8) {
        alert(
            "La contraseña debe tener al menos 8 caracteres"
        );
        return;
    }

    if (password !== confirmPassword) {
        alert("Las contraseñas no coinciden");
        return;
    }

    const info = {
        nombre,
        apellido,
        email,
        password
    };

    try {

        const res = await fetch(
            "../server/high.php",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(info)
            }
        );

        if (!res.ok) {
            throw new Error(
                "Error en la conexión con el servidor"
            );
        }

        const data = await res.json();

        console.log(data);

        if (data.status === "ok") {

            alert(
                "✅ Cuenta creada correctamente"
            );

            window.location.href =
                "login.php";

        } else {

            alert(
                "⚠️ " +
                (
                    data.message ||
                    "No se pudo registrar"
                )
            );

        }

    } catch (err) {

        console.error(err);

        alert(
            "❌ Error al conectar con el servidor"
        );

    }

}