import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { obtenerProductos, IMG_BASE_URL } from "../services/productService";
import { obtenerFavoritos, agregarFavorito, quitarFavorito } from "../services/favoritoService";
import { agregarAlCarrito } from "../services/cartService";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import PlaceholderImage from "../components/PlaceholderImage";
import Reveal from "../components/Reveal";
import "../assets/css/coleccion.css";

function Coleccion() {
  const [productos, setProductos] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [soloFavoritos, setSoloFavoritos] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [mensajeAgregado, setMensajeAgregado] = useState(null);
  const { usuario } = useAuth();
  const { refrescarCarrito } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    async function cargarDatos() {
      try {
        const respuestaProductos = await obtenerProductos();
        setProductos(respuestaProductos.data);

        if (usuario) {
          const respuestaFavoritos = await obtenerFavoritos();
          setFavoritos(respuestaFavoritos.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setCargando(false);
      }
    }
    cargarDatos();
  }, [usuario]);

  async function toggleFavorito(productoId) {
    if (!usuario) {
      navigate("/login");
      return;
    }

    const esFavorito = favoritos.includes(productoId);
    try {
      if (esFavorito) {
        await quitarFavorito(productoId);
        setFavoritos(favoritos.filter((id) => id !== productoId));
      } else {
        await agregarFavorito(productoId);
        setFavoritos([...favoritos, productoId]);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleAgregarCarrito(productoId) {
    if (!usuario) {
      navigate("/login");
      return;
    }
    try {
      await agregarAlCarrito(productoId, 1);
      await refrescarCarrito();
      setMensajeAgregado(productoId);
      setTimeout(() => setMensajeAgregado(null), 1500);
    } catch (err) {
      console.error(err);
    }
  }

  const productosFiltrados = useMemo(() => {
    return productos.filter((p) => {
      const coincideBusqueda = p.Nombre.toLowerCase().includes(busqueda.toLowerCase());
      const coincideFavoritos = !soloFavoritos || favoritos.includes(p.ProductoID);
      return coincideBusqueda && coincideFavoritos;
    });
  }, [productos, busqueda, soloFavoritos, favoritos]);

  if (cargando) return <p className="coleccion-loading">Cargando colección...</p>;

  return (
    <div className="coleccion-container">
      <PlaceholderImage src="/img/banner-principal.jpg" ratio="21 / 11" label="Banner principal — 1600×680" />

      <Reveal>
        <header className="coleccion-header">
          <h1>Nuestra colección</h1>
          <p>Prendas pensadas para combinar estilo y comodidad en cada ocasión.</p>
        </header>
      </Reveal>

      <div className="coleccion-controles">
        <input
          type="search"
          placeholder="Buscar productos..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="coleccion-buscador"
        />
        <button
          className={`filtro-favoritos ${soloFavoritos ? "activo" : ""}`}
          onClick={() => setSoloFavoritos(!soloFavoritos)}
        >
          {soloFavoritos ? "Ver todos" : "Ver guardados"}
        </button>
      </div>

      {productosFiltrados.length === 0 ? (
        <p className="coleccion-vacio">No se encontraron productos.</p>
      ) : (
        <div className="coleccion-grid">
          {productosFiltrados.map((producto, i) => {
            const esFavorito = favoritos.includes(producto.ProductoID);
            const imagenBase = `${IMG_BASE_URL}${producto.Imagen}`;
            const imagenHover = imagenBase.replace(/(\.[a-zA-Z0-9]+)$/, "-hover$1");
            const sinStock = producto.StockActual < 1;

            return (
              <Reveal key={producto.ProductoID} delay={(i % 4) * 60}>
                <div className="coleccion-card">
                  <button
                    className={`boton-favorito ${esFavorito ? "activo" : ""}`}
                    onClick={() => toggleFavorito(producto.ProductoID)}
                    aria-label="Guardar en favoritos"
                  >
                    {esFavorito ? "♥" : "♡"}
                  </button>

                  <Link to={`/producto/${producto.ProductoID}`} className="coleccion-imagen-link">
                    <div className="coleccion-imagen-wrap">
                      <img src={imagenBase} alt={producto.Nombre} className="coleccion-imagen coleccion-imagen-base" />
                      <img
                        src={imagenHover}
                        alt=""
                        className="coleccion-imagen coleccion-imagen-hover"
                        onError={(e) => { e.target.style.display = "none"; }}
                      />
                      {sinStock && <span className="coleccion-agotado-overlay">Sin stock</span>}
                    </div>
                  </Link>

                  <Link to={`/producto/${producto.ProductoID}`} className="coleccion-card-titulo-link">
                    <h3>{producto.Nombre}</h3>
                  </Link>
                  <p className="coleccion-descripcion">{producto.Descripcion}</p>
                  <p className="coleccion-precio">${producto.Precio}</p>

                  {producto.Estado === "PocasUnidades" && (
                    <span className="badge-pocas-unidades">Pocas unidades</span>
                  )}

                  <button
                    className="coleccion-agregar-carrito"
                    onClick={() => handleAgregarCarrito(producto.ProductoID)}
                    disabled={sinStock}
                  >
                    {sinStock
                      ? "Sin stock"
                      : mensajeAgregado === producto.ProductoID
                      ? "Agregado ✓"
                      : "Agregar al carrito"}
                  </button>
                </div>
              </Reveal>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Coleccion;