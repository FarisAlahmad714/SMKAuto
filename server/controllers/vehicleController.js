// server/src/controllers/vehicleController.js
const Vehicle = require('../models/Vehicle');

const vehicleController = {
  create: async (req, res) => {
    try {
      const vehicle = await Vehicle.create(req.body);
      res.status(201).json(vehicle);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const vehicles = await Vehicle.findAll();
      res.json(vehicles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getOne: async (req, res) => {
    try {
      const vehicle = await Vehicle.findByPk(req.params.id);
      if (vehicle) {
        res.json(vehicle);
      } else {
        res.status(404).json({ error: 'Vehicle not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = vehicleController;