import type { Request, Response } from 'express';
import { User } from '../models/user.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// ✅ Load env variables
dotenv.config();

export const register = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  console.log("📩 Register request body:", { email, password, name });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashed = await hashPassword(password);

    const user = await User.create({ email, password: hashed, name });

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user._id, email: user.email },
    });
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({
      message: 'Server error',
      error: err instanceof Error ? err.message : err
    });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // ✅ Use env variable instead of config file
    if (!process.env.JWT_TOKEN) {
      console.error('❌ JWT_TOKEN not set in .env file');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_TOKEN, { expiresIn: '1d' });

    res.json({ token });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({
      message: 'Server error',
      error: err instanceof Error ? err.message : err
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    // If you're using cookies for JWT storage:
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    // If JWT is sent in localStorage on frontend, 
    // the frontend should just delete it — server can still send success.
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error("❌ Logout error:", err);
    res.status(500).json({
      message: 'Server error',
      error: err instanceof Error ? err.message : err
    });
  }
};