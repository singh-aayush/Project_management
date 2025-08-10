import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, logout } from '../controllers/authController.js';
import { validate } from '../middleware/validate.js';

const router = Router();

/**
 * Register
 * POST /api/auth/register
 */
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Must be a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
    body('name').optional().isString(),
  ],
  validate,
  register
);

/**
 * Login
 * POST /api/auth/login
 */
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Must be a valid email'),
    body('password').exists().withMessage('Password is required'),
  ],
  validate,
  login
);

/**
 * Logout
 * POST /api/auth/logout
 */
router.post('/logout', logout);

export default router;
