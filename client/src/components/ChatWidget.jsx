import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";
import "../assets/css/chat-widget.css";

const SERVER_URL = "http://localhost:4000";

function ChatWidget() {
  const { usuario } = useAuth();

  const [abierto, setAbierto] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [mensajes, setMensajes] = useState([]);
  const [socket, setSocket] = useState(null);
  const [conectado, setConectado] = useState(false);

  useEffect(() => {
    if (usuario?.rol === "Admin") return;

    let chatId = sessionStorage.getItem("virofenix_chat_id");

    if (!chatId) {
      chatId = "chat-" + Date.now();
      sessionStorage.setItem("virofenix_chat_id", chatId);
    }

    const conexion = io(SERVER_URL);
    setSocket(conexion);

    conexion.on("connect", () => {
      setConectado(true);

      conexion.emit("cliente:entrar", {
        chatId: chatId,
        nombre: usuario ? usuario.nombre : "Cliente"
      });
    });

    conexion.on("disconnect", () => {
      setConectado(false);
    });

    conexion.on("chat:historial", (lista) => {
      setMensajes(lista);
    });

    conexion.on("chat:mensaje", (nuevo) => {
      setMensajes((actuales) => [...actuales, nuevo]);
    });

    return () => conexion.disconnect();
  }, [usuario]);

  function enviarMensaje(event) {
    event.preventDefault();

    if (!mensaje.trim() || !conectado) return;

    socket.emit("cliente:mensaje", {
      chatId: sessionStorage.getItem("virofenix_chat_id"),
      mensaje: mensaje
    });

    setMensaje("");
  }

  if (usuario?.rol === "Admin") return null;

  return (
    <div className="chat-widget">
      {abierto && (
        <div className="chat-ventana">
          <div className="chat-cabecera">
            <strong>Atención al cliente</strong>

            <button onClick={() => setAbierto(false)}>×</button>

            <small>
              {conectado ? "Conectado" : "Conectando..."}
            </small>
          </div>

          <div className="chat-mensajes">
            {mensajes.length === 0 && (
              <p>Hola. Escribinos y un administrador te responderá.</p>
            )}

            {mensajes.map((item, index) => (
              <div
                key={index}
                className={
                  item.autor === "cliente"
                    ? "chat-mensaje chat-mio"
                    : "chat-mensaje chat-otro"
                }
              >
                <p>{item.texto}</p>
                <small>{item.hora}</small>
              </div>
            ))}
          </div>

          <form onSubmit={enviarMensaje} className="chat-formulario">
            <input
              value={mensaje}
              onChange={(event) => setMensaje(event.target.value)}
              placeholder="Escribí tu mensaje..."
            />

            <button type="submit" disabled={!conectado}>
              Enviar
            </button>
          </form>
        </div>
      )}

      <button
        className="chat-boton"
        onClick={() => setAbierto(!abierto)}
      >
        {abierto ? "Cerrar chat" : "Soporte"}
      </button>
    </div>
  );
}

export default ChatWidget;