<?php
require '../db.php'; // Conexión a la base de datos
// Traer productos de la base de datos
$query = $conn->query("SELECT * FROM Productos");
$productos = [];
while ($row = $query->fetch_assoc()) {
  $productos[] = $row;
}
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
  

  <!-- Estilos -->
  
  <link rel="stylesheet" href="../css/menu.css">


  <link rel="icon" href="../img/iconopagina.png">
  <!-- Font Awesome (iconos) -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

  <!-- Script del menú -->
  <link rel="stylesheet" href="../css/estetica.css">
  <link rel="stylesheet" href="../css/style.css">



  <script src="../js/crud.js" defer></script>
</head>

<body>
  <header>
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
  </header>


  <section class="banner-section">
    <img src="../img/coleccion/mujeranuncio.jpg" alt="Banner Colección" class="banner-coleccion reveal">
  </section>

  <section class="galeria-modelos">
    <img src="../img/coleccion/modeloh.webp" alt="Modelo Hombre" class="modelo reveal">
    <img src="../img/coleccion/modelom.webp" alt="Modelo Mujer" class="modelo reveal">
    <img src="../img/coleccion/modeloniño.webp" alt="Modelo Niño" class="modelo reveal">
  </section>

  <section class="banner-equipos-section">
    <img src="../img/coleccion/equipos.jpg" alt="Equipos deportivos" class="banner-equipos reveal">
  </section>

  <section id="coleccion">
    <h2>Nuestra Colección</h2>
    <p>Explora nuestra selección de prendas cuidadosamente diseñadas para combinar estilo y comodidad. Desde looks casuales hasta elegantes, nuestra colección tiene algo para cada ocasión y personalidad.</p>
    <div class="filtros reveal">
      <button data-filter="todos">Todos</button>
      <button data-filter="camisas">Camisas</button>
      <button data-filter="pantalones">Pantalones</button>
      <button data-filter="chaquetas">Chaquetas</button>
      <button data-filter="accesorios">Accesorios</button>

      <!-- 🔥 NUEVO FILTRO -->
      <button data-filter="favoritos">Guardados</button>
    </div>




    <div class="gallery">
      <div class="product-item camisas reveal " data-product-id="1" data-stock="15">

        <img src="../img/producto1.jpg" alt="Camisa de algodón">
        <h3>Camisa minimalista</h3>

        <p>Camisa de algodón con detalles minimalistas.</p>
        <p class="precio">$24.990</p>
        <div class="rating" data-producto="producto1">
          <i class="fa-regular fa-star estrella" data-valor="1"></i>
          <i class="fa-regular fa-star estrella" data-valor="2"></i>
          <i class="fa-regular fa-star estrella" data-valor="3"></i>
          <i class="fa-regular fa-star estrella" data-valor="4"></i>
          <i class="fa-regular fa-star estrella" data-valor="5"></i>
        </div>
        <button class="btn-comprar">Agregar al carrito</button>
        <button class="btn-detalles">Más detalles</button>
        <i class="fa-regular fa-heart favorito" data-id="producto1"></i>

      </div>
      <div class="product-item pantalones reveal" data-product-id="2" data-stock="12">
        <img src="../img/producto2.jpg" alt="Pantalones de corte recto">
        <h3>Pantalones suaves</h3>

        <p>Pantalones de corte recto y tela suave.</p>
        <p class="precio">$29.990</p>
        <div class="rating" data-producto="producto2">
          <i class="fa-regular fa-star estrella" data-valor="1"></i>
          <i class="fa-regular fa-star estrella" data-valor="2"></i>
          <i class="fa-regular fa-star estrella" data-valor="3"></i>
          <i class="fa-regular fa-star estrella" data-valor="4"></i>
          <i class="fa-regular fa-star estrella" data-valor="5"></i>
        </div>
        <button class="btn-comprar">Agregar al carrito</button>
        <button class="btn-detalles">Más detalles</button>
        <i class="fa-regular fa-heart favorito" data-id="producto2"></i>

      </div>
      <div class="product-item chaquetas reveal" data-product-id="3" data-stock="10">
        <img src="../img/producto3.jpg" alt="Chaqueta ligera">
        <h3>Chaqueta versátil</h3>

        <p>Chaqueta ligera ideal para cualquier ocasión.</p>
        <p class="precio">$34.990</p>
        <span class="etiqueta nuevo">Nuevo</span>
        <div class="rating" data-producto="producto3">
          <i class="fa-regular fa-star estrella" data-valor="1"></i>
          <i class="fa-regular fa-star estrella" data-valor="2"></i>
          <i class="fa-regular fa-star estrella" data-valor="3"></i>
          <i class="fa-regular fa-star estrella" data-valor="4"></i>
          <i class="fa-regular fa-star estrella" data-valor="5"></i>
        </div>
        <button class="btn-comprar">Agregar al carrito</button>
        <button class="btn-detalles">Más detalles</button>
        <i class="fa-regular fa-heart favorito" data-id="producto3"></i>
      </div>
      <div class="product-item vestidos reveal" data-product-id="4" data-stock="8">
        <img src="../img/producto4.jpg" alt="Vestido elegante">
        <h3>Vestido elegante</h3>
        <p>Vestido elegante para eventos especiales.</p>
        <p class="precio">$39.990</p>
        <span class="etiqueta descuento">-20%</span>
        <div class="rating" data-producto="producto4">
          <i class="fa-regular fa-star estrella" data-valor="1"></i>
          <i class="fa-regular fa-star estrella" data-valor="2"></i>
          <i class="fa-regular fa-star estrella" data-valor="3"></i>
          <i class="fa-regular fa-star estrella" data-valor="4"></i>
          <i class="fa-regular fa-star estrella" data-valor="5"></i>
        </div>
        <button class="btn-comprar">Agregar al carrito</button>
        <button class="btn-detalles">Más detalles</button>
        <i class="fa-regular fa-heart favorito" data-id="producto4"></i>

      </div>
      <div class="product-item chaquetas reveal" data-product-id="5" data-stock="10">
        <img src="../img/foto1A.jpg" alt="Suéter acogedor">
        <h3>Suéter acogedor</h3>
        <p>Suéter de lana suave ideal para climas fríos.</p>
        <p class="precio">$27.990</p>
        <div class="rating" data-producto="producto5">
          <i class="fa-regular fa-star estrella" data-valor="1"></i>
          <i class="fa-regular fa-star estrella" data-valor="2"></i>
          <i class="fa-regular fa-star estrella" data-valor="3"></i>
          <i class="fa-regular fa-star estrella" data-valor="4"></i>
          <i class="fa-regular fa-star estrella" data-valor="5"></i>
        </div>
        <button class="btn-comprar">Agregar al carrito</button>
        <button class="btn-detalles">Más detalles</button>
        <i class="fa-regular fa-heart favorito" data-id="producto5"></i>

      </div>
      <div class="product-item camisas  reveal" data-product-id="6" data-stock="25">
        <img src="../img/foto2A.jpg" alt="Camiseta básica">
        <h3>Camiseta básica</h3>
        <p>Camiseta de algodón ligera y cómoda para uso diario.</p>
        <p class="precio">$14.990</p>
        <div class="rating" data-producto="producto6">
          <i class="fa-regular fa-star estrella" data-valor="1"></i>
          <i class="fa-regular fa-star estrella" data-valor="2"></i>
          <i class="fa-regular fa-star estrella" data-valor="3"></i>
          <i class="fa-regular fa-star estrella" data-valor="4"></i>
          <i class="fa-regular fa-star estrella" data-valor="5"></i>
        </div>
        <button class="btn-comprar">Agregar al carrito</button>
        <button class="btn-detalles">Más detalles</button>
        <i class="fa-regular fa-heart favorito" data-id="producto6"></i>

      </div>
      <div class="product-item chaquetas  reveal" data-product-id="7" data-stock="6">
        <img src="../img/foto3A.jpg" alt="Blazer elegante">
        <h3>Blazer elegante</h3>
        <p>Blazer moderno perfecto para eventos formales o de oficina.</p>
        <p class="precio">$44.990</p>
        <div class="rating" data-producto="producto7">
          <i class="fa-regular fa-star estrella" data-valor="1"></i>
          <i class="fa-regular fa-star estrella" data-valor="2"></i>
          <i class="fa-regular fa-star estrella" data-valor="3"></i>
          <i class="fa-regular fa-star estrella" data-valor="4"></i>
          <i class="fa-regular fa-star estrella" data-valor="5"></i>
        </div>
        <button class="btn-comprar">Agregar al carrito</button>
        <button class="btn-detalles">Más detalles</button>
        <i class="fa-regular fa-heart favorito" data-id="producto7"></i>

      </div>
      <div class="product-item chaquetas reveal" data-product-id="8" data-stock="20">
        <img src="../img/foto4A.jpg" alt="Sudadera casual">
        <h3>Sudadera casual</h3>
        <p>Sudadera con capucha y bolsillo frontal, ideal para un look urbano.</p>
        <p class="precio">$22.990</p>
        <div class="rating" data-producto="producto8">
          <i class="fa-regular fa-star estrella" data-valor="1"></i>
          <i class="fa-regular fa-star estrella" data-valor="2"></i>
          <i class="fa-regular fa-star estrella" data-valor="3"></i>
          <i class="fa-regular fa-star estrella" data-valor="4"></i>
          <i class="fa-regular fa-star estrella" data-valor="5"></i>
        </div>
        <button class="btn-comprar">Agregar al carrito</button>
        <button class="btn-detalles">Más detalles</button>
        <i class="fa-regular fa-heart favorito" data-id="producto8"></i>

      </div>
      <div class="product-item pantalones reveal" data-product-id="9" data-stock="30">
        <img src="../img/foto5A.jpg" alt="Shorts frescos">
        <h3>Shorts frescos</h3>
        <p>Shorts de algodón para días cálidos y estilo relajado.</p>
        <p class="precio">$19.990</p>
        <div class="rating" data-producto="producto9">
          <i class="fa-regular fa-star estrella" data-valor="1"></i>
          <i class="fa-regular fa-star estrella" data-valor="2"></i>
          <i class="fa-regular fa-star estrella" data-valor="3"></i>
          <i class="fa-regular fa-star estrella" data-valor="4"></i>
          <i class="fa-regular fa-star estrella" data-valor="5"></i>
        </div>
        <button class="btn-comprar">Agregar al carrito</button>
        <button class="btn-detalles">Más detalles</button>
        <i class="fa-regular fa-heart favorito" data-id="producto9"></i>

      </div>
      <div class="product-item chaquetas reveal" data-product-id="10" data-stock="5">
        <img src="../img/foto6A.jpg" alt="Abrigo clásico">
        <h3>Abrigo clásico</h3>
        <p>Abrigo largo con corte moderno para la temporada invernal.</p>
        <p class="precio">$54.990</p>
        <span class="etiqueta descuento">-15%</span>
        <div class="rating" data-producto="producto10">
          <i class="fa-regular fa-star estrella" data-valor="1"></i>
          <i class="fa-regular fa-star estrella" data-valor="2"></i>
          <i class="fa-regular fa-star estrella" data-valor="3"></i>
          <i class="fa-regular fa-star estrella" data-valor="4"></i>
          <i class="fa-regular fa-star estrella" data-valor="5"></i>
        </div>
        <button class="btn-comprar">Agregar al carrito</button>
        <button class="btn-detalles">Más detalles</button>
        <i class="fa-regular fa-heart favorito" data-id="producto10"></i>

      </div>
      <div class="product-item chaquetas reveal" data-product-id="11" data-stock="4">
        <img src="../img/foto8A.jpg" alt="Chaqueta de Cuero">
        <h3>Chaqueta de Cuero</h3>
        <p>Chaqueta cómoda y negra de hombre con un estilo rockero.</p>
        <p class="precio">$59.990</p>
        <div class="rating" data-producto="producto11">
          <i class="fa-regular fa-star estrella" data-valor="1"></i>
          <i class="fa-regular fa-star estrella" data-valor="2"></i>
          <i class="fa-regular fa-star estrella" data-valor="3"></i>
          <i class="fa-regular fa-star estrella" data-valor="4"></i>
          <i class="fa-regular fa-star estrella" data-valor="5"></i>
        </div>
        <button class="btn-comprar">Agregar al carrito</button>
        <button class="btn-detalles">Más detalles</button>
        <i class="fa-regular fa-heart favorito" data-id="producto11"></i>

      </div>
      <div class="product-item trajes reveal" data-product-id="12" data-stock="3">
        <img src="../img/foto9A.jpg" alt="Traje Azul">
        <h3>Traje Azul Elegante</h3>
        <p>Traje Azul moderno y elegante, ideal para eventos especiales.</p>
        <p class="precio">$89.990</p>
        <div class="rating" data-producto="producto12">
          <i class="fa-regular fa-star estrella" data-valor="1"></i>
          <i class="fa-regular fa-star estrella" data-valor="2"></i>
          <i class="fa-regular fa-star estrella" data-valor="3"></i>
          <i class="fa-regular fa-star estrella" data-valor="4"></i>
          <i class="fa-regular fa-star estrella" data-valor="5"></i>
        </div>
        <button class="btn-comprar">Agregar al carrito</button>
        <button class="btn-detalles">Más detalles</button>
        <i class="fa-regular fa-heart favorito" data-id="producto12"></i>

      </div>
      <div class="product-item accesorios reveal" data-product-id="13" data-stock="40">
        <img src="../img/foto10A.jpg" alt="Bufanda moderna">
        <h3>Bufanda moderna</h3>
        <p>Bufanda de lana tejida, perfecta para complementar tu outfit.</p>
        <p class="precio">$12.990</p>
        <div class="rating" data-producto="producto13">
          <i class="fa-regular fa-star estrella" data-valor="1"></i>
          <i class="fa-regular fa-star estrella" data-valor="2"></i>
          <i class="fa-regular fa-star estrella" data-valor="3"></i>
          <i class="fa-regular fa-star estrella" data-valor="4"></i>
          <i class="fa-regular fa-star estrella" data-valor="5"></i>
        </div>
        <button class="btn-comprar">Agregar al carrito</button>
        <button class="btn-detalles">Más detalles</button>
        <i class="fa-regular fa-heart favorito" data-id="producto13"></i>

      </div>
      <div class="product-item camisas reveal" data-product-id="14" data-stock="10">
        <img src="../img/foto11A.jpg" alt="Camisa Negra">
        <h3>Camisa Negra</h3>
        <p>Camisa Negra de hombre y moderna pegada al cuerpo, perfecta para lucir bien y fresco.</p>
        <p class="precio">$26.990</p>
        <div class="rating" data-producto="producto14">
          <i class="fa-regular fa-star estrella" data-valor="1"></i>
          <i class="fa-regular fa-star estrella" data-valor="2"></i>
          <i class="fa-regular fa-star estrella" data-valor="3"></i>
          <i class="fa-regular fa-star estrella" data-valor="4"></i>
          <i class="fa-regular fa-star estrella" data-valor="5"></i>
        </div>
        <button class="btn-comprar">Agregar al carrito</button>
        <button class="btn-detalles">Más detalles</button>
        <i class="fa-regular fa-heart favorito" data-id="producto14"></i>

      </div>
      <div class="product-item pantalones reveal" data-product-id="15" data-stock="7">
        <img src="../img/foto11A.jpg" alt="Pantalon de Vestir">
        <h3>Pantalon de Vestir</h3>
        <p>Pantalon de Vestir Azul Oscuro y moderno, ideal para eventos importantes.</p>
        <p class="precio">$34.990</p>
        <div class="rating" data-producto="producto15">
          <i class="fa-regular fa-star estrella" data-valor="1"></i>
          <i class="fa-regular fa-star estrella" data-valor="2"></i>
          <i class="fa-regular fa-star estrella" data-valor="3"></i>
          <i class="fa-regular fa-star estrella" data-valor="4"></i>
          <i class="fa-regular fa-star estrella" data-valor="5"></i>
        </div>
        <button class="btn-comprar">Agregar al carrito</button>
        <button class="btn-detalles">Más detalles</button>
        <i class="fa-regular fa-heart favorito" data-id="producto15"></i>

      </div>

      <!-- 🔽 NUEVOS PRODUCTOS AÑADIDOS 🔽 -->
      <div class="product-item zapatillas reveal">
        <img src="../img/zapatillas.jpg" alt="Zapatillas urbanas">
        <h3>Zapatillas Urbanas</h3>
        <p>Zapatillas cómodas de diseño moderno para uso diario.</p>
        <p class="precio">$49.990</p>
        <div class="rating" data-producto="producto16">
          <i class="fa-regular fa-star estrella" data-valor="1"></i>
          <i class="fa-regular fa-star estrella" data-valor="2"></i>
          <i class="fa-regular fa-star estrella" data-valor="3"></i>
          <i class="fa-regular fa-star estrella" data-valor="4"></i>
          <i class="fa-regular fa-star estrella" data-valor="5"></i>
        </div>
        <button class="btn-comprar">Agregar al carrito</button>
        <button class="btn-detalles">Más detalles</button>
        <i class="fa-regular fa-heart favorito" data-id="producto16"></i>
      </div>

      <div class="product-item zapatillas reveal">
        <img src="../img/deportivas.jpg" alt="Zapatillas deportivas">
        <h3>Zapatillas Deportivas</h3>
        <p>Zapatillas ligeras y transpirables, ideales para entrenamientos.</p>
        <p class="precio">$44.990</p>
        <span class="etiqueta nuevo">Nuevo</span>
        <div class="rating" data-producto="producto17">
          <i class="fa-regular fa-star estrella" data-valor="1"></i>
          <i class="fa-regular fa-star estrella" data-valor="2"></i>
          <i class="fa-regular fa-star estrella" data-valor="3"></i>
          <i class="fa-regular fa-star estrella" data-valor="4"></i>
          <i class="fa-regular fa-star estrella" data-valor="5"></i>
        </div>
        <button class="btn-comprar">Agregar al carrito</button>
        <button class="btn-detalles">Más detalles</button>

        <i class="fa-regular fa-heart favorito" data-id="producto17"></i>
      </div>

      <div class="product-item camisas reveal">
        <img src="../img/camisablanca.jpg" alt="Camisa blanca elegante">
        <h3>Camisa Blanca Elegante</h3>
        <p>Camisa blanca de corte slim fit ideal para ocasiones formales.</p>
        <p class="precio">$31.990</p>
        <div class="rating" data-producto="producto18">
          <i class="fa-regular fa-star estrella" data-valor="1"></i>
          <i class="fa-regular fa-star estrella" data-valor="2"></i>
          <i class="fa-regular fa-star estrella" data-valor="3"></i>
          <i class="fa-regular fa-star estrella" data-valor="4"></i>
          <i class="fa-regular fa-star estrella" data-valor="5"></i>
        </div>
        <button class="btn-comprar">Agregar al carrito</button>
        <button class="btn-detalles">Más detalles</button>
        <i class="fa-regular fa-heart favorito" data-id="producto18"></i>
      </div>

      <div class="product-item pantalones reveal">
        <img src="../img/jeanclasico.jpg" alt="Jean clásico">
        <h3>Jean Clásico Azul</h3>
        <p>Jean de corte recto, resistente y cómodo para el uso diario.</p>
        <p class="precio">$32.990</p>
        <div class="rating" data-producto="producto19">
          <i class="fa-regular fa-star estrella" data-valor="1"></i>
          <i class="fa-regular fa-star estrella" data-valor="2"></i>
          <i class="fa-regular fa-star estrella" data-valor="3"></i>
          <i class="fa-regular fa-star estrella" data-valor="4"></i>
          <i class="fa-regular fa-star estrella" data-valor="5"></i>
        </div>
        <button class="btn-comprar">Agregar al carrito</button>
        <button class="btn-detalles">Más detalles</button>
        <i class="fa-regular fa-heart favorito" data-id="producto19"></i>
      </div>

      <div class="product-item chaquetas reveal">
        <img src="../img/bomber.jpg" alt="Campera bomber">
        <h3>Campera Bomber</h3>
        <p>Campera bomber liviana, ideal para un look urbano moderno.</p>
        <p class="precio">$42.990</p>
        <div class="rating" data-producto="producto20">
          <i class="fa-regular fa-star estrella" data-valor="1"></i>
          <i class="fa-regular fa-star estrella" data-valor="2"></i>
          <i class="fa-regular fa-star estrella" data-valor="3"></i>
          <i class="fa-regular fa-star estrella" data-valor="4"></i>
          <i class="fa-regular fa-star estrella" data-valor="5"></i>
        </div>
        <button class="btn-comprar">Agregar al carrito</button>
        <button class="btn-detalles">Más detalles</button>
        <i class="fa-regular fa-heart favorito" data-id="producto20"></i>
      </div>

      <div class="product-item accesorios reveal">
        <img src="../img/gorra.jpg" alt="Gorra deportiva">
        <h3>Gorra Deportiva</h3>
        <p>Gorra ajustable con diseño minimalista y transpirable.</p>
        <p class="precio">$9.990</p>
        <div class="rating" data-producto="producto21">
          <i class="fa-regular fa-star estrella" data-valor="1"></i>
          <i class="fa-regular fa-star estrella" data-valor="2"></i>
          <i class="fa-regular fa-star estrella" data-valor="3"></i>
          <i class="fa-regular fa-star estrella" data-valor="4"></i>
          <i class="fa-regular fa-star estrella" data-valor="5"></i>
        </div>
        <button class="btn-comprar">Agregar al carrito</button>
        <button class="btn-detalles">Más detalles</button>
        <i class="fa-regular fa-heart favorito" data-id="producto21"></i>
      </div>

    </div>
  </section>

  <section class="newsletter">
    <h2>Únete a nuestro Newsletter</h2>
    <p>Recibe ofertas exclusivas, lanzamientos y contenido especial.</p>

    <form id="newsletter-form">
      <div class="input-group">
        <input type="email" id="correo" placeholder="Ingresa tu Gmail" required>
      </div>

      <div class="input-group">
        <input type="number" id="edad" placeholder="Tu edad" min="10" required>
      </div>

      <button type="submit" class="btn-news">Suscribirme</button>
    </form>

    <p id="newsletter-msg" style="display:none; font-weight:600; margin-top:10px; color:#27ae60;">
      Gracias por confiar en nosotros. Tu suscripción se registró correctamente.
    </p>
  </section>


  <footer>
    <div class="footer-container reveal">
      <div class="footer-col brand-info">
        <img src="../img/iconopagina.png" alt="Logo de la marca" class="footer-logo">
        <p>Elegancia y estilo en cada prenda. Inspirados en la autenticidad, diseñamos ropa para destacar tu personalidad.</p>
      </div>
      <div class="footer-col">
        <h3>Enlaces rápidos</h3>
        <ul>
          <li><a href="#inicio">Inicio</a></li>
          <li><a href="#coleccion">Colección</a></li>
          <li><a href="#nosotros">Nosotros</a></li>
          <li><a href="#contacto">Contacto</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h3>Atención al cliente</h3>
        <ul>
          <li><a href="#">Preguntas frecuentes</a></li>
          <li><a href="#">Envíos y devoluciones</a></li>
          <li><a href="#">Términos y condiciones</a></li>
          <li><a href="#">Política de privacidad</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h3>Conéctate con nosotros</h3>
        <div class="social-icons">
          <a href="#"><img src="../img/instagram.png" alt="Instagram"></a>
          <a href="#"><img src="../img/facebook.png" alt="Facebook"></a>
          <a href="#"><img src="../img/twitter.png" alt="Twitter"></a>
        </div>
        <p class="footer-mail">📧 info@marcaropa.com</p>
      </div>
    </div>
    <div class="footer-bottom reveal">
      <p>© 2025 Marca Ropa. Todos los derechos reservados.</p>
    </div>
  </footer>


  <script src="../js/scripts.js"></script>
  <div id="cart-popup" class="hidden">
    <h3>🛒 Carrito de Compras</h3>
    <ul id="cart-items"></ul>

    <div class="envio-section">
      <label for="direccion">Dirección de envío:</label>
      <input type="text" id="direccion" placeholder="Ingresa tu dirección">
      <button id="calcular-envio">Calcular envío</button>
      <p id="costo-envio">Costo de envío: $0</p>
    </div>

    <p>Total: <span id="cart-total">$0</span></p>
    <div class="cart-actions">
      <button id="ir-a-pagar">Ir a pagar</button>
      <button id="vaciar-carrito">Vaciar carrito</button>
    </div>
  </div>

  <script>
    document.addEventListener("DOMContentLoaded", () => {

      // Seleccionar el modal
      const modal = document.getElementById("modal-detalles");
      const closeModal = document.getElementById("close-modal");

      // Selección de los elementos del modal
      const modalImg = document.getElementById("modal-img");
      const modalTitle = document.getElementById("modal-title");
      const modalDescription = document.getElementById("modal-description");
      const modalMaterials = document.getElementById("modal-materials");
      const modalSizes = document.getElementById("modal-sizes");
      const modalColors = document.getElementById("modal-colors");
      const modalPrice = document.getElementById("modal-price");
      const modalStars = document.getElementById("modal-stars");

      // BOTONES "MÁS DETALLES"
      const botonesDetalles = document.querySelectorAll(".btn-detalles");

      botonesDetalles.forEach(boton => {
        boton.addEventListener("click", function() {

          // Encontrar el contenedor del producto
          const item = this.closest(".product-item");

          // Extraer info del producto
          const img = item.querySelector("img").src;
          const title = item.querySelector("h3").textContent;
          const desc = item.querySelector("p").textContent;
          const price = item.querySelector(".precio") ? item.querySelector(".precio").textContent : "Precio no disponible";
          const materials = item.getAttribute("data-materials") || "Materiales no especificados";
          const sizes = item.getAttribute("data-sizes") || "Talles no disponibles";
          const colors = item.getAttribute("data-colors") || "Colores no disponibles";
          const stars = item.getAttribute("data-stars") || 5;

          // Mandar info al modal
          modalImg.src = img;
          modalTitle.textContent = title;
          modalDescription.textContent = desc;
          modalPrice.textContent = price;
          modalMaterials.textContent = "Materiales: " + materials;
          modalSizes.textContent = "Talles: " + sizes;
          modalColors.textContent = "Colores: " + colors;

          // Estrellas
          modalStars.innerHTML = "";
          for (let i = 0; i < stars; i++) {
            modalStars.innerHTML += "⭐";
          }

          // Mostrar modal
          modal.classList.remove("hidden");
        });
      });

      // Cerrar modal
      closeModal.addEventListener("click", () => {
        modal.classList.add("hidden");
      });

      // Cerrar si hace clic afuera
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.classList.add("hidden");
        }
      });

    });
  </script>

  <script>
    const userProfile = document.getElementById('user-profile');
    const userMenu = document.getElementById('user-menu');


    function positionMenu() {
      const rect = userProfile.getBoundingClientRect();
      userMenu.style.top = rect.bottom + window.scrollY + 'px';
      userMenu.style.left = rect.left + window.scrollX + 'px';
    }

    userProfile.addEventListener('click', () => {
      if (userMenu.style.display === 'none' || userMenu.style.display === '') {
        positionMenu();
        userMenu.style.display = 'block';
      } else {
        userMenu.style.display = 'none';
      }
    });


    document.addEventListener('click', (e) => {
      if (!userProfile.contains(e.target) && !userMenu.contains(e.target)) {
        userMenu.style.display = 'none';
      }
    });
  </script>


  
  <script>
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('show');
    });

    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('show');
      });
    });
  </script>
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const userBtn = document.getElementById('userBtn');
      const dropdownMenu = document.getElementById('dropdownMenu');

      userBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownMenu.classList.toggle('show');
      });

      document.addEventListener('click', (e) => {
        if (!dropdownMenu.contains(e.target) && !userBtn.contains(e.target)) {
          dropdownMenu.classList.remove('show');
        }
      });
    });
  </script>




  <div id="modal-detalles" class="modal hidden">
    <div class="modal-content">
      <span id="close-modal" class="close">&times;</span>
      <img id="modal-img" src="" alt="Imagen del producto">
      <h3 id="modal-title"></h3>
      <p id="modal-description"></p>
      <p id="modal-materials"></p>
      <p id="modal-sizes"></p>
      <p id="modal-colors"></p>
      <p id="modal-price"></p>
      <div id="modal-stars"></div>

    </div>
  </div>


  <script>
    document.addEventListener("DOMContentLoaded", () => {

      /* ============================================
         SISTEMA DE FAVORITOS (TU MISMO CÓDIGO)
      ============================================ */

      const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

      const corazones = document.querySelectorAll(".favorito");

      // Pintar corazones que ya están guardados
      corazones.forEach(corazon => {
        const id = corazon.getAttribute("data-id");
        const item = corazon.closest(".product-item");

        if (favoritos.includes(id)) {
          corazon.classList.add("activo");
          corazon.classList.replace("fa-regular", "fa-solid");
          item.classList.add("favoritos"); // ⭐ <<--- CLAVE PARA EL FILTRO
        }

        corazon.addEventListener("click", () => {
          corazon.classList.toggle("activo");
          corazon.classList.toggle("fa-solid");
          corazon.classList.toggle("fa-regular");

          const item = corazon.closest(".product-item");

          if (corazon.classList.contains("activo")) {
            favoritos.push(id);
            item.classList.add("favoritos"); // ⭐ cuando se guarda
          } else {
            const index = favoritos.indexOf(id);
            favoritos.splice(index, 1);
            item.classList.remove("favoritos"); // quitar del filtro
          }

          localStorage.setItem("favoritos", JSON.stringify(favoritos));
        });
      });


      /* ============================================
         FILTRO DE PRODUCTOS (INCLUYE "favoritos")
      ============================================ */

      

      botonesFiltro.forEach(boton => {
        boton.addEventListener("click", () => {

          const filtro = boton.getAttribute("data-filter");

          items.forEach(item => {
            if (filtro === "todos") {
              item.style.display = "block";

            } else if (item.classList.contains(filtro)) {
              item.style.display = "block";

            } else {
              item.style.display = "none";
            }
          });
        });
      });

    });
  </script>

  <script>
    document.addEventListener("DOMContentLoaded", () => {

      /* =====================================
         SISTEMA DE PUNTUACIÓN DE ESTRELLAS
      ======================================*/

      const calificaciones = JSON.parse(localStorage.getItem("calificaciones")) || {};

      const mensajes = document.getElementById("mensaje-reseña");

      function mostrarMensaje() {
        mensajes.classList.add("mostrar");
        setTimeout(() => {
          mensajes.classList.remove("mostrar");
        }, 2500);
      }

      document.querySelectorAll(".rating").forEach(rating => {
        const idProducto = rating.getAttribute("data-producto");
        const estrellas = rating.querySelectorAll(".estrella");

        // Cargar calificación guardada
        if (calificaciones[idProducto]) {
          let valorGuardado = calificaciones[idProducto];
          estrellas.forEach(e => {
            if (parseInt(e.dataset.valor) <= valorGuardado) {
              e.classList.add("activa");
              e.classList.replace("fa-regular", "fa-solid");
            }
          });
        }

        // Evento de click para calificar
        estrellas.forEach(estrella => {
          estrella.addEventListener("click", () => {
            let valor = parseInt(estrella.dataset.valor);

            // Marcar las estrellas correctas
            estrellas.forEach(e => {
              e.classList.remove("activa", "fa-solid");
              e.classList.add("fa-regular");
              if (parseInt(e.dataset.valor) <= valor) {
                e.classList.add("activa", "fa-solid");
              }
            });

            // Guardar la puntuación
            calificaciones[idProducto] = valor;
            localStorage.setItem("calificaciones", JSON.stringify(calificaciones));

            // Mostrar mensaje de agradecimiento
            mostrarMensaje();
          });
        });
      });

    });
  </script>

  

  <script>
    document.addEventListener("DOMContentLoaded", () => {

      const form = document.getElementById("newsletter-form");
      const msg = document.getElementById("newsletter-msg");

      form.addEventListener("submit", (e) => {
        e.preventDefault();

        // Mostrar mensaje
        msg.style.display = "block";

        // Guardar en LocalStorage
        let lista = JSON.parse(localStorage.getItem("newsletter")) || [];

        lista.push({
          correo: document.getElementById("correo").value,
          edad: document.getElementById("edad").value,
          fecha: new Date().toLocaleDateString()
        });

        localStorage.setItem("newsletter", JSON.stringify(lista));

        form.reset(); // limpiar form
      });

    });
  </script>



  <div id="mensaje-reseña" class="mensaje-reseña">¡Gracias por tu valoración! Nos ayuda a mejorar tu experiencia.</div>

</body>

</html>