import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { obtenerProductoPorId, IMG_BASE_URL } from "../services/productService";
import { agregarAlCarrito } from "../services/cartService";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { obtenerResenas, crearResena } from "../services/resenaService";
import "../assets/css/producto-detalle.css";

function ProductoDetalle() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const [resenas, setResenas] = useState([]);
  const [resumenResenas, setResumenResenas] = useState({ total: 0, promedio: 0 });
  const [calificacion, setCalificacion] = useState(0);
  const [estrellaHover, setEstrellaHover] = useState(0);
  const [comentario, setComentario] = useState("");
  const [enviandoResena, setEnviandoResena] = useState(false);
  const [errorResena, setErrorResena] = useState("");
  const [mensajeResena, setMensajeResena] = useState("");
  const [yaReseno, setYaReseno] = useState(false);
  const { usuario } = useAuth();
  const { refrescarCarrito } = useCart();
  const navigate = useNavigate();

  async function cargarResenas(productoId) {
    try {
      const respuesta = await obtenerResenas(productoId);
      setResenas(respuesta.data || []);
      setResumenResenas(respuesta.resumen || { total: 0, promedio: 0 });
      if (usuario?.id) {
        setYaReseno((respuesta.data || []).some((resena) => Number(resena.UsuarioID) === Number(usuario.id)));
      }
    } catch (error) {
      console.error("No se pudieron cargar las reseñas:", error);
    }
  }

  useEffect(() => {
    async function cargarProducto() {
      try {
        const respuesta = await obtenerProductoPorId(id);
        const datos = respuesta.data;
        setProducto(datos);
        // Recuperamos el borrador si el cliente tuvo que iniciar sesión para publicar.
        try {
          const borrador = sessionStorage.getItem(`virofenix_resena_${datos.ProductoID}`);
          if (borrador) {
            const datosBorrador = JSON.parse(borrador);
            setCalificacion(Number(datosBorrador.calificacion) || 0);
            setComentario(typeof datosBorrador.comentario === "string" ? datosBorrador.comentario : "");
          }
        } catch { /* Ignorar borradores dañados */ }
        await cargarResenas(datos.ProductoID);

        // Guardamos los últimos 20 productos visitados en el navegador.
        const historialGuardado = localStorage.getItem("virofenix_historial");
        let historial = [];
        try {
          historial = historialGuardado ? JSON.parse(historialGuardado) : [];
        } catch {
          historial = [];
        }

        const productoVisitado = {
          ProductoID: datos.ProductoID,
          Nombre: datos.Nombre,
          Precio: datos.Precio,
          Imagen: datos.Imagen,
          FechaVisita: new Date().toLocaleString("es-AR")
        };

        historial = historial.filter((item) => item.ProductoID !== datos.ProductoID);
        historial.unshift(productoVisitado);
        localStorage.setItem("virofenix_historial", JSON.stringify(historial.slice(0, 20)));
      } catch (err) {
        console.error(err);
      } finally {
        setCargando(false);
      }
    }
    cargarProducto();
  }, [id]);

  async function handleAgregar() {
    if (!usuario) {
      navigate("/login");
      return;
    }
    try {
      await agregarAlCarrito(producto.ProductoID, cantidad);
      await refrescarCarrito();
      setMensaje("Agregado al carrito");
      setTimeout(() => setMensaje(""), 2000);
    } catch (err) {
      console.error(err);
    }
  }

  if (cargando) return <p className="producto-detalle-loading">Cargando...</p>;
  if (!producto) return <p className="producto-detalle-loading">Producto no encontrado.</p>;

  return (
    <div className="producto-detalle-container">
      <div className="producto-detalle-imagen-wrap">
        <img
          src={`${IMG_BASE_URL}${producto.Imagen}`}
          alt={producto.Nombre}
          className="producto-detalle-imagen"
        />
      </div>

      <div className="producto-detalle-info">
        <h1>{producto.Nombre}</h1>
        <p className="producto-detalle-precio">${producto.Precio}</p>
        <p className="producto-detalle-descripcion">{producto.Descripcion}</p>

        {producto.Estado === "PocasUnidades" && (
          <span className="badge-pocas-unidades">Pocas unidades</span>
        )}
        {producto.Estado === "Agotado" && (
          <span className="producto-detalle-agotado">Sin stock</span>
        )}

        {producto.Estado !== "Agotado" && (
          <>
            <div className="producto-detalle-cantidad">
              <button onClick={() => setCantidad(Math.max(1, cantidad - 1))}>−</button>
              <span>{cantidad}</span>
              <button
                onClick={() => setCantidad(Math.min(producto.StockActual, cantidad + 1))}
                disabled={cantidad >= producto.StockActual}
              >
                +
              </button>
            </div>

            <button className="producto-detalle-agregar" onClick={handleAgregar}>
              Agregar al carrito
            </button>
          </>
        )}

        {mensaje && <p className="success-message">{mensaje}</p>}
      </div>

      <section className="resenas-seccion" aria-labelledby="resenas-titulo">
        <div className="resenas-encabezado">
          <div>
            <span className="resenas-eyebrow">OPINIONES DE CLIENTES</span>
            <h2 id="resenas-titulo">Reseñas del producto</h2>
          </div>
          <div className="resenas-promedio">
            <strong>{resumenResenas.promedio ? resumenResenas.promedio.toFixed(1) : "—"}</strong>
            <div className="resenas-estrellas-resumen" aria-label={`${resumenResenas.promedio} de 5 estrellas`}>
              {[1, 2, 3, 4, 5].map((estrella) => (
                <span key={estrella} className={estrella <= Math.round(resumenResenas.promedio) ? "estrella activa" : "estrella"}>★</span>
              ))}
            </div>
            <span>{resumenResenas.total} {resumenResenas.total === 1 ? "reseña" : "reseñas"}</span>
          </div>
        </div>

        {yaReseno ? (
          <p className="resenas-nota">Ya compartiste tu opinión sobre este producto. ¡Gracias!</p>
        ) : (
          <form className="resenas-formulario" onSubmit={async (e) => {
            e.preventDefault();
            setErrorResena("");
            setMensajeResena("");
            if (!calificacion) {
              setErrorResena("Elegí una calificación: tocá una de las cinco estrellas grandes.");
              return;
            }
            if (!comentario.trim() || comentario.trim().length < 2) {
              setErrorResena("Escribí un comentario de al menos 2 caracteres.");
              return;
            }
            if (!usuario) {
              sessionStorage.setItem(`virofenix_resena_${producto.ProductoID}`, JSON.stringify({ calificacion, comentario }));
              navigate("/login", { state: { from: `/producto/${id}` } });
              return;
            }
            setEnviandoResena(true);
            try {
              const respuesta = await crearResena(producto.ProductoID, { calificacion, comentario });
              setResenas((actuales) => [respuesta.data, ...actuales]);
              setResumenResenas((actual) => {
                const total = actual.total + 1;
                return { total, promedio: Math.round((((actual.promedio * actual.total) + calificacion) / total) * 10) / 10 };
              });
              setComentario("");
              setCalificacion(0);
              setEstrellaHover(0);
              sessionStorage.removeItem(`virofenix_resena_${producto.ProductoID}`);
              setYaReseno(true);
              setMensajeResena("¡Gracias por compartir tu opinión!");
            } catch (error) {
              setErrorResena(error.response?.data?.mensaje || "No se pudo guardar la reseña. Verificá que el servidor y la base de datos estén activos e intentá nuevamente.");
            } finally {
              setEnviandoResena(false);
            }
          }}>
            <h3>{usuario ? "Dejá tu reseña" : "¿Qué te pareció este producto?"}</h3>
            <label className="resenas-label">Tu calificación</label>
            <div className="resenas-selector-estrellas" role="radiogroup" aria-label="Calificación de 1 a 5 estrellas" onMouseLeave={() => setEstrellaHover(0)}>
              {[1, 2, 3, 4, 5].map((estrella) => (
                <button key={estrella} type="button" role="radio" aria-checked={calificacion === estrella}
                  aria-label={`${estrella} ${estrella === 1 ? "estrella" : "estrellas"}`}
                  className={`resena-estrella-boton ${(estrella <= (estrellaHover || calificacion)) ? "activa" : ""}`}
                  onMouseEnter={() => setEstrellaHover(estrella)}
                  onFocus={() => setEstrellaHover(estrella)}
                  onBlur={() => setEstrellaHover(0)}
                  onClick={() => { setCalificacion(estrella); setErrorResena(""); }}>
                  ★
                </button>
              ))}
              <span className="resenas-calificacion-texto">{calificacion ? `${calificacion} de 5 estrellas` : "Tocá una estrella para calificar"}</span>
            </div>
            <label className="resenas-label" htmlFor="resena-comentario">Tu comentario</label>
            <textarea id="resena-comentario" value={comentario} onChange={(e) => setComentario(e.target.value)}
              placeholder="Contales a otros clientes qué te pareció el producto..." minLength={2} maxLength={2000} required />
            <div className="resenas-formulario-pie">
              <small>{comentario.length}/2000 caracteres</small>
              <button type="submit" disabled={enviandoResena}>{enviandoResena ? "Publicando..." : usuario ? "Publicar reseña" : "Iniciar sesión y publicar"}</button>
            </div>
            {!usuario && <p className="resenas-ayuda-login">Podés elegir tus estrellas y escribir el comentario ahora. Para guardarlo en la base de datos, primero necesitás iniciar sesión; tu borrador se conservará.</p>}
            {errorResena && <p className="resenas-error" role="alert">{errorResena}</p>}
            {mensajeResena && <p className="resenas-exito" role="status">{mensajeResena}</p>}
          </form>
        )}

        <div className="resenas-lista">
          {resenas.length ? resenas.map((resena) => (
            <article className="resena-item" key={resena.ResenaID}>
              <div className="resena-item-cabecera">
                <div>
                  <strong>{resena.NombreUsuario}</strong>
                  <div className="resena-estrellas" aria-label={`${resena.Calificacion} de 5 estrellas`}>
                    {[1, 2, 3, 4, 5].map((estrella) => (
                      <span key={estrella} className={estrella <= resena.Calificacion ? "estrella activa" : "estrella"}>★</span>
                    ))}
                  </div>
                </div>
                <time dateTime={resena.FechaCreacion}>{resena.FechaCreacion ? new Date(resena.FechaCreacion).toLocaleDateString("es-AR") : ""}</time>
              </div>
              <p>{resena.Comentario}</p>
            </article>
          )) : <p className="resenas-vacias">Todavía no hay reseñas. ¡Sé el primero en opinar!</p>}
        </div>
      </section>
    </div>
  );
}

export default ProductoDetalle;