const User = require('./User');
const GatePassRequest = require('./GatePassRequest');
const GatePass = require('./GatePass');
const GateEntry = require('./GateEntry');
const AuditLog = require('./AuditLog');
const Notification = require('./Notification');

// Define associations
// GatePassRequest associations
GatePassRequest.belongsTo(User, { as: 'student', foreignKey: 'studentId', targetKey: 'id' });
GatePassRequest.belongsTo(User, { as: 'hod', foreignKey: 'hodId', targetKey: 'id' });
GatePassRequest.belongsTo(User, { as: 'admin', foreignKey: 'adminId', targetKey: 'id' });

// GatePass associations
GatePass.belongsTo(GatePassRequest, { foreignKey: 'requestId', targetKey: 'id' });
GatePass.belongsTo(User, { as: 'student', foreignKey: 'studentId', targetKey: 'id' });

// GateEntry associations
GateEntry.belongsTo(GatePass, { foreignKey: 'gatePassId', targetKey: 'id' });
GateEntry.belongsTo(User, { as: 'student', foreignKey: 'studentId', targetKey: 'id' });

// AuditLog associations
AuditLog.belongsTo(User, { foreignKey: 'userId', targetKey: 'id' });

// Notification associations
Notification.belongsTo(User, { as: 'recipient', foreignKey: 'recipientId', targetKey: 'id' });

// Reverse associations for User
User.hasMany(GatePassRequest, { as: 'studentRequests', foreignKey: 'studentId' });
User.hasMany(GatePassRequest, { as: 'hodApprovals', foreignKey: 'hodId' });
User.hasMany(GatePassRequest, { as: 'adminApprovals', foreignKey: 'adminId' });
User.hasMany(GatePass, { as: 'gatePasses', foreignKey: 'studentId' });
User.hasMany(GateEntry, { as: 'gateEntries', foreignKey: 'studentId' });
User.hasMany(AuditLog, { as: 'auditLogs', foreignKey: 'userId' });
User.hasMany(Notification, { as: 'notifications', foreignKey: 'recipientId' });

module.exports = {
  User,
  GatePassRequest,
  GatePass,
  GateEntry,
  AuditLog,
  Notification
};
