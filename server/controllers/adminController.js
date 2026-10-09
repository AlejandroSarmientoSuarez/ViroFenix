const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { Op } = require("sequelize");
const Usuario = require("../models/Usuario");

const ROLES = ["Admin", "Cliente"];
const ESTADOS_EDITABLES = ["Activo", "Bloqueado", "Pendiente"];
const ESTADOS_FILTRO = ["Activo", "Bloqueado", "Pendiente", "Eliminado"];
const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

// Tu login bloquea solo si BloqueadoHasta está en el futuro,
// así que un bloqueo manual necesita una fecha muy lejana
const BLOQUEO_INDEFINIDO = new Date("2999-12-31T23:59:59Z");

async function listarUsuarios(req, res) {
  try {
    const buscar = String(req.query.buscar || "").trim();
    const estado = ESTADOS_FILTRO.includes(req.query.estado) ? req.query.estado : "";

    const where = {
      // Sin filtro de estado, las cuentas eliminadas no se listan
      Estado: estado ? estado : { [Op.ne]: "Eliminado" },
    };

    if (buscar) {
      const like = `%${buscar}%`;
      where[Op.or] = [
        { Nombre: { [Op.like]: like } },
        { Apellido: { [Op.like]: like } },
        { Email: { [Op.like]: like } },
      ];
    }

    const usuarios = await Usuario.findAll({
      where,
      attributes: ["UsuarioID", "Nombre", "Apellido", "Email", "Rol", "Estado", "UltimoAcceso", "FechaRegistro"],
      order: [["FechaRegistro", "DESC"]],
    });

    return res.status(200).json({ status: "ok", data: usuarios });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "error", message: "Error al obtener las cuentas" });
  }
}

async function actualizarUsuario(req, res) {
  try {
    const id = Number(req.params.id);
    const { nombre, apellido, email, rol, estado } = req.body;

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ status: "error", message: "Cuenta no encontrada" });
    }
    if (usuario.Estado === "Eliminado") {
      return res.status(400).json({ status: "error", message: "No se puede modificar una cuenta eliminada" });
    }

    // Un admin no puede quitarse su propio rol ni bloquearse.
    // Esto además garantiza que siempre quede al menos un admin activo.
    const esUnoMismo = id === req.usuario.id;
    if (esUnoMismo && ((rol && rol !== usuario.Rol) || (estado && estado !== usuario.Estado))) {
      return res.status(400).json({
        status: "error",
        message: "No podés cambiar tu propio rol ni tu estado",
      });
    }

    if (nombre !== undefined) {
      const n = String(nombre).trim();
      if (!n) return res.status(400).json({ status: "error", message: "El nombre es obligatorio" });
      usuario.Nombre = n;
    }

    if (apellido !== undefined) {
      const a = String(apellido).trim();
      if (!a) return res.status(400).json({ status: "error", message: "El apellido es obligatorio" });
      usuario.Apellido = a;
    }

    if (email !== undefined && String(email).trim() !== usuario.Email) {
      const nuevoEmail = String(email).trim();
      if (!EMAIL_REGEX.test(nuevoEmail)) {
        return res.status(400).json({ status: "error", message: "El email no es válido" });
      }
      const existente = await Usuario.findOne({
        where: { Email: nuevoEmail, UsuarioID: { [Op.ne]: id } },
      });
      if (existente) {
        return res.status(409).json({ status: "error", message: "Ese email ya está en uso por otra cuenta" });
      }
      usuario.Email = nuevoEmail;
    }

    if (rol !== undefined) {
      if (!ROLES.includes(rol)) {
        return res.status(400).json({ status: "error", message: "Rol inválido" });
      }
      usuario.Rol = rol;
    }

    if (estado !== undefined && estado !== usuario.Estado) {
      if (!ESTADOS_EDITABLES.includes(estado)) {
        return res.status(400).json({ status: "error", message: "Estado inválido" });
      }
      usuario.Estado = estado;

      if (estado === "Activo") {
        // Desbloquear: limpia también los bloqueos automáticos por intentos fallidos
        usuario.IntentosFallidos = 0;
        usuario.UltimoIntento = null;
        usuario.BloqueadoHasta = null;
      }
      if (estado === "Bloqueado") {
        usuario.BloqueadoHasta = BLOQUEO_INDEFINIDO;
      }
    }

    await usuario.save();

    return res.status(200).json({
      status: "ok",
      message: "Cuenta actualizada correctamente",
      data: {
        id: usuario.UsuarioID,
        nombre: usuario.Nombre,
        apellido: usuario.Apellido,
        email: usuario.Email,
        rol: usuario.Rol,
        estado: usuario.Estado,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "error", message: "Error al actualizar la cuenta" });
  }
}

async function eliminarUsuario(req, res) {
  try {
    const id = Number(req.params.id);

    if (id === req.usuario.id) {
      return res.status(400).json({ status: "error", message: "No podés eliminar tu propia cuenta desde acá" });
    }

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ status: "error", message: "Cuenta no encontrada" });
    }
    if (usuario.Estado === "Eliminado") {
      return res.status(400).json({ status: "error", message: "La cuenta ya fue eliminada" });
    }
    if (usuario.Rol === "Admin") {
      return res.status(400).json({
        status: "error",
        message: "Quitale el rol de admin a esta cuenta antes de eliminarla",
      });
    }

    // Borrado lógico (igual que eliminarCuenta): se anonimizan los datos
    // personales pero se conserva el historial de pedidos
    usuario.Nombre = "Usuario";
    usuario.Apellido = "Eliminado";
    usuario.Email = `eliminado_${usuario.UsuarioID}_${Date.now()}@baja.local`;
    usuario.PasswordHash = await bcrypt.hash(crypto.randomBytes(16).toString("hex"), 10);
    usuario.Estado = "Eliminado";
    usuario.TokenRecuperacion = null;
    usuario.TokenExpiracion = null;
    await usuario.save();

    return res.status(200).json({ status: "ok", message: "Cuenta eliminada correctamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "error", message: "Error al eliminar la cuenta" });
  }
}

module.exports = { listarUsuarios, actualizarUsuario, eliminarUsuario };