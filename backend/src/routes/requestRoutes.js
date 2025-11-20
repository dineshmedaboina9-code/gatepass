const express = require('express');
const Joi = require('joi');
const RequestController = require('../controllers/RequestController');
const authenticateToken = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorizationMiddleware');
const validateRequest = require('../middleware/validationMiddleware');
const { ROLES } = require('../config/constants');

const router = express.Router();

const createRequestSchema = Joi.object({
  reason: Joi.string().required(),
  destination: Joi.string().required(),
  outTime: Joi.date().required(),
  inTime: Joi.date().optional()
});

const approvalSchema = Joi.object({
  remarks: Joi.string().optional()
});

// Student routes
router.post('/', authenticateToken, authorize(ROLES.STUDENT), validateRequest(createRequestSchema), RequestController.createRequest);
router.get('/', authenticateToken, authorize(ROLES.STUDENT), RequestController.getStudentRequests);

// HoD routes
router.get('/department/:department', authenticateToken, authorize(ROLES.HOD, ROLES.ADMIN), RequestController.getDepartmentRequests);
router.put('/:requestId/hod-approve', authenticateToken, authorize(ROLES.HOD), validateRequest(approvalSchema), RequestController.hodApproveRequest);
router.put('/:requestId/hod-reject', authenticateToken, authorize(ROLES.HOD), validateRequest(approvalSchema), RequestController.hodRejectRequest);

// Admin routes
router.get('/admin/pending-approval', authenticateToken, authorize(ROLES.ADMIN), RequestController.getHodApprovedRequests);
router.get('/admin/approved', authenticateToken, authorize(ROLES.ADMIN), RequestController.getAdminApprovedRequests);
router.put('/:requestId/admin-approve', authenticateToken, authorize(ROLES.ADMIN), validateRequest(approvalSchema), RequestController.adminApproveRequest);
router.put('/:requestId/admin-reject', authenticateToken, authorize(ROLES.ADMIN), validateRequest(approvalSchema), RequestController.adminRejectRequest);

module.exports = router;
