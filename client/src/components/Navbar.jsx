import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "../assets/css/navbar.css";

function Navbar() {
  const { usuario, logout } = useAuth();
  const { cantidadItems, refrescarCarrito } = useCart();
  const [menuAbierto, setMenuAbierto] = useState(false);

  useEffect(() => {
    refrescarCarrito();
  }, [usuario]);

  useEffect(() => {
    document.body.style.overflow = menuAbierto ? "hidden" : "";
  }, [menuAbierto]);

  return (
    <>
      <header className="navbar">
        <Link to="/" className="navbar-logo">Clothing Brand</Link>

        <nav className="navbar-links navbar-links-desktop">
          <Link to="/">Inicio</Link>
          <Link to="/coleccion">Colección</Link>
        </nav>

        <div className="navbar-actions">
          {usuario ? (
            <>
              <Link to="/carrito" className="navbar-cart">
                Carrito {cantidadItems > 0 && <span className="navbar-cart-badge">{cantidadItems}</span>}
              </Link>
              <Link to="/perfil" className="navbar-links-desktop">Mi cuenta</Link>
              <button onClick={logout} className="navbar-logout navbar-links-desktop">Salir</button>
            </>
          ) : (
            <Link to="/login" className="navbar-links-desktop">Iniciar sesión</Link>
          )}

          <button
            className="navbar-hamburger"
            onClick={() => setMenuAbierto(true)}
            aria-label="Abrir menú"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      <div className={`navbar-drawer ${menuAbierto ? "navbar-drawer-abierto" : ""}`}>
        <button className="navbar-drawer-cerrar" onClick={() => setMenuAbierto(false)}>
          ✕
        </button>

        <nav className="navbar-drawer-links">
          <Link to="/" onClick={() => setMenuAbierto(false)}>Inicio</Link>
          <Link to="/coleccion" onClick={() => setMenuAbierto(false)}>Colección</Link>
          {usuario ? (
            <>
              <Link to="/carrito" onClick={() => setMenuAbierto(false)}>Carrito</Link>
              <Link to="/perfil" onClick={() => setMenuAbierto(false)}>Mi cuenta</Link>
              <button onClick={() => { logout(); setMenuAbierto(false); }}>Salir</button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMenuAbierto(false)}>Iniciar sesión</Link>
          )}
        </nav>

        <div className="navbar-drawer-proximamente">
          <p className="navbar-drawer-label">Próximamente</p>
          <span>Nosotros</span>
          <span>Contacto</span>
          <span>Blog</span>
        </div>
      </div>

      {menuAbierto && (
        <div className="navbar-overlay" onClick={() => setMenuAbierto(false)}></div>
      )}
    </>
  );
}

export default Navbar;