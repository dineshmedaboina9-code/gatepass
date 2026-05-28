const { Sequelize } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

const dbUrl = 'postgresql://neondb_owner:npg_x7ESMrasLfw1@ep-fragrant-cherry-apwon2xk-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const sequelize = new Sequelize(dbUrl, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false
    }
  }
});

const User = sequelize.define('User', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true
  },
  email: {
    type: Sequelize.STRING,
    unique: true
  },
  password: {
    type: Sequelize.STRING
  },
  firstName: {
    type: Sequelize.STRING
  },
  lastName: {
    type: Sequelize.STRING
  },
  role: {
    type: Sequelize.STRING
  },
  department: {
    type: Sequelize.STRING
  },
  isActive: {
    type: Sequelize.BOOLEAN
  }
}, {
  timestamps: true
});

const HOD_PASSWORD = 'HoD@123456';
const GATEKEEPER_PASSWORD = 'GateKeeper@123';

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

async function forceSeedAll() {
  try {
    console.log('Connecting to Neon database...');
    await sequelize.authenticate();
    console.log('Connection established. Force-seeding missing HODs and Gatekeepers...');

    // Hash passwords
    const hashedHodPass = await bcrypt.hash(HOD_PASSWORD, 10);
    const hashedGkPass = await bcrypt.hash(GATEKEEPER_PASSWORD, 10);

    // 1. Create HoDs if missing
    for (const dept of departments) {
      const existing = await User.findOne({ where: { email: dept.email } });
      if (!existing) {
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
        console.log(`✓ Force-seeded HOD for ${dept.dept}: ${dept.email}`);
      } else {
        console.log(`- HOD for ${dept.dept} already exists: ${dept.email}`);
      }
    }

    // 2. Create Gatekeepers if missing
    for (const gk of gatekeepers) {
      const existing = await User.findOne({ where: { email: gk.email } });
      if (!existing) {
        await User.create({
          id: uuidv4(),
          email: gk.email,
          password: hashedGkPass,
          firstName: gk.firstName,
          lastName: gk.lastName,
          role: 'gatekeeper',
          isActive: true
        });
        console.log(`✓ Force-seeded GateKeeper: ${gk.email}`);
      } else {
        console.log(`- GateKeeper already exists: ${gk.email}`);
      }
    }

    console.log('\nAll default accounts successfully verified and created in your Neon cloud database!');

  } catch (error) {
    console.error('Error running script:', error);
  } finally {
    await sequelize.close();
  }
}

forceSeedAll();
