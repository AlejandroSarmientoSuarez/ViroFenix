import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUsuario } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import "../assets/css/auth.css";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      const respuesta = await loginUsuario(form);
      const { token, usuario } = respuesta.data;
      login(token, usuario);
      navigate("/perfil");
    } catch (err) {
      const mensaje =
        err.response?.data?.message || "Error al iniciar sesión";
      setError(mensaje);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h1>Iniciar sesión</h1>

        {error && <p className="error-message">{error}</p>}

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
        />

        <button type="submit" disabled={cargando}>
          {cargando ? "Ingresando..." : "Ingresar"}
        </button>

        <p>
          ¿No tenés cuenta? <Link to="/register">Registrate</Link>
          {" · "}
          <Link to="/recuperar">¿Olvidaste tu contraseña?</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;