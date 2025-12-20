import express, { RequestHandler } from 'express';
import { AuthController } from '../controllers/auth';
import validate from '../middleware/validation';
import { authLimiter } from '../middleware/rateLimiter';

const router = express.Router();

const register: RequestHandler = AuthController.register;
const login: RequestHandler = AuthController.login;

const registerValidation = validate({
  email: {
    required: true,
    type: 'string',
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: {
    required: true,
    type: 'string',
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
  },
  name: {
    required: true,
    type: 'string',
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s]+$/ // Only letters and spaces allowed
  }
});

const loginValidation = validate({
  username: {
    required: false,
    type: 'string',
    minLength: 3
  },
  email: {
    required: false,
    type: 'string',
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: {
    required: true,
    type: 'string',
    minLength: 6
  }
});

// Add rate limiting to registration to prevent spam
router.post('/register', authLimiter, registerValidation, register);
// Add rate limiting to login to prevent brute force attacks
router.post('/login', authLimiter, loginValidation, login);

export default router;
