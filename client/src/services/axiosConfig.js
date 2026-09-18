import axios from "axios";

let toastHandler = null;
export function registerToastHandler(fn) {
  toastHandler = fn;
}

// Necesario para poder limpiar la sesión desde acá sin depender de un hook de React
let onSessionExpired = null;
export function registerSessionExpiredHandler(fn) {
  onSessionExpired = fn;
}

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response && toastHandler) {
      toastHandler("No pudimos conectar con el servidor. Revisá tu conexión.", "error", 4000);
    } else if (error.response && error.response.status >= 500 && toastHandler) {
      toastHandler("Ocurrió un error inesperado en el servidor.", "error", 4000);
    } else if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403) &&
      onSessionExpired
    ) {
      onSessionExpired();
    }
    return Promise.reject(error);
  }
);