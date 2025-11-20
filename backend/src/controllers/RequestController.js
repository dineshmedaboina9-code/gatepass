const GatePassRequest = require('../models/GatePassRequest');
const User = require('../models/User');
const GatePass = require('../models/GatePass');
const AuditLog = require('../models/AuditLog');
const { REQUEST_STATUS } = require('../config/constants');
const { sendApprovalNotification } = require('../utils/emailService');

class RequestController {
  static async createRequest(req, res) {
    try {
      const { reason, destination, outTime, inTime } = req.validatedData;
      const studentId = req.user.id;

      const student = await User.findByPk(studentId);
      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }

      const request = await GatePassRequest.create({
        studentId,
        reason,
        destination,
        outTime: new Date(outTime),
        inTime: inTime ? new Date(inTime) : null,
        status: REQUEST_STATUS.PENDING,
        department: student.department
      });

      await AuditLog.create({
        userId: studentId,
        action: 'CREATE_REQUEST',
        entityType: 'GatePassRequest',
        entityId: request.id,
        status: 'success'
      });

      res.status(201).json({
        message: 'Gate pass request created successfully',
        request
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getStudentRequests(req, res) {
    try {
      const studentId = req.user.id;

      const requests = await GatePassRequest.findAll({
        where: { studentId },
        order: [['createdAt', 'DESC']]
      });

      res.json({
        message: 'Requests retrieved successfully',
        requests
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getDepartmentRequests(req, res) {
    try {
      const { department } = req.params;

      const requests = await GatePassRequest.findAll({
        where: { department, status: REQUEST_STATUS.PENDING },
        include: [{ model: User, as: 'student', attributes: ['firstName', 'lastName', 'email'] }],
        order: [['createdAt', 'DESC']]
      });

      res.json({
        message: 'Department requests retrieved successfully',
        requests
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getHodApprovedRequests(req, res) {
    try {
      const requests = await GatePassRequest.findAll({
        where: { status: REQUEST_STATUS.HOD_APPROVED },
        include: [{ model: User, as: 'student', attributes: ['firstName', 'lastName', 'email', 'department'] }],
        order: [['createdAt', 'DESC']]
      });

      res.json({
        message: 'HoD approved requests retrieved successfully',
        requests
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAdminApprovedRequests(req, res) {
    try {
      const requests = await GatePassRequest.findAll({
        where: { status: REQUEST_STATUS.ADMIN_APPROVED },
        include: [{ model: User, as: 'student', attributes: ['firstName', 'lastName', 'email', 'department'] }],
        order: [['createdAt', 'DESC']]
      });

      res.json({
        message: 'Admin approved requests retrieved successfully',
        requests
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async hodApproveRequest(req, res) {
    try {
      const { requestId } = req.params;
      const { remarks } = req.validatedData;
      const hodId = req.user.id;

      const request = await GatePassRequest.findByPk(requestId, {
        include: { model: User, as: 'student' }
      });

      if (!request) {
        return res.status(404).json({ error: 'Request not found' });
      }

      await request.update({
        status: REQUEST_STATUS.HOD_APPROVED,
        hodId,
        hodApprovedAt: new Date(),
        hodRemarks: remarks
      });

      await AuditLog.create({
        userId: hodId,
        action: 'HOD_APPROVE_REQUEST',
        entityType: 'GatePassRequest',
        entityId: requestId,
        status: 'success'
      });

      await sendApprovalNotification(request.student.email, `${request.student.firstName} ${request.student.lastName}`, 'approved');

      res.json({
        message: 'Request approved by HoD',
        request
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async hodRejectRequest(req, res) {
    try {
      const { requestId } = req.params;
      const { remarks } = req.validatedData;
      const hodId = req.user.id;

      const request = await GatePassRequest.findByPk(requestId, {
        include: { model: User, as: 'student' }
      });

      if (!request) {
        return res.status(404).json({ error: 'Request not found' });
      }

      await request.update({
        status: REQUEST_STATUS.HOD_REJECTED,
        hodId,
        hodApprovedAt: new Date(),
        hodRemarks: remarks
      });

      await AuditLog.create({
        userId: hodId,
        action: 'HOD_REJECT_REQUEST',
        entityType: 'GatePassRequest',
        entityId: requestId,
        status: 'success'
      });

      await sendApprovalNotification(request.student.email, `${request.student.firstName} ${request.student.lastName}`, 'rejected');

      res.json({
        message: 'Request rejected by HoD',
        request
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async adminApproveRequest(req, res) {
    try {
      const { requestId } = req.params;
      const { remarks } = req.validatedData;
      const adminId = req.user.id;

      const request = await GatePassRequest.findByPk(requestId);

      if (!request) {
        return res.status(404).json({ error: 'Request not found' });
      }

      if (request.status !== REQUEST_STATUS.HOD_APPROVED) {
        return res.status(400).json({ error: 'Request must be HoD approved first' });
      }

      await request.update({
        status: REQUEST_STATUS.ADMIN_APPROVED,
        adminId,
        adminApprovedAt: new Date(),
        adminRemarks: remarks
      });

      await AuditLog.create({
        userId: adminId,
        action: 'ADMIN_APPROVE_REQUEST',
        entityType: 'GatePassRequest',
        entityId: requestId,
        status: 'success'
      });

      res.json({
        message: 'Request approved by Admin',
        request
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async adminRejectRequest(req, res) {
    try {
      const { requestId } = req.params;
      const { remarks } = req.validatedData;
      const adminId = req.user.id;

      const request = await GatePassRequest.findByPk(requestId);

      if (!request) {
        return res.status(404).json({ error: 'Request not found' });
      }

      await request.update({
        status: REQUEST_STATUS.ADMIN_REJECTED,
        adminId,
        adminApprovedAt: new Date(),
        adminRemarks: remarks
      });

      await AuditLog.create({
        userId: adminId,
        action: 'ADMIN_REJECT_REQUEST',
        entityType: 'GatePassRequest',
        entityId: requestId,
        status: 'success'
      });

      res.json({
        message: 'Request rejected by Admin',
        request
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = RequestController;
