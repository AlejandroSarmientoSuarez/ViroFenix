import axios from "axios";

const API_URL = "http://localhost:4000/api/admin";

function getAuthHeader() {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
}

export async function listarUsuarios({ buscar = "", estado = "" } = {}) {
  const respuesta = await axios.get(`${API_URL}/usuarios`, {
    ...getAuthHeader(),
    params: { buscar, estado },
  });
  return respuesta.data;
}

export async function actualizarUsuario(id, datos) {
  const respuesta = await axios.put(`${API_URL}/usuarios/${id}`, datos, getAuthHeader());
  return respuesta.data;
}

export async function eliminarUsuario(id) {
  const respuesta = await axios.delete(`${API_URL}/usuarios/${id}`, getAuthHeader());
  return respuesta.data;
}