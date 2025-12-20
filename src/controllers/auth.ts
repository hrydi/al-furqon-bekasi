import { Request, Response, NextFunction } from 'express';
import { prisma } from '../models/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { responseHelper } from '../utils/responseHelper';
import { RegisterRequest, LoginRequest, AuthResponse } from '../types/auth';
import { AppError } from '../middleware/error';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Password strength regex: at least 8 chars, 1 uppercase, 1 lowercase, 1 number
const passwordStrengthRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

export const AuthController = {
  register: async (req: Request<{}, {}, RegisterRequest>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password, name, username } = req.body;

      if (!passwordStrengthRegex.test(password)) {
        throw new AppError(400, 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number');
      }

      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        throw new AppError(400, 'Email already registered');
      }

      // Check if username already exists (if provided)
      if (username) {
        const existingUsername = await prisma.user.findUnique({
          where: { username }
        });

        if (existingUsername) {
          throw new AppError(400, 'Username already taken');
        }
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          username: username || email.split('@')[0] // Generate username from email if not provided
        },
        select: {
          id: true,
          email: true,
          name: true,
          username: true,
          role: true
        }
      });

      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      const response: AuthResponse = {
        token,
        user
      };

      responseHelper(res, 201, 'User registered successfully', response);
    } catch (error) {
      next(error);
    }
  },

  login: async (req: Request<{}, {}, LoginRequest>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, username, password } = req.body;

      // Support login with email OR username
      const loginIdentifier = email || username;
      if (!loginIdentifier) {
        throw new AppError(400, 'Email or username is required');
      }

      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { email: loginIdentifier },
            { username: loginIdentifier }
          ]
        },
        select: {
          id: true,
          email: true,
          password: true,
          name: true,
          username: true,
          role: true
        }
      });

      if (!user) {
        // Use a generic message to prevent user enumeration
        throw new AppError(401, 'Invalid credentials');
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        throw new AppError(401, 'Invalid credentials');
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      const { password: _, ...userWithoutPassword } = user;
      const response: AuthResponse = {
        token,
        user: userWithoutPassword
      };

      responseHelper(res, 200, 'Login successful', response);
    } catch (error) {
      next(error);
    }
  }
};
