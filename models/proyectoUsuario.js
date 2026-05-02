const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ProyectoUsuario = sequelize.define('ProyectoUsuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  proyecto_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'proyecto_usuario',
  timestamps: false,
});

module.exports = ProyectoUsuario;