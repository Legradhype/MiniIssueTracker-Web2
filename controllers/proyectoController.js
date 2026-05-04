const { Proyecto, Usuario, ProyectoUsuario } = require('../models');
const { Op } = require('sequelize');

const proyectoController = {
  async crear(req, res) {
    const { nombre, descripcion } = req.body;
    if (!nombre) return res.status(400).json({ error: 'El nombre es requerido' });

    try {
      const proyecto = await Proyecto.create({ nombre, descripcion, creador_id: req.usuario.id });

  
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
    const { usuario_id, email } = req.body;
    
    try {
      let usuarioABuscar = usuario_id;
      
      if (email && !usuario_id) {
        const usuario = await Usuario.findOne({ where: { email } });
        if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado con ese email' });
        usuarioABuscar = usuario.id;
      }
      

      const usuario = await Usuario.findByPk(usuarioABuscar);
      if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });


      const proyecto = await Proyecto.findByPk(req.params.id);
      if (proyecto.creador_id === usuarioABuscar) {
        return res.status(400).json({ error: 'El creador ya es miembro del proyecto' });
      }

      const yaEsta = await ProyectoUsuario.findOne({
        where: { proyecto_id: req.params.id, usuario_id: usuarioABuscar }
      });
      if (yaEsta) return res.status(400).json({ error: 'El usuario ya es miembro' });

      await ProyectoUsuario.create({ proyecto_id: req.params.id, usuario_id: usuarioABuscar });
      res.json({ mensaje: 'Usuario agregado al proyecto', usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email } });
    } catch (err) {
      console.error('Error al agregar usuario:', err);
      res.status(500).json({ error: 'Error al agregar usuario' });
    }
  },

  async buscarUsuarios(req, res) {
    try {
      const { q } = req.query;
      if (!q || q.length < 2) {
        return res.json([]);
      }

      const usuarios = await Usuario.findAll({
        where: {
          email: {
            [Op.iLike]: `%${q}%`
          }
        },
        attributes: ['id', 'nombre', 'email'],
        limit: 10
      });
      
      res.json(usuarios);
    } catch (err) {
      console.error('Error al buscar usuarios:', err);
      res.status(500).json({ error: 'Error al buscar usuarios' });
    }
  }
};

module.exports = proyectoController;