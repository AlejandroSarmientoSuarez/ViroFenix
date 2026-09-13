import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  obtenerCarrito,
  actualizarCantidadCarrito,
  eliminarDelCarrito,
  crearPedido,
} from "../services/cartService";
import { IMG_BASE_URL } from "../services/productService";
import { useCart } from "../context/CartContext";
import "../assets/css/carrito.css";

function Carrito() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState("");
  const [pedidoConfirmado, setPedidoConfirmado] = useState(null);
  const { refrescarCarrito } = useCart();
  const navigate = useNavigate();

  async function cargarCarrito() {
    try {
      const respuesta = await obtenerCarrito();
      setItems(respuesta.data.items);
      setTotal(respuesta.data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarCarrito();
  }, []);

  async function cambiarCantidad(productoId, nuevaCantidad) {
    try {
      await actualizarCantidadCarrito(productoId, nuevaCantidad);
      await cargarCarrito();
      await refrescarCarrito();
    } catch (err) {
      console.error(err);
    }
  }

  async function eliminarItem(productoId) {
    try {
      await eliminarDelCarrito(productoId);
      await cargarCarrito();
      await refrescarCarrito();
    } catch (err) {
      console.error(err);
    }
  }

  async function finalizarCompra() {
    setError("");
    setProcesando(true);
    try {
      const respuesta = await crearPedido();
      setPedidoConfirmado(respuesta.data);
      await refrescarCarrito();
      setItems([]);
      setTotal(0);
    } catch (err) {
      setError(err.response?.data?.message || "Error al procesar el pedido");
    } finally {
      setProcesando(false);
    }
  }

  if (cargando) return <p className="carrito-loading">Cargando carrito...</p>;

  if (pedidoConfirmado) {
    return (
      <div className="carrito-confirmacion">
        <h1>Pedido confirmado</h1>
        <p>Tu pedido #{pedidoConfirmado.pedidoId} fue registrado correctamente.</p>
        <p className="carrito-confirmacion-total">Total: ${pedidoConfirmado.total}</p>
        <Link to="/coleccion" className="carrito-seguir">Seguir comprando</Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="carrito-vacio">
        <h1>Tu carrito está vacío</h1>
        <Link to="/coleccion" className="carrito-seguir">Ver colección</Link>
      </div>
    );
  }

  return (
    <div className="carrito-container">
      <h1>Tu carrito</h1>

      {error && <p className="error-message">{error}</p>}

      <div className="carrito-items">
        {items.map((item) => (
          <div key={item.CarritoDetalleID} className="carrito-item">
            <img
              src={`${IMG_BASE_URL}${item.Imagen}`}
              alt={item.Nombre}
              className="carrito-item-imagen"
            />
            <div className="carrito-item-info">
              <h3>{item.Nombre}</h3>
              <p className="carrito-item-precio">${item.Precio}</p>
            </div>
            <div className="carrito-item-cantidad">
              <button onClick={() => cambiarCantidad(item.ProductoID, item.Cantidad - 1)}>−</button>
              <span>{item.Cantidad}</span>
              <button
                onClick={() => cambiarCantidad(item.ProductoID, item.Cantidad + 1)}
                disabled={item.Cantidad >= item.StockActual}
              >
                +
              </button>
            </div>
            <p className="carrito-item-subtotal">${(item.Cantidad * item.Precio).toFixed(2)}</p>
            <button className="carrito-item-eliminar" onClick={() => eliminarItem(item.ProductoID)}>
              Eliminar
            </button>
          </div>
        ))}
      </div>

      <div className="carrito-resumen">
        <p>Total: <span>${total.toFixed(2)}</span></p>
        <button onClick={finalizarCompra} disabled={procesando} className="carrito-finalizar">
          {procesando ? "Procesando..." : "Finalizar compra"}
        </button>
      </div>
    </div>
  );
}

export default Carrito;