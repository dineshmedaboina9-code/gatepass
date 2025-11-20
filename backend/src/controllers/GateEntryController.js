const GateEntry = require('../models/GateEntry');
const GatePass = require('../models/GatePass');
const GatePassRequest = require('../models/GatePassRequest');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const { ENTRY_STATUS } = require('../config/constants');
const { REQUEST_STATUS } = require('../config/constants');

class GateEntryController {
  static async scanGatePass(req, res) {
    try {
      const { passCode, gate } = req.validatedData;
      const securityPersonId = req.user?.id || null;

      const gatePass = await GatePass.findOne({ where: { passCode } });

      if (!gatePass) {
        return res.status(404).json({ error: 'Gate pass not found' });
      }

      // fetch associated request and student for richer response
      const request = await GatePassRequest.findByPk(gatePass.requestId);
      const student = await require('../models/User').findByPk(gatePass.studentId);

      // Validate gate pass
      const now = new Date();
      if (now > gatePass.validUntil) {
        return res.status(400).json({ error: 'Gate pass expired' });
      }

      if (gatePass.isUsed) {
        return res.status(400).json({ error: 'Gate pass already used' });
      }

      let status = ENTRY_STATUS.ALLOWED;
      let remarks = null;

      const gateEntry = await GateEntry.create({
        gatePassId: gatePass.id,
        studentId: gatePass.studentId,
        gate,
        scanTime: now,
        status,
        securityPersonId,
        remarks
      });

      await gatePass.update({
        isUsed: true,
        usedAt: now
      });

      // Update request status to USED
      if (request) {
        await request.update({
          status: REQUEST_STATUS.USED
        });
      }

      await AuditLog.create({
        userId: securityPersonId,
        action: 'SCAN_GATE_PASS',
        entityType: 'GateEntry',
        entityId: gateEntry.id,
        status: 'success'
      });

      res.json({
        message: 'Gate pass validated and entry recorded',
        entry: gateEntry,
        status: status,
        gatePass: {
          id: gatePass.id,
          passCode: gatePass.passCode,
          validUntil: gatePass.validUntil
        },
        request: request ? {
          id: request.id,
          destination: request.destination,
          reason: request.reason,
          outTime: request.outTime,
          inTime: request.inTime,
          status: request.status
        } : null,
        student: student ? {
          id: student.id,
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email
        } : null
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async verifyQRAndRecordEntry(req, res) {
    try {
      const { gatePassId } = req.params;
      const now = new Date();

      // Find the gate pass by ID
      const gatePass = await GatePass.findByPk(gatePassId, {
        include: [{ model: User, as: 'student' }]
      });

      if (!gatePass) {
        return res.status(404).json({ 
          success: false,
          error: 'Gate pass not found' 
        });
      }

      // Check if gate pass is approved (admin_approved status)
      const request = await require('../models/GatePassRequest').findByPk(gatePass.requestId);
      // allow issued or admin_approved statuses as valid for exit
      if (!request || ![REQUEST_STATUS.ADMIN_APPROVED, REQUEST_STATUS.ISSUED].includes(request.status)) {
        return res.status(400).json({ 
          success: false,
          error: 'Gate pass not approved for exit' 
        });
      }

      // Check if already used
      if (gatePass.isUsed) {
        return res.status(400).json({ 
          success: false,
          error: 'Gate pass already used' 
        });
      }

      // Check if expired
      if (now > gatePass.validUntil) {
        return res.status(400).json({ 
          success: false,
          error: 'Gate pass expired' 
        });
      }

      // Record gate entry
      const gateEntry = await GateEntry.create({
        gatePassId: gatePass.id,
        studentId: gatePass.studentId,
        gate: 'Main Gate',
        scanTime: now,
        status: ENTRY_STATUS.ALLOWED
      });

      // Mark gate pass as used
      await gatePass.update({
        isUsed: true,
        usedAt: now
      });

      // Update request status to USED
      if (request) {
        await request.update({
          status: REQUEST_STATUS.USED
        });
      }

      await AuditLog.create({
        userId: gatePass.studentId,
        action: 'GATE_ENTRY_RECORDED',
        entityType: 'GateEntry',
        entityId: gateEntry.id,
        status: 'success'
      });

      res.json({
        success: true,
        message: 'Gate entry recorded successfully',
        gatePass: {
          id: gatePass.id,
          destination: request.destination,
          reason: request.reason,
          outTime: request.outTime,
          inTime: request.inTime,
          student: gatePass.student,
          validUntil: gatePass.validUntil
        }
      });
    } catch (error) {
      console.error('QR Verification error:', error);
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  }

  static async denyAccess(req, res) {
    try {
      const { passCode, gate, remarks } = req.validatedData;
      const securityPersonId = req.user?.id || null;

      const gatePass = await GatePass.findOne({ where: { passCode } });

      if (!gatePass) {
        return res.status(404).json({ error: 'Gate pass not found' });
      }

      const gateEntry = await GateEntry.create({
        gatePassId: gatePass.id,
        studentId: gatePass.studentId,
        gate,
        scanTime: new Date(),
        status: ENTRY_STATUS.DENIED,
        securityPersonId,
        remarks
      });

      await AuditLog.create({
        userId: securityPersonId,
        action: 'DENY_GATE_ACCESS',
        entityType: 'GateEntry',
        entityId: gateEntry.id,
        status: 'success'
      });

      res.json({
        message: 'Access denied',
        entry: gateEntry
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getGateEntries(req, res) {
    try {
      const { startDate, endDate, gate, status } = req.query;

      let where = {};
      if (startDate || endDate) {
        where.scanTime = {};
        if (startDate) where.scanTime.$gte = new Date(startDate);
        if (endDate) where.scanTime.$lte = new Date(endDate);
      }
      if (gate) where.gate = gate;
      if (status) where.status = status;

      const entries = await GateEntry.findAll({
        where,
        include: [
          { model: User, as: 'student', attributes: ['firstName', 'lastName', 'registrationNumber'] },
          { model: GatePass, attributes: ['passCode'] }
        ],
        order: [['scanTime', 'DESC']]
      });

      res.json({
        message: 'Gate entries retrieved successfully',
        entries
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = GateEntryController;
