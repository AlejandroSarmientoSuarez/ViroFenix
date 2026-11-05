
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");

const chats = {};

function prepararChat(io) {

  // Comprobar si el usuario es administrador
  io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
      socket.esAdmin = false;
      return next();
    }

    try {
      const datos = jwt.verify(token, process.env.JWT_SECRET);
      const usuario = await Usuario.findByPk(datos.id);

      if (usuario && usuario.Rol === "Admin" && usuario.Estado === "Activo") {
        socket.esAdmin = true;
        return next();
      }

      next(new Error("No tenés permiso"));
    } catch (error) {
      next(new Error("Sesión inválida"));
    }
  });

  // Cuando un usuario se conecta
  io.on("connection", (socket) => {

    // Si es administrador, recibe la lista de chats
    if (socket.esAdmin) {
      socket.join("administradores");
      socket.emit("chat:lista", Object.values(chats));
    }

    // El cliente entra al chat
    socket.on("cliente:entrar", (datos) => {
      if (socket.esAdmin || !datos.chatId) return;

      const id = datos.chatId;

      if (!chats[id]) {
        chats[id] = {
          id,
          nombre: datos.nombre || "Cliente",
          socketId: socket.id,
          mensajes: []
        };
      }

      const chat = chats[id];

      chat.socketId = socket.id;
      socket.join(id);
      socket.emit("chat:historial", chat.mensajes);

      io.to("administradores").emit("chat:actualizado", chat);
    });

    // El cliente envia un mensaje
    socket.on("cliente:mensaje", (datos) => {
      const chat = chats[datos.chatId];

      if (!chat || chat.socketId !== socket.id) return;

      const texto = datos.mensaje.trim();

      if (!texto) return;

      const mensaje = {
        autor: "cliente",
        texto,
        hora: new Date().toLocaleTimeString()
      };

      chat.mensajes.push(mensaje);

      io.to("administradores").emit("chat:actualizado", chat);
      socket.emit("chat:mensaje", mensaje);
    });

    // El administrador responde
    socket.on("admin:responder", (datos) => {
      if (!socket.esAdmin) return;

      const chat = chats[datos.chatId];

      if (!chat) return;

      const texto = datos.mensaje.trim();

      if (!texto) return;

      const mensaje = {
        autor: "admin",
        texto,
        hora: new Date().toLocaleTimeString()
      };

      chat.mensajes.push(mensaje);

      io.to(chat.id).emit("chat:mensaje", mensaje);
      io.to("administradores").emit("chat:actualizado", chat);
    });

  });
}

module.exports = prepararChat;
