import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerPerfil, actualizarPerfil } from "../services/userService";
import { useAuth } from "../context/AuthContext";
import "../assets/css/perfil.css";
import { eliminarCuenta } from "../services/userService";

function Perfil() {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    passwordActual: "",
    passwordNueva: "",
  });
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [passwordConfirmacion, setPasswordConfirmacion] = useState("");
  const [mostrarEliminar, setMostrarEliminar] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  async function handleEliminarCuenta() {
    setError("");
    setEliminando(true);
    try {
      await eliminarCuenta(passwordConfirmacion);
      logout();
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Error al eliminar la cuenta");
    } finally {
      setEliminando(false);
    }
  }

  useEffect(() => {
    async function cargarPerfil() {
      try {
        const respuesta = await obtenerPerfil();
        const datos = respuesta.data;
        setForm((prev) => ({
          ...prev,
          nombre: datos.Nombre,
          apellido: datos.Apellido,
          email: datos.Email,
        }));
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          logout();
          navigate("/login");
        }
      } finally {
        setCargando(false);
      }
    }
    cargarPerfil();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMensaje("");
    setGuardando(true);

    try {
      const payload = {
        nombre: form.nombre,
        apellido: form.apellido,
        email: form.email,
      };
      if (form.passwordNueva) {
        payload.passwordActual = form.passwordActual;
        payload.passwordNueva = form.passwordNueva;
      }

      await actualizarPerfil(payload);
      setMensaje("Perfil actualizado correctamente");
      setForm((prev) => ({ ...prev, passwordActual: "", passwordNueva: "" }));
    } catch (err) {
      const texto = err.response?.data?.message || "Error al actualizar el perfil";
      setError(texto);
    } finally {
      setGuardando(false);
    }
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  if (cargando) return <p>Cargando perfil...</p>;

  return (
    <div className="perfil-container">
      <form onSubmit={handleSubmit}>
        <h1>Mi perfil</h1>

        {error && <p className="error-message">{error}</p>}
        {mensaje && <p className="success-message">{mensaje}</p>}

        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="apellido"
          placeholder="Apellido"
          value={form.apellido}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <hr />
        <p>Dejá estos campos vacíos si no querés cambiar la contraseña</p>

        <input
          type="password"
          name="passwordActual"
          placeholder="Contraseña actual"
          value={form.passwordActual}
          onChange={handleChange}
        />
        <input
          type="password"
          name="passwordNueva"
          placeholder="Contraseña nueva"
          value={form.passwordNueva}
          onChange={handleChange}
          minLength={8}
        />

        <button type="submit" disabled={guardando}>
          {guardando ? "Guardando..." : "Guardar cambios"}
        </button>

        <button type="button" onClick={handleLogout} className="logout-button">
          Cerrar sesión
        </button>
         <hr />

        {!mostrarEliminar ? (
          <button
            type="button"
            className="eliminar-cuenta-trigger"
            onClick={() => setMostrarEliminar(true)}
          >
            Eliminar mi cuenta
          </button>
        ) : (
          <div className="eliminar-cuenta-confirmacion">
            <p>Esta acción no se puede deshacer. Ingresá tu contraseña para confirmar.</p>
            <input
              type="password"
              placeholder="Contraseña"
              value={passwordConfirmacion}
              onChange={(e) => setPasswordConfirmacion(e.target.value)}
            />
            <button
              type="button"
              className="eliminar-cuenta-confirmar"
              onClick={handleEliminarCuenta}
              disabled={eliminando}
            >
              {eliminando ? "Eliminando..." : "Confirmar eliminación"}
            </button>
            <button type="button" onClick={() => setMostrarEliminar(false)}>
              Cancelar
            </button>
          </div>
        )}
        
      </form>
    </div>
  );
}

export default Perfil;