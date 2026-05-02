const { ProyectoUsuario } = require('../models');

module.exports = async (req, res, next) => {
  const proyecto_id = req.params.proyecto_id || req.params.id;
  const usuario_id = req.usuario.id;

  try {
    const pertenece = await ProyectoUsuario.findOne({
      where: { proyecto_id, usuario_id }
    });
    if (!pertenece) {
      return res.status(403).json({ error: 'No tenés acceso a este proyecto' });
    }
    next();
  } catch (err) {
    res.status(500).json({ error: 'Error al verificar acceso' });
  }
};