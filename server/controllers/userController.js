
const Usuario = require("../models/Usuario");
const bcrypt = require("bcrypt");


async function obtenerPerfil(req, res) {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id, {
      attributes: ["UsuarioID", "Nombre", "Apellido", "Email", "Rol", "Estado"]
    });

    if (!usuario || usuario.Estado !== "Activo") {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener el perfil" });
  }
}


async function actualizarPerfil(req, res) {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id);

    if (!usuario || usuario.Estado !== "Activo") {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    usuario.Nombre = req.body.nombre || usuario.Nombre;
    usuario.Apellido = req.body.apellido || usuario.Apellido;
    usuario.Email = req.body.email || usuario.Email;

    await usuario.save();

    res.json({ mensaje: "Perfil actualizado" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar el perfil" });
  }
}


async function eliminarCuenta(req, res) {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id);

    if (!usuario || usuario.Estado !== "Activo") {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    usuario.Nombre = "Usuario";
    usuario.Apellido = "Eliminado";
    usuario.Email = "eliminado" + usuario.UsuarioID + "@baja.local";
    usuario.Estado = "Eliminado";
    usuario.PasswordHash = await bcrypt.hash("cuenta-eliminada", 10);

    await usuario.save();

    res.json({ mensaje: "Cuenta eliminada" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar la cuenta" });
  }
}

module.exports = { obtenerPerfil, actualizarPerfil, eliminarCuenta };
