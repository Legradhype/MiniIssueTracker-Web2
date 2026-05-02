const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ESTADOS = ['pendiente', 'en_progreso', 'completado'];

const TRANSICIONES = {
  pendiente: ['en_progreso'],
  en_progreso: ['pendiente', 'completado'],
  completado: ['en_progreso'],
};

const Ticket = sequelize.define('Ticket', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  titulo: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
  },
  estado: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'pendiente',
    validate: {
      isIn: [ESTADOS],
    },
  },
  usuario_asignado_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  proyecto_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'tickets',
  timestamps: true,
  createdAt: 'fecha_creacion',
  updatedAt: false,
});

// Método estático para validar transiciones
Ticket.transicionValida = (estado_actual, nuevo_estado) => {
  return TRANSICIONES[estado_actual]?.includes(nuevo_estado) ?? false;
};

module.exports = Ticket;