document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("newsletter-form");
    const msg = document.getElementById("newsletter-msg");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const correo = document.getElementById("correo").value.trim();
        const edad = document.getElementById("edad").value.trim();

        // Obtener lista existente
        let lista = JSON.parse(localStorage.getItem("newsletter")) || [];

        // Crear registro
        lista.push({
            correo: correo,
            edad: edad,
            fecha: new Date().toLocaleDateString()
        });

        // Guardar
        localStorage.setItem("newsletter", JSON.stringify(lista));

        msg.textContent = "Gracias por confiar en nosotros. Tu suscripción fue registrada con éxito.";
        msg.style.color = "limegreen";

        form.reset();
    });

});
