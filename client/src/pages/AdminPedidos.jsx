
import { useEffect, useState } from "react";
import {
  listarPedidosAdmin,
  actualizarEstadoPedido
} from "../services/adminService";
import "../assets/css/admin-pedidos.css";
import { Link } from "react-router-dom";

const siguientesEstados = {
  Pendiente: ["Pagado", "Cancelado"],
  Pagado: ["Enviado"],
  Enviado: ["Entregado"],
  Entregado: [],
  Cancelado: []
};

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState("");

  async function cargar() {
    try {
      const respuesta = await listarPedidosAdmin();

      if (respuesta.data) {
        setPedidos(respuesta.data);
      } else {
        setPedidos([]);
      }

    } catch (error) {
      if (error.response && error.response.data && error.response.data.mensaje) {
        setMensaje(error.response.data.mensaje);
      } else {
        setMensaje("No se pudieron cargar los pedidos.");
      }

    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  async function cambiarEstado(id, estado) {
    try {
      await actualizarEstadoPedido(id, estado);

      setMensaje("Pedido #" + id + ": estado actualizado.");

      await cargar();

    } catch (error) {
      if (error.response && error.response.data && error.response.data.mensaje) {
        setMensaje(error.response.data.mensaje);
      } else {
        setMensaje("No se pudo cambiar el estado.");
      }
    }
  }

  return (
    <main className="admin-pedidos">

      <nav className="admin-navegacion">
        <Link to="/admin/usuarios">Cuentas</Link>
        <Link to="/admin/pedidos" className="admin-nav-activo">
          Pedidos
        </Link>
        <Link to="/admin/stock">Stock</Link>
      </nav>

      <header>
        <div>
          <h1>Gestión de pedidos</h1>
          <p>Administrá el estado y seguimiento de las compras.</p>
        </div>

        <button onClick={cargar}>Actualizar</button>
      </header>

      {mensaje && (
        <p className="ap-mensaje" role="status">
          {mensaje}
        </p>
      )}

      {cargando ? (
        <p>Cargando pedidos...</p>
      ) : pedidos.length === 0 ? (
        <p>No hay pedidos registrados.</p>
      ) : (
        <div className="ap-lista">

          {pedidos.map((pedido) => (
            <article className="ap-card" key={pedido.PedidoID}>

              <div className="ap-cabecera">
                <div>
                  <strong>Pedido #{pedido.PedidoID}</strong>

                  <p>
                    {pedido.Cliente} ·{" "}
                    {new Date(pedido.FechaCreacion).toLocaleDateString("es-AR")}
                  </p>
                </div>

                <span className={"ap-estado ap-" + pedido.Estado.toLowerCase()}>
                  {pedido.Estado}
                </span>
              </div>

              <p>
                <b>Contacto:</b>{" "}
                {pedido.EmailContacto
                  ? pedido.EmailContacto
                  : "Sin email"}
              </p>

              <p>
                <b>Dirección:</b>{" "}
                {pedido.DireccionEnvio
                  ? pedido.DireccionEnvio
                  : "No indicada"}
              </p>

              <div className="ap-items">

                {pedido.items && pedido.items.map((item, i) => (
                  <p key={item.ProductoID + "-" + i}>
                    {item.Nombre} × {item.Cantidad} — $
                    {(Number(item.PrecioUnitario) * item.Cantidad).toFixed(2)}
                  </p>
                ))}

              </div>

              <div className="ap-pie">
                <strong>
                  Total: ${Number(pedido.Total).toFixed(2)}
                </strong>

                {siguientesEstados[pedido.Estado] &&
                  siguientesEstados[pedido.Estado].length > 0 && (

                  <select
                    defaultValue=""
                    onChange={(e) => {
                      if (e.target.value !== "") {
                        cambiarEstado(pedido.PedidoID, e.target.value);
                        e.target.value = "";
                      }
                    }}
                  >
                    <option value="">Cambiar estado...</option>

                    {siguientesEstados[pedido.Estado].map((estado) => (
                      <option key={estado} value={estado}>
                        {estado}
                      </option>
                    ))}

                  </select>
                )}
              </div>

              {(pedido.FechaPago || pedido.FechaEnvio || pedido.FechaEntrega) && (
                <small className="ap-fechas">

                  {pedido.FechaPago &&
                    "Pagado: " +
                    new Date(pedido.FechaPago).toLocaleDateString("es-AR")}

                  {pedido.FechaEnvio &&
                    " · Enviado: " +
                    new Date(pedido.FechaEnvio).toLocaleDateString("es-AR")}

                  {pedido.FechaEntrega &&
                    " · Entregado: " +
                    new Date(pedido.FechaEntrega).toLocaleDateString("es-AR")}

                </small>
              )}

            </article>
          ))}

        </div>
      )}

    </main>
  );
}

