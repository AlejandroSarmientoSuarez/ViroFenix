
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { obtenerProductos, IMG_BASE_URL } from "../services/productService";
import { agregarAlCarrito } from "../services/cartService";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "../assets/css/coleccion.css";

function Coleccion() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [cargandoMas, setCargandoMas] = useState(false);
  const [pagina, setPagina] = useState(1);
  const [total, setTotal] = useState(0);
  const [agregado, setAgregado] = useState(null);

  const { usuario } = useAuth();
  const { refrescarCarrito } = useCart();
  const navigate = useNavigate();
  const limite = 8;

  useEffect(() => {
    async function cargar() {
      try {
        const respuesta = await obtenerProductos("Todos", 1, limite);
        const lista = Array.isArray(respuesta.data) ? respuesta.data : [];

        setProductos(lista);
        setTotal(respuesta.pagination?.total || lista.length);
      } catch {
        setProductos([]);
      }

      setCargando(false);
    }

    cargar();
  }, []);

  async function cargarMas() {
    setCargandoMas(true);

    try {
      const respuesta = await obtenerProductos("Todos", pagina + 1, limite);
      const nuevos = Array.isArray(respuesta.data) ? respuesta.data : [];

      setProductos([...productos, ...nuevos]);
      setPagina(pagina + 1);
      setTotal(respuesta.pagination?.total || total);
    } catch {
      alert("No se pudieron cargar más productos.");
    }

    setCargandoMas(false);
  }

  async function agregarCarrito(id) {
    if (!usuario) {
      navigate("/login");
      return;
    }

    try {
      await agregarAlCarrito(id, 1);
      await refrescarCarrito();
      setAgregado(id);
      setTimeout(() => setAgregado(null), 2000);
    } catch {
      alert("No se pudo agregar el producto al carrito.");
    }
  }

  return (
    <div className="coleccion-container">
      <section className="banner-hero">
        <img src="/img/banner-principal.jpg" alt="Colección ViroFenix" className="banner-imagen" />

        <div className="banner-overlay">
          <span className="banner-kicker">Temporada 2026</span>
          <h1 className="banner-titulo">Estilo que se nota</h1>
          <p className="banner-subtitulo">
            Prendas y calzado que combinan carácter, comodidad y estilo.
          </p>
          <button
            className="banner-cta"
            onClick={() => document.getElementById("catalogo").scrollIntoView({ behavior: "smooth" })}
          >
            Ver colección
          </button>
        </div>
      </section>

      <main className="coleccion-contenido" id="catalogo">
        <header className="coleccion-header">
          <span className="coleccion-kicker">Catálogo completo</span>
          <h1>Nuestra colección</h1>
          <p>Descubrí todos nuestros productos en un solo lugar.</p>
        </header>

        <div className="coleccion-separador" />

        {cargando ? (
          <p>Cargando productos...</p>
        ) : (
          <>
            <div className="coleccion-resultado-info">
              <span>Mostrando {productos.length} de {total} productos</span>
            </div>

            {productos.length === 0 ? (
              <div className="coleccion-vacio">
                <p>No hay productos disponibles.</p>
              </div>
            ) : (
              <>
                <div className="coleccion-grid">
                  {productos.map((producto) => {
                    const imagen = producto.Imagen
                      ? producto.Imagen.startsWith("http")
                        ? producto.Imagen
                        : IMG_BASE_URL + producto.Imagen
                      : "";

                    const hover = imagen
                      ? imagen.replace(/(\.[a-zA-Z0-9]+)$/, "-hover$1")
                      : "";

                    const sinStock = Number(producto.StockActual) < 1;
                    const precio = Number(producto.Precio);

                    return (
                      <article className="coleccion-card" key={producto.ProductoID}>
                        <Link to={`/producto/${producto.ProductoID}`} className="coleccion-imagen-link">
                          <div className="coleccion-imagen-wrap">
                            {imagen && (
                              <>
                                <img
                                  src={imagen}
                                  alt={producto.Nombre || "Producto"}
                                  className="coleccion-imagen coleccion-imagen-base"
                                  loading="lazy"
                                />

                                {hover !== imagen && (
                                  <img
                                    src={hover}
                                    alt=""
                                    className="coleccion-imagen coleccion-imagen-hover"
                                    loading="lazy"
                                    onError={(e) => e.currentTarget.style.display = "none"}
                                  />
                                )}
                              </>
                            )}

                            {sinStock && (
                              <span className="coleccion-agotado-overlay">Sin stock</span>
                            )}
                          </div>
                        </Link>

                        <Link to={`/producto/${producto.ProductoID}`} className="coleccion-card-titulo-link">
                          <h3>{producto.Nombre || "Producto sin nombre"}</h3>
                        </Link>

                        <p className="coleccion-descripcion">{producto.Descripcion}</p>

                        <p className="coleccion-precio">
                          {producto.Precio != null && producto.Precio !== "" && Number.isFinite(precio)
                            ? precio.toLocaleString("es-AR", { style: "currency", currency: "ARS" })
                            : "Consultar precio"}
                        </p>

                        {producto.Estado === "PocasUnidades" && (
                          <span className="badge-pocas-unidades">Pocas unidades</span>
                        )}

                        <button
                          type="button"
                          className="coleccion-agregar-carrito"
                          onClick={() => agregarCarrito(producto.ProductoID)}
                          disabled={sinStock}
                        >
                          {sinStock ? "Sin stock" : agregado === producto.ProductoID ? "Agregado ✓" : "Agregar al carrito"}
                        </button>
                      </article>
                    );
                  })}
                </div>

                {productos.length < total && (
                  <div className="coleccion-cargar-mas-wrap">
                    <button
                      type="button"
                      className="coleccion-cargar-mas"
                      onClick={cargarMas}
                      disabled={cargandoMas}
                    >
                      {cargandoMas ? "Cargando..." : "Cargar más productos"}
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}

        <section className="coleccion-banner-secundario">
          <div className="banner-secundario-wrap">
            <img src="/img/banners/banner.jpg" alt="Edición limitada ViroFenix" loading="lazy" />

            <div className="banner-overlay">
              <span className="banner-kicker">Edición limitada</span>
              <h2 className="banner-titulo">No te lo pierdas</h2>
              <p className="banner-subtitulo">Piezas seleccionadas, stock limitado.</p>
              <button
                type="button"
                className="banner-cta"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                Volver arriba
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Coleccion;
