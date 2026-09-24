const bcrypt = require("bcrypt");
const Usuario = require("../models/Usuario");
const crypto = require("crypto");
async function obtenerPerfil(req, res) {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id, {
      attributes: ["UsuarioID", "Nombre", "Apellido", "Email", "Rol", "UltimoAcceso"],
    });

    if (!usuario) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado",
      });
    }

    return res.status(200).json({
      status: "ok",
      data: usuario,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Error al obtener el perfil",
    });
  }
}

async function actualizarPerfil(req, res) {
  try {
    const { nombre, apellido, email, passwordActual, passwordNueva } = req.body;

    const usuario = await Usuario.findByPk(req.usuario.id);

    if (!usuario) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado",
      });
    }

    if (nombre) usuario.Nombre = nombre;
    if (apellido) usuario.Apellido = apellido;

    if (email && email !== usuario.Email) {
      const existente = await Usuario.findOne({ where: { Email: email } });
      if (existente) {
        return res.status(409).json({
          status: "error",
          message: "Ese email ya está en uso por otra cuenta",
        });
      }
      usuario.Email = email;
    }

    if (passwordNueva) {
      if (!passwordActual) {
        return res.status(400).json({
          status: "error",
          message: "Debés indicar tu contraseña actual para cambiarla",
        });
      }

      const passwordValido = await bcrypt.compare(passwordActual, usuario.PasswordHash);
      if (!passwordValido) {
        return res.status(401).json({
          status: "error",
          message: "La contraseña actual es incorrecta",
        });
      }

      if (passwordNueva.length < 8) {
        return res.status(400).json({
          status: "error",
          message: "La nueva contraseña debe tener al menos 8 caracteres",
        });
      }

      usuario.PasswordHash = await bcrypt.hash(passwordNueva, 10);
    }

    await usuario.save();

    return res.status(200).json({
      status: "ok",
      message: "Perfil actualizado correctamente",
      data: {
        id: usuario.UsuarioID,
        nombre: usuario.Nombre,
        apellido: usuario.Apellido,
        email: usuario.Email,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Error al actualizar el perfil",
    });
  }
}
async function eliminarCuenta(req, res) {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        status: "error",
        message: "Ingresá tu contraseña para confirmar",
      });
    }

    const usuario = await Usuario.findByPk(req.usuario.id);

    if (!usuario) {
      return res.status(404).json({ status: "error", message: "Usuario no encontrado" });
    }

    const passwordValido = await bcrypt.compare(password, usuario.PasswordHash);
    if (!passwordValido) {
      return res.status(401).json({ status: "error", message: "Contraseña incorrecta" });
    }

    // Borrado lógico: anonimizamos en vez de borrar la fila, porque
    // carrito y pedidos tienen ON DELETE RESTRICT hacia usuarios
    // (no se puede perder el historial de compras real)
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

module.exports = { obtenerPerfil, actualizarPerfil, eliminarCuenta };
