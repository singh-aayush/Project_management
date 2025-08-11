import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  createTask,
  getTasksForProject,
  updateTask,
  deleteTask,
} from '../controllers/taskController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';

const router = Router();

// All routes require auth
router.use(authMiddleware);


  // Create task for project
  // POST /api/projects/:projectId/tasks
 
router.post(
  '/projects/:projectId/tasks',
  [param('projectId').isMongoId().withMessage('Invalid project id'), body('title').isString().notEmpty().withMessage('Title is required')],
  validate,
  createTask
);


  // Get tasks for project
  // GET /api/projects/:projectId/tasks
 
router.get('/projects/:projectId/tasks', [param('projectId').isMongoId().withMessage('Invalid project id')], validate, getTasksForProject);


//  Update task
//  *PUT /api/tasks/:id
 
router.put('/tasks/:id', [param('id').isMongoId().withMessage('Invalid task id')], validate, updateTask);


  // Delete task
//  DELETE /api/tasks/:id
 
router.delete('/tasks/:id', [param('id').isMongoId().withMessage('Invalid task id')], validate, deleteTask);

export default router;
