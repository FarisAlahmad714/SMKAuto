// server/src/models/Vehicle.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Vehicle = sequelize.define('Vehicle', {
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
  transmission: {
    type: DataTypes.STRING,
    allowNull: false
  },
  exteriorColor: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('available', 'sold', 'pending'),
    defaultValue: 'available'
  },
  stockNumber: {
    type: DataTypes.STRING,
    unique: true
  }
});

module.exports = Vehicle;