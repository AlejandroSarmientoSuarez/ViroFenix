
const Usuario = require("../models/Usuario");
const bcrypt = require("bcrypt");

// Obtiene los datos del usuario sin mostrar información sensible.
async function obtenerPerfil(req, res) {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id, {
      attributes: [
        "UsuarioID",
        "Nombre",
        "Apellido",
        "Email",
        "Rol",
        "Estado"
      ]
    });

    if (!usuario || usuario.Estado !== "Activo") {
      return res.status(404).json({
        mensaje: "Usuario no encontrado"
      });
    }

    return res.json(usuario);
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al obtener el perfil"
    });
  }
}

// Permite modificar el nombre, apellido y email del usuario que inició sesión.
async function actualizarPerfil(req, res) {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id);

    if (!usuario || usuario.Estado !== "Activo") {
      return res.status(404).json({
        mensaje: "Usuario no encontrado"
      });
    }

    if (req.body.nombre) usuario.Nombre = req.body.nombre;
    if (req.body.apellido) usuario.Apellido = req.body.apellido;
    if (req.body.email) usuario.Email = req.body.email;

    await usuario.save();

    return res.json({
      mensaje: "Perfil actualizado"
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al actualizar el perfil"
    });
  }
}

// Elimina la cuenta de forma lógica, reemplazando sus datos personales.
async function eliminarCuenta(req, res) {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id);

    if (!usuario || usuario.Estado !== "Activo") {
      return res.status(404).json({
        mensaje: "Usuario no encontrado"
      });
    }

    usuario.Nombre = "Usuario";
    usuario.Apellido = "Eliminado";
    usuario.Email = "eliminado" + usuario.UsuarioID + "@baja.local";
    usuario.Estado = "Eliminado";

    // Reemplaza la contraseña por un hash para impedir el uso de la anterior.
    usuario.PasswordHash = await bcrypt.hash("cuenta-eliminada", 10);

    await usuario.save();

    return res.json({
      mensaje: "Cuenta eliminada"
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al eliminar la cuenta"
    });
  }
}

module.exports = {
  obtenerPerfil,
  actualizarPerfil,
  eliminarCuenta
};
