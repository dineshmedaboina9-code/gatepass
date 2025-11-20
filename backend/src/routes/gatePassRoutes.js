const express = require('express');
const Joi = require('joi');
const GatePassController = require('../controllers/GatePassController');
const authenticateToken = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorizationMiddleware');
const validateRequest = require('../middleware/validationMiddleware');
const { ROLES } = require('../config/constants');

const router = express.Router();

// Admin generates gate pass
router.post('/:requestId/generate', authenticateToken, authorize(ROLES.ADMIN), GatePassController.generateGatePass);

// Student views gate passes
router.get('/', authenticateToken, authorize(ROLES.STUDENT), GatePassController.getStudentGatePass);

// Download gate pass
router.get('/:gatePassId/download', authenticateToken, GatePassController.downloadGatePass);

// Email gate pass
router.post('/:gatePassId/email', authenticateToken, GatePassController.emailGatePass);

module.exports = router;
