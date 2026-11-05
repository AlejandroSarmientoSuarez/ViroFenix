import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "../assets/css/admin-chat.css";

const SERVER_URL = "http://localhost:4000";

function AdminChat() {
  const [socket, setSocket] = useState(null);
  const [chats, setChats] = useState([]);
  const [chatActual, setChatActual] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const conexion = io(SERVER_URL, {
      auth: { token: token }
    });

    setSocket(conexion);

    conexion.on("chat:lista", (lista) => {
      setChats(lista);
    });

    conexion.on("chat:actualizado", (chat) => {
      setChats((actuales) => {
        const existe = actuales.some((item) => item.id === chat.id);

        if (existe) {
          return actuales.map((item) =>
            item.id === chat.id ? chat : item
          );
        }

        return [...actuales, chat];
      });

      setChatActual((actual) => {
        if (actual && actual.id === chat.id) {
          return chat;
        }
        return actual;
      });
    });

    conexion.on("connect", () => setError(""));

    conexion.on("connect_error", () => {
      setError("No se pudo conectar al servidor.");
    });

    return () => conexion.disconnect();
  }, []);

  function responder(event) {
    event.preventDefault();

    if (mensaje.trim() === "" || !chatActual || !socket) {
      return;
    }

    socket.emit("admin:responder", {
      chatId: chatActual.id,
      mensaje: mensaje
    });

    setMensaje("");
  }

  return (
    <main className="admin-chat-container">
      <h1>Soporte - Chats de clientes</h1>

      {error && <p className="admin-chat-error">{error}</p>}

      <div className="admin-chat-layout">
        <aside className="admin-chat-lista">
          <h2>Clientes</h2>

          {chats.length === 0 && <p>No hay chats por ahora.</p>}

          {chats.map((chat) => (
            <button
              key={chat.id}
              type="button"
              onClick={() => setChatActual(chat)}
              className={
                chatActual && chatActual.id === chat.id
                  ? "admin-chat-cliente seleccionado"
                  : "admin-chat-cliente"
              }
            >
              <strong>{chat.nombre}</strong>
              <small>{chat.mensajes.length} mensajes</small>
            </button>
          ))}
        </aside>

        <section className="admin-chat-conversacion">
          {!chatActual ? (
            <p>Elegí un cliente para ver sus mensajes.</p>
          ) : (
            <>
              <h2>{chatActual.nombre}</h2>

              <div className="admin-chat-mensajes">
                {chatActual.mensajes.map((item, index) => (
                  <div
                    key={index}
                    className={
                      item.autor === "admin"
                        ? "admin-chat-mensaje admin-chat-mio"
                        : "admin-chat-mensaje"
                    }
                  >
                    <strong>
                      {item.autor === "admin" ? "Vos" : "Cliente"}
                    </strong>

                    <p>{item.texto}</p>
                    <small>{item.hora}</small>
                  </div>
                ))}
              </div>

              <form
                className="admin-chat-formulario"
                onSubmit={responder}
              >
                <input
                  value={mensaje}
                  onChange={(event) => setMensaje(event.target.value)}
                  placeholder="Escribí una respuesta..."
                />

                <button type="submit">Responder</button>
              </form>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

export default AdminChat;