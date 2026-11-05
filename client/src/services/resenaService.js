import axios from "axios";

const API_URL = "http://localhost:4000/api/resenas";

export async function obtenerResenas(productoId) {
  const respuesta = await axios.get(`${API_URL}/${productoId}`);
  return respuesta.data;
}

export async function crearResena(productoId, datos) {
  const token = localStorage.getItem("token");
  const respuesta = await axios.post(`${API_URL}/${productoId}`, datos, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
  return respuesta.data;
}
