import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registrarUsuario } from "../services/authService";
import "../assets/css/auth.css";

function Register() {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      await registrarUsuario(form);
      navigate("/login");
    } catch (err) {
      const mensaje =
        err.response?.data?.message || "Error al registrar el usuario";
      setError(mensaje);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit}>
        <h1>Crear cuenta</h1>

        {error && <p className="error-message">{error}</p>}

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
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          required
          minLength={8}
        />

        <button type="submit" disabled={cargando}>
          {cargando ? "Creando cuenta..." : "Registrarse"}
        </button>

        <p>
          ¿Ya tenés cuenta? <Link to="/login">Iniciar sesión</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;