const GatePass = require('../models/GatePass');
const GatePassRequest = require('../models/GatePassRequest');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const { generatePassCode, generateQRCode } = require('../utils/barcodeUtils');
const { sendGatePassEmail } = require('../utils/emailService');
const { REQUEST_STATUS } = require('../config/constants');

class GatePassController {
  static async generateGatePass(req, res) {
    try {
      const { requestId } = req.params;

      const request = await GatePassRequest.findByPk(requestId, {
        include: { model: User, as: 'student' }
      });

      if (!request) {
        return res.status(404).json({ error: 'Request not found' });
      }

      if (request.status !== REQUEST_STATUS.ADMIN_APPROVED) {
        return res.status(400).json({ error: 'Request must be admin approved' });
      }

      const passCode = generatePassCode();
      const qrData = {
        passCode,
        studentId: request.studentId,
        destination: request.destination,
        outTime: request.outTime,
        inTime: request.inTime
      };

      const qrCode = await generateQRCode(qrData);

      const gatePass = await GatePass.create({
        requestId,
        studentId: request.studentId,
        passCode,
        qrCode,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000) // Valid for 24 hours
      });

      await request.update({ status: REQUEST_STATUS.ISSUED });

      await AuditLog.create({
        userId: req.user.id,
        action: 'GENERATE_GATE_PASS',
        entityType: 'GatePass',
        entityId: gatePass.id,
        status: 'success'
      });

      await sendGatePassEmail(
        request.student.email,
        `${request.student.firstName} ${request.student.lastName}`,
        passCode,
        qrCode
      );

      res.status(201).json({
        message: 'Gate pass generated successfully',
        gatePass
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getStudentGatePass(req, res) {
    try {
      const studentId = req.user.id;

      const gatePasses = await GatePass.findAll({
        where: { studentId },
        include: { 
          model: GatePassRequest, 
          attributes: ['id', 'destination', 'reason', 'outTime', 'inTime', 'status']
        },
        order: [['createdAt', 'DESC']]
      });

      // Rename the association for frontend compatibility
      const formattedPasses = gatePasses.map(pass => {
        const passData = pass.toJSON();
        passData.request = passData.GatePassRequest;
        delete passData.GatePassRequest;
        return passData;
      });

      res.json({
        message: 'Gate passes retrieved successfully',
        gatePasses: formattedPasses
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async downloadGatePass(req, res) {
    try {
      const { gatePassId } = req.params;

      const gatePass = await GatePass.findByPk(gatePassId);

      if (!gatePass) {
        return res.status(404).json({ error: 'Gate pass not found' });
      }

      res.json({
        message: 'Gate pass retrieved for download',
        gatePass
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async emailGatePass(req, res) {
    try {
      const { gatePassId } = req.params;

      const gatePass = await GatePass.findByPk(gatePassId, {
        include: { model: User, as: 'student' }
      });

      if (!gatePass) {
        return res.status(404).json({ error: 'Gate pass not found' });
      }

      await sendGatePassEmail(
        gatePass.student.email,
        `${gatePass.student.firstName} ${gatePass.student.lastName}`,
        gatePass.passCode,
        gatePass.qrCode
      );

      res.json({ message: 'Gate pass emailed successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = GatePassController;
