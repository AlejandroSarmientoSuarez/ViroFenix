import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  obtenerPerfil,
  actualizarPerfil,
  eliminarCuenta
} from "../services/userService";
import { useAuth } from "../context/AuthContext";
import "../assets/css/perfil.css";

function Perfil() {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    passwordActual: "",
    passwordNueva: ""
  });

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [passwordConfirmacion, setPasswordConfirmacion] = useState("");
  const [mostrarEliminar, setMostrarEliminar] = useState(false);

  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function cargarPerfil() {
      try {
        const respuesta = await obtenerPerfil();

        // Acepta el usuario directo o dentro de la propiedad usuario.
        const datos = respuesta.data?.usuario || respuesta.data;

        if (!datos || !datos.Nombre) {
          setError("No se pudieron cargar los datos del perfil");
          return;
        }

        setForm((prev) => ({
          ...prev,
          nombre: datos.Nombre || "",
          apellido: datos.Apellido || "",
          email: datos.Email || ""
        }));
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          logout();
          navigate("/login");
        } else {
          setError("Error al cargar el perfil");
        }
      } finally {
        setCargando(false);
      }
    }

    cargarPerfil();
  }, []);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMensaje("");

    if (form.passwordNueva && !form.passwordActual) {
      setError("Ingresá tu contraseña actual");
      return;
    }

    setGuardando(true);

    try {
      const datos = {
        nombre: form.nombre,
        apellido: form.apellido,
        email: form.email
      };

      if (form.passwordNueva) {
        datos.passwordActual = form.passwordActual;
        datos.passwordNueva = form.passwordNueva;
      }

      await actualizarPerfil(datos);

      setMensaje("Perfil actualizado correctamente");

      setForm((prev) => ({
        ...prev,
        passwordActual: "",
        passwordNueva: ""
      }));
    } catch (err) {
      setError(
        err.response?.data?.mensaje ||
        err.response?.data?.message ||
        "Error al actualizar el perfil"
      );
    } finally {
      setGuardando(false);
    }
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  async function handleEliminarCuenta() {
    setError("");
    setMensaje("");

    if (!passwordConfirmacion) {
      setError("Ingresá tu contraseña para confirmar");
      return;
    }

    setEliminando(true);

    try {
      await eliminarCuenta(passwordConfirmacion);
      logout();
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.mensaje ||
        err.response?.data?.message ||
        "Error al eliminar la cuenta"
      );
    } finally {
      setEliminando(false);
    }
  }

  if (cargando) {
    return <p>Cargando perfil...</p>;
  }

  return (
    <div className="perfil-container">
      <form onSubmit={handleSubmit}>
        <h1>Mi perfil</h1>

        {error && (
          <p className="error-message">{error}</p>
        )}

        {mensaje && (
          <p className="success-message">{mensaje}</p>
        )}

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

        <p>
          Dejá estos campos vacíos si no querés cambiar la contraseña.
        </p>

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

        <button
          type="button"
          onClick={handleLogout}
          className="logout-button"
        >
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
            <p>
              Esta acción no se puede deshacer.
              Ingresá tu contraseña para confirmar.
            </p>

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
              {eliminando
                ? "Eliminando..."
                : "Confirmar eliminación"}
            </button>

            <button
              type="button"
              onClick={() => {
                setMostrarEliminar(false);
                setPasswordConfirmacion("");
              }}
            >
              Cancelar
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

export default Perfil;