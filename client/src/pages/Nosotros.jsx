
import PlaceholderImage from "../components/PlaceholderImage";
import Reveal from "../components/Reveal";
import "../assets/css/Nosotros.css";

const valores = [
  {
    id: 1,
    numero: "01",
    titulo: "Calidad",
    descripcion:
      "Seleccionamos cuidadosamente cada material, textura y terminación para crear prendas que conserven su esencia y calidad con el paso del tiempo.",
  },
  {
    id: 2,
    numero: "02",
    titulo: "Diseño",
    descripcion:
      "Creamos piezas con una identidad propia, equilibrando tendencias, funcionalidad y una estética atemporal que trasciende cada temporada.",
  },
  {
    id: 3,
    numero: "03",
    titulo: "Cercanía",
    descripcion:
      "Creemos en las relaciones auténticas. Escuchamos a nuestra comunidad y buscamos que cada experiencia con ViroFenix sea personal y significativa.",
  },
];

const equipo = [
  {
    id: 1,
    nombre: "Pedro WANGLIN",
    cargo: "Frontend Developer",
    imagen:
      "/img/user-profile-icon-person-avatar-symbol-account-silhouette-free-vector.jpg",
  },
  {
    id: 2,
    nombre: "Alejandro Sarmiento",
    cargo: "Backend Developer",
    imagen:
      "/img/user-profile-icon-person-avatar-symbol-account-silhouette-free-vector.jpg",
  },
  {
    id: 3,
    nombre: "Baruc Alexander Nuñez",
    cargo: "Frontend Developer",
    imagen:
      "/img/user-profile-icon-person-avatar-symbol-account-silhouette-free-vector.jpg",
  },
];

function Nosotros() {
  return (
    <main className="nosotros-container">
      {/* INTRODUCCIÓN */}
      <Reveal>
        <header className="nosotros-header">
          <span className="nosotros-eyebrow">VIROFENIX · DESDE EL ORIGEN</span>

          <h1>
            Diseñamos prendas
            <br />
            <em>con identidad.</em>
          </h1>

          <div className="nosotros-header-line" />

          <p>
            ViroFenix nace de una idea sencilla: crear prendas que no dependan
            de una temporada para tener sentido. Diseñamos desde la
            autenticidad, buscando combinar estética, calidad y personalidad
            en cada pieza.
          </p>
        </header>
      </Reveal>

      {/* HISTORIA */}
      <section className="nosotros-historia">
        <Reveal>
          <div className="nosotros-historia-contenido">
            <span className="nosotros-eyebrow">01 · NUESTRA HISTORIA</span>

            <h2>
              Una marca construida
              <br />
              <em>con propósito.</em>
            </h2>

            <p>
              Desde nuestros comienzos, ViroFenix se construye alrededor de
              una búsqueda constante: encontrar el equilibrio entre diseño,
              calidad y una identidad que pueda sentirse propia.
            </p>

            <p>
              Cada colección parte de una mirada contemporánea, pero evita
              seguir tendencias de manera pasajera. Preferimos crear piezas
              que puedan incorporarse naturalmente al estilo de cada persona
              y acompañarla durante mucho tiempo.
            </p>

            <div className="nosotros-historia-dato">
              <strong>ViroFenix</strong>
              <span>Diseño · Calidad · Identidad</span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="nosotros-historia-visual">
            <div className="nosotros-historia-marco">
              <span>VF</span>
            </div>
          </div>
        </Reveal>
      </section>

      {/* VALORES */}
      <section className="nosotros-seccion nosotros-valores">
        <Reveal>
          <div className="nosotros-seccion-header">
            <span className="nosotros-eyebrow">02 · LO QUE NOS DEFINE</span>

            <h2 className="nosotros-subtitulo">
              Nuestros <em>valores</em>
            </h2>

            <p>
              Los principios que guían nuestras decisiones y forman parte de
              cada etapa del proceso.
            </p>
          </div>
        </Reveal>

        <div className="nosotros-valores-grid">
          {valores.map((valor, i) => (
            <Reveal key={valor.id} delay={i * 80}>
              <article className="nosotros-valor-card">
                <span className="nosotros-valor-numero">
                  {valor.numero}
                </span>

                <div className="nosotros-valor-contenido">
                  <h3>{valor.titulo}</h3>
                  <p>{valor.descripcion}</p>
                </div>

                <span className="nosotros-valor-arrow">↗</span>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FILOSOFÍA */}
      <Reveal>
        <section className="nosotros-filosofia">
          <span className="nosotros-filosofia-marca">VIROFENIX</span>

          <blockquote>
            “No buscamos crear prendas para una temporada.
            <br />
            Buscamos crear piezas que formen parte de tu historia.”
          </blockquote>

          <span className="nosotros-filosofia-linea" />
        </section>
      </Reveal>

      {/* EQUIPO */}
      <section className="nosotros-seccion nosotros-equipo">
        <Reveal>
          <div className="nosotros-seccion-header">
            <span className="nosotros-eyebrow">03 · DETRÁS DE LA MARCA</span>

            <h2 className="nosotros-subtitulo">
              Nuestro <em>equipo</em>
            </h2>

            <p>
              Personas, ideas y diferentes miradas que trabajan detrás de
              cada colección de ViroFenix.
            </p>
          </div>
        </Reveal>

        <div className="nosotros-equipo-grid">
          {equipo.map((persona, i) => (
            <Reveal key={persona.id} delay={i * 80}>
              <article className="nosotros-equipo-card">
                <div className="nosotros-equipo-imagen">
                  <PlaceholderImage
                    src={persona.imagen}
                    ratio="1 / 1"
                    label={`${persona.nombre} — 400×400`}
                  />

                  <span className="nosotros-equipo-numero">
                    0{i + 1}
                  </span>
                </div>

                <div className="nosotros-equipo-info">
                  <h3>{persona.nombre}</h3>
                  <p>{persona.cargo}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CIERRE */}
      <Reveal>
        <section className="nosotros-cierre">
          <span className="nosotros-eyebrow">EL FUTURO</span>

          <h2>
            Seguimos creando.
            <br />
            <em>Seguimos evolucionando.</em>
          </h2>

          <p>
            ViroFenix continúa creciendo con una visión clara: desarrollar
            una identidad de moda reconocible, cuidada y fiel a quienes la
            eligen.
          </p>
        </section>
      </Reveal>
    </main>
  );
}

export default Nosotros;

