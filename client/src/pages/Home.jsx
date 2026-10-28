
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { obtenerProductos, IMG_BASE_URL } from "../services/productService";
import Carousel from "../components/Carousel";
import "../assets/css/home.css";
import "../assets/css/faq.css";
import "../assets/css/variables.css";

const slides = [
  {
    src: "/img/banner-3.jpg",
    titulo: "Elegancia y estilo para tu día a día",
    subtitulo: "Una colección inspirada en la libertad y la fuerza de quien la lleva puesta.",
    cta: "Explorar colección",
    ctaLink: "/coleccion"
  },
  {
    src: "/img/banner-secundario.jpg",
    titulo: "Nueva temporada",
    subtitulo: "Prendas pensadas para combinar estilo y comodidad en cada ocasión.",
    cta: "Ver novedades",
    ctaLink: "/coleccion"
  }
];

const preguntas = [
  {
    pregunta: "Transparencia",
    respuesta: "Nos comprometemos a brindar información clara sobre nuestros procesos de producción, los materiales utilizados y las prácticas laborales."
  },
  {
    pregunta: "Confianza",
    respuesta: "Valoramos la confianza de nuestros clientes y nos esforzamos por ofrecer productos de calidad y un buen servicio."
  },
  {
    pregunta: "Productos",
    respuesta: "Nuestros productos están diseñados para ofrecer calidad, durabilidad y comodidad."
  },
  {
    pregunta: "Sostenibilidad",
    respuesta: "Buscamos reducir nuestro impacto ambiental y promover prácticas responsables."
  }
];

function Home() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [preguntaAbierta, setPreguntaAbierta] = useState(null);

  useEffect(() => {
    async function cargarProductos() {
      try {
        const respuesta = await obtenerProductos();
        const lista = Array.isArray(respuesta.data)
          ? respuesta.data
          : Array.isArray(respuesta)
            ? respuesta
            : [];

        setProductos(lista.slice(0, 8));
      } catch {
        setProductos([]);
      }

      setCargando(false);
    }

    cargarProductos();
  }, []);

  return (
    <div className="home-container">
      <Carousel slides={slides} />

      <section className="home-categorias">
        <h2>Comprá por categoría</h2>

        <div className="home-categorias-grid">
          <Link to="/coleccion?categoria=Hombre" className="home-categoria-tile">
            <img src="/img/categoria-hombre.jpg" alt="Categoría Hombre" loading="lazy" />
            <span>Hombre</span>
          </Link>

          <Link to="/coleccion?categoria=Mujer" className="home-categoria-tile">
            <img src="/img/categoria-mujer.jpg" alt="Categoría Mujer" loading="lazy" />
            <span>Mujer</span>
          </Link>
        </div>
      </section>

      <section className="home-productos">
        {cargando ? (
          <p className="home-loading">Cargando productos...</p>
        ) : productos.length === 0 ? (
          <p className="home-loading">No hay productos disponibles.</p>
        ) : (
          <div className="home-grid">
            {productos.map((producto) => {
              let imagen = producto.Imagen || "";

              if (imagen && !imagen.startsWith("http")) {
                imagen = IMG_BASE_URL + imagen;
              }

              const hover = imagen
                ? imagen.replace(/(\.[a-zA-Z0-9]+)$/, "-hover$1")
                : "";

              const precio = Number(producto.Precio);

              return (
                <Link
                  key={producto.ProductoID}
                  to={`/producto/${producto.ProductoID}`}
                  className="home-item"
                >
                  <div className="home-item-imagen-wrap">
                    {imagen && (
                      <img
                        src={imagen}
                        alt={producto.Nombre || "Producto"}
                        className="home-item-imagen home-item-imagen-base"
                        loading="lazy"
                      />
                    )}

                    {hover && hover !== imagen && (
                      <img
                        src={hover}
                        alt=""
                        className="home-item-imagen home-item-imagen-hover"
                        loading="lazy"
                        onError={(e) => e.currentTarget.style.display = "none"}
                      />
                    )}
                  </div>

                  <h3>{producto.Nombre || "Producto sin nombre"}</h3>

                  <p className="home-item-precio">
                    {producto.Precio != null && producto.Precio !== "" && Number.isFinite(precio)
                      ? precio.toLocaleString("es-AR", {
                          style: "currency",
                          currency: "ARS"
                        })
                      : "Consultar precio"}
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section className="home-editorial">
        <div className="home-editorial-imagen">
          <img src="/img/historia-marca.jpg" alt="Nuestra historia" loading="lazy" />
        </div>

        <div className="home-editorial-texto">
          <h2>Nuestra historia</h2>

          <p>
            Desde nuestros inicios, nos dedicamos a crear ropa que combina
            estilo, comodidad y autenticidad. Cada colección refleja nuestra
            pasión por la moda y nuestro compromiso con la calidad.
          </p>

          <p>
            Creemos que cada prenda cuenta una historia, y queremos que formes
            parte de ella.
          </p>

          <Link to="/coleccion" className="home-editorial-link">
            Ver colección
          </Link>
        </div>
      </section>

      <section className="faq-categoria">
        <h3>Ética y sostenibilidad</h3>

        <div className="faq-lista">
          {preguntas.map((item, indice) => (
            <div className="faq-item" key={item.pregunta}>
              <button
                type="button"
                className="faq-pregunta"
                onClick={() =>
                  setPreguntaAbierta(preguntaAbierta === indice ? null : indice)
                }
                aria-expanded={preguntaAbierta === indice}
              >
                <span>{item.pregunta}</span>
                <span className="faq-icono">
                  {preguntaAbierta === indice ? "−" : "+"}
                </span>
              </button>

              {preguntaAbierta === indice && (
                <div className="faq-respuesta">
                  <p>{item.respuesta}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
