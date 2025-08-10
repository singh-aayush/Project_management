import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface JwtPayload {
  id: string;
}

export const authMiddleware = (
  req: Request & { user?: string },
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  if (!process.env.JWT_TOKEN) {
    console.error('❌ JWT_TOKEN is missing in .env');
    return res.status(500).json({ message: 'Server configuration error' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN) as JwtPayload;
    req.user = decoded.id;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
