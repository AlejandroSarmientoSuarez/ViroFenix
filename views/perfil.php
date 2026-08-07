<?php
session_start();
require_once 'db.php';

if (!isset($_SESSION['user_id'])) {
    header("Location: ../views/login.php");
    exit();
}

$stmt = $pdo->prepare("SELECT * FROM Usuarios WHERE UsuarioID = ?");
$stmt->execute([$_SESSION['user_id']]);
$usuario = $stmt->fetch(PDO::FETCH_ASSOC);
?>


<?php include("../includes/header.php"); ?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Página de Pago - Marca Ropa</title>
    <link rel="stylesheet" href="../css/perfil.css" />
<link rel="stylesheet" href="/proyecto1_final/assets/css/responsive.css">
<script src="/proyecto1_final/assets/js/menu.js" defer></script>
</head>
<body>
  
 <script src="../js/scripts.js"></script>
    <header>
        <nav>
           <div class="logo">
       <a href="index.php"><img src="../img/iconopagina.png" alt="Logo de la marca"></a>
      </div>
      <ul>
        <li><a href="index.php">Inicio</a></li>
            <li><a href="coleccion.php">Colección</a></li>
            <li><a href="nosotros.php">Nosotros</a></li>
            <li><a href="contacto.php">Contacto</a></li>
      </ul>
       <div class="search-bar">
            <form action="#" method="get">
                <input type="search" placeholder="Buscar productos..." name="search">
                <button id="button-search" type="submit"><img src="../img/iconobuscar.png" alt="" width="20"></button>
            </form>
        </div>
         <div class="nav-icons">
    <div id="user-profile">
        <img src="../img/perfil.png" alt="Perfil" width="28" title="Perfil de usuario">
    </div>
    <div id="user-menu" style="display:none; position:absolute; background:#fff; border:1px solid #ccc; padding:10px; box-shadow:0 2px 5px rgba(0,0,0,0.2); z-index:100;">
  <ul style="list-style:none; margin:0; padding:0;">
    <li><a href="perfil.php" style="text-decoration:none; color:#333; display:block; padding:5px 10px;">Perfil</a></li>
    <li><a href="../logout.php" style="text-decoration:none; color:#333; display:block; padding:5px 10px;">Cerrar sesión</a></li>
  </ul>
</div>

    <div id="cart-icon">
        <img src="../img/carritodecompras.png" alt="Carrito de compras" width="28" title="Carrito">
        <span id="cart-count">0</span>
    </div>
</div>
        </nav>
    </header>

    <div class="profile-container">
  <div class="profile-container">
  <h1>Bienvenido, <span id="username">Cargando...</span> 👋</h1>


</div>



  <section class="profile-info">
    <h2>Tu perfil</h2>
    <p>Aquí puedes ver tus pedidos, recomendaciones y más.</p>
  </section>



  <section class="orders">
    <h2>Tus pedidos recientes</h2>
    <ul>
      <li>Tambien puedes consulta el estado de tus pedidos por <a href="">whatsapp</a></li>
    
    </ul>
    <ul id="lista-ordenes"></ul>
  </section>
</div>


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
        <div class="footer-bottom">
            <p>© 2025 Marca Ropa. Todos los derechos reservados.</p>
        </div>
    </footer>
    <script>
        document.addEventListener("DOMContentLoaded", () => {
    const resumenCarrito = document.getElementById("resumen-carrito");
    const mostrarDireccion = document.getElementById("mostrar-direccion");
    const totalPagar = document.getElementById("total-pagar");

    
    const carritoGuardado = JSON.parse(localStorage.getItem("carrito")) || [];
    const direccion = localStorage.getItem("direccion") || "";

    mostrarDireccion.textContent = direccion;

    let total = 0;

    carritoGuardado.forEach((item) => {
        const li = document.createElement("li");
        li.className = "producto-resumen";

        const img = document.createElement("img");
        img.src = item.img;
        img.alt = item.name;
        img.style.width = "60px";  
        img.style.height = "60px";
        img.style.objectFit = "cover";
        img.style.marginRight = "10px";
        img.style.verticalAlign = "middle";

        const texto = document.createElement("span");
        texto.textContent = `${item.name} x${item.quantity} - $${(item.price * item.quantity).toLocaleString()}`;

        li.appendChild(img);
        li.appendChild(texto);

        resumenCarrito.appendChild(li);
        total += item.price * item.quantity;
    });

    totalPagar.textContent = `$${total.toLocaleString()}`;
});

    </script>
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
    <button id="ir-a-pagar">Ir a pagar</button>
</div>

<script>
  
  fetch('../getUser.php')
    .then(response => response.json())
    .then(data => {
      const usernameSpan = document.getElementById('username');
      if (data.username) {
        usernameSpan.textContent = data.username;
      } else {
        usernameSpan.textContent = "Invitado";
      
      }
    })
    .catch(() => {
      document.getElementById('username').textContent = "Error al cargar usuario";
    });

  
  document.querySelector('a[href="../logout.php"]').addEventListener('click', (e) => {
  e.preventDefault();
  window.location.href = '../logout.php';
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
  fetch('../getUser.php')
  .then(response => response.json())
  .then(data => {
    if (data.username) {
      document.getElementById('username').textContent = data.username;
    } else {
      
      window.location.href = 'login.php';
    }
  })
  .catch(() => {
     
    window.location.href = 'login.php';
  });

</script>
<script>
  document.addEventListener('DOMContentLoaded', () => {
  const cliente = 'usuario@example.com';  
  fetch(`src/pages/php/listar_ordenes.php?cliente=${encodeURIComponent(cliente)}`)
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        const lista = document.getElementById('lista-ordenes');
        data.ordenes.forEach(ord => {
          const li = document.createElement('li');
          li.textContent = `Orden ${ord.numero_orden} - ${ord.metodo_pago} - $${ord.total} - Dirección: ${ord.direccion} - Fecha: ${ord.fecha}`;
          lista.appendChild(li);
        });
      } else {
        alert('Error al cargar órdenes: ' + data.message);
      }
    });
});

</script>
</body>
<script>
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('show');
  });

  // Opcional: cerrar menú al hacer clic en un enlace
  const links = navLinks.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('show');
    });
  });
</script>

</html>

<?php include("../includes/footer.php"); ?>