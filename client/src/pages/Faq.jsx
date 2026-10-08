import { useState } from "react";
import "../assets/css/Faq.css";

const preguntas = [
  {
    pregunta: "¿Cómo puedo realizar una compra?",
    respuesta:
      "Elegí el producto que querés comprar, seleccioná el talle y color, agregalo al carrito y seguí los pasos para completar la compra."
  },
  {
    pregunta: "¿Qué medios de pago aceptan?",
    respuesta:
      "Aceptamos tarjetas de crédito, tarjetas de débito y otros medios de pago disponibles en nuestra tienda."
  },
  {
    pregunta: "¿Qué talles tienen disponibles?",
    respuesta:
      "Los talles disponibles dependen de cada producto. Podés consultar los talles disponibles dentro de la página del producto."
  },
  {
    pregunta: "¿Cómo puedo saber qué talle elegir?",
    respuesta:
      "Cada producto cuenta con una tabla de talles para ayudarte a elegir la medida correcta."
  },
  {
    pregunta: "¿Realizan envíos?",
    respuesta:
      "Sí, realizamos envíos a diferentes zonas. El costo y tiempo de entrega dependen de la ubicación."
  },
  {
    pregunta: "¿Cuánto demora el envío?",
    respuesta:
      "El tiempo de entrega depende de la localidad y del servicio de envío seleccionado."
  },
  {
    pregunta: "¿Cómo puedo consultar el estado de mi pedido?",
    respuesta:
      "Podés consultar el estado de tu pedido desde tu cuenta utilizando el número de pedido."
  },
  {
    pregunta: "¿Puedo cambiar una prenda?",
    respuesta:
      "Sí, podés solicitar un cambio siempre que se cumplan las condiciones establecidas por nuestra tienda."
  },
  {
    pregunta: "¿Puedo devolver una prenda?",
    respuesta:
      "Sí, las devoluciones están disponibles según nuestra política de devolución."
  },
  {
    pregunta: "¿Cómo puedo contactar al soporte?",
    respuesta:
      "Podés comunicarte con nuestro equipo de soporte mediante WhatsApp, correo electrónico o redes sociales."
  }
];

const politicas = [
  {
    titulo: "Calidad de los productos",
    texto:
      "Todos nuestros productos son revisados antes de ser enviados. Nos comprometemos a ofrecer prendas de buena calidad y en excelentes condiciones."
  },
  {
    titulo: "Compras y pagos",
    texto:
      "Para realizar una compra, el cliente debe proporcionar información correcta. Aceptamos tarjetas de crédito, débito y otros medios de pago disponibles en nuestra tienda."
  },
  {
    titulo: "Cambios",
    texto:
      "Los cambios pueden solicitarse siempre que se cumplan las condiciones establecidas por nuestra tienda. La prenda debe encontrarse en buen estado y conservar sus etiquetas."
  },
  {
    titulo: "Devoluciones",
    texto:
      "Las devoluciones pueden realizarse dentro del plazo establecido por la empresa y siempre que el producto cumpla con las condiciones correspondientes."
  },
  {
    titulo: "Envíos",
    texto:
      "Realizamos envíos a diferentes zonas. El costo y el tiempo de entrega dependen de la ubicación del cliente y del servicio de envío seleccionado."
  },
  {
    titulo: "Información del cliente",
    texto:
      "Los datos proporcionados por nuestros clientes serán utilizados para gestionar pedidos, pagos, envíos y comunicaciones relacionadas con la compra."
  },
  {
    titulo: "Atención al cliente",
    texto:
      "Nuestro equipo de soporte está disponible para responder consultas y ayudar a resolver cualquier inconveniente relacionado con los productos o pedidos."
  },
  {
    titulo: "Uso del sitio web",
    texto:
      "Los usuarios deben utilizar nuestro sitio web de manera responsable y proporcionar información verdadera durante el proceso de compra."
  },
  {
    titulo: "Modificaciones",
    texto:
      "La empresa puede modificar estas políticas cuando sea necesario. Las nuevas condiciones serán publicadas en nuestro sitio web."
  }
];

function FAQ() {
  const [abierta, setAbierta] = useState(null);

  const mostrarRespuesta = (index) => {
    if (abierta === index) {
      setAbierta(null);
    } else {
      setAbierta(index);
    }
  };

  return (
    <div className="faq-page">

      <main className="faq-container">

        <h2>Preguntas frecuentes</h2>

        <div className="faq-list">

          {preguntas.map((item, index) => (
            <div
              className={`faq-item ${
                abierta === index ? "faq-abierta" : ""
              }`}
              key={index}
            >

              <button
                className="faq-question"
                onClick={() => mostrarRespuesta(index)}
              >

                <span>{item.pregunta}</span>

                <span
                  className={`faq-arrow ${
                    abierta === index ? "rotar" : ""
                  }`}
                >
                  ›
                </span>

              </button>

              {abierta === index && (
                <div className="faq-answer">
                  <p>{item.respuesta}</p>
                </div>
              )}

            </div>
          ))}

        </div>


        {/* POLÍTICA DE LA EMPRESA */}

        <section className="politica-section">

          <h2>Política de la empresa</h2>

          <div className="politica-list">

            {politicas.map((politica, index) => (
              <div
                className="politica-item"
                key={index}
              >

                <h3>{politica.titulo}</h3>

                <p>{politica.texto}</p>

              </div>
            ))}

          </div>

        </section>

      </main>

    </div>
  );
}

export default FAQ;