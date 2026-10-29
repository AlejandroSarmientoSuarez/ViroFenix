import { Link } from "react-router-dom";
import "../assets/css/footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <p className="footer-logo">Clothing Brand</p>
          <p>Elegancia y estilo en cada prenda. Diseñamos ropa para destacar tu personalidad.</p>
        </div>

        <div className="footer-col">
          <h4>Navegación</h4>
          <Link to="/">Inicio</Link>
          <Link to="/coleccion">Colección</Link>
          <Link to="/nosotros">Nosotros</Link>
          <Link to="/contacto">Contacto</Link>
        </div>

        <div className="footer-col">
          <h4>Ayuda</h4>
          <Link to="/faq#preguntas">Preguntas frecuentes</Link>
          <Link to="/faq#envios">Envíos</Link>
          <Link to="/faq#devoluciones">Cambios y devoluciones</Link>
          <Link to="/faq#privacidad">Privacidad</Link>
          <Link to="/faq#terminos">Términos y condiciones</Link>
        </div>

        <div className="footer-col">
          <h4>Contacto</h4>
          <span>info@clothingbrand.com</span>
          <span>Buenos Aires, Argentina</span>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Clothing Brand. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;