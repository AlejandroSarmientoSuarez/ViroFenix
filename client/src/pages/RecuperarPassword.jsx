import { useState } from "react";
import { Link } from "react-router-dom";
import { solicitarRecuperacion } from "../services/authService";
import "../assets/css/auth.css";

function RecuperarPassword() {
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [linkDev, setLinkDev] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setCargando(true);
    try {
      const respuesta = await solicitarRecuperacion(email);
      setEnviado(true);
      if (respuesta.resetLinkDev) {
        setLinkDev(respuesta.resetLinkDev);
      }
    } catch (err) {
      setError("Ocurrió un error, intentá de nuevo");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h1>Recuperar contraseña</h1>

        {error && <p className="error-message">{error}</p>}

        {enviado ? (
          <>
            <p className="success-message">
              Si el email existe, te enviamos un enlace de recuperación.
            </p>
            {linkDev && (
              <p style={{ fontSize: "12px", wordBreak: "break-all", color: "var(--stone)" }}>
                (Modo desarrollo, sin email real configurado todavía):<br />
                <Link to={linkDev.replace("http://localhost:5173", "")}>{linkDev}</Link>
              </p>
            )}
          </>
        ) : (
          <>
            <input
              type="email"
              placeholder="Tu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" disabled={cargando}>
              {cargando ? "Enviando..." : "Enviar enlace"}
            </button>
          </>
        )}

        <p>
          <Link to="/login">Volver a iniciar sesión</Link>
        </p>
      </form>
    </div>
  );
}

export default RecuperarPassword;