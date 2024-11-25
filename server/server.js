const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/database');
const vehicleRoutes = require('./routes/vehicleRoutes');
const testDriveRoutes = require('./routes/testdriveRoutes');
const fs = require('fs');
const { backupDatabase, restoreDatabase } = require('./utils/backupDatabase');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Debug middleware - enhanced logging
app.use((req, res, next) => {
  console.log('Incoming request:', {
    method: req.method,
    url: req.url,
    path: req.path
  });
  next();
});

// Resolve the uploads path relative to project root
const projectRoot = path.join(__dirname, '..');
const uploadsDir = path.join(projectRoot, 'uploads');
console.log('Project root:', projectRoot);
console.log('Uploads directory:', uploadsDir);

// Create uploads directory if it doesn't exist
fs.mkdirSync(path.join(uploadsDir, 'vehicles'), { recursive: true });

// Serve static files with detailed logging
app.use('/uploads', (req, res, next) => {
  console.log('Static file request:', {
    originalUrl: req.originalUrl,
    path: req.path,
    fullPath: path.join(uploadsDir, req.path)
  });
  // Check if file exists
  const filePath = path.join(uploadsDir, req.path);
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.log('File not found:', filePath);
    } else {
      console.log('File exists:', filePath);
    }
  });
  next();
}, express.static(uploadsDir));

// Routes
app.use('/api', vehicleRoutes);
app.use('/api', testDriveRoutes);

// Add route debugging
console.log('Registered routes:');
app._router.stack.forEach(middleware => {
  if (middleware.route) {
    // Routes registered directly
    console.log(middleware.route.path);
  } else if (middleware.name === 'router') {
    // Router middleware
    middleware.handle.stack.forEach(handler => {
      if (handler.route) {
        console.log(`/api${handler.route.path}`);
      }
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5001;
let backupData;

sequelize.sync({ alter: true })
  .then(async () => {
    try {
      // Create backup before any changes
      backupData = await backupDatabase();
      
      // After schema changes, restore the data if needed
      if (backupData && backupData.length > 0) {
        await restoreDatabase(backupData);
      }
      
      console.log('Database synced and data restored');
      
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log('Server configured with:');
        console.log('- Uploads directory:', uploadsDir);
        console.log('- Static files route: /uploads');
      });
    } catch (error) {
      console.error('Error during backup/restore:', error);
    }
  })
  .catch(err => {
    console.error('Database sync error:', err);
  });
  
// Sync database and start server
sequelize.sync({ alter: true }) 
  .then(() => {
    console.log('Database synced');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log('Server configured with:');
      console.log('- Uploads directory:', uploadsDir);
      console.log('- Static files route: /uploads');
    });
  })
  .catch(err => {
    console.error('Database sync error:', err);
  });

module.exports = app;