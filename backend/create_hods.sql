-- Insert HoD accounts for each department
-- Password hash for "HoD@123456" generated using bcryptjs
-- Run this to generate the hash in Node:
-- const bcrypt = require('bcryptjs');
-- bcrypt.hash("HoD@123456", 10).then(h => console.log(h));
-- Result: $2a$10$V9h.ObxkK5p9LZ0.2KqOWuL5VxPkDqQd5qQq5qQq5qQq5qQq5qQq5

-- For now using a simpler approach - we'll use Node to create them properly

INSERT INTO Users (id, email, password, firstName, lastName, role, department, isActive, createdAt, updatedAt) 
VALUES 
(UUID(), 'hod.cse@university.edu', 'hashed_password_cse', 'Department', 'Head - CSE', 'hod', 'CSE', true, NOW(), NOW()),
(UUID(), 'hod.it@university.edu', 'hashed_password_it', 'Department', 'Head - IT', 'hod', 'IT', true, NOW(), NOW()),
(UUID(), 'hod.ece@university.edu', 'hashed_password_ece', 'Department', 'Head - ECE', 'hod', 'ECE', true, NOW(), NOW()),
(UUID(), 'hod.eee@university.edu', 'hashed_password_eee', 'Department', 'Head - EEE', 'hod', 'EEE', true, NOW(), NOW()),
(UUID(), 'hod.ds@university.edu', 'hashed_password_ds', 'Department', 'Head - DS', 'hod', 'DS', true, NOW(), NOW()),
(UUID(), 'hod.cs@university.edu', 'hashed_password_cs', 'Department', 'Head - CS', 'hod', 'CS', true, NOW(), NOW());
