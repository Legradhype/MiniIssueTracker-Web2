const sequelize = require('../config/db');
const Usuario = require('./usuario');
const Proyecto = require('./proyecto');
const Ticket = require('./ticket');
const ProyectoUsuario = require('./proyectoUsuario');

// Usuario crea muchos proyectos
Usuario.hasMany(Proyecto, { foreignKey: 'creador_id', as: 'proyectosCreados' });
Proyecto.belongsTo(Usuario, { foreignKey: 'creador_id', as: 'creador' });

// Proyectos y usuarios N:M via proyecto_usuario
Proyecto.belongsToMany(Usuario, {
  through: ProyectoUsuario,
  foreignKey: 'proyecto_id',
  as: 'miembros',
});
Usuario.belongsToMany(Proyecto, {
  through: ProyectoUsuario,
  foreignKey: 'usuario_id',
  as: 'proyectos',
});

// Proyecto tiene muchos tickets
Proyecto.hasMany(Ticket, { foreignKey: 'proyecto_id', as: 'tickets' });
Ticket.belongsTo(Proyecto, { foreignKey: 'proyecto_id', as: 'proyecto' });

// Usuario asignado a ticket
Usuario.hasMany(Ticket, { foreignKey: 'usuario_asignado_id', as: 'ticketsAsignados' });
Ticket.belongsTo(Usuario, { foreignKey: 'usuario_asignado_id', as: 'asignado' });

module.exports = { sequelize, Usuario, Proyecto, Ticket, ProyectoUsuario };