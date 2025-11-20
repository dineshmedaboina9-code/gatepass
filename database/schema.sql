-- Create Database
CREATE DATABASE IF NOT EXISTS gate_pass_system;
USE gate_pass_system;

-- Users Table
CREATE TABLE Users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  role ENUM('student', 'hod', 'admin', 'security') DEFAULT 'student',
  department VARCHAR(50),
  registrationNumber VARCHAR(50) UNIQUE,
  profileImage LONGTEXT,
  isActive BOOLEAN DEFAULT true,
  lastLogin DATETIME,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_department (department)
);

-- Gate Pass Requests Table
CREATE TABLE GatePassRequests (
  id VARCHAR(36) PRIMARY KEY,
  studentId VARCHAR(36) NOT NULL,
  reason TEXT NOT NULL,
  destination VARCHAR(255) NOT NULL,
  outTime DATETIME NOT NULL,
  inTime DATETIME,
  status ENUM('pending', 'hod_approved', 'hod_rejected', 'admin_approved', 'admin_rejected', 'issued', 'used', 'expired', 'cancelled') DEFAULT 'pending',
  hodId VARCHAR(36),
  hodApprovedAt DATETIME,
  hodRemarks TEXT,
  adminId VARCHAR(36),
  adminApprovedAt DATETIME,
  adminRemarks TEXT,
  department VARCHAR(50) NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (studentId) REFERENCES Users(id),
  FOREIGN KEY (hodId) REFERENCES Users(id),
  FOREIGN KEY (adminId) REFERENCES Users(id),
  INDEX idx_studentId (studentId),
  INDEX idx_status (status),
  INDEX idx_department (department),
  INDEX idx_createdAt (createdAt)
);

-- Gate Passes Table
CREATE TABLE GatePasses (
  id VARCHAR(36) PRIMARY KEY,
  requestId VARCHAR(36) NOT NULL,
  studentId VARCHAR(36) NOT NULL,
  passCode VARCHAR(100) NOT NULL UNIQUE,
  qrCode LONGTEXT NOT NULL,
  validFrom DATETIME NOT NULL,
  validUntil DATETIME NOT NULL,
  isUsed BOOLEAN DEFAULT false,
  usedAt DATETIME,
  isExpired BOOLEAN DEFAULT false,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (requestId) REFERENCES GatePassRequests(id),
  FOREIGN KEY (studentId) REFERENCES Users(id),
  INDEX idx_passCode (passCode),
  INDEX idx_studentId (studentId),
  INDEX idx_validUntil (validUntil)
);

-- Gate Entries Table
CREATE TABLE GateEntries (
  id VARCHAR(36) PRIMARY KEY,
  gatePassId VARCHAR(36) NOT NULL,
  studentId VARCHAR(36) NOT NULL,
  gate VARCHAR(50) NOT NULL,
  scanTime DATETIME DEFAULT CURRENT_TIMESTAMP,
  status ENUM('allowed', 'denied', 'pending_validation') DEFAULT 'pending_validation',
  securityPersonId VARCHAR(36),
  remarks TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (gatePassId) REFERENCES GatePasses(id),
  FOREIGN KEY (studentId) REFERENCES Users(id),
  FOREIGN KEY (securityPersonId) REFERENCES Users(id),
  INDEX idx_studentId (studentId),
  INDEX idx_scanTime (scanTime),
  INDEX idx_status (status)
);

-- Audit Logs Table
CREATE TABLE AuditLogs (
  id VARCHAR(36) PRIMARY KEY,
  userId VARCHAR(36),
  action VARCHAR(100) NOT NULL,
  entityType VARCHAR(50) NOT NULL,
  entityId VARCHAR(100) NOT NULL,
  previousValue JSON,
  newValue JSON,
  ipAddress VARCHAR(45),
  userAgent TEXT,
  status VARCHAR(20) DEFAULT 'success',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES Users(id),
  INDEX idx_userId (userId),
  INDEX idx_action (action),
  INDEX idx_createdAt (createdAt)
);

-- Notifications Table
CREATE TABLE Notifications (
  id VARCHAR(36) PRIMARY KEY,
  userId VARCHAR(36) NOT NULL,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  relatedEntityType VARCHAR(50),
  relatedEntityId VARCHAR(100),
  isRead BOOLEAN DEFAULT false,
  sentVia VARCHAR(50),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES Users(id),
  INDEX idx_userId (userId),
  INDEX idx_isRead (isRead),
  INDEX idx_createdAt (createdAt)
);

-- Create database indexes for performance
CREATE INDEX idx_requests_status_department ON GatePassRequests(status, department);
CREATE INDEX idx_gatepass_validuntil_used ON GatePasses(validUntil, isUsed);
CREATE INDEX idx_gateentry_gate_date ON GateEntries(gate, scanTime);
