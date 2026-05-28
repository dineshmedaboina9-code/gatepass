const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { REQUEST_STATUS } = require('../config/constants');
const { v4: uuidv4 } = require('uuid');

const GatePassRequest = sequelize.define('GatePassRequest', {
  id: {
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
    primaryKey: true
  },
  studentId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  destination: {
    type: DataTypes.STRING,
    allowNull: false
  },
  outTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  inTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: REQUEST_STATUS.PENDING,
    allowNull: false
  },
  hodId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  hodApprovedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  hodRemarks: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  adminId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  adminApprovedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  adminRemarks: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  department: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true
});

module.exports = GatePassRequest;
