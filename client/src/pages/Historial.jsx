import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IMG_BASE_URL } from "../services/productService";
import "../assets/css/historial.css";

function Historial() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const datos = localStorage.getItem("virofenix_historial");

    if (datos) {
      setProductos(JSON.parse(datos));
    }
  }, []);

  function borrarHistorial() {
    localStorage.removeItem("virofenix_historial");
    setProductos([]);
  }

  return (
    <main className="historial-container">
      <h1>Historial de productos</h1>

      {productos.length === 0 ? (
        <p>No visitaste ningún producto.</p>
      ) : (
        <>
          <button onClick={borrarHistorial}>Borrar historial</button>

          <div className="historial-grid">
            {productos.map((producto) => (
              <Link
                to={`/producto/${producto.ProductoID}`}
                className="historial-card"
                key={producto.ProductoID}
              >
                <img
                  src={IMG_BASE_URL + producto.Imagen}
                  alt={producto.Nombre}
                />
                <h3>{producto.Nombre}</h3>
                <p>${producto.Precio}</p>
                <small>{producto.FechaVisita}</small>
              </Link>
            ))}
          </div>
        </>
      )}
    </main>
  );
}

export default Historial;