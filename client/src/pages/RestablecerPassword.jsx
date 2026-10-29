import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { restablecerPassword } from "../services/authService";
import "../assets/css/auth.css";

function RestablecerPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [passwordNueva, setPasswordNueva] = useState("");
  const [error, setError] = useState("");
  const [exito, setExito] = useState(false);
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setCargando(true);
    try {
      await restablecerPassword(token, passwordNueva);
      setExito(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Error al restablecer la contraseña");
    } finally {
      setCargando(false);
    }
  }

  if (!token) {
    return (
      <div className="login-container">
        <form>
          <h1>Enlace inválido</h1>
          <p className="error-message">Este enlace no es válido.</p>
          <p><Link to="/recuperar">Solicitar uno nuevo</Link></p>
        </form>
      </div>
    );
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h1>Nueva contraseña</h1>

        {error && <p className="error-message">{error}</p>}
        {exito && <p className="success-message">Contraseña actualizada. Redirigiendo...</p>}

        {!exito && (
          <>
            <input
              type="password"
              placeholder="Nueva contraseña"
              value={passwordNueva}
              onChange={(e) => setPasswordNueva(e.target.value)}
              minLength={8}
              required
            />
            <button type="submit" disabled={cargando}>
              {cargando ? "Guardando..." : "Guardar nueva contraseña"}
            </button>
          </>
        )}
      </form>
    </div>
  );
}

export default RestablecerPassword;