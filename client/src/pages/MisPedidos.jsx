import { useState, useEffect } from "react";
import { obtenerPedidos } from "../services/cartService";
import { IMG_BASE_URL } from "../services/productService";
import { SkeletonGrid } from "../components/Skeleton";
import "../assets/css/pedidos.css";

const ESTADO_LABEL = {
  Pendiente: "Pendiente", Pagado: "Pagado", Enviado: "Enviado",
  Entregado: "Entregado", Cancelado: "Cancelado",
};

function MisPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargar() {
      try {
        const respuesta = await obtenerPedidos();
        setPedidos(respuesta.data);
      } catch (err) {
        console.error(err);
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, []);

  if (cargando) return <SkeletonGrid count={3} />;

  return (
    <div className="pedidos-container">
      <h1>Mis pedidos</h1>

      {pedidos.length === 0 ? (
        <p className="pedidos-vacio">Todavía no hiciste ningún pedido.</p>
      ) : (
        <div className="pedidos-lista">
          {pedidos.map((pedido) => (
            <div key={pedido.PedidoID} className="pedido-card">
              <div className="pedido-header">
                <div>
                  <p className="pedido-numero">Pedido #{pedido.PedidoID}</p>
                  <p className="pedido-fecha">
                    {new Date(pedido.FechaCreacion).toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" })}
                  </p>
                </div>
                <span className={`pedido-estado pedido-estado-${pedido.Estado.toLowerCase()}`}>
                  {ESTADO_LABEL[pedido.Estado] || pedido.Estado}
                </span>
              </div>

              <div className="pedido-items">
                {pedido.items.map((item) => (
                  <div key={item.ProductoID} className="pedido-item">
                    <img src={`${IMG_BASE_URL}${item.Imagen}`} alt={item.Nombre} />
                    <div>
                      <p>{item.Nombre}</p>
                      <span>{item.Cantidad} × ${item.PrecioUnitario}</span>
                    </div>
                  </div>
                ))}
              </div>

              <p className="pedido-total">Total: ${Number(pedido.Total).toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MisPedidos;