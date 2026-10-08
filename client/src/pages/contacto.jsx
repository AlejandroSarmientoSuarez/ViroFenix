
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
    setFormulario((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const mailto = `mailto:contacto@virofenix.com?subject=${encodeURIComponent(
      formulario.asunto
    )}&body=${encodeURIComponent(
      `Nombre: ${formulario.nombre}\nEmail: ${formulario.email}\n\n${formulario.mensaje}`
    )}`;

    window.location.href = mailto;
  };

  return (
    <main className="contacto-container">
      {/* =====================================================
          HERO
      ====================================================== */}
      <Reveal>
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
      </Reveal>

      {/* =====================================================
          INFORMACIÓN + MAPA
      ====================================================== */}
      <section className="contacto-info">
        <Reveal>
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
        </Reveal>

        <Reveal delay={120}>
          <div className="contacto-mapa">
            <div className="contacto-mapa-overlay">
              <span>VIROFENIX</span>
              <p>Buenos Aires · Argentina</p>
            </div>

            {/* Reemplazar el src por la ubicación real de ViroFenix */}
            <iframe
              src="https://www.google.com/maps?q=Buenos%20Aires%2C%20Argentina&output=embed"
              title="Ubicación de ViroFenix en Buenos Aires"
              loading="lazy"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </Reveal>
      </section>

      {/* =====================================================
          FORMULARIO
      ====================================================== */}
      <section className="contacto-form-section">
        <Reveal>
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
        </Reveal>

        <Reveal delay={100}>
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
        </Reveal>
      </section>

      {/* =====================================================
          CIERRE
      ====================================================== */}
      <Reveal>
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
      </Reveal>
    </main>
  );
}

export default Contacto;

