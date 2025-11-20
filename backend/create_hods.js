const sequelize = require('./src/config/database');
const User = require('./src/models/User');
const { hashPassword } = require('./src/utils/authUtils');
const { v4: uuidv4 } = require('uuid');

const departments = [
  { dept: 'CSE', email: 'hod.cse@university.edu', firstName: 'CSE', lastName: 'Head' },
  { dept: 'IT', email: 'hod.it@university.edu', firstName: 'IT', lastName: 'Head' },
  { dept: 'ECE', email: 'hod.ece@university.edu', firstName: 'ECE', lastName: 'Head' },
  { dept: 'EEE', email: 'hod.eee@university.edu', firstName: 'EEE', lastName: 'Head' },
  { dept: 'DS', email: 'hod.ds@university.edu', firstName: 'DS', lastName: 'Head' },
  { dept: 'CS', email: 'hod.cs@university.edu', firstName: 'CS', lastName: 'Head' }
];

const password = 'HoD@123456';

async function createHoDs() {
  try {
    console.log('Starting HoD account creation...');
    
    const hashedPassword = await hashPassword(password);
    
    for (const dept of departments) {
      // Check if HoD already exists
      const existing = await User.findOne({ where: { email: dept.email } });
      
      if (existing) {
        console.log(`HoD for ${dept.dept} already exists: ${dept.email}`);
        continue;
      }
      
      const hod = await User.create({
        id: uuidv4(),
        email: dept.email,
        password: hashedPassword,
        firstName: dept.firstName,
        lastName: dept.lastName,
        role: 'hod',
        department: dept.dept,
        isActive: true
      });
      
      console.log(`✓ Created HoD for ${dept.dept}: ${dept.email}`);
    }
    
    console.log('\nAll HoD accounts created successfully!');
    console.log(`\nLogin credentials for all HoDs:`);
    console.log(`Password: ${password}`);
    console.log(`\nEmails:`);
    departments.forEach(d => console.log(`  - ${d.email}`));
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating HoD accounts:', error);
    process.exit(1);
  }
}

createHoDs();
