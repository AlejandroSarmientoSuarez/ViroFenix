import { useState, useEffect } from "react";
import { listarUsuarios, actualizarUsuario, eliminarUsuario } from "../services/adminService";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import ConfirmModal from "../components/ConfirmModal";
import "../assets/css/admin.css";

const ESTADOS = ["Activo", "Bloqueado", "Pendiente"];
const FILTROS_ESTADO = ["Activo", "Bloqueado", "Pendiente", "Eliminado"];

function formatearFecha(valor) {
  if (!valor) return "Nunca ingresó";
  return new Date(valor).toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busquedaInput, setBusquedaInput] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [editando, setEditando] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [aEliminar, setAEliminar] = useState(null);

  const { usuario } = useAuth();
  const { showToast } = useToast();

  // Debounce de la búsqueda
  useEffect(() => {
    const timer = setTimeout(() => setBusqueda(busquedaInput), 400);
    return () => clearTimeout(timer);
  }, [busquedaInput]);

  async function cargar() {
    try {
      const respuesta = await listarUsuarios({ buscar: busqueda, estado: filtroEstado });
      setUsuarios(respuesta.data);
    } catch (err) {
      console.error(err);
      showToast("No se pudieron cargar las cuentas", "error");
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
  }, [busqueda, filtroEstado]);

  function abrirGestion(u) {
    setEditando({
      id: u.UsuarioID,
      nombre: u.Nombre,
      apellido: u.Apellido,
      email: u.Email,
      rol: u.Rol,
      estado: u.Estado,
      esPropio: u.UsuarioID === usuario.id,
    });
  }

  function cambiarCampo(campo, valor) {
    setEditando((prev) => ({ ...prev, [campo]: valor }));
  }

  async function guardar(e) {
    e.preventDefault();
    setGuardando(true);
    try {
      await actualizarUsuario(editando.id, {
        nombre: editando.nombre,
        apellido: editando.apellido,
        email: editando.email,
        rol: editando.rol,
        estado: editando.estado,
      });
      showToast("Cuenta actualizada", "success");
      setEditando(null);
      await cargar();
    } catch (err) {
      showToast(err.response?.data?.message || "No se pudo actualizar la cuenta", "error");
    } finally {
      setGuardando(false);
    }
  }

  async function confirmarEliminar() {
    try {
      await eliminarUsuario(aEliminar.UsuarioID);
      showToast("Cuenta eliminada", "success");
      await cargar();
    } catch (err) {
      showToast(err.response?.data?.message || "No se pudo eliminar la cuenta", "error");
    } finally {
      setAEliminar(null);
    }
  }

  if (cargando) return <p className="admin-loading">Cargando cuentas...</p>;

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div>
          <h1>Gestión de cuentas</h1>
          <p>{usuarios.length} {usuarios.length === 1 ? "cuenta" : "cuentas"}</p>
        </div>

        <div className="admin-filtros">
          <input
            type="search"
            className="admin-buscador"
            placeholder="Buscar por nombre o email..."
            value={busquedaInput}
            onChange={(e) => setBusquedaInput(e.target.value)}
          />
          <select
            className="admin-select"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
          >
            <option value="">Todas (sin eliminadas)</option>
            {FILTROS_ESTADO.map((est) => (
              <option key={est} value={est}>{est}</option>
            ))}
          </select>
        </div>
      </div>

      {usuarios.length === 0 ? (
        <p className="admin-vacio">No se encontraron cuentas.</p>
      ) : (
        <div className="admin-tabla-wrap">
          <table className="admin-tabla">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Última sesión</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => {
                const esPropio = u.UsuarioID === usuario.id;
                const eliminada = u.Estado === "Eliminado";
                return (
                  <tr key={u.UsuarioID}>
                    <td>
                      {u.Nombre} {u.Apellido}
                      {esPropio && <span className="admin-tu"> (vos)</span>}
                    </td>
                    <td>{u.Email}</td>
                    <td>
                      <span className={`admin-badge admin-badge--${u.Rol.toLowerCase()}`}>{u.Rol}</span>
                    </td>
                    <td>
                      <span className={`admin-badge admin-badge--${u.Estado.toLowerCase()}`}>{u.Estado}</span>
                    </td>
                    <td>{formatearFecha(u.UltimoAcceso)}</td>
                    <td>
                      <div className="admin-acciones">
                        <button
                          className="admin-btn"
                          onClick={() => abrirGestion(u)}
                          disabled={eliminada}
                        >
                          Gestionar
                        </button>
                        <button
                          className="admin-btn admin-btn--peligro"
                          onClick={() => setAEliminar(u)}
                          disabled={eliminada || esPropio}
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
      )}

      {editando && (
        <div className="admin-modal-overlay" onClick={() => setEditando(null)}>
          <form className="admin-modal" onClick={(e) => e.stopPropagation()} onSubmit={guardar}>
            <h2>Gestionar cuenta</h2>

            <div className="admin-campo-fila">
              <div className="admin-campo">
                <label htmlFor="adm-nombre">Nombre</label>
                <input
                  id="adm-nombre"
                  value={editando.nombre}
                  onChange={(e) => cambiarCampo("nombre", e.target.value)}
                  required
                />
              </div>
              <div className="admin-campo">
                <label htmlFor="adm-apellido">Apellido</label>
                <input
                  id="adm-apellido"
                  value={editando.apellido}
                  onChange={(e) => cambiarCampo("apellido", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="admin-campo">
              <label htmlFor="adm-email">Email</label>
              <input
                id="adm-email"
                type="email"
                value={editando.email}
                onChange={(e) => cambiarCampo("email", e.target.value)}
                required
              />
            </div>

            <div className="admin-campo-fila">
              <div className="admin-campo">
                <label htmlFor="adm-rol">Rol</label>
                <select
                  id="adm-rol"
                  value={editando.rol}
                  onChange={(e) => cambiarCampo("rol", e.target.value)}
                  disabled={editando.esPropio}
                >
                  <option value="Cliente">Cliente</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="admin-campo">
                <label htmlFor="adm-estado">Estado</label>
                <select
                  id="adm-estado"
                  value={editando.estado}
                  onChange={(e) => cambiarCampo("estado", e.target.value)}
                  disabled={editando.esPropio}
                >
                  {ESTADOS.map((est) => (
                    <option key={est} value={est}>{est}</option>
                  ))}
                </select>
              </div>
            </div>

            {editando.esPropio && (
              <p className="admin-nota">Es tu cuenta: no podés cambiar tu propio rol ni tu estado.</p>
            )}
            {editando.estado === "Bloqueado" && !editando.esPropio && (
              <p className="admin-nota">Una cuenta bloqueada no puede iniciar sesión hasta que la pases a Activo.</p>
            )}

            <div className="admin-modal-acciones">
              <button type="button" className="admin-btn" onClick={() => setEditando(null)}>
                Cancelar
              </button>
              <button type="submit" className="admin-btn admin-btn--primario" disabled={guardando}>
                {guardando ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </form>
        </div>
      )}

      <ConfirmModal
        open={!!aEliminar}
        title="Eliminar cuenta"
        message={
          aEliminar
            ? `Vas a eliminar la cuenta de ${aEliminar.Nombre} ${aEliminar.Apellido} (${aEliminar.Email}). Se borran sus datos personales, pero se conserva el historial de pedidos. Esta acción no se puede deshacer.`
            : ""
        }
        confirmLabel="Eliminar"
        danger
        onConfirm={confirmarEliminar}
        onCancel={() => setAEliminar(null)}
      />
    </div>
  );
}

export default AdminUsuarios;