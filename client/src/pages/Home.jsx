import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { obtenerProductos, IMG_BASE_URL } from "../services/productService";
import Carousel from "../components/Carousel";
import Reveal from "../components/Reveal";
import PlaceholderImage from "../components/PlaceholderImage";
import NewsletterForm from "../components/NewsletterForm";
import "../assets/css/home.css";
              
const slides = [
  {
    src: "/img/banner-3.jpg",
    titulo: "Elegancia y estilo para tu día a día",
    subtitulo: "Una colección inspirada en la libertad y la fuerza de quien la lleva puesta.",
    cta: "Explorar colección",
    ctaLink: "/coleccion",
  },
  {
    src: "/img/banner-secundario.jpg",
    titulo: "Nueva temporada",
    subtitulo: "Prendas pensadas para combinar estilo y comodidad en cada ocasión.",
    cta: "Ver novedades",
    ctaLink: "/coleccion",
  },
];

const valores = [
  { titulo: "Envío gratis", detalle: "En compras superiores a $50.000" },
  { titulo: "Cambios sin costo", detalle: "Hasta 30 días desde la compra" },
  { titulo: "Pago seguro", detalle: "Tus datos siempre protegidos" },
  { titulo: "Atención personalizada", detalle: "Te ayudamos a elegir tu talle" },
];

function Home() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargarProductos() {
      try {
        const respuesta = await obtenerProductos();
        setProductos(respuesta.data.slice(0, 8));
      } catch (err) {
        console.error(err);
      } finally {
        setCargando(false);
      }
    }
    cargarProductos();
  }, []);

  return (
    <div className="home-container">
      <Carousel slides={slides} />

      {/* Tira de beneficios */}
      <section className="home-valores">
        {valores.map((v, i) => (
          <Reveal key={v.titulo} delay={i * 60} className="home-valor">
            <h4>{v.titulo}</h4>
            <p>{v.detalle}</p>
          </Reveal>
        ))}
      </section>

      {/* Categorías */}
      <section className="home-categorias">
        <Reveal>
          <h2>Comprá por categoría</h2>
        </Reveal>
        <div className="home-categorias-grid">
          <Reveal delay={60}>
            <Link to="/coleccion" className="home-categoria-tile">
              <PlaceholderImage src="/img/categoria-hombre.jpg" ratio="4 / 5" label="Categoría — Hombre" />
              <span>Hombre</span>
            </Link>
          </Reveal>
          <Reveal delay={120}>
            <Link to="/coleccion" className="home-categoria-tile">
              <PlaceholderImage src="/img/categoria-mujer.jpg" ratio="4 / 5" label="Categoría — Mujer" />
              <span>Mujer</span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Destacados */}
      <section className="home-productos">
        <Reveal>
          <h2>Destacados</h2>
        </Reveal>

        {cargando ? (
          <p className="home-loading">Cargando...</p>
        ) : (
          <div className="home-grid">
            {productos.map((producto, i) => {
              const imagenBase = `${IMG_BASE_URL}${producto.Imagen}`;
              const imagenHover = imagenBase.replace(/(\.[a-zA-Z0-9]+)$/, "-hover$1");

              return (
                <Reveal key={producto.ProductoID} delay={(i % 4) * 60}>
                  <Link to={`/producto/${producto.ProductoID}`} className="home-item">
                    <div className="home-item-imagen-wrap">
                      <img src={imagenBase} alt={producto.Nombre} className="home-item-imagen home-item-imagen-base" />
                      <img
                        src={imagenHover}
                        alt=""
                        className="home-item-imagen home-item-imagen-hover"
                        onError={(e) => { e.target.style.display = "none"; }}
                      />
                    </div>
                    <h3>{producto.Nombre}</h3>
                    <p className="home-item-precio">${producto.Precio}</p>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        )}

        <Reveal>
          <Link to="/coleccion" className="home-ver-todo">Ver toda la colección</Link>
        </Reveal>
      </section>

      {/* Banner editorial: historia de la marca */}
      <section className="home-editorial">
        <Reveal className="home-editorial-imagen">
          <PlaceholderImage src="/img/historia-marca.jpg" ratio="1 / 1" label="Imagen — Nuestra historia" />
        </Reveal>
        <Reveal className="home-editorial-texto" delay={100}>
          <h2>Nuestra historia</h2>
          <p>
            Desde nuestros inicios, nos dedicamos a crear ropa que combina estilo, comodidad
            y autenticidad. Cada colección refleja nuestra pasión por la moda y nuestro
            compromiso con la calidad.
          </p>
          <p>Creemos que cada prenda cuenta una historia, y queremos que formes parte de ella.</p>
          <Link to="/coleccion" className="home-editorial-link">Ver colección</Link>
        </Reveal>
      </section>

      {/* Video / filosofía */}
      <section className="home-filosofia">
        <Reveal>
          <h2>Nuestra filosofía</h2>
          <p>
            Creemos en la autenticidad y la calidad. Cada prenda está diseñada para ofrecer
            comodidad y estilo, reflejando una personalidad fuerte y libre.
          </p>
        </Reveal>
        <Reveal delay={100} className="home-filosofia-video">
          <iframe
            src="https://www.youtube.com/embed/HRAG9lHW2XQ"
            title="Video de marca"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </Reveal>
      </section>

      <NewsletterForm />
    </div>
  );
}

export default Home;