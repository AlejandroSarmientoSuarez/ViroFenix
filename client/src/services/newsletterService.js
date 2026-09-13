import axios from "axios";

const API_URL = "http://localhost:4000/api/newsletter";

export async function suscribirNewsletter(email, edad) {
  const respuesta = await axios.post(API_URL, { email, edad });
  return respuesta.data;
}