import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Reveal from "../components/Reveal";
import "../assets/css/faq.css";

const PREGUNTAS = [
  {
    categoria: "Pedidos y envíos",
    items: [
      {
        p: "¿Cuánto tarda en llegar mi pedido?",
        r: "Los pedidos se preparan en 24 a 48 horas hábiles. Una vez despachado, el envío demora entre 3 y 7 días hábiles según tu zona.",
      },
      {
        p: "¿Cómo puedo ver el estado de mi pedido?",
        r: "Iniciá sesión y entrá a la sección “Mis pedidos”. Ahí vas a ver el estado (Pendiente, Pagado, Enviado o Entregado), la fecha, la hora y la dirección de envío.",
      },
      {
        p: "¿Puedo cambiar la dirección de entrega después de comprar?",
        r: "Sí, siempre que el pedido todavía esté en estado Pendiente. Escribinos desde la sección de Contacto indicando tu número de pedido.",
      },
      {
        p: "¿Hacen envíos a todo el país?",
        r: "Sí, enviamos a todo el país. El costo y el tiempo de entrega pueden variar según la localidad.",
      },
    ],
  },
  {
    categoria: "Pagos",
    items: [
      {
        p: "¿Qué medios de pago aceptan?",
        r: "Aceptamos tarjetas de crédito y débito. Los datos de la tarjeta se usan solo para validar el pago y no se almacenan en nuestros servidores.",
      },
      {
        p: "¿Es seguro comprar en el sitio?",
        r: "Sí. Tu contraseña se guarda cifrada y las sesiones están protegidas con tokens. Nunca guardamos el número completo ni el código de seguridad de tu tarjeta.",
      },
      {
        p: "¿Recibo un comprobante de mi compra?",
        r: "Sí. Al finalizar la compra se muestra un recibo con fecha, hora, productos y dirección de envío, y el pedido queda guardado en “Mis pedidos”.",
      },
    ],
  },
  {
    categoria: "Cambios y devoluciones",
    items: [
      {
        p: "¿Puedo cambiar o devolver una prenda?",
        r: "Sí, tenés 30 días desde la recepción del pedido. La prenda debe estar sin uso, con sus etiquetas y en su empaque original.",
      },
      {
        p: "¿Quién paga el envío de un cambio?",
        r: "Si el cambio es por un error nuestro o por un producto con falla, el envío corre por nuestra cuenta. En otros casos, el costo lo cubre el cliente.",
      },
      {
        p: "¿Cuándo me devuelven el dinero?",
        r: "Una vez recibida y revisada la prenda, el reembolso se procesa en un plazo de 5 a 10 días hábiles por el mismo medio de pago.",
      },
    ],
  },
  {
    categoria: "Cuenta y productos",
    items: [
      {
        p: "¿Necesito una cuenta para comprar?",
        r: "Sí. Con tu cuenta podés usar el carrito, guardar favoritos y consultar tus pedidos. Registrarte es gratis y toma menos de un minuto.",
      },
      {
        p: "Olvidé mi contraseña, ¿qué hago?",
        r: "En la pantalla de inicio de sesión elegí la opción de recuperar contraseña. Te enviaremos un enlace para crear una nueva.",
      },
      {
        p: "¿Cómo sé qué talle elegir?",
        r: "Cada producto indica sus características en la página de detalle. Si tenés dudas, escribinos desde Contacto y te asesoramos.",
      },
      {
        p: "¿Qué significa “Pocas unidades”?",
        r: "Que quedan muy pocas prendas en stock de ese producto. Cuando se agota, aparece como “Sin stock”.",
      },
    ],
  },
];

const POLITICAS = [
  {
    id: "envios",
    titulo: "Política de envíos",
    parrafos: [
      "Realizamos envíos a todo el país. Los pedidos se despachan dentro de las 24 a 48 horas hábiles posteriores a la confirmación de la compra.",
      "El plazo de entrega estimado es de 3 a 7 días hábiles. Este plazo puede extenderse por causas ajenas a nosotros, como demoras del correo o fechas especiales.",
      "Es responsabilidad del cliente ingresar una dirección correcta y completa. Si el paquete no puede entregarse por datos erróneos, podremos cobrar un nuevo envío.",
    ],
  },
  {
    id: "devoluciones",
    titulo: "Política de cambios y devoluciones",
    parrafos: [
      "Podés solicitar un cambio o devolución dentro de los 30 días corridos desde que recibís tu pedido.",
      "Las prendas deben estar sin uso, sin lavar, con todas sus etiquetas y en su empaque original. No se aceptan cambios de productos de edición limitada marcados como tales.",
      "Para iniciar el trámite, escribinos desde la sección de Contacto con tu número de pedido. El reembolso se realiza por el mismo medio de pago utilizado en la compra.",
    ],
  },
  {
    id: "privacidad",
    titulo: "Política de privacidad",
    parrafos: [
      "Recopilamos solo los datos necesarios para gestionar tu cuenta y tus pedidos: nombre, email, dirección de envío e historial de compras.",
      "No almacenamos el número completo de tu tarjeta ni su código de seguridad. Tu contraseña se guarda cifrada.",
      "No vendemos ni compartimos tus datos personales con terceros con fines comerciales. Podés solicitar la modificación o eliminación de tus datos escribiéndonos desde Contacto.",
    ],
  },
  {
    id: "terminos",
    titulo: "Términos y condiciones",
    parrafos: [
      "Al registrarte y comprar en nuestro sitio aceptás estos términos. Los precios y la disponibilidad de los productos pueden cambiar sin previo aviso.",
      "Nos reservamos el derecho de cancelar pedidos ante errores evidentes de precio o falta de stock, reembolsando el importe abonado.",
      "Las imágenes de los productos son ilustrativas; pueden existir pequeñas variaciones de color según la pantalla de cada dispositivo.",
    ],
  },
];

const ENLACES_RAPIDOS = [
  { to: "#preguntas", label: "Preguntas frecuentes" },
  { to: "#envios", label: "Envíos" },
  { to: "#devoluciones", label: "Devoluciones" },
  { to: "#privacidad", label: "Privacidad" },
  { to: "#terminos", label: "Términos" },
];

function Faq() {
  const [abierto, setAbierto] = useState(null);
  const { hash } = useLocation();

  // Scroll a la sección cuando la URL trae un #ancla (ej: /faq#devoluciones)
  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0 });
      return;
    }
    const el = document.getElementById(hash.slice(1));
    if (el) {
      setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    }
  }, [hash]);

  function toggle(clave) {
    setAbierto(abierto === clave ? null : clave);
  }

  return (
    <div className="faq-container">
      <Reveal>
        <header className="faq-header">
          <span className="faq-kicker">Centro de ayuda</span>
          <h1>Preguntas frecuentes y políticas</h1>
          <p>Todo lo que necesitás saber sobre tus compras, envíos y cambios.</p>
        </header>
      </Reveal>

      <nav className="faq-chips" aria-label="Secciones">
        {ENLACES_RAPIDOS.map((enlace) => (
          <Link key={enlace.to} to={enlace.to} className="faq-chip">
            {enlace.label}
          </Link>
        ))}
      </nav>

      <section id="preguntas" className="faq-seccion">
        <h2 className="faq-titulo-seccion">Preguntas frecuentes</h2>

        {PREGUNTAS.map((grupo, gi) => (
          <div key={grupo.categoria} className="faq-grupo">
            <h3 className="faq-categoria">{grupo.categoria}</h3>
            {grupo.items.map((item, ii) => {
              const clave = `${gi}-${ii}`;
              const estaAbierto = abierto === clave;
              return (
                <div key={clave} className={`faq-item ${estaAbierto ? "abierto" : ""}`}>
                  <button
                    className="faq-pregunta"
                    onClick={() => toggle(clave)}
                    aria-expanded={estaAbierto}
                  >
                    <span>{item.p}</span>
                    <span className="faq-icono" aria-hidden="true">+</span>
                  </button>
                  <div className="faq-respuesta-wrap">
                    <div className="faq-respuesta">
                      <p>{item.r}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </section>

      <section className="faq-seccion">
        <h2 className="faq-titulo-seccion">Políticas de la empresa</h2>
        <p className="faq-actualizacion">Última actualización: octubre de 2026</p>

        {POLITICAS.map((pol) => (
          <article key={pol.id} id={pol.id} className="faq-politica">
            <h3>{pol.titulo}</h3>
            {pol.parrafos.map((texto, i) => (
              <p key={i}>{texto}</p>
            ))}
          </article>
        ))}
      </section>

      <div className="faq-contacto">
        <h2>¿No encontraste lo que buscabas?</h2>
        <p>Escribinos y te respondemos a la brevedad.</p>
        <Link to="/contacto" className="faq-contacto-boton">Ir a contacto</Link>
      </div>
    </div>
  );
}

export default Faq;