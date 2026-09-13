import axios from "axios";

const API_URL = "http://localhost:4000/api/auth";

export async function registrarUsuario(datos) {
  const respuesta = await axios.post(`${API_URL}/register`, datos);
  return respuesta.data;
}

export async function loginUsuario(datos) {
  const respuesta = await axios.post(`${API_URL}/login`, datos);
  return respuesta.data;
}

export async function solicitarRecuperacion(email) {
  const respuesta = await axios.post(`${API_URL}/recuperar`, { email });
  return respuesta.data;
}

export async function restablecerPassword(token, passwordNueva) {
  const respuesta = await axios.post(`${API_URL}/restablecer`, { token, passwordNueva });
  return respuesta.data;
}