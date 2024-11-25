// server/models/TestDrive.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Vehicle = require('./Vehicle');

const TestDrive = sequelize.define('TestDrive', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  customerEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  customerPhone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  scheduleDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  timeSlot: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled'),
    defaultValue: 'pending'
  },
  notes: {
    type: DataTypes.TEXT
  }
}, {
  // Add timestamps
  timestamps: true
});

// Set up the relationship properly
TestDrive.belongsTo(Vehicle, {
  foreignKey: 'vehicleId', // Use lowercase to match your existing code
  allowNull: false
});

module.exports = TestDrive;