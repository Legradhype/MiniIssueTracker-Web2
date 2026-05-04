const { Ticket, ProyectoUsuario, Usuario } = require('../models');

const ticketController = {
  async crear(req, res) {
    const { titulo, descripcion, usuario_asignado_id } = req.body;
    const proyecto_id = req.params.proyecto_id;

    if (!titulo || !descripcion) {
      return res.status(400).json({ error: 'Título y descripción son requeridos' });
    }

    if (usuario_asignado_id) {
      const pertenece = await ProyectoUsuario.findOne({
        where: { proyecto_id, usuario_id: usuario_asignado_id }
      });
      if (!pertenece) {
        return res.status(400).json({ error: 'El usuario asignado no pertenece al proyecto' });
      }
    }

    try {
      const ticket = await Ticket.create({ titulo, descripcion, proyecto_id, usuario_asignado_id });
      res.status(201).json(ticket);
    } catch (err) {
      res.status(500).json({ error: 'Error al crear ticket' });
    }
  },

  async listar(req, res) {
    try {
      const tickets = await Ticket.findAll({
        where: { proyecto_id: req.params.proyecto_id },
        include: [{ association: 'asignado', attributes: ['id', 'nombre', 'email'] }],
        order: [['fecha_creacion', 'DESC']],
      });
      res.json(tickets);
    } catch (err) {
      res.status(500).json({ error: 'Error al listar tickets' });
    }
  },

  async detalle(req, res) {
    try {
      const ticket = await Ticket.findByPk(req.params.id, {
        include: [{ association: 'asignado', attributes: ['id', 'nombre', 'email'] }]
      });
      if (!ticket) return res.status(404).json({ error: 'Ticket no encontrado' });
      res.json(ticket);
    } catch (err) {
      res.status(500).json({ error: 'Error al obtener ticket' });
    }
  },

  async editar(req, res) {
    const { titulo, descripcion, usuario_asignado_id, estado } = req.body;
    const proyecto_id = req.params.proyecto_id;
    
    if (!titulo || !descripcion) {
      return res.status(400).json({ error: 'Título y descripción son requeridos' });
    }

    if (estado) {
      return res.status(400).json({ error: 'Use el endpoint PATCH /:id/estado para cambiar el estado del ticket' });
    }

    try {
      const ticket = await Ticket.findByPk(req.params.id);
      if (!ticket) return res.status(404).json({ error: 'Ticket no encontrado' });

      if (usuario_asignado_id && usuario_asignado_id !== ticket.usuario_asignado_id) {
        const pertenece = await ProyectoUsuario.findOne({
          where: { proyecto_id, usuario_id: usuario_asignado_id }
        });
        if (!pertenece) {
          return res.status(400).json({ error: 'El usuario asignado no pertenece al proyecto' });
        }
      }

      await ticket.update({ titulo, descripcion, usuario_asignado_id });
      const ticketActualizado = await Ticket.findByPk(ticket.id, {
        include: [{ association: 'asignado', attributes: ['id', 'nombre', 'email'] }]
      });
      res.json(ticketActualizado);
    } catch (err) {
      console.error('Error al editar ticket:', err);
      res.status(500).json({ error: 'Error al editar ticket' });
    }
  },

  async cambiarEstado(req, res) {
    const { nuevo_estado } = req.body;
    const estados_validos = ['pendiente', 'en_progreso', 'completado'];

    if (!estados_validos.includes(nuevo_estado)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }

    try {
      const ticket = await Ticket.findByPk(req.params.id);
      if (!ticket) return res.status(404).json({ error: 'Ticket no encontrado' });

      if (nuevo_estado === 'en_progreso' && !ticket.usuario_asignado_id) {
        return res.status(400).json({ error: 'Asigná un responsable antes de iniciar el ticket' });
      }

      if (!Ticket.transicionValida(ticket.estado, nuevo_estado)) {
        return res.status(400).json({
          error: `No se puede pasar de "${ticket.estado}" a "${nuevo_estado}"`
        });
      }

      await ticket.update({ estado: nuevo_estado });
      const ticketActualizado = await Ticket.findByPk(ticket.id, {
        include: [{ association: 'asignado', attributes: ['id', 'nombre', 'email'] }]
      });
      res.json(ticketActualizado);
    } catch (err) {
      res.status(500).json({ error: 'Error al cambiar estado' });
    }
  },

  async eliminar(req, res) {
    try {
      const ticket = await Ticket.findByPk(req.params.id);
      if (!ticket) return res.status(404).json({ error: 'Ticket no encontrado' });

      await ticket.destroy();
      res.json({ mensaje: 'Ticket eliminado' });
    } catch (err) {
      res.status(500).json({ error: 'Error al eliminar ticket' });
    }
  }
};

module.exports = ticketController;