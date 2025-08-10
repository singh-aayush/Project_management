import type { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

// Define a custom error class
class ValidationError extends Error {
  status: number;
  errors: any[];

  constructor(message: string, errors: any[]) {
    super(message);
    this.status = 400;
    this.errors = errors;
  }
}

export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError('Validation failed', errors.array());
  }
  next();
};