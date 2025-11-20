const AuditLog = require('../models/AuditLog');

const auditLog = async (req, res, next) => {
  // Capture original send
  const originalSend = res.send;

  res.send = function (data) {
    // Log after response
    try {
      const log = {
        userId: req.user?.id || null,
        action: req.method,
        entityType: req.path,
        entityId: req.params.id || 'N/A',
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
        status: res.statusCode < 400 ? 'success' : 'failure'
      };

      AuditLog.create(log).catch(err => console.error('Audit log error:', err));
    } catch (err) {
      console.error('Audit middleware error:', err);
    }

    res.send = originalSend;
    return res.send(data);
  };

  next();
};

module.exports = auditLog;
