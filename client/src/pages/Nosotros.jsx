import PlaceholderImage from "../components/PlaceholderImage";
import Reveal from "../components/Reveal";
import "../assets/css/Nosotros.css";

const equipo = [
  { id: 1, nombre: "Pedro WANGLIN", cargo: "Fundadora & Dirección Creativa", imagen: "/img/Pedro.jpg" },
  { id: 2, nombre: "Alejandro Sarmiento", cargo: "Diseño de Colecciones", imagen: "/img/Alejandro.jpg" },
  { id: 3, nombre: "Baruc Alexander Nuñez", cargo: "Producción", imagen: "/img/Baruc.jpg" },
];

const valores = [
  { id: 1, titulo: "Calidad", descripcion: "Seleccionamos materiales y terminaciones que perduran en el tiempo." },
  { id: 2, titulo: "Diseño", descripcion: "Cada prenda nace de un proceso creativo pensado para durar más allá de una temporada." },
  { id: 3, titulo: "Cercanía", descripcion: "Construimos vínculos reales con quienes eligen vestir ViroFenix." },
];

function Nosotros() {
  return (
    <div className="nosotros-container">
     <PlaceholderImage src="/img/Nosotros.png" ratio="21 / 11" label="Banner principal — 1600×680" />

      <Reveal>
        <header className="nosotros-header">
          <h1>Nuestra historia</h1>
          <p>
            ViroFenix nació de la idea de crear prendas atemporales, pensadas para acompañar
            cada etapa de quien las usa. Desde nuestros comienzos buscamos equilibrar diseño,
            calidad y cercanía en cada colección.
          </p>
        </header>
      </Reveal>

      <section className="nosotros-seccion">
        <Reveal>
          <h2 className="nosotros-subtitulo">Nuestros valores</h2>
        </Reveal>
        <div className="nosotros-valores-grid">
          {valores.map((valor, i) => (
            <Reveal key={valor.id} delay={(i % 4) * 60}>
              <div className="nosotros-valor-card">
                <h3>{valor.titulo}</h3>
                <p>{valor.descripcion}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="nosotros-seccion">
        <Reveal>
          <h2 className="nosotros-subtitulo">Nuestro equipo</h2>
        </Reveal>
        <div className="nosotros-equipo-grid">
          {equipo.map((persona, i) => (
            <Reveal key={persona.id} delay={(i % 4) * 60}>
              <div className="nosotros-equipo-card">
                <PlaceholderImage
                  src={persona.imagen}
                  ratio="1 / 1"
                  label={`${persona.nombre} — 400×400`}
                />
                <h3>{persona.nombre}</h3>
                <p>{persona.cargo}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Nosotros;