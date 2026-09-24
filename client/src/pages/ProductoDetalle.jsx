import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { obtenerProductoPorId, IMG_BASE_URL } from "../services/productService";
import { agregarAlCarrito } from "../services/cartService";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "../assets/css/producto-detalle.css";

function ProductoDetalle() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const { usuario } = useAuth();
  const { refrescarCarrito } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    async function cargarProducto() {
      try {
        const respuesta = await obtenerProductoPorId(id);
        setProducto(respuesta.data);
      } catch (err) {
        console.error(err);
      } finally {
        setCargando(false);
      }
    }
    cargarProducto();
  }, [id]);

  async function handleAgregar() {
    if (!usuario) {
      navigate("/login");
      return;
    }
    try {
      await agregarAlCarrito(producto.ProductoID, cantidad);
      await refrescarCarrito();
      setMensaje("Agregado al carrito");
      setTimeout(() => setMensaje(""), 2000);
    } catch (err) {
      console.error(err);
    }
  }

  if (cargando) return <p className="producto-detalle-loading">Cargando...</p>;
  if (!producto) return <p className="producto-detalle-loading">Producto no encontrado.</p>;

  return (
    <div className="producto-detalle-container">
      <div className="producto-detalle-imagen-wrap">
        <img
          src={`${IMG_BASE_URL}${producto.Imagen}`}
          alt={producto.Nombre}
          className="producto-detalle-imagen"
        />
      </div>

      <div className="producto-detalle-info">
        <h1>{producto.Nombre}</h1>
        <p className="producto-detalle-precio">${producto.Precio}</p>
        <p className="producto-detalle-descripcion">{producto.Descripcion}</p>

        {producto.Estado === "PocasUnidades" && (
          <span className="badge-pocas-unidades">Pocas unidades</span>
        )}
        {producto.Estado === "Agotado" && (
          <span className="producto-detalle-agotado">Sin stock</span>
        )}

        {producto.Estado !== "Agotado" && (
          <>
            <div className="producto-detalle-cantidad">
              <button onClick={() => setCantidad(Math.max(1, cantidad - 1))}>−</button>
              <span>{cantidad}</span>
              <button
                onClick={() => setCantidad(Math.min(producto.StockActual, cantidad + 1))}
                disabled={cantidad >= producto.StockActual}
              >
                +
              </button>
            </div>

            <button className="producto-detalle-agregar" onClick={handleAgregar}>
              Agregar al carrito
            </button>
          </>
        )}

        {mensaje && <p className="success-message">{mensaje}</p>}
      </div>
    </div>
  );
}

export default ProductoDetalle;