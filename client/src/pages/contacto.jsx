import { useState } from "react";
import Reveal from "../components/Reveal";
import "../assets/css/contacto.css";

function Contacto() {
  const [formulario, setFormulario] = useState({
    nombre: "",
    email: "",
    asunto: "",
    mensaje: "",
  });

  const handleChange = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const mailto = `mailto:contacto@tumarca.com
?subject=${encodeURIComponent(formulario.asunto)}
&body=${encodeURIComponent(
      `Nombre: ${formulario.nombre}\nEmail: ${formulario.email}\n\n${formulario.mensaje}`
    )}`;

    window.location.href = mailto;
  };

  return (
    <div className="contacto-container">

      {/* Encabezado */}
      <section className="contacto-header">
        <Reveal>
          <h1>Contactanos</h1>
          <p>
            Estamos para ayudarte. Podés comunicarte con nosotros
            o enviarnos tu consulta a través del formulario.
          </p>
        </Reveal>
      </section>

      {/* Información + Mapa */}
      <section className="contacto-info">

        <Reveal className="contacto-datos">
          <h2>Información de contacto</h2>

          <div className="contacto-dato">
            <h3>Email</h3>
            <p>contacto@tumarca.com</p>
          </div>

          <div className="contacto-dato">
            <h3>Teléfono</h3>
            <p>+54 11 1234-5678</p>
          </div>

          <div className="contacto-dato">
            <h3>Dirección</h3>
            <p>Buenos Aires, Argentina</p>
          </div>

          <div className="contacto-dato">
            <h3>Horarios de atención</h3>
            <p>Lunes a viernes · 9:00 a 18:00</p>
          </div>
        </Reveal>

    <Reveal className="contacto-mapa" delay={100}>
  <iframe
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.0959619719238!2d-58.37780902339865!3d-34.60173485739505!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bccacc66ebd6b7%3A0x84c10974e0f64c77!2sFullh4rd%20-%20Tienda%20Gamer!5e0!3m2!1ses-419!2sus!4v1789229024840!5m2!1ses-419!2sus"
    title="Ubicación de Fullh4rd - Tienda Gamer"
    loading="lazy"
    allowFullScreen
    referrerPolicy="strict-origin-when-cross-origin"
  />
</Reveal>

      </section>

      {/* Formulario */}
      <section className="contacto-form-section">
        <Reveal>
          <h2>Envianos un mensaje</h2>
          <p>
            Completá el formulario y nos pondremos en contacto con vos.
          </p>
        </Reveal>

        <Reveal delay={100}>
          <form className="contacto-form" onSubmit={handleSubmit}>

            <div className="contacto-form-row">
              <div className="contacto-field">
                <label htmlFor="nombre">Nombre</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formulario.nombre}
                  onChange={handleChange}
                  placeholder="Tu nombre"
                  required
                />
              </div>

              <div className="contacto-field">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formulario.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  required
                />
              </div>
            </div>

            <div className="contacto-field">
              <label htmlFor="asunto">Asunto</label>
              <input
                type="text"
                id="asunto"
                name="asunto"
                value={formulario.asunto}
                onChange={handleChange}
                placeholder="¿En qué podemos ayudarte?"
                required
              />
            </div>

            <div className="contacto-field">
              <label htmlFor="mensaje">Mensaje</label>
              <textarea
                id="mensaje"
                name="mensaje"
                value={formulario.mensaje}
                onChange={handleChange}
                placeholder="Escribí tu mensaje..."
                rows="6"
                required
              />
            </div>

            <button type="submit" className="contacto-submit">
              Enviar mensaje
            </button>

          </form>
        </Reveal>
      </section>

    </div>
  );
}

export default Contacto;