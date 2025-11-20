-- Use the database
USE gate_pass_system;

-- Sample data for testing

-- Insert admin user
INSERT INTO Users (id, email, password, firstName, lastName, role, isActive) VALUES
('admin-001', 'admin@gatepass.com', '$2a$10$...', 'Admin', 'User', 'admin', true);

-- Insert HoD users for each department
INSERT INTO Users (id, email, password, firstName, lastName, role, department, isActive) VALUES
('hod-cse-001', 'hod.cse@gatepass.com', '$2a$10$...', 'Cse', 'Head', 'hod', 'CSE', true),
('hod-it-001', 'hod.it@gatepass.com', '$2a$10$...', 'It', 'Head', 'hod', 'IT', true),
('hod-ece-001', 'hod.ece@gatepass.com', '$2a$10$...', 'Ece', 'Head', 'hod', 'ECE', true),
('hod-eee-001', 'hod.eee@gatepass.com', '$2a$10$...', 'Eee', 'Head', 'hod', 'EEE', true);

-- Insert sample students
INSERT INTO Users (id, email, password, firstName, lastName, role, department, registrationNumber, isActive) VALUES
('student-001', 'student1@college.com', '$2a$10$...', 'John', 'Doe', 'student', 'CSE', 'CSE001', true),
('student-002', 'student2@college.com', '$2a$10$...', 'Jane', 'Smith', 'student', 'IT', 'IT001', true),
('student-003', 'student3@college.com', '$2a$10$...', 'Mike', 'Johnson', 'student', 'ECE', 'ECE001', true);

-- Insert security personnel
INSERT INTO Users (id, email, password, firstName, lastName, role, isActive) VALUES
('security-001', 'security.gate1@gatepass.com', '$2a$10$...', 'Security', 'Personnel', 'security', true),
('security-002', 'security.gate2@gatepass.com', '$2a$10$...', 'Gate', 'Guard', 'security', true);
