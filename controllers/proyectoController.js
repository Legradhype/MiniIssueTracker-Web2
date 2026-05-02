const { Proyecto, Usuario, ProyectoUsuario } = require('../models');

const proyectoController = {
  async crear(req, res) {
    const { nombre, descripcion } = req.body;
    if (!nombre) return res.status(400).json({ error: 'El nombre es requerido' });

    try {
      const proyecto = await Proyecto.create({ nombre, descripcion, creador_id: req.usuario.id });

      // El creador entra automáticamente como miembro
      await ProyectoUsuario.create({ proyecto_id: proyecto.id, usuario_id: req.usuario.id });

      res.status(201).json(proyecto);
    } catch (err) {
      res.status(500).json({ error: 'Error al crear proyecto' });
    }
  },

  async listar(req, res) {
    try {
      const usuario = await Usuario.findByPk(req.usuario.id, {
        include: [{ association: 'proyectos' }]
      });
      res.json(usuario.proyectos);
    } catch (err) {
      res.status(500).json({ error: 'Error al listar proyectos' });
    }
  },

  async detalle(req, res) {
    try {
      const proyecto = await Proyecto.findByPk(req.params.id, {
        include: [
          { association: 'miembros', attributes: ['id', 'nombre', 'email'] },
          { association: 'creador', attributes: ['id', 'nombre', 'email'] },
        ]
      });
      if (!proyecto) return res.status(404).json({ error: 'Proyecto no encontrado' });
      res.json(proyecto);
    } catch (err) {
      res.status(500).json({ error: 'Error al obtener proyecto' });
    }
  },

  async editar(req, res) {
    const { nombre, descripcion } = req.body;
    if (!nombre) return res.status(400).json({ error: 'El nombre es requerido' });

    try {
      const proyecto = await Proyecto.findByPk(req.params.id);
      if (!proyecto) return res.status(404).json({ error: 'Proyecto no encontrado' });

      await proyecto.update({ nombre, descripcion });
      res.json(proyecto);
    } catch (err) {
      res.status(500).json({ error: 'Error al editar proyecto' });
    }
  },

  async agregarUsuario(req, res) {
    const { usuario_id } = req.body;
    try {
      const usuario = await Usuario.findByPk(usuario_id);
      if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

      const yaEsta = await ProyectoUsuario.findOne({
        where: { proyecto_id: req.params.id, usuario_id }
      });
      if (yaEsta) return res.status(400).json({ error: 'El usuario ya es miembro' });

      await ProyectoUsuario.create({ proyecto_id: req.params.id, usuario_id });
      res.json({ mensaje: 'Usuario agregado al proyecto' });
    } catch (err) {
      res.status(500).json({ error: 'Error al agregar usuario' });
    }
  }
};

module.exports = proyectoController;