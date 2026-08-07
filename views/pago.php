<?php
session_start();
?>

<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="../js/reveral.js" defer></script>
  <link rel="stylesheet" href="../css/reveral.css">
  <title>Clothing Brand - Elegancia y Estilo</title>
  <link rel="stylesheet" href="../css/coleccion.css">
  <link rel="icon" href="../img/iconopagina.png">

  <!-- Estilos -->
  <link rel="stylesheet" href="../css/style.css">
  <link rel="stylesheet" href="../css/menu.css">


  <link rel="icon" href="../img/iconopagina.png">
  <!-- Font Awesome (iconos) -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

  <!-- Script del menú -->
  <!-- Script del menú -->
  <script src="js/menu.js" defer></script>


  <link rel="stylesheet" href="../css/estetica.css">
  <link rel="stylesheet" href="/proyecto1_final/assets/css/responsive.css">
  <script src="/proyecto1_final/assets/js/menu.js" defer></script>



  <script src="../js/crud.js" defer></script>







</head>

<body>



  <header>

    <!-- === MENÚ DE USUARIO DESPLEGABLE === -->
    <div class="user-menu-container reveal">
      <div class="user-general">
        <p class="username">Usuario</p>
        <button class="user-icon-btn" id="userBtn" aria-expanded="false" aria-controls="dropdownMenu">
          <img src="../php/css/img/user.png" alt="Usuario">
        </button>
      </div>
      <ul class="dropdown-menu reveal" id="dropdownMenu" role="menu">
        <li><a class="dropdown-item reveal" href="modification.php"><i class="fas fa-key"></i> Modificar contraseña</a></li>


        <!-- 🔹 Nueva sección CRUD -->
        <li><a class="dropdown-item reveal" href="#" onclick="accessCRUD()"><i class="fas fa-database"></i> CRUD</a></li>

        <li class="dropdown-divider reveal"></li>
        <li><a class="dropdown-item reveal" href="#" onclick="logout()"><i class="fas fa-sign-out-alt"></i> Cerrar sesión</a></li>
      </ul>
    </div>



    <!-- === NAVEGACIÓN PRINCIPAL === -->
    <nav>
      <div class="logo reveal">
        <a href="index.php"><img src="../img/iconopagina.png" alt="Logo de la marca"></a>
      </div>

      <!-- Menú hamburguesa -->
      <div class="hamburger reveal" id="hamburger">☰</div>

      <!-- Menú de enlaces -->
      <div class="nav-links reveal" id="nav-links">
        <ul>
          <li><a href="index.php">Inicio</a></li>
          <li><a href="coleccion.php">Colección</a></li>
          <li><a href="nosotros.php">Nosotros</a></li>
          <li><a href="contacto.php">Contacto</a></li>
        </ul>
      </div>

      <!-- Barra de búsqueda -->
      <div class="search-bar reveal">
        <form action="#" method="get">
          <input type="search" placeholder="Buscar productos..." name="search">
          <button id="button-search" type="submit"><img src="../img/iconobuscar.png" alt="" width="20"></button>
        </form>
      </div>

      <!-- Íconos de usuario y carrito -->
      <div class="nav-icons reveal">
        <div id="cart-icon">
          <img src="../img/carritodecompras.png" alt="Carrito de compras" width="28" title="Carrito">
          <span id="cart-count">0</span>
        </div>
      </div>
    </nav>
    <nav>



    </nav>

  </header>
  <style>
    /* ==============================
   🎨 ESTILO PREMIUM GLOBAL
   ============================== */

    :root {
      --bg: #f6f7f9;
      --white: #ffffff;
      --black: #111;
      --gray: #777;
      --primary: #4f46e5;
      /* violeta premium */
      --primary-dark: #3b32c4;
      --radius: 14px;
      --shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
    }

    /* Fondo limpio */
    body {
      font-family: "Inter", sans-serif;
      background: var(--bg);
      margin: 0;
      padding: 0;
      color: var(--black);
    }

    /* Contenedor del pago */
    .pago-container {
      max-width: 900px;
      margin: 45px auto;
      background: var(--white);
      padding: 35px;
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      animation: fadeUp 0.7s ease forwards;
    }

    /* Títulos */
    h2 {
      font-size: 32px;
      font-weight: 700;
      letter-spacing: -.3px;
      margin-bottom: 25px;
    }

    h3 {
      font-size: 22px;
      font-weight: 600;
      margin-bottom: 15px;
      color: var(--primary);
    }

    /* Inputs premium */
    input,
    select {
      width: 100%;
      padding: 14px;
      border-radius: var(--radius);
      border: 1.5px solid rgba(0, 0, 0, 0.15);
      font-size: 16px;
      transition: .25s ease;
      background: #fafafa;
    }

    input:focus,
    select:focus {
      border-color: var(--primary);
      background: #fff;
      box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.15);
      outline: none;
    }

    /* Secciones */
    .seccion {
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(10px);
      padding: 20px;
      border-radius: var(--radius);
      margin-bottom: 35px;
      box-shadow: var(--shadow);
    }

    /* Resumen del pedido */
    .resumen-box {
      background: linear-gradient(135deg, #ffffff, #f4f4f4);
      padding: 20px;
      border-radius: var(--radius);
      border: 1px solid rgba(0, 0, 0, 0.1);
      box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.05);
    }

    /* Botón Finalizar */
    .btn-finalizar {
      width: 100%;
      background: var(--primary);
      color: white;
      padding: 16px;
      border: none;
      border-radius: var(--radius);
      font-size: 19px;
      font-weight: 600;
      cursor: pointer;
      transition: .3s ease;
      box-shadow: 0 10px 20px rgba(79, 70, 229, 0.25);
    }

    .btn-finalizar:hover {
      background: var(--primary-dark);
      transform: translateY(-3px);
      box-shadow: 0 15px 30px rgba(79, 70, 229, 0.38);
    }

    /* Botón "Ir a pagar" (del modal) */
    .btn-pagar {
      display: inline-block;
      background: var(--primary);
      color: #fff;
      padding: 12px 20px;
      border-radius: var(--radius);
      text-align: center;
      font-weight: 600;
      transition: .3s ease;
      text-decoration: none;
    }

    .btn-pagar:hover {
      background: var(--primary-dark);
      transform: translateY(-3px);
      box-shadow: 0 10px 25px rgba(79, 70, 229, 0.35);
    }

    /* Animación Premium */
    @keyframes fadeUp {
      from {
        opacity: 0;
        transform: translateY(25px);
      }

      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Hover suave en inputs */
    input:hover,
    select:hover {
      border-color: var(--primary);
    }

    /* Etiquetas */
    label {
      font-weight: 600;
      font-size: 15px;
      margin-bottom: 8px;
      display: block;
    }

    /* RESPONSIVE */
    @media (max-width: 768px) {
      .pago-container {
        padding: 20px;
        margin: 20px;
      }

      h2 {
        font-size: 26px;
      }

      h3 {
        font-size: 20px;
      }
    }

    /* ==============================
   🔧 AJUSTE DE ANCHO DE INPUTS
   ============================== */

    /* Evita que los inputs sobresalgan */
    input,
    select,
    textarea {
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;
    }

    /* Reduce ligeramente el ancho interno para que encaje perfecto */
    .seccion input,
    .seccion select {
      width: 95%;
      /* Ajuste ideal */
      margin: 0 auto;
      /* Centrado */
      display: block;
    }

    /* En pantallas pequeñas (celular) se ajustan aún mejor */
    @media (max-width: 768px) {

      .seccion input,
      .seccion select {
        width: 100%;
        /* En celular se ve perfecto */
      }
    }
  </style>
</head>

<body>

  <div class="pago-container fade-in">

    <h2>Finalizar compra</h2>

    <!-- DATOS PERSONALES -->
    <div class="seccion">
      <h3>🧍 Datos del comprador</h3>

      <label>Nombre completo</label>
      <input type="text" placeholder="Tu nombre y apellido">

      <label>Correo electrónico</label>
      <input type="email" placeholder="ejemplo@gmail.com">

      <label>Teléfono</label>
      <input type="text" placeholder="11 2345 6789">
    </div>

    <!-- ENVÍO -->
    <div class="seccion">
      <h3>📦 Dirección de envío</h3>

      <label>Calle y número</label>
      <input type="text">

      <label>Ciudad</label>
      <input type="text">

      <label>Código Postal</label>
      <input type="text">
    </div>

    <!-- MÉTODO DE PAGO -->
    <div class="seccion">
      <h3>💳 Método de pago</h3>

      <select>
        <option>Tarjeta de crédito</option>
        <option>Tarjeta de débito</option>
        <option>Mercado Pago</option>
        <option>Transferencia bancaria</option>
      </select>

      <label>Número de tarjeta</label>
      <input type="text" placeholder="XXXX XXXX XXXX XXXX">

      <label>Fecha de vencimiento</label>
      <input type="text" placeholder="MM/AA">

      <label>Código de seguridad</label>
      <input type="text" placeholder="CVV">
    </div>


    <button class="btn-finalizar">Finalizar compra</button>

  </div>
 <script>
document.addEventListener("DOMContentLoaded", function () {

  const botonFinalizar = document.querySelector(".btn-finalizar");
  const modal = document.getElementById("modal-exito");
  const cerrarModal = document.getElementById("cerrarModal");

  botonFinalizar.addEventListener("click", () => {
    const campos = document.querySelectorAll(".seccion input, .seccion select");

    for (const campo of campos) {
      if (campo.value.trim() === "") {
        alert("⚠️ Completá todos los campos antes de finalizar la compra.");
        campo.focus();
        return;
      }
    }

    // Mostrar modal
    modal.style.display = "flex";
  });

  cerrarModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

});
</script>

<style>
  /* FONDO DEL MODAL */
  .modal-exito {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.55);
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    backdrop-filter: blur(6px);
  }

  /* CAJA DEL MODAL */
  .modal-contenido {
    background: linear-gradient(135deg, #ffffff, #f2f1ff, #e6e4ff);
    padding: 45px;
    width: 95%;
    max-width: 520px;
    border-radius: 22px;
    text-align: center;
    box-shadow: 0 20px 60px rgba(79, 70, 229, 0.35);
    animation: popIn 0.35s ease;
    border: 3px solid #4f46e5;
  }

  /* ICONO DE ÉXITO PREMIUM */
  .icono-exito {
    font-size: 55px;
    background: #4f46e5;
    color: white;
    width: 85px;
    height: 85px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
    box-shadow: 0 0 25px rgba(79, 70, 229, 0.7);
    animation: glow 1.5s infinite alternate;
  }

  @keyframes glow {
    from { box-shadow: 0 0 10px rgba(79, 70, 229, 0.45); }
    to   { box-shadow: 0 0 28px rgba(79, 70, 229, 0.85); }
  }

  .modal-contenido h2 {
    font-size: 30px;
    font-weight: 800;
    margin-bottom: 10px;
    color: #3b32c4;
  }

  .modal-contenido p {
    font-size: 18px;
    color: #333;
    margin-bottom: 25px;
  }

  /* BOTÓN PREMIUM */
  .modal-contenido button {
    background: #4f46e5;
    color: white;
    padding: 14px 30px;
    border: none;
    border-radius: 12px;
    font-size: 18px;
    cursor: pointer;
    transition: .25s ease;
    box-shadow: 0 10px 25px rgba(79, 70, 229, 0.35);
  }

  .modal-contenido button:hover {
    background: #382ebf;
    transform: translateY(-3px);
    box-shadow: 0 15px 35px rgba(79, 70, 229, 0.55);
  }

  /* ANIMACIÓN DE ENTRADA */
  @keyframes popIn {
    from { transform: scale(0.7); opacity: 0; }
    to   { transform: scale(1); opacity: 1; }
  }
</style>


<div id="modal-exito" class="modal-exito">
  <div class="modal-contenido">
    
    <div class="icono-exito">✔</div>

    <h2>¡Compra finalizada con éxito!</h2>
    <p>Gracias por tu compra. Tu pedido está siendo procesado.</p>

    <button id="cerrarModal">Cerrar</button>
  </div>
</div>
</body>
</html>