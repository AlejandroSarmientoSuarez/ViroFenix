<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Registro - Clothing Brand</title>
  <link rel="icon" href="../img/iconopagina.png">
  <script src="../js/register.js" defer></script>

  <style>
    /* --- Fondo oscuro con movimiento elegante --- */
    body {
      margin: 0;
      padding: 0;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: 'Poppins', sans-serif;
      background: linear-gradient(135deg, #ffffff, #fdfdfd, #fdfdfd);
      background-size: 400% 400%;
      animation: gradientMove 12s ease infinite;
      overflow: hidden;
      position: relative;
    }

    /* Animación del degradado */
    @keyframes gradientMove {
      0% {
        background-position: 0% 50%;
      }

      50% {
        background-position: 100% 50%;
      }

      100% {
        background-position: 0% 50%;
      }
    }

   /* Caja del formulario */
.Logbox {
  background: #ffffff;
  padding: 40px 50px;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.10);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 350px;
  transition: all 0.3s ease;
  border: 1px solid #eeeeee;
  z-index: 2;
  position: relative;
}

.Logbox:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
  border-color: #e5e5e5;
}


/* Título */
.indtitle {
  font-size: 26px;
  font-weight: 600;
  margin-bottom: 25px;
  color: #333333;
  letter-spacing: 0.5px;
}


/* Campos del formulario */
.indform {
  width: 100%;
  padding: 12px 15px;
  margin-bottom: 20px;
  border: 1px solid #dddddd;
  border-radius: 8px;
  font-size: 15px;
  outline: none;
  transition: all 0.2s ease;
  background: #ffffff;
  color: #333333;
  box-sizing: border-box;
}

.indform::placeholder {
  color: #888888;
}

.indform:focus {
  background: #ffffff;
  border: 1px solid #08a8e8;
  box-shadow: 0 0 0 3px rgba(8, 168, 232, 0.12);
}


/* Botón */
.indbutton {
  width: 100%;
  padding: 12px 0;
  border: none;
  border-radius: 8px;
  background: #ed3343;
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: none;
}

.indbutton:hover {
  background: #d92738;
  transform: scale(1.02);
  box-shadow: 0 5px 15px rgba(237, 51, 67, 0.25);
}


/* --- Efecto onda expansiva --- */
#ripple-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
  pointer-events: none;
}

.ripple {
  position: absolute;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(237, 51, 67, 0.18) 0%,
    rgba(237, 51, 67, 0) 70%
  );
  transform: scale(0);
  animation: rippleAnim 1.2s ease-out forwards;
}

@keyframes rippleAnim {
  to {
    transform: scale(20);
    opacity: 0;
  }
}


/* Adaptación a móviles */
@media (max-width: 480px) {
  .Logbox {
    width: 90%;
    padding: 30px 25px;
  }

  .indtitle {
    font-size: 22px;
  }
}
  </style>

  
</head>

<body>

  <main>
          <form class="Logbox" onsubmit="register(event)" method="POST">

            <p class="indtitle">Únete a Clothing Brand</p>

            <input
              type="text"
              name="nombre"
              id="nombre"
              class="indform"
              placeholder="Nombre"
              required
              minlength="2"
              maxlength="100">

            <input
              type="text"
              name="apellido"
              id="apellido"
              class="indform"
              placeholder="Apellido"
              required
              minlength="2"
              maxlength="100">

            <input
              type="email"
              name="email"
              id="email"
              class="indform"
              placeholder="Correo electrónico"
              required>

            <input
              type="password"
              name="password"
              id="password"
              class="indform"
              placeholder="Contraseña"
              required
              minlength="8">

            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              class="indform"
              placeholder="Confirmar contraseña"
              required
              minlength="8">

            <div id="passwordStrength" style="
              width:100%;
              margin-bottom:15px;
              color:#00aaff;
              font-size:14px;">
              Seguridad: —
            </div>

            <button type="submit" class="indbutton">
              Crear Cuenta
            </button>

            <p style="
              margin-top:15px;
              color:#ccc;
              font-size:14px;
              text-align:center;">
              ¿Ya tienes cuenta?
              <a href="login.html"
                style="
                color:#00aaff;
                text-decoration:none;">
                Inicia sesión
              </a>
            </p>

          </form>
  </main>
     
  <!-- Contenedor del efecto de onda -->
  <div id="ripple-container"></div>


    
  
  
  <script>
    const logbox = document.querySelector('.Logbox');
    const rippleContainer = document.getElementById('ripple-container');

    document.addEventListener('click', (e) => {
      // Solo se activa si el clic fue fuera del formulario
      if (!logbox.contains(e.target)) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');

        // Posicionar la onda en el punto exacto del clic
        ripple.style.left = `${e.clientX - 50}px`;
        ripple.style.top = `${e.clientY - 50}px`;

        rippleContainer.appendChild(ripple);

        // Eliminar la onda después de la animación
        setTimeout(() => ripple.remove(), 1200);
      }
    });
  </script>

 
 
</body>

</html>