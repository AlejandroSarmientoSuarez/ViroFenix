
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { Op } = require("sequelize");
const Usuario = require("../models/Usuario");

// Obtiene todas las cuentas que no fueron eliminadas y devuelve sus datos.
async function listarUsuarios(req, res) {
  try {
    const usuarios = await Usuario.findAll({
      where: { Estado: { [Op.ne]: "Eliminado" } },
      attributes: ["UsuarioID", "Nombre", "Apellido", "Email", "Rol", "Estado"],
      order: [["FechaRegistro", "DESC"]]
    });

    res.json({ status: "ok", data: usuarios });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al obtener las cuentas" });
  }
}

// Actualiza los datos de una cuenta y valida que los cambios sean correctos.
async function actualizarUsuario(req, res) {
  try {
    const usuario = await Usuario.findByPk(req.params.id);

    if (!usuario || usuario.Estado === "Eliminado")
      return res.status(404).json({ status: "error", message: "Cuenta no encontrada" });

    const { nombre, apellido, email, rol, estado } = req.body;
    const propio = Number(req.params.id) === Number(req.usuario.id);

    // Evita que un administrador cambie su propio rol o estado.
    if (propio && ((rol && rol !== usuario.Rol) || (estado && estado !== usuario.Estado)))
      return res.status(400).json({ status: "error", message: "No podés cambiar tu propio rol o estado" });

    if (nombre !== undefined) usuario.Nombre = String(nombre).trim();
    if (apellido !== undefined) usuario.Apellido = String(apellido).trim();

    if ((nombre !== undefined && !usuario.Nombre) || (apellido !== undefined && !usuario.Apellido))
      return res.status(400).json({ status: "error", message: "Nombre y apellido son obligatorios" });

    // Comprueba que el email tenga un formato válido y no esté registrado.
    if (email && email.trim() !== usuario.Email) {
      const nuevoEmail = email.trim();

      if (!nuevoEmail.includes("@") || !nuevoEmail.includes("."))
        return res.status(400).json({ message: "Email inválido" });

      const existe = await Usuario.findOne({ where: { Email: nuevoEmail } });

      if (existe && existe.UsuarioID !== usuario.UsuarioID)
        return res.status(409).json({ message: "Email en uso" });

      usuario.Email = nuevoEmail;
    }

    // Solo permite los roles definidos por el sistema.
    if (rol !== undefined) {
      if (!["Admin", "Cliente"].includes(rol))
        return res.status(400).json({ status: "error", message: "Rol inválido" });

      usuario.Rol = rol;
    }

    // Actualiza el estado y reinicia los intentos fallidos si la cuenta se activa.
   if (estado) {
      if (!["Activo", "Pendiente"].includes(estado))
        return res.status(400).json({ message: "Estado inválido" });

      usuario.Estado = estado;
    }
    await usuario.save();
    res.json({ status: "ok", message: "Cuenta actualizada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Error al actualizar la cuenta" });
  }
}

// Elimina una cuenta de forma lógica, reemplazando sus datos personales y anulando su contraseña.
async function eliminarUsuario(req, res) {
  try {
    const id = req.params.id;

    if (id == req.usuario.id)
      return res.status(400).json({ message: "No podés eliminar tu cuenta" });

    const usuario = await Usuario.findByPk(id);

    if (!usuario || usuario.Estado === "Eliminado")
      return res.status(404).json({ message: "Usuario no encontrado" });

    if (usuario.Rol === "Admin")
      return res.status(400).json({ message: "No se puede eliminar un administrador" });

    usuario.Nombre = "Usuario";
    usuario.Apellido = "Eliminado";
    usuario.Email = "eliminado@gmail.com";
    usuario.Estado = "Eliminado";
    usuario.TokenRecuperacion = null;
    usuario.TokenExpiracion = null;

    await usuario.save();

    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar usuario" });
  }
}
module.exports = { listarUsuarios, actualizarUsuario, eliminarUsuario };
