<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Clothing Brand - Elegancia y Estilo</title>

    <!-- Estilos -->
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/menu.css">

    <link rel="icon" href="../img/iconopagina.png">
    <!-- Font Awesome (iconos) -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <!-- Script del menú -->

    <link rel="stylesheet" href="../css/reveral.css">
    <script src="../js/reveral.js" defer></script>

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
    </header>

    <!-- === SECCIONES PRINCIPALES === -->

    

    <section id="inicio">
        <div class="hero-content reveal">
            <h1>Elegancia y Estilo para tu Día a Día</h1>
            <p>Descubre nuestra nueva colección inspirada en la libertad y la fuerza.</p>
            <a href="coleccion.php" class="btn">Explorar Colección</a>
        </div>
    </section>

    <section id="historia ">
        <div class="historia-container reveal">
            <div class="historia-text">
                <h2>Nuestra Historia</h2>
                <p>Desde nuestros inicios, nos hemos dedicado a crear ropa que combina estilo, comodidad y autenticidad. Cada colección refleja nuestra pasión por la moda y nuestro compromiso con la calidad.</p>
                <p>Creemos que cada prenda cuenta una historia, y queremos que tú formes parte de ella.</p>
                <a href="coleccion.php" class="btn">Ver Colección</a>
            </div>
            <div class="historia-image reveal">
                <img src="../img/iconopagina.png" alt="Historia de la marca">
            </div>
        </div>
    </section>

   <section id="nosotros" class="reveal">
  <h2 class="reveal">Nuestra Filosofía</h2>
  <p class="reveal">Somos una marca que cree en la autenticidad y la calidad. Cada prenda está diseñada para ofrecer comodidad y estilo, reflejando una personalidad fuerte y libre.</p>
  <div style="width: 100%; max-width: 560px; margin: 30px auto; aspect-ratio: 16/9;">
    <iframe 
      style="width: 100%; height: 100%;"
      src="https://www.youtube.com/embed/Bcpu-jqAL6w" 
      title="Nike - Why Do It" 
      frameborder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>
  </div>
</section>


    <footer>
        <div class="footer-container">
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

    <!-- === CARRITO POPUP === -->
    <div id="cart-popup" class="hidden reveal">
        <h3>🛒 Carrito de Compras</h3>
        <ul id="cart-items"></ul>
        <div class="envio-section">
            <label for="direccion">Dirección de envío:</label>
            <input type="text" id="direccion" placeholder="Ingresa tu dirección">
            <button id="calcular-envio">Calcular envío</button>
            <p id="costo-envio">Costo de envío: $0</p>
        </div>
        <p>Total: <span id="cart-total">$0</span></p>
        <button id="ir-a-pagar">Ir a pagar</button>
    </div>

    <!-- === SCRIPTS === -->
    <script src="../js/scripts.js"></script>

    <!-- Carrusel -->
    <script>
        document.addEventListener("DOMContentLoaded", () => {
            let index = 0;
            const slides = document.querySelectorAll('.slide');
            const dots = document.querySelectorAll('.dot');

            function showSlide(n) {
                if (n >= slides.length) index = 0;
                if (n < 0) index = slides.length - 1;

                slides.forEach(s => s.classList.remove('active'));
                dots.forEach(d => d.classList.remove('active'));

                slides[index].classList.add('active');
                dots[index].classList.add('active');
                document.querySelector('.slides').style.transform = `translateX(-${index * 100}%)`;
            }

            document.querySelector('.next').addEventListener('click', () => {
                index++;
                showSlide(index);
            });
            document.querySelector('.prev').addEventListener('click', () => {
                index--;
                showSlide(index);
            });
            dots.forEach((dot, i) => dot.addEventListener('click', () => {
                index = i;
                showSlide(index);
            }));

            setInterval(() => {
                index++;
                showSlide(index);
            }, 6000);
        });
    </script>

<script>
   document.addEventListener("DOMContentLoaded", () => {

    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    const body = document.body;

    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        navLinks.classList.toggle('show');
        body.classList.toggle('menu-open');
    });

    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
            navLinks.classList.remove('show');
            body.classList.remove('menu-open');
        }
    });

    const navLinksItems = navLinks.querySelectorAll('a');
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('show');
            body.classList.remove('menu-open');
        });
    });

});
</script>

    <!-- Dropdown del usuario -->
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

</body>

</html>