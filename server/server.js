const express = require('express');
const cors = require('cors');
const { Sequelize } = require('sequelize');

const app = express();
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

app.use(cors());
app.use(express.json());

sequelize.authenticate()
  .then(() => console.log('Connected to SQLite'))
  .catch(err => console.error('Database connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));