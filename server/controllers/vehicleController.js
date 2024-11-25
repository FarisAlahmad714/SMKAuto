// server/controllers/vehicleController.js
const Vehicle = require('../models/Vehicle');

const vehicleController = {
  async create(req, res) {
    try {
      const vehicle = await Vehicle.create({
        ...req.body,
        stockNumber: `SMK${Math.floor(Math.random() * 90000) + 10000}`
      });
      res.status(201).json(vehicle);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getAll(req, res) {
    try {
      const vehicles = await Vehicle.findAll();
      res.json(vehicles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getOne(req, res) {
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
  },

  async update(req, res) {
    try {
      const vehicle = await Vehicle.findByPk(req.params.id);
      if (!vehicle) {
        return res.status(404).json({ error: 'Vehicle not found' });
      }
      await vehicle.update(req.body);
      res.json(vehicle);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const vehicle = await Vehicle.findByPk(req.params.id);
      if (!vehicle) {
        return res.status(404).json({ error: 'Vehicle not found' });
      }
      await vehicle.destroy();
      res.json({ message: 'Vehicle deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = vehicleController;