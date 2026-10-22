const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { Op } = require("sequelize");
const Usuario = require("../models/Usuario");

async function listarUsuarios(req, res) {
  try {
    const where = {};
    const estado = req.query.estado;
    const buscar = String(req.query.buscar || "").trim();

    if (["Activo", "Bloqueado", "Pendiente", "Eliminado"].includes(estado)) {
      where.Estado = estado;
    } else {
      where.Estado = { [Op.ne]: "Eliminado" };
    }

    if (buscar) {
      where[Op.or] = [
        { Nombre: { [Op.like]: `%${buscar}%` } },
        { Apellido: { [Op.like]: `%${buscar}%` } },
        { Email: { [Op.like]: `%${buscar}%` } },
      ];
    }

    const usuarios = await Usuario.findAll({
      where,
      attributes: ["UsuarioID", "Nombre", "Apellido", "Email", "Rol", "Estado", "UltimoAcceso", "FechaRegistro"],
      order: [["FechaRegistro", "DESC"]],
    });
    return res.json({ status: "ok", data: usuarios });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "error", message: "Error al obtener las cuentas" });
  }
}

async function actualizarUsuario(req, res) {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ status: "error", message: "Cuenta no encontrada" });
    if (usuario.Estado === "Eliminado") return res.status(400).json({ status: "error", message: "La cuenta fue eliminada" });

    const { nombre, apellido, email, rol, estado } = req.body;
    if (Number(req.params.id) === Number(req.usuario.id) &&
        ((rol && rol !== usuario.Rol) || (estado && estado !== usuario.Estado))) {
      return res.status(400).json({ status: "error", message: "No podés cambiar tu propio rol o estado" });
    }

    if (nombre !== undefined) {
      if (!String(nombre).trim()) return res.status(400).json({ status: "error", message: "El nombre es obligatorio" });
      usuario.Nombre = String(nombre).trim();
    }
    if (apellido !== undefined) {
      if (!String(apellido).trim()) return res.status(400).json({ status: "error", message: "El apellido es obligatorio" });
      usuario.Apellido = String(apellido).trim();
    }
    if (email !== undefined && String(email).trim() !== usuario.Email) {
      const nuevoEmail = String(email).trim();
      if (!/^\S+@\S+\.\S+$/.test(nuevoEmail)) return res.status(400).json({ status: "error", message: "El email no es válido" });
      const repetido = await Usuario.findOne({ where: { Email: nuevoEmail, UsuarioID: { [Op.ne]: usuario.UsuarioID } } });
      if (repetido) return res.status(409).json({ status: "error", message: "Ese email ya está en uso" });
      usuario.Email = nuevoEmail;
    }
    if (rol !== undefined) {
      if (!["Admin", "Cliente"].includes(rol)) return res.status(400).json({ status: "error", message: "Rol inválido" });
      usuario.Rol = rol;
    }
    if (estado !== undefined) {
      if (!["Activo", "Bloqueado", "Pendiente"].includes(estado)) return res.status(400).json({ status: "error", message: "Estado inválido" });
      usuario.Estado = estado;
      if (estado === "Activo") {
        usuario.IntentosFallidos = 0;
        usuario.UltimoIntento = null;
        usuario.BloqueadoHasta = null;
      }
      if (estado === "Bloqueado") usuario.BloqueadoHasta = new Date("2999-12-31T23:59:59Z");
    }

    await usuario.save();
    return res.json({ status: "ok", message: "Cuenta actualizada correctamente", data: {
      id: usuario.UsuarioID, nombre: usuario.Nombre, apellido: usuario.Apellido,
      email: usuario.Email, rol: usuario.Rol, estado: usuario.Estado,
    } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "error", message: "Error al actualizar la cuenta" });
  }
}

async function eliminarUsuario(req, res) {
  try {
    const id = Number(req.params.id);
    if (id === Number(req.usuario.id)) return res.status(400).json({ status: "error", message: "No podés eliminar tu propia cuenta" });

    const usuario = await Usuario.findByPk(id);
    if (!usuario) return res.status(404).json({ status: "error", message: "Cuenta no encontrada" });
    if (usuario.Estado === "Eliminado") return res.status(400).json({ status: "error", message: "La cuenta ya fue eliminada" });
    if (usuario.Rol === "Admin") return res.status(400).json({ status: "error", message: "No se puede eliminar una cuenta administradora" });

    usuario.Nombre = "Usuario";
    usuario.Apellido = "Eliminado";
    usuario.Email = `eliminado_${usuario.UsuarioID}_${Date.now()}@baja.local`;
    usuario.PasswordHash = await bcrypt.hash(crypto.randomBytes(16).toString("hex"), 10);
    usuario.Estado = "Eliminado";
    usuario.TokenRecuperacion = null;
    usuario.TokenExpiracion = null;
    await usuario.save();
    return res.json({ status: "ok", message: "Cuenta eliminada correctamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "error", message: "Error al eliminar la cuenta" });
  }
}

module.exports = { listarUsuarios, actualizarUsuario, eliminarUsuario };
