// server/utils/backupDatabase.js

const fs = require('fs');
const path = require('path');
const sequelize = require('../config/database');
const Vehicle = require('../models/Vehicle');

async function backupDatabase() {
  try {
    // Create backups directory if it doesn't exist
    const backupDir = path.join(__dirname, '../backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir);
    }

    // Get all vehicles
    const vehicles = await Vehicle.findAll();
    
    // Save to backup file
    const backupPath = path.join(backupDir, `vehicles_backup_${Date.now()}.json`);
    fs.writeFileSync(backupPath, JSON.stringify(vehicles, null, 2));
    
    console.log('Backup created at:', backupPath);
    return vehicles;
  } catch (error) {
    console.error('Backup failed:', error);
    throw error;
  }
}

async function restoreDatabase(backupData) {
  try {
    for (const vehicle of backupData) {
      await Vehicle.create(vehicle);
    }
    console.log('Database restored successfully');
  } catch (error) {
    console.error('Restore failed:', error);
    throw error;
  }
}

module.exports = { backupDatabase, restoreDatabase };