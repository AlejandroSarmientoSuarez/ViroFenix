import { createContext, useState, useContext, useEffect } from "react";
import { registerSessionExpiredHandler } from "../services/axiosConfig";
import { obtenerPerfil } from "../services/userService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const guardado = localStorage.getItem("usuario");
    return guardado ? JSON.parse(guardado) : null;
  });

  function login(token, datosUsuario) {
    localStorage.setItem("token", token);
    localStorage.setItem("usuario", JSON.stringify(datosUsuario));
    setUsuario(datosUsuario);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setUsuario(null);
  }

  useEffect(() => {
    registerSessionExpiredHandler(() => {
      logout();
    });
  }, []);

  // Al cargar la app, trae los datos reales del servidor (por ejemplo el rol)
  // para que un cambio hecho en la base se refleje sin tener que volver a loguearse
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    let cancelado = false;

    obtenerPerfil()
      .then((respuesta) => {
        if (cancelado) return;
        const p = respuesta.data;
        const actualizado = {
          id: p.UsuarioID,
          nombre: p.Nombre,
          apellido: p.Apellido,
          email: p.Email,
          rol: p.Rol,
        };

        const guardado = localStorage.getItem("usuario");
        if (guardado !== JSON.stringify(actualizado)) {
          localStorage.setItem("usuario", JSON.stringify(actualizado));
          setUsuario(actualizado);
        }
      })
      .catch(() => {
        // Si falla, se sigue con los datos guardados
      });

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