
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
    if (email !== undefined && email.trim() !== usuario.Email) {
      const nuevoEmail = email.trim();

      if (!/^\S+@\S+\.\S+$/.test(nuevoEmail))
        return res.status(400).json({ status: "error", message: "Email inválido" });

      if (await Usuario.findOne({ where: { Email: nuevoEmail, UsuarioID: { [Op.ne]: usuario.UsuarioID } } }))
        return res.status(409).json({ status: "error", message: "Email en uso" });

      usuario.Email = nuevoEmail;
    }

    // Solo permite los roles definidos por el sistema.
    if (rol !== undefined) {
      if (!["Admin", "Cliente"].includes(rol))
        return res.status(400).json({ status: "error", message: "Rol inválido" });

      usuario.Rol = rol;
    }

    // Actualiza el estado y reinicia los intentos fallidos si la cuenta se activa.
    if (estado !== undefined) {
      if (!["Activo", "Bloqueado", "Pendiente"].includes(estado))
        return res.status(400).json({ status: "error", message: "Estado inválido" });

      usuario.Estado = estado;

      if (estado === "Activo") {
        usuario.IntentosFallidos = 0;
        usuario.UltimoIntento = null;
        usuario.BloqueadoHasta = null;
      }

      if (estado === "Bloqueado")
        usuario.BloqueadoHasta = new Date("2999-12-31T23:59:59Z");
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
    const id = Number(req.params.id);

    if (id === Number(req.usuario.id))
      return res.status(400).json({ status: "error", message: "No podés eliminar tu propia cuenta" });

    const usuario = await Usuario.findByPk(id);

    if (!usuario || usuario.Estado === "Eliminado")
      return res.status(404).json({ status: "error", message: "Cuenta no encontrada" });

    if (usuario.Rol === "Admin")
      return res.status(400).json({ status: "error", message: "No se puede eliminar una cuenta administradora" });

    // Reemplaza los datos de la cuenta para evitar conservar los datos personales originales.
    Object.assign(usuario, {
      Nombre: "Usuario",
      Apellido: "Eliminado",
      Email: `eliminado_${id}_${Date.now()}@baja.local`,
      PasswordHash: await bcrypt.hash(crypto.randomBytes(16).toString("hex"), 10),
      Estado: "Eliminado",
      TokenRecuperacion: null,
      TokenExpiracion: null
    });

    await usuario.save();
    res.json({ status: "ok", message: "Cuenta eliminada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Error al eliminar la cuenta" });
  }
}

module.exports = { listarUsuarios, actualizarUsuario, eliminarUsuario };
