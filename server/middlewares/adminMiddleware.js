
const Usuario = require("../models/Usuario");

// Comprueba que el usuario esté activo y tenga permisos de administrador.
async function soloAdmin(req, res, next) {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id, {
      attributes: ["UsuarioID", "Rol", "Estado"],
    });

    if (!usuario || usuario.Rol !== "Admin" || usuario.Estado !== "Activo") {
      return res.status(403).json({
        status: "error",
        message: "Acceso restringido a administradores",
      });
    }

    // Permite continuar con la solicitud si el usuario tiene los permisos necesarios.
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Error al verificar permisos",
    });
  }
}

module.exports = soloAdmin;
