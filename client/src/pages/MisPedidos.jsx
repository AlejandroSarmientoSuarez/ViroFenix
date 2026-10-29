import { useState, useEffect } from "react";
import { obtenerPedidos } from "../services/cartService";
import { IMG_BASE_URL } from "../services/productService";
import "../assets/css/pedidos.css";

function fecha(valor) {
  return valor
    ? new Date(valor).toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "long",
        year: "numeric"
      })
    : "Pendiente";
}

export default function MisPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    obtenerPedidos()
      .then((respuesta) => setPedidos(respuesta.data || []))
      .catch(() => {
        setError("No se pudieron cargar tus pedidos. Intentá nuevamente.");
      })
      .finally(() => setCargando(false));
  }, []);

  return (
    <main className="pedidos-container">
      <h1>Mis pedidos</h1>

      {cargando ? (
        <p>Cargando pedidos...</p>
      ) : error ? (
        <p role="alert">{error}</p>
      ) : pedidos.length === 0 ? (
        <p className="pedidos-vacio">
          Todavía no hiciste ningún pedido.
        </p>
      ) : (
        <div className="pedidos-lista">
          {pedidos.map((pedido) => (
            <article className="pedido-card" key={pedido.PedidoID}>
              <div className="pedido-header">
                <div>
                  <p className="pedido-numero">
                    Pedido #{pedido.PedidoID}
                  </p>

                  <p className="pedido-fecha">
                    {fecha(pedido.FechaCreacion)}
                  </p>

                  {pedido.DireccionEnvio && (
                    <p className="pedido-fecha">
                      Envío a: {pedido.DireccionEnvio}
                    </p>
                  )}
                </div>

                <span
                  className={`pedido-estado pedido-estado-${pedido.Estado.toLowerCase()}`}
                >
                  {pedido.Estado}
                </span>
              </div>

              <div className="pedido-seguimiento">
                <p><b>Pago:</b> {fecha(pedido.FechaPago)}</p>
                <p><b>Envío:</b> {fecha(pedido.FechaEnvio)}</p>
                <p><b>Entrega:</b> {fecha(pedido.FechaEntrega)}</p>
              </div>

              <div className="pedido-items">
                {(pedido.items || []).map((item, i) => (
                  <div
                    key={`${item.ProductoID}-${i}`}
                    className="pedido-item"
                  >
                    {item.Imagen && (
                      <img
                        src={`${IMG_BASE_URL}${item.Imagen}`}
                        alt={item.Nombre}
                      />
                    )}

                    <div>
                      <p>{item.Nombre}</p>
                      <span>
                        {item.Cantidad} × $
                        {Number(item.PrecioUnitario).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <p className="pedido-total">
                Total: ${Number(pedido.Total).toFixed(2)}
              </p>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}