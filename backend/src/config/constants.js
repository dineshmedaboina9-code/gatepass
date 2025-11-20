// Departments
const DEPARTMENTS = ['CSE', 'IT', 'ECE', 'EEE', 'DS', 'CS'];

// User Roles
const ROLES = {
  STUDENT: 'student',
  HOD: 'hod',
  ADMIN: 'admin',
  SECURITY: 'security',
  GATEKEEPER: 'gatekeeper'
};

// Gate Pass Request Status
const REQUEST_STATUS = {
  PENDING: 'pending',
  HOD_APPROVED: 'hod_approved',
  HOD_REJECTED: 'hod_rejected',
  ADMIN_APPROVED: 'admin_approved',
  ADMIN_REJECTED: 'admin_rejected',
  ISSUED: 'issued',
  USED: 'used',
  EXPIRED: 'expired',
  CANCELLED: 'cancelled'
};

// Gate Entry Status
const ENTRY_STATUS = {
  ALLOWED: 'allowed',
  DENIED: 'denied',
  PENDING_VALIDATION: 'pending_validation'
};

module.exports = {
  DEPARTMENTS,
  ROLES,
  REQUEST_STATUS,
  ENTRY_STATUS
};
