import axios from "axios";

const API_URL = "http://localhost:4000/api/productos";
export const IMG_BASE_URL = "http://localhost:4000/img/";

export async function obtenerProductos(categoria, page = 1, limit = 8, search = "") {
  const params = new URLSearchParams();
  if (categoria && categoria !== "Todos") params.set("categoria", categoria);
  if (search && search.trim() !== "") params.set("search", search.trim());
  params.set("page", page);
  params.set("limit", limit);
  const respuesta = await axios.get(`${API_URL}?${params.toString()}`);
  return respuesta.data;
}

export async function obtenerProductoPorId(id) {
  const respuesta = await axios.get(`${API_URL}/${id}`);
  return respuesta.data;
}