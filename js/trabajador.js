const trabajadores = {
    alejandro: {
        nombre: "Alejandro Sarmiento",
        info: `
      👤 Edad: 17 años<br>
      💻 Lenguajes: Python, JavaScript, C++, HTML, CSS<br>
      🌍 Nacionalidad: Argentina<br>
      🧠 Experiencia: 2 años en desarrollo web y proyectos de inteligencia artificial`
    },
    uriel: {
        nombre: "Uriel Torterola",
        info: `
      👤 Edad: 18 años<br>
      💻 Lenguajes: Java, PHP, SQL<br>
      🌍 Nacionalidad: Argentina<br>
      🧠 Experiencia: Coordinación de proyectos y backend`
    },
    adrian: {
        nombre: "Adrian Vega",
        info: `
      👤 Edad: 19 años<br>
      💻 Lenguajes: HTML, CSS, JavaScript<br>
      🌍 Nacionalidad: Argentina<br>
      🧠 Experiencia: Estrategia de marketing y optimización UX/UI`
    },
    pedro: {
        nombre: "Pedro Wang Lin",
        info: `
      👤 Edad: 20 años<br>
      💻 Lenguajes: Python, PHP<br>
      🌍 Nacionalidad: China-Argentina<br>
      🧠 Experiencia: Atención al cliente y automatización de procesos`
    },
    mateo: {
        nombre: "Mateo Aranguez",
        info: `
      👤 Edad: 18 años<br>
      💻 Lenguajes: JavaScript, React, HTML, CSS<br>
      🌍 Nacionalidad: Argentina<br>
      🧠 Experiencia: Desarrollo frontend y diseño responsivo`
    },
    alex: {
        nombre: "Alex Baruc",
        info: `
      👤 Edad: 21 años<br>
      💻 Lenguajes: Bash, Python, SQL<br>
      🌍 Nacionalidad: Argentina<br>
      🧠 Experiencia: Administración de servidores y bases de datos`
    },
    martin: {
        nombre: "Martin Chamorro",
        info: `
      👤 Edad: 22 años<br>
      💻 Lenguajes: Python, R, SQL<br>
      🌍 Nacionalidad: Argentina<br>
      🧠 Experiencia: Análisis de datos y machine learning`
    }
};

function mostrarModal(id) {
    const modal = document.getElementById("infoModal");
    document.getElementById("modal-nombre").innerText = trabajadores[id].nombre;
    document.getElementById("modal-info").innerHTML = trabajadores[id].info;
    modal.style.display = "block";
}

function cerrarModal() {
    document.getElementById("infoModal").style.display = "none";
}

// Cerrar al hacer clic fuera del modal
window.onclick = function (event) {
    const modal = document.getElementById("infoModal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
};