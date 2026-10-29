import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../assets/css/carousel.css";

function Carousel({ slides }) {
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndice((indice + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [indice, slides.length]);

  return (
    <div className="carousel">
      <div
        className="carousel-track"
        style={{ transform: `translateX(-${indice * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            className="carousel-slide"
            style={{ backgroundImage: `url(${slide.src})` }}
          >
            <div className="carousel-overlay">
              <h2>{slide.titulo}</h2>
              <p>{slide.subtitulo}</p>

              {slide.cta && (
                <Link to={slide.ctaLink || "/coleccion"}>
                  {slide.cta}
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Carousel;