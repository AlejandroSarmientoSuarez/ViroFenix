
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  obtenerCarrito,
  actualizarCantidadCarrito,
  eliminarDelCarrito
} from "../services/cartService";
import { IMG_BASE_URL } from "../services/productService";
import { useCart } from "../context/CartContext";
import ConfirmModal from "../components/ConfirmModal";
import "../assets/css/carrito.css";

function Carrito() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [eliminar, setEliminar] = useState(null);
  const [procesando, setProcesando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const { refrescarCarrito } = useCart();
  const navigate = useNavigate();

  async function cargarCarrito() {
    try {
      const respuesta = await obtenerCarrito();
      let datos = respuesta.data || respuesta;

      if (datos.carrito) datos = datos.carrito;
      if (datos.data && !datos.items) datos = datos.data;

      const productos = Array.isArray(datos)
        ? datos
        : datos.items || datos.detalles || datos.productos || [];

      setItems(productos);

      let suma = 0;

      productos.forEach((item) => {
        const cantidad = Number(item.Cantidad ?? item.cantidad ?? 1);
        const precio = Number(item.Precio ?? item.precio ?? item.PrecioUnitario ?? 0);
        suma += cantidad * precio;
      });

      setTotal(Number(datos.total ?? datos.Total ?? suma));
      setMensaje("");
    } catch {
      setMensaje("No se pudo cargar el carrito.");
    }

    setCargando(false);
  }

  useEffect(() => {
    cargarCarrito();
  }, []);

  async function cambiarCantidad(id, cantidad) {
    if (!id || cantidad < 1 || procesando) return;

    setProcesando(true);

    try {
      await actualizarCantidadCarrito(id, cantidad);
      await cargarCarrito();
      await refrescarCarrito();
    } catch {
      setMensaje("No se pudo actualizar la cantidad.");
    }

    setProcesando(false);
  }

  async function confirmarEliminar() {
    if (!eliminar || procesando) return;

    setProcesando(true);

    try {
      await eliminarDelCarrito(eliminar);
      setEliminar(null);
      await cargarCarrito();
      await refrescarCarrito();
    } catch {
      setMensaje("No se pudo eliminar el producto.");
    }

    setProcesando(false);
  }

  if (cargando) {
    return <p className="carrito-loading">Cargando carrito...</p>;
  }

  if (items.length === 0) {
    return (
      <div className="carrito-container">
        <div className="carrito-vacio">
          <h1>Tu carrito está vacío</h1>
          {mensaje && <p role="alert">{mensaje}</p>}
          <Link to="/coleccion" className="carrito-seguir">
            Ver colección
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="carrito-container">
      <h1>Tu carrito</h1>

      {mensaje && <p className="carrito-error" role="alert">{mensaje}</p>}

      <div className="carrito-items">
        {items.map((item, indice) => {
          const id = item.ProductoID ?? item.productoId ?? item.id;
          const cantidad = Number(item.Cantidad ?? item.cantidad ?? 1);
          const precio = Number(item.Precio ?? item.precio ?? item.PrecioUnitario ?? 0);
          const stock = Number(item.StockActual ?? item.stock ?? 0);
          const nombre = item.Nombre ?? item.nombre ?? "Producto";
          const archivo = item.Imagen ?? item.imagen ?? "";

          let imagen = archivo;

          if (archivo && !archivo.startsWith("http")) {
            imagen = IMG_BASE_URL + archivo;
          }

          return (
            <div key={id ?? item.CarritoDetalleID ?? indice} className="carrito-item">
              {imagen && (
                <img src={imagen} alt={nombre} className="carrito-item-imagen" />
              )}

              <div className="carrito-item-info">
                <h3>{nombre}</h3>
                <p className="carrito-item-precio">${precio.toFixed(2)}</p>
              </div>

              <div className="carrito-item-cantidad">
                <button
                  type="button"
                  disabled={procesando || cantidad <= 1 || !id}
                  onClick={() => cambiarCantidad(id, cantidad - 1)}
                >
                  −
                </button>

                <span>{cantidad}</span>

                <button
                  type="button"
                  disabled={procesando || (stock > 0 && cantidad >= stock) || !id}
                  onClick={() => cambiarCantidad(id, cantidad + 1)}
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
                disabled={procesando || !id}
                onClick={() => setEliminar(id)}
              >
                Eliminar
              </button>
            </div>
          );
        })}

        <ConfirmModal
          open={eliminar !== null}
          title="Eliminar producto"
          message="¿Seguro que querés quitar este producto del carrito?"
          confirmLabel="Eliminar"
          danger
          onConfirm={confirmarEliminar}
          onCancel={() => setEliminar(null)}
        />
      </div>

      <div className="carrito-resumen">
        <p>
          Total: <span>${total.toFixed(2)}</span>
        </p>

        <button
          type="button"
          className="carrito-finalizar"
          disabled={procesando}
          onClick={() => navigate("/checkout")}
        >
          Finalizar compra
        </button>
      </div>
    </div>
  );
}

export default Carrito;
