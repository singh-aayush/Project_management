// src/config.ts
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

if (!process.env.MONGO_URL) {
  throw new Error('MONGO_URL is missing in .env');
}
if (!process.env.JWT_TOKEN) {
  throw new Error('JWT_TOKEN is missing in .env');
}

export const config = {
  mongoUrl: process.env.MONGO_URL as string,
  jwtSecret: process.env.JWT_TOKEN as string,
  port: process.env.PORT ? Number(process.env.PORT) : 3333,
};
