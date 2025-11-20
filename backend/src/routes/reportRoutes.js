const express = require('express');
const ReportController = require('../controllers/ReportController');
const authenticateToken = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorizationMiddleware');
const { ROLES } = require('../config/constants');

const router = express.Router();

// Admin only routes
router.get('/audit-logs', authenticateToken, authorize(ROLES.ADMIN), ReportController.getAuditLogs);
router.get('/analytics', authenticateToken, authorize(ROLES.ADMIN, ROLES.HOD), ReportController.getRequestAnalytics);
router.get('/export-logs', authenticateToken, authorize(ROLES.ADMIN), ReportController.exportLogs);

module.exports = router;
