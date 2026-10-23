import { useState } from "react";
import "../assets/css/contacto.css";

function Contacto() {
  const [formulario, setFormulario] = useState({
    nombre: "",
    email: "",
    asunto: "",
    mensaje: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormulario((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const asunto = formulario.asunto.trim();
    const cuerpo = [
      `Nombre: ${formulario.nombre.trim()}`,
      `Email: ${formulario.email.trim()}`,
      "",
      formulario.mensaje.trim(),
    ].join("\n");

    const mailto = `mailto:contacto@virofenix.com?subject=${encodeURIComponent(
      asunto
    )}&body=${encodeURIComponent(cuerpo)}`;

    window.location.href = mailto;
  };

  return (
    <main className="contacto-container">
      {/* HERO */}
      <header className="contacto-header">
        <span className="contacto-eyebrow">
          VIROFENIX · ESTAMOS PARA VOS
        </span>

        <h1>
          Hablemos.
          <br />
          <em>Estamos para ayudarte.</em>
        </h1>

        <div className="contacto-header-line" />

        <p>
          ¿Tenés alguna consulta sobre nuestras prendas, colecciones o
          pedidos? Escribinos y nuestro equipo se pondrá en contacto con
          vos.
        </p>
      </header>

      {/* INFORMACIÓN + MAPA */}
      <section className="contacto-info">
        <div className="contacto-datos">
          <span className="contacto-section-number">01</span>

          <h2>
            Información
            <br />
            <em>de contacto</em>
          </h2>

          <p className="contacto-intro">
            Elegí el medio que prefieras para comunicarte con nosotros.
            Estamos disponibles para ayudarte.
          </p>

          <div className="contacto-lista">
            <div className="contacto-dato">
              <span className="contacto-dato-numero">01</span>

              <div>
                <h3>Email</h3>
                <a href="mailto:contacto@virofenix.com">
                  contacto@virofenix.com
                </a>
              </div>
            </div>

            <div className="contacto-dato">
              <span className="contacto-dato-numero">02</span>

              <div>
                <h3>Teléfono</h3>
                <a href="tel:+541112345678">
                  +54 11 1234-5678
                </a>
              </div>
            </div>

            <div className="contacto-dato">
              <span className="contacto-dato-numero">03</span>

              <div>
                <h3>Ubicación</h3>
                <p>Buenos Aires, Argentina</p>
              </div>
            </div>

            <div className="contacto-dato">
              <span className="contacto-dato-numero">04</span>

              <div>
                <h3>Horarios</h3>
                <p>Lunes a viernes · 9:00 a 18:00</p>
              </div>
            </div>
          </div>
        </div>

        <div className="contacto-mapa">
          <div className="contacto-mapa-overlay">
            <span>VIROFENIX</span>
            <p>Buenos Aires · Argentina</p>
          </div>

          <iframe
            src="https://maps.google.com/maps?hl=es&q=Buenos%20Aires%2C%20Argentina&z=12&output=embed"
            title="Mapa de Buenos Aires, Argentina"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </section>

      {/* FORMULARIO */}
      <section className="contacto-form-section">
        <div className="contacto-form-header">
          <span className="contacto-section-number">02</span>

          <h2>
            Enviá tu
            <br />
            <em>consulta.</em>
          </h2>

          <p>
            Completá los siguientes datos y escribinos tu mensaje.
            Te responderemos a la brevedad.
          </p>
        </div>

        <form className="contacto-form" onSubmit={handleSubmit}>
          <div className="contacto-form-top">
            <span>FORMULARIO DE CONTACTO</span>
            <span>VIROFENIX</span>
          </div>

          <div className="contacto-form-row">
            <div className="contacto-field">
              <label htmlFor="nombre">
                <span>01</span>
                Nombre
              </label>

              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formulario.nombre}
                onChange={handleChange}
                placeholder="Tu nombre"
                autoComplete="name"
                maxLength={100}
                required
              />
            </div>

            <div className="contacto-field">
              <label htmlFor="email">
                <span>02</span>
                Email
              </label>

              <input
                type="email"
                id="email"
                name="email"
                value={formulario.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                autoComplete="email"
                maxLength={254}
                required
              />
            </div>
          </div>

          <div className="contacto-field">
            <label htmlFor="asunto">
              <span>03</span>
              Asunto
            </label>

            <input
              type="text"
              id="asunto"
              name="asunto"
              value={formulario.asunto}
              onChange={handleChange}
              placeholder="¿En qué podemos ayudarte?"
              maxLength={150}
              required
            />
          </div>

          <div className="contacto-field">
            <label htmlFor="mensaje">
              <span>04</span>
              Mensaje
            </label>

            <textarea
              id="mensaje"
              name="mensaje"
              value={formulario.mensaje}
              onChange={handleChange}
              placeholder="Escribí tu mensaje..."
              rows={6}
              maxLength={3000}
              required
            />
          </div>

          <div className="contacto-form-footer">
            <p>
              Al enviar el formulario se abrirá tu cliente de correo
              electrónico.
            </p>

            <button type="submit" className="contacto-submit">
              <span>Enviar mensaje</span>
              <strong>↗</strong>
            </button>
          </div>
        </form>
      </section>

      {/* CIERRE */}
      <section className="contacto-cierre">
        <span className="contacto-eyebrow">VIROFENIX</span>

        <h2>
          Tu mensaje.
          <br />
          <em>Nuestra respuesta.</em>
        </h2>

        <p>
          Cada consulta es una oportunidad para conocernos un poco más.
          Gracias por formar parte de ViroFenix.
        </p>
      </section>
    </main>
  );
}

export default Contacto;