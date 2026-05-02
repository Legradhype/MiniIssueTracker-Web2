const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Proyecto = sequelize.define('Proyecto', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
  },
  creador_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'proyectos',
  timestamps: true,
  createdAt: 'fecha_creacion',
  updatedAt: false,
});

module.exports = Proyecto;