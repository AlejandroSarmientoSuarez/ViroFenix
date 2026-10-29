import axios from "axios";

const API_URL = "http://localhost:4000/api/admin";

function getAuthHeader() {
  const token = localStorage.getItem("token");

  return {
    headers: { Authorization: `Bearer ${token}` }
  };
}

export async function listarUsuarios({ buscar = "", estado = "" } = {}) {
  const respuesta = await axios.get(`${API_URL}/usuarios`, {
    ...getAuthHeader(),
    params: { buscar, estado }
  });

  return respuesta.data;
}

export async function actualizarUsuario(id, datos) {
  const respuesta = await axios.put(
    `${API_URL}/usuarios/${id}`,
    datos,
    getAuthHeader()
  );

  return respuesta.data;
}

export async function eliminarUsuario(id) {
  const respuesta = await axios.delete(
    `${API_URL}/usuarios/${id}`,
    getAuthHeader()
  );

  return respuesta.data;
}

export async function listarPedidosAdmin() {
  const respuesta = await axios.get(
    `${API_URL}/pedidos`,
    getAuthHeader()
  );

  return respuesta.data;
}

export async function actualizarEstadoPedido(id, estado) {
  const respuesta = await axios.put(
    `${API_URL}/pedidos/${id}/estado`,
    { estado },
    getAuthHeader()
  );

  return respuesta.data;
}

export async function listarStockAdmin() {
  const respuesta = await axios.get(
    `${API_URL}/stock`,
    getAuthHeader()
  );

  return respuesta.data;
}

export async function reponerStock(id, cantidad) {
  const respuesta = await axios.put(
    `${API_URL}/stock/${id}`,
    { cantidad },
    getAuthHeader()
  );

  return respuesta.data;
}