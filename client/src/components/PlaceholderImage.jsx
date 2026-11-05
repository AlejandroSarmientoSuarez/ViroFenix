import "../assets/css/placeholder.css";

function PlaceholderImage({ src, alt = "", ratio = "1 / 1", label = "Imagen" }) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className="placeholder-image"
        style={{ aspectRatio: ratio }}
      />
    );
  }

  return (
    <div className="placeholder-image placeholder-empty" style={{ aspectRatio: ratio }}>
      <span>{label}</span>
    </div>
  );
}

export default PlaceholderImage;