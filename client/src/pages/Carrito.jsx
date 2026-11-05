import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  obtenerCarrito,
  actualizarCantidadCarrito,
  eliminarDelCarrito,
} from "../services/cartService";
import { IMG_BASE_URL } from "../services/productService";
import { useCart } from "../context/CartContext";
import ConfirmModal from "../components/ConfirmModal";
import "../assets/css/carrito.css";

function normalizarRespuesta(respuesta) {
  let datos = respuesta?.data ?? respuesta;

  if (datos?.carrito) datos = datos.carrito;
  else if (datos?.data && !Array.isArray(datos.items)) datos = datos.data;

  const items = Array.isArray(datos)
    ? datos
    : datos?.items ?? datos?.detalles ?? datos?.productos ?? [];

  const lista = Array.isArray(items) ? items : [];

  const total = Number(
    datos?.total ??
    datos?.Total ??
    lista.reduce(
      (suma, item) =>
        suma +
        Number(item.Cantidad ?? item.cantidad ?? 0) *
          Number(item.Precio ?? item.precio ?? item.PrecioUnitario ?? 0),
      0
    )
  );

  return { items: lista, total };
}

function Carrito() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const [procesando, setProcesando] = useState(false);
  const [mensajeError, setMensajeError] = useState("");

  const { refrescarCarrito } = useCart();
  const navigate = useNavigate();

  const cargarCarrito = useCallback(async () => {
    try {
      setMensajeError("");

      const respuesta = await obtenerCarrito();
      const carrito = normalizarRespuesta(respuesta);

      setItems(carrito.items);
      setTotal(carrito.total);
    } catch (error) {
      console.error("Error al cargar el carrito:", error);
      setMensajeError(
        error.response?.data?.mensaje ||
          error.response?.data?.message ||
          "No se pudo cargar el carrito. Intentá nuevamente."
      );
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarCarrito();
  }, [cargarCarrito]);

  async function cambiarCantidad(productoId, cantidad) {
    if (!productoId || cantidad < 1 || procesando) return;

    try {
      setProcesando(true);
      await actualizarCantidadCarrito(productoId, cantidad);
      await cargarCarrito();
      await refrescarCarrito();
    } catch (error) {
      console.error("Error al actualizar la cantidad:", error);
      setMensajeError("No se pudo actualizar la cantidad.");
    } finally {
      setProcesando(false);
    }
  }

  async function confirmarEliminar() {
    if (!productoAEliminar || procesando) return;

    try {
      setProcesando(true);
      await eliminarDelCarrito(productoAEliminar);
      setProductoAEliminar(null);
      await cargarCarrito();
      await refrescarCarrito();
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      setMensajeError("No se pudo eliminar el producto.");
    } finally {
      setProcesando(false);
    }
  }

  if (cargando) {
    return <p className="carrito-loading">Cargando carrito...</p>;
  }

  if (items.length === 0) {
    return (
      <div className="carrito-container">
        <div className="carrito-vacio">
          <h1>Tu carrito está vacío</h1>
          {mensajeError && <p role="alert">{mensajeError}</p>}
          <Link to="/coleccion" className="carrito-seguir">
            Ver colección
          </Link>
          <button type="button" onClick={cargarCarrito}>
            Volver a intentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="carrito-container">
      <h1>Tu carrito</h1>

      {mensajeError && (
        <p className="carrito-error" role="alert">{mensajeError}</p>
      )}

      <div className="carrito-items">
        {items.map((item, indice) => {
          const productoId = item.ProductoID ?? item.productoId ?? item.id;
          const cantidad = Number(item.Cantidad ?? item.cantidad ?? 1);
          const precio = Number(
            item.Precio ?? item.precio ?? item.PrecioUnitario ?? 0
          );
          const stock = Number(item.StockActual ?? item.stock ?? 0);
          const nombre = item.Nombre ?? item.nombre ?? "Producto";
          const archivoImagen = item.Imagen ?? item.imagen ?? "";

          const imagen = archivoImagen
            ? /^https?:\/\//i.test(archivoImagen)
              ? archivoImagen
              : `${IMG_BASE_URL}${archivoImagen}`
            : "";

          return (
            <div
              key={productoId ?? item.CarritoDetalleID ?? indice}
              className="carrito-item"
            >
              {imagen && (
                <img
                  src={imagen}
                  alt={nombre}
                  className="carrito-item-imagen"
                />
              )}

              <div className="carrito-item-info">
                <h3>{nombre}</h3>
                <p className="carrito-item-precio">
                  ${precio.toFixed(2)}
                </p>
              </div>

              <div className="carrito-item-cantidad">
                <button
                  type="button"
                  onClick={() => cambiarCantidad(productoId, cantidad - 1)}
                  disabled={procesando || cantidad <= 1 || !productoId}
                >
                  −
                </button>

                <span>{cantidad}</span>

                <button
                  type="button"
                  onClick={() => cambiarCantidad(productoId, cantidad + 1)}
                  disabled={
                    procesando ||
                    (stock > 0 && cantidad >= stock) ||
                    !productoId
                  }
                >
                  +
                </button>
              </div>

              <p className="carrito-item-subtotal">
                ${(cantidad * precio).toFixed(2)}
              </p>

              <button
                type="button"
                className="carrito-item-eliminar"
                onClick={() => setProductoAEliminar(productoId)}
                disabled={procesando || !productoId}
              >
                Eliminar
              </button>
            </div>
          );
        })}

        <ConfirmModal
          open={productoAEliminar !== null}
          title="Eliminar producto"
          message="¿Seguro que querés quitar este producto del carrito?"
          confirmLabel="Eliminar"
          danger
          onConfirm={confirmarEliminar}
          onCancel={() => setProductoAEliminar(null)}
        />
      </div>

      <div className="carrito-resumen">
        <p>
          Total: <span>${total.toFixed(2)}</span>
        </p>

        <button
          type="button"
          onClick={() => navigate("/checkout")}
          className="carrito-finalizar"
          disabled={procesando}
        >
          Finalizar compra
        </button>
      </div>
    </div>
  );
}

export default Carrito;