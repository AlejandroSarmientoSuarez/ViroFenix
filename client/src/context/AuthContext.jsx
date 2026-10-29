import { createContext, useState, useContext, useEffect } from "react";
import { registerSessionExpiredHandler } from "../services/axiosConfig";
import { obtenerPerfil } from "../services/userService";

const AuthContext = createContext();

function normalizarUsuario(datos) {
  if (!datos) return null;

  return {
    id: datos.id || datos.UsuarioID || datos.usuario?.UsuarioID,
    nombre: datos.nombre || datos.Nombre || datos.usuario?.Nombre || "",
    apellido: datos.apellido || datos.Apellido || datos.usuario?.Apellido || "",
    email: datos.email || datos.Email || datos.usuario?.Email || "",
    rol: datos.rol || datos.Rol || datos.usuario?.Rol || ""
  };
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const guardado = localStorage.getItem("usuario");

    try {
      return guardado ? normalizarUsuario(JSON.parse(guardado)) : null;
    } catch {
      return null;
    }
  });

  function login(token, datosUsuario) {
    const datos = normalizarUsuario(datosUsuario);

    localStorage.setItem("token", token);
    localStorage.setItem("usuario", JSON.stringify(datos));
    setUsuario(datos);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setUsuario(null);
  }

  useEffect(() => {
    registerSessionExpiredHandler(logout);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    let cancelado = false;

    async function actualizarUsuario() {
      try {
        const respuesta = await obtenerPerfil();

        if (cancelado) return;

        const datos = normalizarUsuario(
          respuesta.data?.usuario || respuesta.data
        );

        if (datos) {
          localStorage.setItem("usuario", JSON.stringify(datos));
          setUsuario(datos);
        }
      } catch (error) {
        if (
          error.response?.status === 401 ||
          error.response?.status === 403
        ) {
          logout();
        }
      }
    }

    actualizarUsuario();

    return () => {
      cancelado = true;
    };
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}