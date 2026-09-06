function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

window.onpageshow = function (e) {
  if (e.persisted) window.location.reload();
};

function init() {
  redirect();
  userconfig();
  loadBooks();
}

// 💡 FUNCIONALIDAD DE TRANSACCIONES
function handleTransaction(bookId, type) {
  const username = getCookie("user");
  if (!username) {
    alert("Error: No se encontró la sesión del usuario. Por favor, inicie sesión de nuevo.");
    return;
  }

  const transactionData = {
    book_id: bookId,
    username: username,
    type: type,
  };

  fetch("../server/menu.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(transactionData),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status === "ok") {
        alert(`¡Transacción exitosa! ${type === "COMPRA" ? "Has comprado" : "Has alquilado"} ${data.book_name}.`);
        closeBookModal();
      } else {
        alert("Error al realizar la transacción: " + data.message);
      }
    })
    .catch((err) => {
      console.error("Error en fetch de transacción:", err);
      alert("Ocurrió un error de conexión al procesar la transacción.");
    });
}

// ==================================================================
// ================== MODAL DE LIBROS ================================
// ==================================================================

function clickbook(id) {
  fetch("../server/getfront.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: id }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status === "ok") {
        const bookId = id;

        const span = document.createElement("span");
        span.id = "bookspan";
        span.addEventListener("click", () => closeBookModal());

        const div = document.createElement("div");
        div.id = "bookdiv";
        div.addEventListener("click", (e) => e.stopPropagation());

        const badge = document.createElement("span");
        badge.className = "badge";
        badge.textContent = data.gender;

        const nombre = document.createElement("h2");
        nombre.textContent = data.name;

        const content = document.createElement("div");
        content.className = "book-content";

        const img = document.createElement("img");
        img.src = data.url;

        const btnContainer = document.createElement("div");
        btnContainer.className = "button-container";

        const comprarBtn = document.createElement("button");
        comprarBtn.className = "comprar";
        comprarBtn.textContent = "Comprar";
        comprarBtn.onclick = () => handleTransaction(bookId, "COMPRA");

        const alquilarBtn = document.createElement("button");
        alquilarBtn.className = "alquilar";
        alquilarBtn.textContent = "Alquilar";
        alquilarBtn.onclick = () => handleTransaction(bookId, "ALQUILER");

        btnContainer.appendChild(comprarBtn);
        btnContainer.appendChild(alquilarBtn);

        content.appendChild(img);
        content.appendChild(btnContainer);

        div.appendChild(badge);
        div.appendChild(nombre);
        div.appendChild(content);

        span.appendChild(div);
        document.body.appendChild(span);

        div.style.animation = "moveleft 0.5s ease-out forwards";
      } else {
        alert("Error: " + data.message);
      }
    })
    .catch((err) => console.error("Error en fetch:", err));
}

function closeBookModal() {
  const div = document.getElementById("bookdiv");
  if (!div) return;
  div.style.animation = "moveright 0.3s ease-out forwards";
  const span = document.getElementById("bookspan");
  span.style.animation = "disapear 0.3s ease-out forwards";
  setTimeout(() => {
    if (span) span.remove();
  }, 300);
}

// ==================================================================
// ================== MENÚ DE USUARIO ================================
// ==================================================================

function userconfig() {
  const user = getCookie("user");
  document.querySelector(".username").textContent = user || "Usuario";

  const userBtn = document.getElementById("userBtn");
  const dropdownMenu = document.getElementById("dropdownMenu");

  userBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdownMenu.classList.toggle("show");
    const expanded = dropdownMenu.classList.contains("show");
    userBtn.setAttribute("aria-expanded", expanded);
  });

  document.addEventListener("click", (e) => {
    if (!dropdownMenu.contains(e.target) && !userBtn.contains(e.target)) {
      dropdownMenu.classList.remove("show");
      userBtn.setAttribute("aria-expanded", false);
    }
  });
}

// ==================================================================
// ================== FUNCIONES VARIAS ===============================
// ==================================================================

function removeCookie(name) {
  document.cookie = `${name}=; path=/; max-age=0;`;
}

function logout() {
  removeCookie("user");
  removeCookie("password");
  window.location.href = "../php/index.html";
}

function redirect() {
  const user = getCookie("user");
  if (!user) window.location.href = "../php/index.html";
}

// CONFIRMAR ELIMINACIÓN
function showDeleteConfirm() {
  document.getElementById("deleteConfirm").style.display = "flex";
}
function closeConfirm() {
  document.getElementById("deleteConfirm").style.display = "none";
}
function confirmDelete() {
  fetch("../server/delete.php", { method: "POST" })
    .then((r) => r.json())
    .then((data) => {
      alert(data.message);
      if (data.message.includes("correctamente")) {
        window.location.href = "../php/index.html";
      }
    })
    .catch((err) => alert("Error: " + err));
}

document.addEventListener("DOMContentLoaded", () => {
    const userBtn = document.getElementById("userBtn");
    const dropdownMenu = document.getElementById("dropdownMenu");

    userBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        dropdownMenu.classList.toggle("show");
        const expanded = dropdownMenu.classList.contains("show");
        userBtn.setAttribute("aria-expanded", expanded);
    });

    // Cierra el menú al hacer clic fuera
    document.addEventListener("click", (e) => {
        if (!dropdownMenu.contains(e.target) && !userBtn.contains(e.target)) {
            dropdownMenu.classList.remove("show");
            userBtn.setAttribute("aria-expanded", false);
        }
    });
});


// ==================================================================
// ================== CARRITO =======================================
// ==================================================================

function verCarrito() {
  const modal = document.getElementById("carritoModal");
  const content = modal.querySelector(".carrito-content");
  content.innerHTML = "";

  const carrito = [
    {
      nombre: "Minecraft",
      estado: "comprado",
      imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoADxMkbl8qh15FHha80LiFcfD9KHialDciA&s",
    },
    {
      nombre: "Harry Potter",
      estado: "alquilado",
      imagen: "https://via.placeholder.com/150x200?text=Harry+Potter",
    },
  ];

  carrito.forEach((libro) => {
    const card = document.createElement("div");
    card.classList.add("carrito-card");

    const title = document.createElement("p");
    title.innerText = libro.nombre;
    title.classList.add("carrito-title");
    card.appendChild(title);

    const img = document.createElement("img");
    img.src = libro.imagen;
    card.appendChild(img);

    const badge = document.createElement("div");
    badge.classList.add("badge-status", libro.estado === "comprado" ? "badge-comprado" : "badge-alquilado");
    badge.innerText = libro.estado === "comprado" ? "Comprado" : "Alquilado";
    badge.classList.add("badge-bottom");
    card.appendChild(badge);

    content.appendChild(card);
  });

  modal.style.display = "flex";
}

function cerrarCarrito() {
  document.getElementById("carritoModal").style.display = "none";
}

// ==================================================================
// ================== LIBROS ========================================
// ==================================================================

function loadBooks() {
  fetch("../server/fronts.php")
    .then((response) => response.json())
    .then((data) => {
      let book = [];
      for (let i = 0; i < data.count; i++) {
        book.push({
          id: data.id[i],
          name: data.name[i],
          url: data.url[i],
          gender: data.gender[i],
        });
      }

      book.sort((a, b) => a.name.localeCompare(b.name));

      for (let i = 0; i < data.count; i++) {
        const button = document.createElement("button");
        button.onclick = () => clickbook(book[i].id);
        button.className = "bookcontainer";
        button.dataset.gender = book[i].gender;
        button.dataset.id = book[i].id;

        const img = document.createElement("img");
        img.className = "indbook";
        img.src = book[i].url;

        const p = document.createElement("p");
        p.className = "indtitle";
        p.textContent = `${book[i].name}`;

        const title = book[i].name;
        const words = title.split(" ");
        let longestWord = 0;
        for (const word of words) if (word.length > longestWord) longestWord = word.length;
        p.style.fontSize = title.length <= 20 && longestWord <= 10 ? "34px" : "28px";

        const container = document.querySelector(".bookstorage");
        button.appendChild(img);
        button.appendChild(p);
        container.appendChild(button);
      }
    })
    .catch((error) => console.error("Error al hacer fetch:", error));
}

// ==================================================================
// ================== INICIALIZACIÓN ================================
// ==================================================================

document.addEventListener("DOMContentLoaded", init);
