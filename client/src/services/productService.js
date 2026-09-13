import axios from "axios";

const API_URL = "http://localhost:4000/api/productos";
export const IMG_BASE_URL = "http://localhost:4000/img/";

export async function obtenerProductos() {
  const respuesta = await axios.get(API_URL);
  return respuesta.data;
}
export async function obtenerProductoPorId(id) {
  const respuesta = await axios.get(`${API_URL}/${id}`);
  return respuesta.data;
}