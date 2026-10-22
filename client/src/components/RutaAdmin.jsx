import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { obtenerPerfil } from "../services/userService";

function RutaAdmin({ children }) {
  const { usuario } = useAuth();
  const [rol, setRol] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!usuario) return;

    obtenerPerfil()
      .then((perfil) => {
        console.log("PERFIL RECIBIDO:", perfil);

        const rolUsuario = String(perfil.Rol || perfil.rol || "")
          .trim()
          .toLowerCase();

        setRol(rolUsuario);
      })
      .catch((error) => {
        console.error("Error al obtener perfil:", error);
        setError("No se pudo verificar tu cuenta. Revisá el servidor.");
      })
      .finally(() => {
        setCargando(false);
      });
  }, [usuario]);

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (cargando) {
    return <p style={{ textAlign: "center", padding: "80px 0" }}>
      Verificando permisos...
    </p>;
  }

  if (error) {
    return <p style={{ textAlign: "center", padding: "40px", color: "red" }}>
      {error}
    </p>;
  }

  if (rol !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RutaAdmin;