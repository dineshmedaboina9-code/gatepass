const AuditLog = require('../models/AuditLog');
const User = require('../models/User');
const GatePassRequest = require('../models/GatePassRequest');

class ReportController {
  static async getAuditLogs(req, res) {
    try {
      const { startDate, endDate, userId, action } = req.query;

      let where = {};
      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.$gte = new Date(startDate);
        if (endDate) where.createdAt.$lte = new Date(endDate);
      }
      if (userId) where.userId = userId;
      if (action) where.action = action;

      const logs = await AuditLog.findAll({
        where,
        include: { model: User, attributes: ['email', 'firstName', 'lastName'] },
        order: [['createdAt', 'DESC']],
        limit: 1000
      });

      res.json({
        message: 'Audit logs retrieved successfully',
        logs
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getRequestAnalytics(req, res) {
    try {
      const { department, startDate, endDate } = req.query;

      let where = {};
      if (department) where.department = department;
      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.$gte = new Date(startDate);
        if (endDate) where.createdAt.$lte = new Date(endDate);
      }

      const requests = await GatePassRequest.findAll({ where });

      const analytics = {
        total: requests.length,
        pending: requests.filter(r => r.status === 'pending').length,
        hodApproved: requests.filter(r => r.status === 'hod_approved').length,
        hodRejected: requests.filter(r => r.status === 'hod_rejected').length,
        adminApproved: requests.filter(r => r.status === 'admin_approved').length,
        adminRejected: requests.filter(r => r.status === 'admin_rejected').length,
        issued: requests.filter(r => r.status === 'issued').length,
        used: requests.filter(r => r.status === 'used').length
      };

      res.json({
        message: 'Analytics retrieved successfully',
        analytics
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async exportLogs(req, res) {
    try {
      const { startDate, endDate } = req.query;

      let where = {};
      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.$gte = new Date(startDate);
        if (endDate) where.createdAt.$lte = new Date(endDate);
      }

      const logs = await AuditLog.findAll({ where });

      res.json({
        message: 'Logs exported successfully',
        data: logs
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = ReportController;
