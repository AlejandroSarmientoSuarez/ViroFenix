import { useState } from "react";
import { suscribirNewsletter } from "../services/newsletterService";
import "../assets/css/newsletter.css";

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [edad, setEdad] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMensaje("");
    setEnviando(true);
    try {
      const respuesta = await suscribirNewsletter(email, edad);
      setMensaje(respuesta.message);
      setEmail("");
      setEdad("");
    } catch (err) {
      setError(err.response?.data?.message || "Ocurrió un error, intentá de nuevo");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="newsletter-section">
      <div className="newsletter-content">
        <h2>Sumate a la comunidad</h2>
        <p>Enterate primero de los lanzamientos y accedé a beneficios exclusivos.</p>

        <form onSubmit={handleSubmit} className="newsletter-form">
          <input
            type="email"
            placeholder="Tu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Edad"
            value={edad}
            onChange={(e) => setEdad(e.target.value)}
            min="13"
            max="120"
            required
          />
          <button type="submit" disabled={enviando}>
            {enviando ? "Enviando..." : "Suscribirme"}
          </button>
        </form>

        {mensaje && <p className="newsletter-mensaje newsletter-ok">{mensaje}</p>}
        {error && <p className="newsletter-mensaje newsletter-error">{error}</p>}
      </div>
    </section>
  );
}

export default NewsletterForm;