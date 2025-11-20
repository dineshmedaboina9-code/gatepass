const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// Database
const sequelize = require('./config/database');

// Models (loads associations)
require('./models');

// Routes
const authRoutes = require('./routes/authRoutes');
const requestRoutes = require('./routes/requestRoutes');
const gatePassRoutes = require('./routes/gatePassRoutes');
const gateEntryRoutes = require('./routes/gateEntryRoutes');
const reportRoutes = require('./routes/reportRoutes');

// Middleware
const errorHandler = require('./utils/errorHandler');
const auditLog = require('./middleware/auditMiddleware');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Audit middleware
app.use(auditLog);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/gate-passes', gatePassRoutes);
app.use('/api/gate-entries', gateEntryRoutes);
app.use('/api/reports', reportRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Gate Pass Management System Backend running on port ${PORT}`);
});

module.exports = app;
