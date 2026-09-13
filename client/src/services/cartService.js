import axios from "axios";

const CART_URL = "http://localhost:4000/api/carrito";
const PEDIDOS_URL = "http://localhost:4000/api/pedidos";

function getAuthHeader() {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
}

export async function obtenerCarrito() {
  const respuesta = await axios.get(CART_URL, getAuthHeader());
  return respuesta.data;
}

export async function agregarAlCarrito(productoId, cantidad = 1) {
  const respuesta = await axios.post(`${CART_URL}/${productoId}`, { cantidad }, getAuthHeader());
  return respuesta.data;
}

export async function actualizarCantidadCarrito(productoId, cantidad) {
  const respuesta = await axios.put(`${CART_URL}/${productoId}`, { cantidad }, getAuthHeader());
  return respuesta.data;
}

export async function eliminarDelCarrito(productoId) {
  const respuesta = await axios.delete(`${CART_URL}/${productoId}`, getAuthHeader());
  return respuesta.data;
}

export async function crearPedido() {
  const respuesta = await axios.post(PEDIDOS_URL, {}, getAuthHeader());
  return respuesta.data;
}