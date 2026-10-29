import { Link } from "react-router-dom";
import "../assets/css/notfound.css";

function NotFound() {
  return (
    <div className="notfound-container">
      <p className="notfound-code">404</p>
      <h1>Esta página no existe</h1>
      <p>Puede que el link esté roto o que la página se haya movido.</p>
      <Link to="/" className="notfound-link">Volver al inicio</Link>
    </div>
  );
}

export default NotFound;