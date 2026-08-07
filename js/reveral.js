// Animación al hacer scroll
document.addEventListener("DOMContentLoaded", () => {
  const reveals = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target); // solo una vez
        }
      });
    },
    {
      threshold: 0.2 // se activa cuando el 20% del elemento es visible
    }
  );

  reveals.forEach(el => observer.observe(el));
});


