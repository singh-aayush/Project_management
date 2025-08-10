import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';

const router = Router();

// All routes require auth
router.use(authMiddleware);

/**
 * GET /api/projects
 */
router.get('/', getProjects);

/**
 * POST /api/projects
 */
router.post(
  '/',
  [body('title').isString().notEmpty().withMessage('Title is required')],
  validate,
  createProject
);

/**
 * GET /api/projects/:id
 */
router.get('/:id', [param('id').isMongoId().withMessage('Invalid project id')], validate, getProjectById);

/**
 * PUT /api/projects/:id
 */
router.put('/:id', [param('id').isMongoId().withMessage('Invalid project id')], validate, updateProject);

/**
 * DELETE /api/projects/:id
 */
router.delete('/:id', [param('id').isMongoId().withMessage('Invalid project id')], validate, deleteProject);

export default router;
