
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { obtenerProductos, IMG_BASE_URL } from "../services/productService";
import { agregarAlCarrito } from "../services/cartService";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { SkeletonGrid } from "../components/Skeleton";
import "../assets/css/coleccion.css";

const LIMITE = 8;

function Coleccion() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [cargandoMas, setCargandoMas] = useState(false);
  const [pagina, setPagina] = useState(1);
  const [total, setTotal] = useState(0);
  const [hayMas, setHayMas] = useState(false);
  const [agregado, setAgregado] = useState(null);

  const { usuario } = useAuth();
  const { refrescarCarrito } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    let activo = true;

    async function cargarProductos() {
      setCargando(true);

      try {
        const respuesta = await obtenerProductos("Todos", 1, LIMITE);
        const lista = Array.isArray(respuesta?.data) ? respuesta.data : [];
        const cantidad = respuesta?.pagination?.total ?? lista.length;

        if (!activo) return;

        setProductos(lista);
        setTotal(cantidad);
        setPagina(1);
        setHayMas(lista.length < cantidad);
      } catch (error) {
        console.error("Error al cargar productos:", error);

        if (activo) {
          setProductos([]);
          setTotal(0);
          setHayMas(false);
        }
      } finally {
        if (activo) setCargando(false);
      }
    }

    cargarProductos();

    return () => {
      activo = false;
    };
  }, []);

  async function cargarMas() {
    if (cargandoMas || !hayMas) return;

    setCargandoMas(true);

    try {
      const siguiente = pagina + 1;
      const respuesta = await obtenerProductos("Todos", siguiente, LIMITE);
      const nuevos = Array.isArray(respuesta?.data) ? respuesta.data : [];
      const cantidad = respuesta?.pagination?.total ?? total;

      setProductos((actuales) => [...actuales, ...nuevos]);
      setPagina(siguiente);
      setTotal(cantidad);
      setHayMas(siguiente * LIMITE < cantidad);
    } catch (error) {
      console.error("Error al cargar más productos:", error);
      alert("No se pudieron cargar más productos.");
    } finally {
      setCargandoMas(false);
    }
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
      setTimeout(() => {
        setAgregado((actual) => (actual === id ? null : actual));
      }, 2000);
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
      alert("No se pudo agregar el producto al carrito.");
    }
  }

  if (cargando) return <SkeletonGrid count={LIMITE} />;

  return (
    <div className="coleccion-container">
      <section className="banner-hero">
        <img
          src="/img/banner-principal.jpg"
          alt="Colección ViroFenix"
          className="banner-imagen"
        />
        <div className="banner-overlay">
          <span className="banner-kicker">Temporada 2026</span>
          <h1 className="banner-titulo">Estilo que se nota</h1>
          <p className="banner-subtitulo">
            Prendas y calzado que combinan carácter, comodidad y estilo.
          </p>
          <button
            className="banner-cta"
            onClick={() =>
              document.getElementById("catalogo")?.scrollIntoView({
                behavior: "smooth",
              })
            }
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

        <div className="coleccion-resultado-info">
          <span>
            Mostrando {productos.length} de {total} productos
          </span>
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
                  ? /^https?:\/\//i.test(producto.Imagen)
                    ? producto.Imagen
                    : `${IMG_BASE_URL}${producto.Imagen}`
                  : "";

                const hover = imagen
                  ? imagen.replace(/(\.[a-zA-Z0-9]+)$/, "-hover$1")
                  : "";

                const sinStock = Number(producto.StockActual) < 1;
                const precio = Number(producto.Precio);

                return (
                  <article className="coleccion-card" key={producto.ProductoID}>
                    <Link
                      to={`/producto/${producto.ProductoID}`}
                      className="coleccion-imagen-link"
                    >
                      <div className="coleccion-imagen-wrap">
                        {imagen && (
                          <>
                            <img
                              src={imagen}
                              alt={producto.Nombre || "Producto"}
                              className="coleccion-imagen coleccion-imagen-base"
                              loading="lazy"
                              onError={(e) => {
                                e.currentTarget.style.visibility = "hidden";
                              }}
                            />
                            {hover !== imagen && (
                              <img
                                src={hover}
                                alt=""
                                aria-hidden="true"
                                className="coleccion-imagen coleccion-imagen-hover"
                                loading="lazy"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            )}
                          </>
                        )}

                        {sinStock && (
                          <span className="coleccion-agotado-overlay">
                            Sin stock
                          </span>
                        )}
                      </div>
                    </Link>

                    <Link
                      to={`/producto/${producto.ProductoID}`}
                      className="coleccion-card-titulo-link"
                    >
                      <h3>{producto.Nombre || "Producto sin nombre"}</h3>
                    </Link>

                    <p className="coleccion-descripcion">
                      {producto.Descripcion}
                    </p>

                    <p className="coleccion-precio">
                      {producto.Precio != null && producto.Precio !== "" &&
                      Number.isFinite(precio)
                        ? precio.toLocaleString("es-AR", {
                            style: "currency",
                            currency: "ARS",
                          })
                        : "Consultar precio"}
                    </p>

                    {producto.Estado === "PocasUnidades" && (
                      <span className="badge-pocas-unidades">
                        Pocas unidades
                      </span>
                    )}

                    <button
                      type="button"
                      className="coleccion-agregar-carrito"
                      onClick={() => agregarCarrito(producto.ProductoID)}
                      disabled={sinStock}
                    >
                      {sinStock
                        ? "Sin stock"
                        : agregado === producto.ProductoID
                          ? "Agregado ✓"
                          : "Agregar al carrito"}
                    </button>
                  </article>
                );
              })}
            </div>

            {hayMas && (
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

        <section className="coleccion-banner-secundario">
          <div className="banner-secundario-wrap">
            <img
              src="/img/banners/banner.jpg"
              alt="Edición limitada ViroFenix"
              loading="lazy"
            />
            <div className="banner-overlay">
              <span className="banner-kicker">Edición limitada</span>
              <h2 className="banner-titulo">No te lo pierdas</h2>
              <p className="banner-subtitulo">
                Piezas seleccionadas, stock limitado.
              </p>
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
