const { Sequelize } = require('sequelize');
require('dotenv').config();

// Handle empty password string as null
const password = process.env.DB_PASSWORD ? process.env.DB_PASSWORD : null;

const sequelize = new Sequelize(
  process.env.DB_NAME || 'gate_pass_db',
  process.env.DB_USER || 'root',
  password,
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Test the connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connection established successfully');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;
