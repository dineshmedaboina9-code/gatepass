const express = require('express');
const Joi = require('joi');
const GateEntryController = require('../controllers/GateEntryController');
const validateRequest = require('../middleware/validationMiddleware');

const router = express.Router();

const scanSchema = Joi.object({
  passCode: Joi.string().required(),
  gate: Joi.string().required()
});

const denySchema = Joi.object({
  passCode: Joi.string().required(),
  gate: Joi.string().required(),
  remarks: Joi.string().optional()
});

// Security scans gate pass
router.post('/scan', validateRequest(scanSchema), GateEntryController.scanGatePass);

// Verify QR code and record gate entry
router.get('/verify-qr/:gatePassId', GateEntryController.verifyQRAndRecordEntry);

// Deny access
router.post('/deny', validateRequest(denySchema), GateEntryController.denyAccess);

// Get all gate entries (admin/security)
router.get('/', GateEntryController.getGateEntries);

module.exports = router;
