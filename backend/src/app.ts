import express from 'express';
import type {Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/project.js';
import taskRoutes from './routes/task.js';
import { errorHandler } from './middleware/errorHandler.js';

// ✅ Load environment variables first
dotenv.config();

const app = express();

// ✅ Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// ✅ Ensure Mongo URL exists
if (!process.env.MONGO_URL) {
  console.error('❌ MONGO_URL is missing in .env file');
  process.exit(1);
}

// ✅ Debug log to check value (remove in production)
console.log('Connecting to MongoDB:', process.env.MONGO_URL);

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1); // Stop server if DB fails
  });

// ✅ Health route
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ success: true, message: 'API is healthy' });
});

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api', taskRoutes);

// ✅ Error handler
app.use(errorHandler);

export default app;
