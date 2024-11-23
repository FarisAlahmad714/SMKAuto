const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const vehicleRoutes = require('./routes/vehicleRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Add routes
app.use('/api', vehicleRoutes);

sequelize.authenticate()
  .then(() => console.log('Connected to SQLite'))
  .catch(err => console.error('Database connection error:', err));

sequelize.sync({ force: true })
  .then(() => console.log('Database synced'))
  .catch(err => console.error('Error syncing database:', err));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));