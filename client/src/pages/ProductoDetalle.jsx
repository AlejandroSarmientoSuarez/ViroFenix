
import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  obtenerProductoPorId,
  obtenerProductos,
  IMG_BASE_URL
} from "../services/productService";
import { agregarAlCarrito } from "../services/cartService";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "../assets/css/producto-detalle.css";

function ProductoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const { refrescarCarrito } = useCart();

  const [producto, setProducto] = useState(null);
  const [recomendados, setRecomendados] = useState([]);
  const [cantidad, setCantidad] = useState(1);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    async function cargarProducto() {
      setCargando(true);
      setProducto(null);
      setCantidad(1);
      setMensaje("");

      try {
        const respuesta = await obtenerProductoPorId(id);
        setProducto(respuesta.data ?? respuesta);
      } catch {
        setProducto(null);
      } finally {
        setCargando(false);
      }
    }

    cargarProducto();
  }, [id]);

  useEffect(() => {
    async function cargarRecomendados() {
      try {
        const respuesta = await obtenerProductos("Todos", 1, 10);
        const lista = Array.isArray(respuesta.data) ? respuesta.data : [];

        setRecomendados(
          lista
            .filter(p => String(p.ProductoID) !== String(id))
            .slice(0, 4)
        );
      } catch {
        setRecomendados([]);
      }
    }

    cargarRecomendados();
  }, [id]);

  async function comprar(irAlPago) {
    if (!usuario) {
      navigate("/login");
      return;
    }

    if (procesando || !producto) return;

    const stock = Number(producto.StockActual || 0);

    if (stock < 1 || cantidad > stock) {
      setError(true);
      setMensaje("No hay stock suficiente.");
      return;
    }

    setProcesando(true);
    setMensaje("");

    try {
      await agregarAlCarrito(producto.ProductoID, cantidad);
      await refrescarCarrito();

      if (irAlPago) {
        navigate("/checkout");
      } else {
        setError(false);
        setMensaje("Producto agregado al carrito.");
      }
    } catch {
      setError(true);
      setMensaje("No se pudo agregar el producto al carrito.");
    } finally {
      setProcesando(false);
    }
  }

  const formatoPrecio = valor =>
    Number(valor || 0).toLocaleString("es-AR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

  const obtenerImagen = imagen =>
    imagen
      ? imagen.startsWith("http")
        ? imagen
        : `${IMG_BASE_URL}${imagen}`
      : "";

  if (cargando) {
    return (
      <p className="producto-detalle-loading">
        Cargando producto...
      </p>
    );
  }

  if (!producto) {
    return (
      <div className="producto-detalle-vacio">
        <h2>Producto no encontrado</h2>
        <button onClick={() => navigate("/coleccion")}>
          Volver a la colección
        </button>
      </div>
    );
  }

  const stock = Number(producto.StockActual || 0);
  const precio = Number(producto.Precio || 0);
  const imagen = obtenerImagen(producto.Imagen);

  return (
    <>
      <main className="producto-detalle-container">
        <section className="producto-detalle-galeria">
          <div className="producto-detalle-imagen-wrap">
            {imagen ? (
              <img
                src={imagen}
                alt={producto.Nombre}
                className="producto-detalle-imagen"
              />
            ) : (
              <div className="producto-detalle-sin-imagen">
                Imagen no disponible
              </div>
            )}

            <span className="producto-detalle-etiqueta">
              VIROFENIX
            </span>
          </div>
        </section>

        <section className="producto-detalle-info">
          <p className="producto-detalle-kicker">
            COLECCIÓN VIROFENIX
          </p>

          <h1>{producto.Nombre}</h1>

          <div className="producto-detalle-precio-wrap">
            <p className="producto-detalle-precio">
              ${formatoPrecio(precio)}
            </p>
            <span>Precio por unidad</span>
          </div>

          <p className="producto-detalle-descripcion">
            {producto.Descripcion ||
              "Descubrí este producto de nuestra colección."}
          </p>

          <div className="producto-detalle-stock">
            <span className={stock > 0 ? "stock-disponible" : "stock-agotado"}>
              {stock > 0 ? "● Disponible" : "● Sin stock"}
            </span>
          </div>

          <div className="producto-detalle-separador" />

          <div className="producto-detalle-cantidad-wrap">
            <label>Cantidad</label>

            <div className="producto-detalle-cantidad">
              <button
                onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                disabled={cantidad <= 1 || procesando}
              >
                −
              </button>

              <span>{cantidad}</span>

              <button
                onClick={() => setCantidad(Math.min(stock, cantidad + 1))}
                disabled={cantidad >= stock || procesando}
              >
                +
              </button>
            </div>
          </div>

          <div className="producto-detalle-total">
            <span>Subtotal</span>
            <strong>${formatoPrecio(precio * cantidad)}</strong>
          </div>

          <div className="producto-detalle-acciones">
            <button
              className="producto-detalle-comprar"
              onClick={() => comprar(true)}
              disabled={stock < 1 || procesando}
            >
              {procesando ? "PROCESANDO..." : "COMPRAR AHORA"}
              {!procesando && <span>→</span>}
            </button>

            <button
              className="producto-detalle-agregar"
              onClick={() => comprar(false)}
              disabled={stock < 1 || procesando}
            >
              {procesando ? "AGUARDÁ..." : "AGREGAR AL CARRITO"}
            </button>
          </div>

          {mensaje && (
            <p className={`producto-detalle-mensaje ${error ? "error" : "exito"}`}>
              {mensaje}
            </p>
          )}

          <div className="producto-detalle-confianza">
            <div>
              <span>✓</span>
              <p>Compra sencilla</p>
            </div>
            <div>
              <span>✓</span>
              <p>Información de envío en el checkout</p>
            </div>
          </div>
        </section>
      </main>

      {recomendados.length > 0 && (
        <section className="productos-recomendados">
          <div className="recomendados-encabezado">
            <span>DESCUBRÍ MÁS</span>
            <h2>También te puede interesar</h2>
            <p>Más opciones seleccionadas para vos.</p>
          </div>

          <div className="recomendados-grid">
            {recomendados.map(p => {
              const imagenRecomendada = obtenerImagen(p.Imagen);

              return (
                <Link
                  to={`/producto/${p.ProductoID}`}
                  className="recomendado-card"
                  key={p.ProductoID}
                >
                  <div className="recomendado-imagen-wrap">
                    {imagenRecomendada ? (
                      <img
                        src={imagenRecomendada}
                        alt={p.Nombre || "Producto"}
                        loading="lazy"
                      />
                    ) : (
                      <div className="recomendado-sin-imagen">
                        Imagen no disponible
                      </div>
                    )}
                  </div>

                  <h3>{p.Nombre || "Producto"}</h3>

                  <p>
                    {p.Precio != null && p.Precio !== "" &&
                    Number.isFinite(Number(p.Precio))
                      ? `$${formatoPrecio(p.Precio)}`
                      : "Consultar precio"}
                  </p>

                  <span>Ver producto →</span>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </>
  );
}

export default ProductoDetalle;
