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

async function checkAndReset() {
  try {
    console.log('Connecting to Neon database...');
    await sequelize.authenticate();
    console.log('Connection established successfully.');

    // List all users
    const users = await User.findAll({ attributes: ['email', 'role', 'department'] });
    console.log('\n--- Existing Users in Neon Database ---');
    users.forEach(u => {
      console.log(`Email: ${u.email} | Role: ${u.role} | Dept: ${u.department || 'N/A'}`);
    });
    console.log('----------------------------------------\n');

    const dsEmail = 'hod.ds@university.edu';
    const targetPassword = 'HoD@123456';
    const hashedPassword = await bcrypt.hash(targetPassword, 10);

    const dsHod = await User.findOne({ where: { email: dsEmail } });
    if (dsHod) {
      console.log(`Found DS HoD account: ${dsEmail}. Resetting password...`);
      await dsHod.update({ password: hashedPassword });
      console.log('✓ Password reset successfully!');
    } else {
      console.log(`DS HoD account not found. Creating a fresh one...`);
      await User.create({
        id: uuidv4(),
        email: dsEmail,
        password: hashedPassword,
        firstName: 'DS',
        lastName: 'Head',
        role: 'hod',
        department: 'DS',
        isActive: true
      });
      console.log('✓ Created fresh DS HoD account successfully!');
    }

    // Verify Admin account too
    const adminEmail = 'admin.portal@test.com';
    const adminPass = 'Admin@12345';
    const hashedAdminPass = await bcrypt.hash(adminPass, 10);
    const adminUser = await User.findOne({ where: { email: adminEmail } });
    if (adminUser) {
      console.log(`Verifying Admin account. Resetting password to Admin@12345...`);
      await adminUser.update({ password: hashedAdminPass });
      console.log('✓ Admin password reset successfully!');
    } else {
      console.log('Admin account not found. Creating fresh one...');
      await User.create({
        id: uuidv4(),
        email: adminEmail,
        password: hashedAdminPass,
        firstName: 'Admin',
        lastName: 'Portal',
        role: 'admin',
        isActive: true
      });
      console.log('✓ Created fresh Admin account successfully!');
    }

  } catch (error) {
    console.error('Error running script:', error);
  } finally {
    await sequelize.close();
  }
}

checkAndReset();
