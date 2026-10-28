import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { listarUsuarios, actualizarUsuario, eliminarUsuario } from "../services/adminService";
import { useAuth } from "../context/AuthContext";
import ConfirmModal from "../components/ConfirmModal";
import "../assets/css/admin.css";

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [editando, setEditando] = useState(null);
  const [eliminar, setEliminar] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [guardando, setGuardando] = useState(false);
  const { usuario } = useAuth();

  async function cargarUsuarios() {
    try {
      const respuesta = await listarUsuarios();
      setUsuarios(Array.isArray(respuesta) ? respuesta : respuesta.data || []);
    } catch {
      setMensaje("Error al cargar las cuentas.");
    }
  }

  useEffect(() => {
    cargarUsuarios();
  }, []);

  async function guardar(e) {
    e.preventDefault();
    setGuardando(true);

    try {
      await actualizarUsuario(editando.id, {
        nombre: editando.nombre,
        apellido: editando.apellido,
        email: editando.email,
        rol: editando.rol,
        estado: editando.estado
      });

      setEditando(null);
      setMensaje("Cuenta actualizada.");
      await cargarUsuarios();
    } catch (error) {
      setMensaje(error.response?.data?.message || "Error al actualizar.");
    }

    setGuardando(false);
  }

  async function confirmarEliminar() {
    try {
      await eliminarUsuario(eliminar.UsuarioID);
      setMensaje("Cuenta eliminada.");
      setEliminar(null);
      await cargarUsuarios();
    } catch (error) {
      setMensaje(error.response?.data?.message || "Error al eliminar.");
      setEliminar(null);
    }
  }

  if (!usuarios.length && !mensaje) {
    return <p className="admin-loading">Cargando cuentas...</p>;
  }

  return (
    <div className="admin-container">
      <nav className="admin-navegacion">
        <Link to="/admin/usuarios" className="admin-nav-activo">Cuentas</Link>
        <Link to="/admin/pedidos">Pedidos</Link>
        <Link to="/admin/stock">Stock</Link>
      </nav>

      <header className="admin-header">
        <div>
          <h1>Gestión de cuentas</h1>
          <p>{usuarios.length} cuentas</p>
        </div>
      </header>

      {mensaje && <p role="status" className="admin-mensaje">{mensaje}</p>}

      <div className="admin-tabla-wrap">
        <table className="admin-tabla">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => {
              const esPropio = u.UsuarioID === (usuario?.id || usuario?.UsuarioID);

              return (
                <tr key={u.UsuarioID}>
                  <td>{u.Nombre} {u.Apellido}{esPropio && " (vos)"}</td>
                  <td>{u.Email}</td>
                  <td>
                    <span className={`admin-badge admin-badge--${u.Rol.toLowerCase()}`}>
                      {u.Rol}
                    </span>
                  </td>
                  <td>
                    <span className={`admin-badge admin-badge--${u.Estado.toLowerCase()}`}>
                      {u.Estado}
                    </span>
                  </td>
                  <td>
                    <div className="admin-acciones">
                      <button
                        className="admin-btn"
                        onClick={() => setEditando({
                          id: u.UsuarioID,
                          nombre: u.Nombre,
                          apellido: u.Apellido,
                          email: u.Email,
                          rol: u.Rol,
                          estado: u.Estado
                        })}
                      >
                        Editar
                      </button>
                      <button
                        className="admin-btn admin-btn--peligro"
                        disabled={esPropio}
                        onClick={() => setEliminar(u)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {editando && (
        <div className="admin-modal-overlay" onClick={() => setEditando(null)}>
          <form className="admin-modal" onClick={(e) => e.stopPropagation()} onSubmit={guardar}>
            <h2>Editar cuenta</h2>

            <div className="admin-campo">
              <label>Nombre</label>
              <input value={editando.nombre} onChange={(e) => setEditando({ ...editando, nombre: e.target.value })} required />
            </div>

            <div className="admin-campo">
              <label>Apellido</label>
              <input value={editando.apellido} onChange={(e) => setEditando({ ...editando, apellido: e.target.value })} required />
            </div>

            <div className="admin-campo">
              <label>Email</label>
              <input type="email" value={editando.email} onChange={(e) => setEditando({ ...editando, email: e.target.value })} required />
            </div>

            <div className="admin-campo">
              <label>Rol</label>
              <select
                value={editando.rol}
                disabled={editando.id === (usuario?.id || usuario?.UsuarioID)}
                onChange={(e) => setEditando({ ...editando, rol: e.target.value })}
              >
                <option value="Cliente">Cliente</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <div className="admin-campo">
              <label>Estado</label>
              <select
                value={editando.estado}
                disabled={editando.id === (usuario?.id || usuario?.UsuarioID)}
                onChange={(e) => setEditando({ ...editando, estado: e.target.value })}
              >
                <option value="Activo">Activo</option>
                <option value="Bloqueado">Bloqueado</option>
                <option value="Pendiente">Pendiente</option>
              </select>
            </div>

            <div className="admin-modal-acciones">
              <button type="button" className="admin-btn" onClick={() => setEditando(null)}>
                Cancelar
              </button>
              <button className="admin-btn admin-btn--primario" disabled={guardando}>
                {guardando ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      )}

      <ConfirmModal
        open={!!eliminar}
        title="Eliminar cuenta"
        message={eliminar ? `¿Eliminar la cuenta de ${eliminar.Nombre} ${eliminar.Apellido}?` : ""}
        confirmLabel="Eliminar"
        danger
        onConfirm={confirmarEliminar}
        onCancel={() => setEliminar(null)}
      />
    </div>
  );
}
