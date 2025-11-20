const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { ENTRY_STATUS } = require('../config/constants');

const GateEntry = sequelize.define('GateEntry', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  gatePassId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'GatePasses',
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
  gate: {
    type: DataTypes.STRING,
    allowNull: false
  },
  scanTime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  status: {
    type: DataTypes.ENUM(...Object.values(ENTRY_STATUS)),
    defaultValue: ENTRY_STATUS.PENDING_VALIDATION,
    allowNull: false
  },
  securityPersonId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  remarks: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = GateEntry;
