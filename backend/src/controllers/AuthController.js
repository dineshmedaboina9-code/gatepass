const User = require('../models/User');
const { generateToken, hashPassword, comparePassword } = require('../utils/authUtils');
const AuditLog = require('../models/AuditLog');

class AuthController {
  static async register(req, res) {
    try {
      const { email, password, firstName, lastName, role, department, registrationNumber } = req.validatedData;

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ error: 'Email already registered' });
      }

      const hashedPassword = await hashPassword(password);

      const user = await User.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role,
        department,
        registrationNumber
      });

      await AuditLog.create({
        userId: user.id,
        action: 'REGISTER',
        entityType: 'User',
        entityId: user.id,
        status: 'success'
      });

      const token = generateToken(user);
      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        },
        token
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: error.message || 'Registration failed' });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.validatedData;

      const user = await User.findOne({ where: { email } });
      if (!user || !await comparePassword(password, user.password)) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      if (!user.isActive) {
        return res.status(403).json({ error: 'User account is inactive' });
      }

      await user.update({ lastLogin: new Date() });

      await AuditLog.create({
        userId: user.id,
        action: 'LOGIN',
        entityType: 'User',
        entityId: user.id,
        status: 'success'
      });

      const token = generateToken(user);
      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          department: user.department
        },
        token
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async logout(req, res) {
    try {
      await AuditLog.create({
        userId: req.user.id,
        action: 'LOGOUT',
        entityType: 'User',
        entityId: req.user.id,
        status: 'success'
      });

      res.json({ message: 'Logout successful' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AuthController;
