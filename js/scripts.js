const reveals = document.querySelectorAll('.reveal');

function revealOnScroll() {
    const triggerBottom = window.innerHeight * 0.85;

    reveals.forEach(el => {
        const boxTop = el.getBoundingClientRect().top;

        if (boxTop < triggerBottom) {
            el.classList.add('visible');
        } else {
            el.classList.remove('visible');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

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

document.addEventListener("DOMContentLoaded", () => {

    const cartIcon = document.getElementById("cart-icon");
    const cartPopup = document.getElementById("cart-popup");
    const cartItemsList = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const cartCount = document.getElementById("cart-count");
    const calcularEnvioBtn = document.getElementById("calcular-envio");
    const direccionInput = document.getElementById("direccion");
    const costoEnvioEl = document.getElementById("costo-envio");
    const irAPagarBtn = document.getElementById("ir-a-pagar");

    const vaciarBtn = document.getElementById("vaciar-carrito");


    let cart = JSON.parse(localStorage.getItem("cartData")) || [];
    let envioCosto = 0;
    updateCartUI();

    cartIcon.addEventListener("click", () => {
        cartPopup.classList.toggle("hidden");
    });

    document.querySelectorAll(".btn-comprar").forEach((btn) => {
        btn.addEventListener("click", () => {
            const product = btn.closest(".product-item");
            const title = product.querySelector("h3").textContent;
            const priceText = product.querySelector(".precio").textContent;
            const imgSrc = product.querySelector("img").getAttribute("src");

            const price = parseFloat(priceText.replace(/[$.]/g, '').replace(',', '.') || 0);

            addToCart(title, price, imgSrc);
        });
    });

    function saveCart() {
        localStorage.setItem("cartData", JSON.stringify(cart));
    }

    function addToCart(name, price, img) {
        const MAX_ITEMS = 50;
        const totalItems = cart.reduce((s, it) => s + it.quantity, 0);

        if (totalItems >= MAX_ITEMS) {
            alert(`Has alcanzado el límite máximo de ${MAX_ITEMS} productos en el carrito.`);
            return;
        }

        const existing = cart.find(item => item.name === name);
        if (existing) {
            if (totalItems + 1 > MAX_ITEMS) {
                alert(`No puedes agregar más productos. Límite ${MAX_ITEMS}.`);
                return;
            }
            existing.quantity += 1;
        } else {
            cart.push({ name, price, img, quantity: 1 });
        }
        updateCartUI();
        saveCart();
    }

    function removeFromCart(index) {
        cart.splice(index, 1);
        updateCartUI();
        saveCart();
    }

    function formatPrice(price) {
        return price.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }

    function updateCartUI() {
        cartItemsList.innerHTML = "";
        let subtotal = 0;
        let count = 0;

        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            count += item.quantity;

            const li = document.createElement("li");
            li.innerHTML = `
                <img src="${item.img}" alt="${item.name}" />
                <div class="cart-product-info">
                    <strong>${item.name}</strong> x${item.quantity} - $${formatPrice(itemTotal)}
                </div>
                <button class="remove-btn" onclick="document.dispatchEvent(new CustomEvent('removeItem', { detail: ${index} }))">Eliminar</button>
            `;
            cartItemsList.appendChild(li);
        });

        document.addEventListener('removeItem', (e) => removeFromCart(e.detail), { once: true });

        // Actualizar boton vaciar
        if (vaciarBtn) vaciarBtn.disabled = cart.length === 0;

        const totalWithEnvio = subtotal + envioCosto;
        cartTotal.textContent = `$${formatPrice(totalWithEnvio)}`;
        cartCount.textContent = count;
    }

    calcularEnvioBtn.addEventListener("click", () => {
        const direccion = direccionInput.value.trim();
        if (direccion.length === 0) {
            alert("Por favor, ingresa tu dirección.");
            return;
        }

        envioCosto = 4990;
        costoEnvioEl.textContent = `Costo de envío: $${formatPrice(envioCosto)}`;
        updateCartUI();
    });

    irAPagarBtn.addEventListener("click", () => {
        if (cart.length === 0) {
            alert("Tu carrito está vacío.");
            return;
        }

        if (direccionInput.value.trim() === "") {
            alert("Por favor, ingresa tu dirección para continuar.");
            return;
        }

        irAPagarBtn.addEventListener("click", () => {
            if (cart.length === 0) {
                alert("Tu carrito está vacío.");
                return;
            }

            if (direccionInput.value.trim() === "") {
                alert("Por favor, ingresa tu dirección para continuar.");
                return;
            }

            localStorage.setItem("direccion", direccionInput.value.trim());
            localStorage.setItem("envioCosto", envioCosto);

            window.location.href = "pago.php";
        });

    });


    // Vaciar carrito
    if (vaciarBtn) {
        vaciarBtn.addEventListener('click', () => {
            if (!cart || cart.length === 0) {
                alert('El carrito ya está vacío.');
                return;
            }
            const confirmado = confirm('¿Estás seguro de que quieres vaciar todo el carrito?');
            if (confirmado) {
                cart.length = 0; // vaciar array
                envioCosto = 0;
                saveCart();
                updateCartUI();
                alert('Carrito vaciado.');
            }
        });
    }


    const searchForm = document.querySelector('.search-bar form');
    const searchInput = document.querySelector('.search-bar input[type="search"]');
    const productItems = document.querySelectorAll('.gallery .product-item');


    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        performSearch(searchInput.value.trim());
    });


    searchInput.addEventListener('input', () => {
        performSearch(searchInput.value.trim());
    });

    function performSearch(query) {
        const lowerCaseQuery = query.toLowerCase();

        productItems.forEach(product => {

            const title = product.querySelector('h3').textContent.toLowerCase();
            const description = product.querySelector('p:nth-child(3)').textContent.toLowerCase();


            const matches = title.includes(lowerCaseQuery) || description.includes(lowerCaseQuery);


            if (matches || lowerCaseQuery === "") {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });


        document.querySelectorAll('.filtros button').forEach(btn => btn.classList.remove('active'));
    }
});


document.addEventListener('DOMContentLoaded', () => {


    const botonesFiltro = document.querySelectorAll('.filtros button');
    const productos = document.querySelectorAll('.gallery .product-item');
    const searchInput = document.querySelector('.search-bar input[type="search"]');

    botonesFiltro.forEach(boton => {
        boton.addEventListener('click', () => {
            const filtro = boton.getAttribute('data-filter');


            if (searchInput) searchInput.value = '';


            botonesFiltro.forEach(btn => btn.classList.remove('active'));
            boton.classList.add('active');

            productos.forEach(producto => {
                if (filtro === 'todos') {
                    producto.style.display = 'block';
                } else {
                    if (producto.classList.contains(filtro)) {
                        producto.style.display = 'block';
                    } else {
                        producto.style.display = 'none';
                    }
                }
            });
        });
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-suscripcion");
    const mensaje = document.getElementById("mensaje-suscripcion");

    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault(); // Evita recargar la página

            mensaje.style.display = "block";  // mostrar mensaje
            form.reset(); // limpiar campo
        });
    }
});
