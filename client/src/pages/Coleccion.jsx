import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { obtenerProductos, IMG_BASE_URL } from "../services/productService";
import { obtenerFavoritos, agregarFavorito, quitarFavorito } from "../services/favoritoService";
import { agregarAlCarrito } from "../services/cartService";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import PlaceholderImage from "../components/PlaceholderImage";
import Reveal from "../components/Reveal";
import { SkeletonGrid } from "../components/Skeleton";
import "../assets/css/coleccion.css";

const CATEGORIAS = ["Todos", "Hombre", "Mujer", "Unisex"];
const LIMITE_POR_PAGINA = 8;

function Coleccion() {
  const [productos, setProductos] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const categoriaActiva = searchParams.get("categoria") || "Todos";

  const [busquedaInput, setBusquedaInput] = useState(""); // lo que el usuario escribe
  const [busqueda, setBusqueda] = useState(""); // valor con debounce, el que realmente se usa
  const [soloFavoritos, setSoloFavoritos] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [cargandoMas, setCargandoMas] = useState(false);
  const [mensajeAgregado, setMensajeAgregado] = useState(null);
  const [pagina, setPagina] = useState(1);
  const [hayMas, setHayMas] = useState(true);
  const [totalProductos, setTotalProductos] = useState(0);

  const { usuario } = useAuth();
  const { refrescarCarrito } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Debounce: espera 400ms después de que el usuario deja de tipear antes de disparar la búsqueda real
  useEffect(() => {
    const timer = setTimeout(() => setBusqueda(busquedaInput), 400);
    return () => clearTimeout(timer);
  }, [busquedaInput]);

  useEffect(() => {
    async function cargarInicial() {
      setCargando(true);
      setPagina(1);
      try {
        const respuesta = await obtenerProductos(categoriaActiva, 1, LIMITE_POR_PAGINA, busqueda);
        setProductos(respuesta.data);
        setTotalProductos(respuesta.pagination.total);
        setHayMas(respuesta.data.length < respuesta.pagination.total);

        if (usuario) {
          const respuestaFavoritos = await obtenerFavoritos();
          setFavoritos(respuestaFavoritos.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setCargando(false);
      }
    }
    cargarInicial();
  }, [usuario, categoriaActiva, busqueda]);

  async function cargarMas() {
    const siguiente = pagina + 1;
    setCargandoMas(true);
    try {
      const respuesta = await obtenerProductos(categoriaActiva, siguiente, LIMITE_POR_PAGINA, busqueda);
      setProductos((prev) => [...prev, ...respuesta.data]);
      setPagina(siguiente);
      setHayMas(productos.length + respuesta.data.length < respuesta.pagination.total);
    } catch (err) {
      console.error(err);
    } finally {
      setCargandoMas(false);
    }
  }

  function cambiarCategoria(cat) {
    setSearchParams(cat === "Todos" ? {} : { categoria: cat });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function limpiarFiltros() {
    setBusquedaInput("");
    setBusqueda("");
    setSoloFavoritos(false);
    setSearchParams({});
  }

  async function toggleFavorito(productoId) {
    if (!usuario) {
      navigate("/login");
      return;
    }
    const esFavorito = favoritos.includes(productoId);
    try {
      if (esFavorito) {
        await quitarFavorito(productoId);
        setFavoritos(favoritos.filter((id) => id !== productoId));
      } else {
        await agregarFavorito(productoId);
        setFavoritos([...favoritos, productoId]);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleAgregarCarrito(productoId) {
    if (!usuario) {
      navigate("/login");
      return;
    }
    try {
      await agregarAlCarrito(productoId, 1);
      await refrescarCarrito();
      showToast("Producto agregado al carrito", "success");
    } catch (err) {
      showToast("No se pudo agregar el producto", "error");
    }
  }

  // El filtro de favoritos sigue siendo client-side porque solo aplica sobre lo ya cargado,
  // pero eso es intencional: "ver guardados" es una vista chica, no necesita paginar.
  const productosVisibles = useMemo(() => {
    if (!soloFavoritos) return productos;
    return productos.filter((p) => favoritos.includes(p.ProductoID));
  }, [productos, soloFavoritos, favoritos]);

  const hayFiltrosActivos = busqueda.trim() !== "" || soloFavoritos || categoriaActiva !== "Todos";
  const tituloSeccion = categoriaActiva === "Todos" ? "Nuestra colección" : `Colección — ${categoriaActiva}`;
  const mostrarBotonCargarMas = hayMas && !soloFavoritos;

  if (cargando) return <SkeletonGrid count={8} />;

  return (
    <div className="coleccion-container">
      {/* === HERO: banner principal con texto superpuesto === */}
      <div className="banner-hero">
        <PlaceholderImage src="/img/banner-principal.jpg" ratio="21 / 11" label="Banner principal — 1600×680" />
        <div className="banner-overlay">
          <span className="banner-kicker">Temporada 2026</span>
          <h1 className="banner-titulo">Estilo que se nota</h1>
          <p className="banner-subtitulo">
            Prendas y calzado pensados para combinar carácter, comodidad y una estética atemporal.
          </p>
          <button className="banner-cta" onClick={() => cambiarCategoria("Todos")}>
            Ver colección
          </button>
        </div>
      </div>

      {/* === Galería de categorías (clickeable, sin texto superpuesto) === */}
      <div className="coleccion-contenido">
        <div className="coleccion-galeria-modelos">
          <button className="galeria-item" onClick={() => cambiarCategoria("Hombre")}>
            <div className="galeria-item-imagen-wrap">
              <PlaceholderImage src="/img/banners/portada1.jpg" ratio="3 / 4" label="Modelo — Hombre" />
            </div>
            <span className="galeria-item-nombre">Hombre</span>
          </button>
          <button className="galeria-item" onClick={() => cambiarCategoria("Mujer")}>
            <div className="galeria-item-imagen-wrap">
              <PlaceholderImage src="/img/banners/portada2.jpg" ratio="3 / 4" label="Modelo — Mujer" />
            </div>
            <span className="galeria-item-nombre">Mujer</span>
          </button>
          <button className="galeria-item" onClick={() => cambiarCategoria("Unisex")}>
            <div className="galeria-item-imagen-wrap">
              <PlaceholderImage src="/img/banners/portada3.jpg" ratio="3 / 4" label="Modelo — Unisex" />
            </div>
            <span className="galeria-item-nombre">Unisex</span>
          </button>
        </div>
      </div>

      

      <div className="coleccion-contenido">
        <Reveal>
          <header className="coleccion-header">
            <span className="coleccion-kicker">Catálogo completo</span>
            <h1>{tituloSeccion}</h1>
            <p>Prendas y calzado pensados para combinar estilo y comodidad en cada ocasión.</p>
          </header>
        </Reveal>

        <div className="coleccion-separador" />

        {/* Toolbar unificada: categorías + búsqueda + favoritos en una sola barra */}
        <div className="coleccion-toolbar">
          <div className="coleccion-categorias">
            {CATEGORIAS.map((cat) => (
              <button
                key={cat}
                className={`categoria-chip ${categoriaActiva === cat ? "activo" : ""}`}
                onClick={() => cambiarCategoria(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="coleccion-toolbar-derecha">
            <input
              type="search"
              placeholder="Buscar productos..."
              value={busquedaInput}
              onChange={(e) => setBusquedaInput(e.target.value)}
              className="coleccion-buscador"
            />
            <button
              className={`filtro-favoritos ${soloFavoritos ? "activo" : ""}`}
              onClick={() => setSoloFavoritos(!soloFavoritos)}
            >
              {soloFavoritos ? "Ver todos" : "Ver guardados"}
            </button>
          </div>
        </div>

        <div className="coleccion-resultado-info">
          <span>
            {soloFavoritos
              ? `${productosVisibles.length} guardados`
              : `${productos.length} de ${totalProductos} productos`}
          </span>
          {hayFiltrosActivos && (
            <button className="coleccion-limpiar-chip" onClick={limpiarFiltros}>
              Limpiar filtros ✕
            </button>
          )}
        </div>

        {productosVisibles.length === 0 ? (
          <div className="coleccion-vacio">
            <p>No se encontraron productos con estos filtros.</p>
            {hayFiltrosActivos && (
              <button className="coleccion-limpiar-chip coleccion-limpiar-chip-boton" onClick={limpiarFiltros}>
                Limpiar filtros ✕
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="coleccion-grid">
              {productosVisibles.map((producto, i) => {
                const esFavorito = favoritos.includes(producto.ProductoID);
                const imagenBase = `${IMG_BASE_URL}${producto.Imagen}`;
                const imagenHover = imagenBase.replace(/(\.[a-zA-Z0-9]+)$/, "-hover$1");
                const sinStock = producto.StockActual < 1;

                return (
                  <Reveal key={producto.ProductoID} delay={(i % 4) * 60}>
                    <div className="coleccion-card">
                      <button
                        className={`boton-favorito ${esFavorito ? "activo" : ""}`}
                        onClick={() => toggleFavorito(producto.ProductoID)}
                        aria-label="Guardar en favoritos"
                      >
                        {esFavorito ? "♥" : "♡"}
                      </button>

                      <Link to={`/producto/${producto.ProductoID}`} className="coleccion-imagen-link">
                        <div className="coleccion-imagen-wrap">
                          <img src={imagenBase} alt={producto.Nombre} className="coleccion-imagen coleccion-imagen-base" />
                          <img
                            src={imagenHover}
                            alt=""
                            className="coleccion-imagen coleccion-imagen-hover"
                            onError={(e) => { e.target.style.display = "none"; }}
                          />
                          {sinStock && <span className="coleccion-agotado-overlay">Sin stock</span>}
                        </div>
                      </Link>

                      <Link to={`/producto/${producto.ProductoID}`} className="coleccion-card-titulo-link">
                        <h3>{producto.Nombre}</h3>
                      </Link>
                      <p className="coleccion-descripcion">{producto.Descripcion}</p>
                      <p className="coleccion-precio">${producto.Precio}</p>

                      {producto.Estado === "PocasUnidades" && (
                        <span className="badge-pocas-unidades">Pocas unidades</span>
                      )}

                      <button
                        className="coleccion-agregar-carrito"
                        onClick={() => handleAgregarCarrito(producto.ProductoID)}
                        disabled={sinStock}
                      >
                        {sinStock
                          ? "Sin stock"
                          : mensajeAgregado === producto.ProductoID
                          ? "Agregado ✓"
                          : "Agregar al carrito"}
                      </button>
                    </div>
                  </Reveal>
                );
              })}
            </div>

            {mostrarBotonCargarMas && (
              <div className="coleccion-cargar-mas-wrap">
                <button className="coleccion-cargar-mas" onClick={cargarMas} disabled={cargandoMas}>
                  {cargandoMas ? "Cargando..." : "Cargar más productos"}
                </button>
              </div>
            )}

            {!hayFiltrosActivos && (
              <div className="coleccion-banner-secundario">
                <div className="banner-secundario-wrap">
                  <PlaceholderImage src="/img/banners/banner.jpg" ratio="21 / 7" label="Banner secundario — 1600×540" />
                  <div className="banner-overlay">
                    <span className="banner-kicker">Edición limitada</span>
                    <h2 className="banner-titulo">No te lo pierdas</h2>
                    <p className="banner-subtitulo">Piezas seleccionadas, stock limitado.</p>
                    <button className="banner-cta" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                      Volver arriba
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Coleccion;