const express = require('express');
const Joi = require('joi');
const AuthController = require('../controllers/AuthController');
const authenticateToken = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validationMiddleware');

const router = express.Router();

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  role: Joi.string().valid('student').required(),
  department: Joi.string().required(),
  registrationNumber: Joi.string().required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

router.post('/register', validateRequest(registerSchema), AuthController.register);
router.post('/login', validateRequest(loginSchema), AuthController.login);
router.post('/logout', authenticateToken, AuthController.logout);

module.exports = router;
