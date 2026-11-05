import axios from "axios";

const API_URL = "http://localhost:4000/api/user";

function getAuthHeader() {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
}

export async function obtenerPerfil() {
  const respuesta = await axios.get(`${API_URL}/perfil`, getAuthHeader());
  return respuesta.data;
}

export async function actualizarPerfil(datos) {
  const respuesta = await axios.put(`${API_URL}/perfil`, datos, getAuthHeader());
  return respuesta.data;
}

export async function eliminarCuenta(password) {
  const respuesta = await axios.delete(`${API_URL}/cuenta`, {
    ...getAuthHeader(),
    data: { password },
  });
  return respuesta.data;
}