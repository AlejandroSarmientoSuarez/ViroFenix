const Usuario = require("../models/Usuario");

async function listarUsuarios(req, res) {
  try {
    const usuarios = await Usuario.findAll({
      attributes: ["UsuarioID", "Nombre", "Apellido", "Email", "Rol", "Estado"],
      order: [["FechaRegistro", "DESC"]]
    });

    const resultado = usuarios.filter(usuario => usuario.Estado !== "Eliminado");

    res.json({ status: "ok", data: resultado });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las cuentas" });
  }
}

async function actualizarUsuario(req, res) {
  try {
    const usuario = await Usuario.findByPk(req.params.id);

    if (!usuario || usuario.Estado === "Eliminado") {
      return res.status(404).json({ message: "Cuenta no encontrada" });
    }

    const { nombre, apellido, email, rol, estado } = req.body;

    if (Number(req.params.id) === Number(req.usuario.id)) {
      if ((rol && rol !== usuario.Rol) || (estado && estado !== usuario.Estado)) {
        return res.status(400).json({ message: "No podés cambiar tu propio rol o estado" });
      }
    }

    if (nombre !== undefined) {
      usuario.Nombre = String(nombre).trim();
      if (!usuario.Nombre) {
        return res.status(400).json({ message: "Nombre obligatorio" });
      }
    }

    if (apellido !== undefined) {
      usuario.Apellido = String(apellido).trim();
      if (!usuario.Apellido) {
        return res.status(400).json({ message: "Apellido obligatorio" });
      }
    }

    if (email && email.trim() !== usuario.Email) {
      const nuevoEmail = email.trim();

      if (!nuevoEmail.includes("@") || !nuevoEmail.includes(".")) {
        return res.status(400).json({ message: "Email inválido" });
      }

      const existe = await Usuario.findOne({ where: { Email: nuevoEmail } });

      if (existe && existe.UsuarioID !== usuario.UsuarioID) {
        return res.status(409).json({ message: "Email en uso" });
      }

      usuario.Email = nuevoEmail;
    }

    if (rol !== undefined) {
      if (rol !== "Admin" && rol !== "Cliente") {
        return res.status(400).json({ message: "Rol inválido" });
      }

      usuario.Rol = rol;
    }

    if (estado !== undefined) {
      if (estado !== "Activo" && estado !== "Pendiente") {
        return res.status(400).json({ message: "Estado inválido" });
      }

      usuario.Estado = estado;
    }

    await usuario.save();

    res.json({ message: "Cuenta actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la cuenta" });
  }
}

async function eliminarUsuario(req, res) {
  try {
    const id = req.params.id;

    if (Number(id) === Number(req.usuario.id)) {
      return res.status(400).json({ message: "No podés eliminar tu cuenta" });
    }

    const usuario = await Usuario.findByPk(id);

    if (!usuario || usuario.Estado === "Eliminado") {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (usuario.Rol === "Admin") {
      return res.status(400).json({ message: "No se puede eliminar un administrador" });
    }

    usuario.Nombre = "Usuario";
    usuario.Apellido = "Eliminado";
    usuario.Email = "eliminado" + usuario.UsuarioID + "@baja.local";
    usuario.Estado = "Eliminado";
    usuario.TokenRecuperacion = null;
    usuario.TokenExpiracion = null;

    await usuario.save();

    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar usuario" });
  }
}

module.exports = {
  listarUsuarios,
  actualizarUsuario,
  eliminarUsuario
};