import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../assets/css/carousel.css";

function Carousel({ slides, intervalo = 5000 }) {
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndice((prev) => (prev + 1) % slides.length);
    }, intervalo);
    return () => clearInterval(timer);
  }, [slides.length, intervalo]);

  return (
    <div className="carousel">
      <div
        className="carousel-track"
        style={{ transform: `translateX(-${indice * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div key={i} className="carousel-slide" style={{ backgroundImage: `url(${slide.src})` }}>
            <div className="carousel-overlay">
              <h2>{slide.titulo}</h2>
              <p>{slide.subtitulo}</p>
              {slide.cta && (
                <Link to={slide.ctaLink || "/coleccion"} className="carousel-cta">
                  {slide.cta}
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="carousel-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`carousel-dot ${i === indice ? "carousel-dot-activo" : ""}`}
            onClick={() => setIndice(i)}
            aria-label={`Ir a slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default Carousel;