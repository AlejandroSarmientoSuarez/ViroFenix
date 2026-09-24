import axios from "axios";

const API_URL = "http://localhost:4000/api/favoritos";

function getAuthHeader() {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
}

export async function obtenerFavoritos() {
  const respuesta = await axios.get(API_URL, getAuthHeader());
  return respuesta.data;
}

export async function agregarFavorito(productoId) {
  const respuesta = await axios.post(`${API_URL}/${productoId}`, {}, getAuthHeader());
  return respuesta.data;
}

export async function quitarFavorito(productoId) {
  const respuesta = await axios.delete(`${API_URL}/${productoId}`, getAuthHeader());
  return respuesta.data;
}