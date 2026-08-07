<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contacto - Clothing Brand</title>
  <link rel="stylesheet" href="../css/contacto.css">
  <link rel="icon" href="../img/iconopagina.png">
  <script src="../js/reveral.js" defer></script>
  <link rel="stylesheet" href="../css/reveral.css">
  <!-- Estilos -->
  <link rel="stylesheet" href="../css/style.css">
  <link rel="stylesheet" href="../css/menu.css">

  <link rel="icon" href="../img/iconopagina.png">
  <!-- Font Awesome (iconos) -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

  <!-- Script del menú -->
  <!-- Script del menú -->
  <script src="js/menu.js" defer></script>

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
      <div class="hamburger" id="hamburger">☰</div>

      <!-- Menú de enlaces -->
      <div class="nav-links reveal" id="nav-links">
        <ul>
          <li><a href="index.php">Inicio</a></li>
          <li><a href="coleccion.php">Colección</a></li>
          <li><a href="nosotros.php">Nosotros</a></li>
          <li><a href="contacto.php">Contacto</a></li>
        </ul>
      </div>



      <!-- Íconos de usuario y carrito -->
      <div class="nav-icons reveal">
        <div id="cart-icon">
          <a href="coleccion.php"><img src="../img/carritodecompras.png" alt="Carrito de compras" width="28" title="Carrito"></a>

        </div>
      </div>
    </nav>
    <nav>

    </nav>
  </header>

  <section id="contacto-page reveal">
    <h1>Contáctanos</h1>
    <p>Estamos aquí para ayudarte. Escríbenos por correo, llámanos o visítanos en nuestra tienda.</p>

    <div class="contact-info reveal">
      <div class="info-box">
        <h3>📞 Teléfono</h3>
        <p>+54 11 4567-8900</p>
      </div>
      <div class="info-box reveal">
        <h3>📧 Email</h3>
        <p><a href="mailto:info@marcaropa.com">info@marcaropa.com</a></p>
      </div>
      <div class="info-box reveal">
        <h3>📍 Ubicación</h3>
        <p>Av. Siempre Viva 742, Buenos Aires</p>
      </div>
    </div>

    <div class="map-container reveal">
      <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.002595324593!2d-58.38155968477177!3d-34.60368498045983!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bccac9f0c6fbed%3A0x3e4b6e5b1f7a9e!2sBuenos%20Aires%20Obelisco!5e0!3m2!1ses!2sar!4v1700000000000!5m2!1ses!2sar"
        width="100%" height="400" style="border:0;" allowfullscreen loading="lazy"></iframe>
    </div>

    <div class="form-container reveal">
      <h2>Envíanos un mensaje</h2>
      <form action="mailto:info@marcaropa.com" method="post" enctype="text/plain">
        <input type="text" name="nombre" placeholder="Tu nombre" required>
        <input type="email" name="email" placeholder="Tu email" required>
        <input type="text" name="asunto" placeholder="Asunto" required>
        <textarea name="mensaje" rows="5" placeholder="Escribe tu mensaje..." required></textarea>
        <button type="submit">Enviar mensaje</button>
      </form>
    </div>
  </section>

  <footer>
    <div class="footer-container reveal">
      <div class="footer-col brand-info reveal">
        <img src="../img/iconopagina.png" alt="Logo de la marca" class="footer-logo">
        <p>Elegancia y estilo en cada prenda. Inspirados en la autenticidad, diseñamos ropa para destacar tu personalidad.</p>
      </div>
      <div class="footer-col">
        <h3>Enlaces rápidos</h3>
        <ul>
          <li><a href="index.php#inicio">Inicio</a></li>
          <li><a href="index.php#coleccion">Colección</a></li>
          <li><a href="index.php#nosotros">Nosotros</a></li>
          <li><a href="contacto.php">Contacto</a></li>
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
    <a href="pago.php" class="btn-pagar">Ir a pagar</a>

  </div>


  <script>
    /**********************
     * 1. 用户头像下拉菜单
     **********************/
    document.addEventListener('DOMContentLoaded', () => {

      const userProfile = document.getElementById('user-profile');
      const userMenu = document.getElementById('user-menu');

      function positionMenu() {
        const rect = userProfile.getBoundingClientRect();
        userMenu.style.top = rect.bottom + window.scrollY + 'px';
        userMenu.style.left = rect.left + window.scrollX + 'px';
      }

      userProfile.addEventListener('click', (e) => {
        e.stopPropagation();
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

    });


    /**********************
     * 2. 商品过滤按钮
     **********************/
    document.addEventListener('DOMContentLoaded', () => {

      const botonesFiltro = document.querySelectorAll('.filtros button');
      const productos = document.querySelectorAll('.gallery .product-item');

      botonesFiltro.forEach(boton => {
        boton.addEventListener('click', () => {
          const filtro = boton.getAttribute('data-filter');

          productos.forEach(producto => {
            if (filtro === 'todos') {
              producto.style.display = 'block';
            } else {
              producto.style.display = producto.classList.contains(filtro) ?
                'block' :
                'none';
            }
          });
        });
      });

    });


    /**********************
     * 3. Modal de detalles de producto
     **********************/
    document.addEventListener('DOMContentLoaded', () => {

      const modal = document.getElementById('modal-detalles');
      const modalImg = document.getElementById('modal-img');
      const modalTitle = document.getElementById('modal-title');
      const modalDesc = document.getElementById('modal-description');
      const modalMaterials = document.getElementById('modal-materials');
      const modalSizes = document.getElementById('modal-sizes');
      const modalColors = document.getElementById('modal-colors');
      const modalPrice = document.getElementById('modal-price');
      const modalStars = document.getElementById('modal-stars');
      const closeModal = document.getElementById('close-modal');
      const navbar = document.querySelector('nav');

      const botonesDetalles = document.querySelectorAll('.btn-detalles');

      botonesDetalles.forEach(boton => {
        boton.addEventListener('click', () => {

          const product = boton.closest('.product-item');

          modalImg.src = product.querySelector('img').src;
          modalTitle.textContent = product.querySelector('h3').textContent;
          modalDesc.textContent = product.querySelector('p').textContent;
          modalPrice.textContent = product.querySelector('.precio').textContent;
          modalStars.innerHTML = product.querySelector('.estrellas').innerHTML;

          modalMaterials.textContent = "Material: Algodón Premium";
          modalSizes.textContent = "Tallas: S, M, L, XL";
          modalColors.textContent = "Colores: Negro, Blanco, Azul";

          modal.classList.remove('hidden');
          navbar.style.display = 'none';
        });
      });

      function cerrarModal() {
        modal.classList.add('hidden');
        navbar.style.display = 'flex';
      }

      closeModal.addEventListener('click', cerrarModal);

      window.addEventListener('click', (e) => {
        if (e.target === modal) cerrarModal();
      });

    });


    /**********************
     * 4. Hamburger menú (mobile)
     **********************/
    document.addEventListener('DOMContentLoaded', () => {

      const hamburger = document.getElementById('hamburger');
      const navLinks = document.getElementById('nav-links');

      hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('show');
      });

      navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          navLinks.classList.remove('show');
        });
      });

    });


    /**********************
     * 5. Otro menú dropdown（userBtn）
     **********************/
    document.addEventListener('DOMContentLoaded', () => {

      const userBtn = document.getElementById('userBtn');
      const dropdownMenu = document.getElementById('dropdownMenu');

      if (userBtn && dropdownMenu) {
        userBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          dropdownMenu.classList.toggle('show');
        });

        document.addEventListener('click', (e) => {
          if (!dropdownMenu.contains(e.target) && !userBtn.contains(e.target)) {
            dropdownMenu.classList.remove('show');
          }
        });
      }

    });
  </script>

</body>

</html>