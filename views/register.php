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
      background: linear-gradient(135deg, #1e1e1e, #2a2a2a, #3a3a3a);
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
      background: rgba(30, 30, 30, 0.6);
      backdrop-filter: blur(20px);
      padding: 40px 50px;
      border-radius: 15px;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 350px;
      transition: all 0.3s ease;
      border: 1px solid rgba(255, 215, 0, 0.25);
      /* sutil dorado */
      z-index: 2;
      position: relative;
    }

    .Logbox:hover {
      transform: translateY(-5px);
      box-shadow: 0 12px 30px rgba(255, 215, 0, 0.15);
      border-color: rgba(255, 215, 0, 0.4);
    }

    /* Título */
    .indtitle {
      font-size: 26px;
      font-weight: 600;
      margin-bottom: 25px;
      color: #f5d67b;
      /* dorado suave */
      letter-spacing: 1px;
    }

    /* Campos del formulario */
    .indform {
      width: 100%;
      padding: 12px 15px;
      margin-bottom: 20px;
      border: none;
      border-radius: 8px;
      font-size: 15px;
      outline: none;
      transition: all 0.2s ease;
      background: rgba(255, 255, 255, 0.08);
      color: #f0f0f0;
    }

    .indform::placeholder {
      color: rgba(200, 200, 200, 0.6);
    }

    .indform:focus {
      background: rgba(255, 255, 255, 0.12);
      box-shadow: 0 0 8px rgba(255, 215, 0, 0.3);
      border: 1px solid rgba(255, 215, 0, 0.3);
    }

    /* Botón */
    .indbutton {
      width: 100%;
      padding: 12px 0;
      border: none;
      border-radius: 8px;
      background: linear-gradient(135deg, #a8892c, #d4af37);
      color: #fff;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 0 10px rgba(212, 175, 55, 0.2);
    }

    .indbutton:hover {
      background: linear-gradient(135deg, #d4af37, #b9962a);
      transform: scale(1.03);
      box-shadow: 0 0 20px rgba(212, 175, 55, 0.35);
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
      background: radial-gradient(circle, rgba(212, 175, 55, 0.25) 0%, rgba(0, 0, 0, 0) 70%);
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
              color:#f5d67b;
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
                color:#f5d67b;
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