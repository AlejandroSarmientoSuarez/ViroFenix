import { useEffect, useState } from "react";
import {
  listarStockAdmin,
  reponerStock
} from "../services/adminService";
import "../assets/css/admin-stock.css";
import { Link } from "react-router-dom";

export default function AdminStock() {
  const [productos, setProductos] = useState([]);
  const [cantidades, setCantidades] = useState({});
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(true);

  async function cargar() {
    try {
      const respuesta = await listarStockAdmin();
      setProductos(respuesta.data || []);
    } catch (error) {
      setMensaje(
        error.response?.data?.mensaje ||
        "No se pudo cargar el stock."
      );
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  async function guardar(producto) {
    const cantidad = Number(cantidades[producto.ProductoID]);

    if (!Number.isInteger(cantidad) || cantidad < 1) {
      setMensaje("Ingresá una cantidad entera mayor que cero.");
      return;
    }

    try {
      const respuesta = await reponerStock(producto.ProductoID, cantidad);

      setMensaje(respuesta.mensaje);

      setCantidades({
        ...cantidades,
        [producto.ProductoID]: ""
      });

      await cargar();
    } catch (error) {
      setMensaje(
        error.response?.data?.mensaje ||
        "No se pudo reponer el stock."
      );
    }
  }

  const alertas = productos.filter((p) => p.StockActual <= 5).length;

  return (
    <main className="admin-stock">
      <nav className="admin-navegacion">
        <Link to="/admin/usuarios">Cuentas</Link>
        <Link to="/admin/pedidos">Pedidos</Link>
        <Link to="/admin/stock" className="admin-nav-activo">Stock</Link>
      </nav>

      <header>
        <div>
          <h1>Control de stock</h1>
          <p>
            {alertas} productos agotados o con 5 unidades o menos.
          </p>
        </div>

        <button onClick={cargar}>Actualizar</button>
      </header>

      {mensaje && (
        <p className="as-mensaje" role="status">{mensaje}</p>
      )}

      {cargando ? (
        <p>Cargando inventario...</p>
      ) : (
        <div className="as-tabla-wrap">
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Estado</th>
                <th>Stock actual</th>
                <th>Stock máximo</th>
                <th>Reponer unidades</th>
                <th>Acción</th>
              </tr>
            </thead>

            <tbody>
              {productos.map((p) => (
                <tr key={p.ProductoID}>
                  <td>{p.Nombre}</td>

                  <td>
                    <span className={`as-estado as-${p.Estado.toLowerCase()}`}>
                      {p.Estado}
                    </span>
                  </td>

                  <td>{p.StockActual}</td>
                  <td>{p.StockMaximo}</td>

                  <td>
                    <input
                      type="number"
                      min="1"
                      max={Math.max(0, p.StockMaximo - p.StockActual)}
                      value={cantidades[p.ProductoID] || ""}
                      placeholder="Cantidad"
                      onChange={(e) =>
                        setCantidades({
                          ...cantidades,
                          [p.ProductoID]: e.target.value
                        })
                      }
                    />
                  </td>

                  <td>
                    <button
                      disabled={
                        p.Estado === "Inactivo" ||
                        p.StockActual >= p.StockMaximo
                      }
                      onClick={() => guardar(p)}
                    >
                      Reponer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="as-nota">
        La reposición no puede superar el stock máximo del producto.
        La base de datos actualiza automáticamente el estado y registra
        el movimiento.
      </p>
    </main>
  );
}