// server/src/routes/vehicleRoutes.js
const router = require('express').Router();
const vehicleController = require('../controllers/vehicleController');

router.post('/vehicles', vehicleController.create);
router.get('/vehicles', vehicleController.getAll);
router.get('/vehicles/:id', vehicleController.getOne);

module.exports = router;