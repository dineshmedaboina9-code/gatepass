const User = require('../models/User');
const { hashPassword } = require('./authUtils');
const { v4: uuidv4 } = require('uuid');

const HOD_PASSWORD = 'HoD@123456';
const ADMIN_PASSWORD = 'Admin@12345';
const GATEKEEPER_PASSWORD = 'GateKeeper@123';
const STUDENT_PASSWORD = 'Student@123';

const departments = [
  { dept: 'CSE', email: 'hod.cse@university.edu', firstName: 'CSE', lastName: 'Head' },
  { dept: 'IT', email: 'hod.it@university.edu', firstName: 'IT', lastName: 'Head' },
  { dept: 'ECE', email: 'hod.ece@university.edu', firstName: 'ECE', lastName: 'Head' },
  { dept: 'EEE', email: 'hod.eee@university.edu', firstName: 'EEE', lastName: 'Head' },
  { dept: 'DS', email: 'hod.ds@university.edu', firstName: 'DS', lastName: 'Head' },
  { dept: 'CS', email: 'hod.cs@university.edu', firstName: 'CS', lastName: 'Head' }
];

const gatekeepers = [
  { email: 'gatekeeper1@university.edu', firstName: 'Gate', lastName: 'Keeper 1' },
  { email: 'gatekeeper2@university.edu', firstName: 'Gate', lastName: 'Keeper 2' }
];

const students = [
  { email: 'student1@college.com', firstName: 'John', lastName: 'Doe', dept: 'CSE', regNo: 'CSE001' },
  { email: 'student2@college.com', firstName: 'Jane', lastName: 'Smith', dept: 'IT', regNo: 'IT001' }
];

async function seedDatabase() {
  try {
    const userCount = await User.count();
    if (userCount > 0) {
      console.log('Database already has data. Skipping seeder.');
      return;
    }

    console.log('Database is empty. Seeding default accounts...');

    // 1. Create Admin
    const hashedAdminPass = await hashPassword(ADMIN_PASSWORD);
    await User.create({
      id: 'admin-001',
      email: 'admin.portal@test.com',
      password: hashedAdminPass,
      firstName: 'Admin',
      lastName: 'Portal',
      role: 'admin',
      isActive: true
    });
    console.log('✓ Seeded Admin account: admin.portal@test.com');

    // 2. Create HoDs
    const hashedHodPass = await hashPassword(HOD_PASSWORD);
    for (const dept of departments) {
      await User.create({
        id: uuidv4(),
        email: dept.email,
        password: hashedHodPass,
        firstName: dept.firstName,
        lastName: dept.lastName,
        role: 'hod',
        department: dept.dept,
        isActive: true
      });
      console.log(`✓ Seeded HoD for ${dept.dept}: ${dept.email}`);
    }

    // 3. Create Gatekeepers
    const hashedGkPass = await hashPassword(GATEKEEPER_PASSWORD);
    for (const gk of gatekeepers) {
      await User.create({
        id: uuidv4(),
        email: gk.email,
        password: hashedGkPass,
        firstName: gk.firstName,
        lastName: gk.lastName,
        role: 'gatekeeper',
        isActive: true
      });
      console.log(`✓ Seeded GateKeeper: ${gk.email}`);
    }

    // 4. Create Students
    const hashedStudentPass = await hashPassword(STUDENT_PASSWORD);
    for (const st of students) {
      await User.create({
        id: uuidv4(),
        email: st.email,
        password: hashedStudentPass,
        firstName: st.firstName,
        lastName: st.lastName,
        role: 'student',
        department: st.dept,
        registrationNumber: st.regNo,
        isActive: true
      });
      console.log(`✓ Seeded Student: ${st.email}`);
    }

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

module.exports = { seedDatabase };
