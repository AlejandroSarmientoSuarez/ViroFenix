
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { obtenerProductos, IMG_BASE_URL } from "../services/productService";
import Carousel from "../components/Carousel";
import "../assets/css/home.css";
import "../assets/css/faq.css";

const slides = [
  {
    src: "/img/banner-3.jpg",
    titulo: "Elegancia y estilo para tu día a día",
    subtitulo:
      "Una colección inspirada en la libertad y la fuerza de quien la lleva puesta.",
    cta: "Explorar colección",
    ctaLink: "/coleccion",
  },
  {
    src: "/img/banner-secundario.jpg",
    titulo: "Nueva temporada",
    subtitulo:
      "Prendas pensadas para combinar estilo y comodidad en cada ocasión.",
    cta: "Ver novedades",
    ctaLink: "/coleccion",
  },
];

const valores = [
  {
    titulo: "Envío gratis",
    detalle: "En compras superiores a $50.000",
  },
  {
    titulo: "Cambios sin costo",
    detalle: "Hasta 30 días desde la compra",
  },
  {
    titulo: "Pago seguro",
    detalle: "Tus datos siempre protegidos",
  },
  {
    titulo: "Atención personalizada",
    detalle: "Te ayudamos a elegir tu talle",
  },
];

const PREGUNTAS = [
  {
    categoria: "Ética y sostenibilidad",
    items: [
      {
        p: "Transparencia",
        r: "Nos comprometemos a brindar información clara sobre nuestros procesos de producción, los materiales utilizados y las prácticas laborales. Creemos que la transparencia es clave para generar confianza con nuestros clientes.",
      },
      {
        p: "Confianza",
        r: "Valoramos la confianza que nuestros clientes depositan en nosotros. Nos esforzamos por ofrecer productos de calidad, cumplir con los plazos de entrega y brindar un excelente servicio al cliente.",
      },
      {
        p: "Productos",
        r: "Nuestros productos están diseñados para ofrecer calidad, durabilidad y comodidad. Procuramos que cada prenda cumpla con nuestros estándares antes de ser enviada a nuestros clientes.",
      },
      {
        p: "Sostenibilidad",
        r: "Buscamos reducir nuestro impacto ambiental y promover prácticas responsables en la selección de materiales, la producción y la cadena de suministro.",
      },
    ],
  },
];

function Home() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorProductos, setErrorProductos] = useState(false);
  const [preguntaAbierta, setPreguntaAbierta] = useState(null);

  useEffect(() => {
    let activo = true;

    async function cargarProductos() {
      try {
        setCargando(true);
        setErrorProductos(false);

        const respuesta = await obtenerProductos();
        const lista = Array.isArray(respuesta?.data)
          ? respuesta.data
          : Array.isArray(respuesta)
            ? respuesta
            : [];

        if (activo) {
          setProductos(lista.slice(0, 8));
        }
      } catch (error) {
        console.error("Error al cargar los productos:", error);

        if (activo) {
          setProductos([]);
          setErrorProductos(true);
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    }

    cargarProductos();

    return () => {
      activo = false;
    };
  }, []);

  function obtenerImagenProducto(imagen) {
    if (!imagen) return "";

    if (/^https?:\/\//i.test(imagen)) {
      return imagen;
    }

    return `${IMG_BASE_URL}${imagen}`;
  }

  function obtenerImagenHover(imagen) {
    if (!imagen) return "";
    return imagen.replace(/(\.[a-zA-Z0-9]+)$/, "-hover$1");
  }

  function formatearPrecio(precio) {
    const numero = Number(precio);

    if (!Number.isFinite(numero)) {
      return "Consultar precio";
    }

    return numero.toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 2,
    });
  }

  function alternarPregunta(categoriaIndex, preguntaIndex) {
    const identificador = `${categoriaIndex}-${preguntaIndex}`;

    setPreguntaAbierta((actual) =>
      actual === identificador ? null : identificador
    );
  }

  return (
    <div className="home-container">
      <Carousel slides={slides} />

      <section className="home-valores">
        {valores.map((valor) => (
          <div className="home-valor" key={valor.titulo}>
            <h4>{valor.titulo}</h4>
            <p>{valor.detalle}</p>
          </div>
        ))}
      </section>

      <section className="home-categorias">
        <h2>Comprá por categoría</h2>

        <div className="home-categorias-grid">
          <Link
            to="/coleccion?categoria=Hombre"
            className="home-categoria-tile"
          >
            <img
              src="/img/categoria-hombre.jpg"
              alt="Categoría Hombre"
              loading="lazy"
            />
            <span>Hombre</span>
          </Link>

          <Link
            to="/coleccion?categoria=Mujer"
            className="home-categoria-tile"
          >
            <img
              src="/img/categoria-mujer.jpg"
              alt="Categoría Mujer"
              loading="lazy"
            />
            <span>Mujer</span>
          </Link>
        </div>
      </section>

      <section className="home-productos">
        <h2>Destacados</h2>

        {cargando ? (
          <p className="home-loading" role="status">
            Cargando productos...
          </p>
        ) : errorProductos ? (
          <p className="home-loading" role="alert">
            No pudimos cargar los productos. Intentá nuevamente más tarde.
          </p>
        ) : productos.length === 0 ? (
          <p className="home-loading">
            Por el momento no hay productos disponibles.
          </p>
        ) : (
          <div className="home-grid">
            {productos.map((producto) => {
              const imagenBase = obtenerImagenProducto(producto.Imagen);
              const imagenHover = obtenerImagenHover(imagenBase);

              return (
                <Link
                  key={producto.ProductoID}
                  to={`/producto/${producto.ProductoID}`}
                  className="home-item"
                >
                  <div className="home-item-imagen-wrap">
                    {imagenBase ? (
                      <img
                        src={imagenBase}
                        alt={producto.Nombre || "Producto"}
                        className="home-item-imagen home-item-imagen-base"
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.style.visibility = "hidden";
                        }}
                      />
                    ) : (
                      <div className="home-item-imagen home-item-imagen-base" />
                    )}

                    {imagenHover && imagenHover !== imagenBase && (
                      <img
                        src={imagenHover}
                        alt=""
                        aria-hidden="true"
                        className="home-item-imagen home-item-imagen-hover"
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    )}
                  </div>

                  <h3>{producto.Nombre || "Producto sin nombre"}</h3>

                  <p className="home-item-precio">
                    {formatearPrecio(producto.Precio)}
                  </p>
                </Link>
              );
            })}
          </div>
        )}

        <Link to="/coleccion" className="home-ver-todo">
          Ver toda la colección
        </Link>
      </section>

      <section className="home-editorial">
        <div className="home-editorial-imagen">
          <img
            src="/img/historia-marca.jpg"
            alt="Nuestra historia"
            loading="lazy"
          />
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

      <section className="home-filosofia">
        <h2>Nuestra filosofía</h2>

        <p>
          Creemos en la autenticidad y la calidad. Cada prenda está diseñada
          para ofrecer comodidad y estilo, reflejando una personalidad fuerte
          y libre.
        </p>
      </section>

      <section className="faq-section" id="etica-sostenibilidad">
        <h2>Ética y sostenibilidad</h2>

        <p>
          Conocé los principios que guían nuestras decisiones y nuestro
          compromiso con los clientes.
        </p>

        {PREGUNTAS.map((categoria, categoriaIndex) => (
          <div className="faq-categoria" key={categoria.categoria}>
            <h3>{categoria.categoria}</h3>

            <div className="faq-lista">
              {categoria.items.map((pregunta, preguntaIndex) => {
                const identificador = `${categoriaIndex}-${preguntaIndex}`;
                const abierta = preguntaAbierta === identificador;
                const respuestaId =
                  `faq-respuesta-${categoriaIndex}-${preguntaIndex}`;

                return (
                  <div className="faq-item" key={pregunta.p}>
                    <button
                      type="button"
                      className="faq-pregunta"
                      onClick={() =>
                        alternarPregunta(categoriaIndex, preguntaIndex)
                      }
                      aria-expanded={abierta}
                      aria-controls={respuestaId}
                    >
                      <span>{pregunta.p}</span>
                      <span className="faq-icono" aria-hidden="true">
                        {abierta ? "−" : "+"}
                      </span>
                    </button>

                    {abierta && (
                      <div className="faq-respuesta" id={respuestaId}>
                        <p>{pregunta.r}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Home;
