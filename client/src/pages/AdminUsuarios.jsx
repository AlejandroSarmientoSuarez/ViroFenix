
import { useState, useEffect } from "react";
import { listarUsuarios, actualizarUsuario, eliminarUsuario } from "../services/adminService";
import { useAuth } from "../context/AuthContext";
import ConfirmModal from "../components/ConfirmModal";
import "../assets/css/admin.css";

const ESTADOS = ["Activo", "Bloqueado", "Pendiente"];

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [editando, setEditando] = useState(null);
  const [eliminar, setEliminar] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [guardando, setGuardando] = useState(false);
  const { usuario } = useAuth();
  const propio = (id) => id === (usuario?.id || usuario?.UsuarioID);

  async function cargar() {
    try {
      const r = await listarUsuarios();
      setUsuarios(Array.isArray(r) ? r : r.data || []);
    } catch {
      setMensaje("Error al cargar las cuentas.");
    }
  }

  useEffect(() => { cargar(); }, []);

  async function guardar(e) {
    e.preventDefault();
    setGuardando(true);
    try {
      const { id, esPropio, ...datos } = editando;
      await actualizarUsuario(id, datos);
      setEditando(null);
      setMensaje("Cuenta actualizada.");
      await cargar();
    } catch (e) {
      setMensaje(e.response?.data?.message || "Error al actualizar.");
    } finally {
      setGuardando(false);
    }
  }

  async function confirmarEliminar() {
    try {
      await eliminarUsuario(eliminar.UsuarioID);
      setMensaje("Cuenta eliminada.");
      setEliminar(null);
      await cargar();
    } catch (e) {
      setMensaje(e.response?.data?.message || "Error al eliminar.");
      setEliminar(null);
    }
  }

  if (!usuarios.length && !mensaje) {
    return <p className="admin-loading">Cargando cuentas...</p>;
  }

  return (
    <div className="admin-container">
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
              <th>Nombre</th><th>Email</th><th>Rol</th><th>Estado</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.UsuarioID}>
                <td>{u.Nombre} {u.Apellido}{propio(u.UsuarioID) && " (vos)"}</td>
                <td>{u.Email}</td>
                <td><span className={`admin-badge admin-badge--${u.Rol.toLowerCase()}`}>{u.Rol}</span></td>
                <td><span className={`admin-badge admin-badge--${u.Estado.toLowerCase()}`}>{u.Estado}</span></td>
                <td>
                  <div className="admin-acciones">
                    <button className="admin-btn" onClick={() => setEditando({
                      id: u.UsuarioID, nombre: u.Nombre, apellido: u.Apellido,
                      email: u.Email, rol: u.Rol, estado: u.Estado,
                      esPropio: propio(u.UsuarioID)
                    })}>Editar</button>
                    <button className="admin-btn admin-btn--peligro"
                      disabled={propio(u.UsuarioID)}
                      onClick={() => setEliminar(u)}>Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editando && (
        <div className="admin-modal-overlay" onClick={() => setEditando(null)}>
          <form className="admin-modal" onClick={e => e.stopPropagation()} onSubmit={guardar}>
            <h2>Editar cuenta</h2>

            {["nombre", "apellido", "email"].map(campo => (
              <div className="admin-campo" key={campo}>
                <label htmlFor={`adm-${campo}`}>{campo[0].toUpperCase() + campo.slice(1)}</label>
                <input id={`adm-${campo}`} type={campo === "email" ? "email" : "text"}
                  value={editando[campo]}
                  onChange={e => setEditando({ ...editando, [campo]: e.target.value })}
                  required />
              </div>
            ))}

            {["rol", "estado"].map(campo => (
              <div className="admin-campo" key={campo}>
                <label>{campo === "rol" ? "Rol" : "Estado"}</label>
                <select value={editando[campo]} disabled={editando.esPropio}
                  onChange={e => setEditando({ ...editando, [campo]: e.target.value })}>
                  {(campo === "rol" ? ["Cliente", "Admin"] : ESTADOS).map(opcion =>
                    <option key={opcion} value={opcion}>{opcion}</option>
                  )}
                </select>
              </div>
            ))}

            <div className="admin-modal-acciones">
              <button type="button" className="admin-btn" onClick={() => setEditando(null)}>Cancelar</button>
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
