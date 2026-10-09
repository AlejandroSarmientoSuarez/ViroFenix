import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { obtenerPerfil } from "../services/userService";

function RutaAdmin({ children }) {
  const { usuario } = useAuth();
  const [estado, setEstado] = useState("verificando"); // verificando | permitido | denegado

  useEffect(() => {
    if (!usuario) return;
    let cancelado = false;

    obtenerPerfil()
      .then((respuesta) => {
        if (!cancelado) {
          setEstado(respuesta.data.Rol === "Admin" ? "permitido" : "denegado");
        }
      })
      .catch(() => {
        if (!cancelado) setEstado("denegado");
      });

    return () => {
      cancelado = true;
    };
  }, [usuario]);

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (estado === "verificando") {
    return <p style={{ textAlign: "center", padding: "80px 0" }}>Verificando permisos...</p>;
  }

  if (estado === "denegado") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RutaAdmin;