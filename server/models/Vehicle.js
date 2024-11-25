// server/src/models/Vehicle.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Vehicle = sequelize.define('Vehicle', {
  stockNumber: {
    type: DataTypes.STRING,
    unique: true,
  },
  make: {
    type: DataTypes.STRING,
    allowNull: false
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  mileage: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  transmission: DataTypes.STRING,
  exteriorColor: DataTypes.STRING,
  status: {
    type: DataTypes.STRING,
    defaultValue: 'available'
  },
  description: DataTypes.TEXT,
  images: {
    type: DataTypes.JSON,
    defaultValue: []
  }
});

module.exports = Vehicle;