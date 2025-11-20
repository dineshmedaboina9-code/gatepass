const sequelize = require('./src/config/database');
const User = require('./src/models/User');
const { hashPassword } = require('./src/utils/authUtils');
const { v4: uuidv4 } = require('uuid');

const gatekeepers = [
  { email: 'gatekeeper1@university.edu', firstName: 'Gate', lastName: 'Keeper 1' },
  { email: 'gatekeeper2@university.edu', firstName: 'Gate', lastName: 'Keeper 2' }
];

const password = 'GateKeeper@123';

async function createGateKeepers() {
  try {
    console.log('Starting GateKeeper account creation...');
    
    const hashedPassword = await hashPassword(password);
    
    for (const gk of gatekeepers) {
      // Check if GateKeeper already exists
      const existing = await User.findOne({ where: { email: gk.email } });
      
      if (existing) {
        console.log(`GateKeeper already exists: ${gk.email}`);
        continue;
      }
      
      const gatekeeper = await User.create({
        id: uuidv4(),
        email: gk.email,
        password: hashedPassword,
        firstName: gk.firstName,
        lastName: gk.lastName,
        role: 'gatekeeper',
        isActive: true
      });
      
      console.log(`✓ Created GateKeeper: ${gk.email}`);
    }
    
    console.log('\nAll GateKeeper accounts created successfully!');
    console.log(`\nLogin credentials for all GateKeepers:`);
    console.log(`Password: ${password}`);
    console.log(`\nEmails:`);
    gatekeepers.forEach(gk => console.log(`  - ${gk.email}`));
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating GateKeeper accounts:', error);
    process.exit(1);
  }
}

createGateKeepers();
