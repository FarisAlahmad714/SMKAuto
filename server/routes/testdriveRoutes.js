// server/routes/testDriveRoutes.js
const router = require('express').Router();
const TestDrive = require('../models/TestDrive');
const Vehicle = require('../models/Vehicle');
const { Op } = require('sequelize');

// Get all test drives
router.get('/test-drives', async (req, res) => {
  try {
    const testDrives = await TestDrive.findAll({
      include: [{
        model: Vehicle,
        attributes: ['make', 'model', 'year', 'stockNumber']
      }],
      order: [['scheduleDate', 'ASC']]
    });
    res.json(testDrives);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get available time slots for a specific date
// In testDriveRoutes.js, update the available-slots route
// In testdriveRoutes.js
router.get('/test-drives/available-slots', async (req, res) => {
  console.log('Available slots endpoint hit');
  console.log('Query params:', req.query);
  
  const { date } = req.query;
  try {
    // Define business hours (9 AM to 5 PM)
    const allTimeSlots = [
      '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
      '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
    ];

    console.log('Checking for booked appointments on:', date);
    
    const bookedAppointments = await TestDrive.findAll({
      where: {
        scheduleDate: {
          [Op.between]: [
            new Date(`${date} 00:00:00`),
            new Date(`${date} 23:59:59`)
          ]
        },
        status: {
          [Op.in]: ['pending', 'confirmed'] // Only consider pending and confirmed appointments
        }
      },
      attributes: ['timeSlot']
    });

    // Get array of booked time slots
    const bookedSlots = bookedAppointments.map(appointment => appointment.timeSlot);
    console.log('Booked slots:', bookedSlots);

    // Filter out booked slots
    const availableSlots = allTimeSlots.filter(slot => !bookedSlots.includes(slot));
    console.log('Available slots:', availableSlots);

    // Return available slots
    res.json(availableSlots);
  } catch (error) {
    console.error('Error in available slots:', error);
    res.status(500).json({ error: 'Failed to fetch available time slots' });
  }
});

// Create a new test drive appointment
router.post('/test-drives', async (req, res) => {
  try {
    // Check if the slot is still available
    const existingBooking = await TestDrive.findOne({
      where: {
        scheduleDate: req.body.scheduleDate,
        timeSlot: req.body.timeSlot,
        status: {
          [Op.in]: ['pending', 'confirmed']
        }
      }
    });

    if (existingBooking) {
      return res.status(400).json({ 
        error: 'This time slot is no longer available. Please select another time.' 
      });
    }

    const testDrive = await TestDrive.create(req.body);
    res.status(201).json(testDrive);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update test drive status
router.put('/test-drives/:id', async (req, res) => {
  try {
    const testDrive = await TestDrive.findByPk(req.params.id);
    if (!testDrive) {
      return res.status(404).json({ error: 'Test drive not found' });
    }
    await testDrive.update(req.body);
    res.json(testDrive);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete test drive
router.delete('/test-drives/:id', async (req, res) => {
  try {
    const testDrive = await TestDrive.findByPk(req.params.id);
    if (!testDrive) {
      return res.status(404).json({ error: 'Test drive not found' });
    }
    await testDrive.destroy();
    res.json({ message: 'Test drive cancelled successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;