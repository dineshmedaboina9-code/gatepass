const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GatePass = sequelize.define('GatePass', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  requestId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'GatePassRequests',
      key: 'id'
    }
  },
  studentId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  passCode: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  qrCode: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  validFrom: {
    type: DataTypes.DATE,
    allowNull: false
  },
  validUntil: {
    type: DataTypes.DATE,
    allowNull: false
  },
  isUsed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  usedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  isExpired: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true
});

module.exports = GatePass;
