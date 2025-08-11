import type { Request, Response } from 'express';
import { Task } from '../models/task.js';
import { Project } from '../models/project.js';

const TASKS_LIMIT = 7;

/**
 * Create Task under a project
 * POST /api/projects/:projectId/tasks
 */
export const createTask = async (req: Request & { user?: string }, res: Response) => {
  try {
    const { projectId } = req.params;
    const { title, description, status, dueDate } = req.body;
    const owner = req.user;

    // verify project belongs to user
    const project = await Project.findOne({ _id: projectId, owner });
    if (!project)
      return res
        .status(404)
        .json({ success: false, message: 'Project not found or not authorized' });

    const task = await Task.create({ project: projectId, title, description, status, dueDate });
    res.status(201).json({ success: true, task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error', error: err });
  }
};

/**
 * Get tasks for a project with optional status filter and pagination
 * GET /api/projects/:projectId/tasks?status=todo&page=1
 */
export const getTasksForProject = async (req: Request & { user?: string }, res: Response) => {
  try {
    const { projectId } = req.params;
    const { status } = req.query;
    const owner = req.user;

    // Verify project ownership
    const project = await Project.findOne({ _id: projectId, owner });
    if (!project)
      return res
        .status(404)
        .json({ success: false, message: 'Project not found or not authorized' });

    const filter: any = { project: projectId };
    if (status) filter.status = status;

    const page = Math.max(Number(req.query.page) || 1, 1);

    const totalTasks = await Task.countDocuments(filter);

    const tasks = await Task.find(filter)
      .sort({ createdAt: 1 })
      .skip((page - 1) * TASKS_LIMIT)
      .limit(TASKS_LIMIT)
      .lean();

    res.json({
      success: true,
      tasks,
      pagination: {
        total: totalTasks,
        pages: Math.max(1, Math.ceil(totalTasks / TASKS_LIMIT)),
        page,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error', error: err });
  }
};

/**
 * Update task
 * PUT /api/tasks/:id
 */
export const updateTask = async (req: Request & { user?: string }, res: Response) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const owner = req.user;

    // ensure task belongs to a project owned by the user
    const task = await Task.findById(id).populate('project');
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    // @ts-ignore
    const projectOwner = task.project.owner?.toString();
    if (projectOwner !== owner)
      return res.status(403).json({ success: false, message: 'Not authorized' });

    const updated = await Task.findByIdAndUpdate(id, update, { new: true });
    res.json({ success: true, task: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error', error: err });
  }
};

/**
 * Delete task
 * DELETE /api/tasks/:id
 */
export const deleteTask = async (req: Request & { user?: string }, res: Response) => {
  try {
    const { id } = req.params;
    const owner = req.user;

    const task = await Task.findById(id).populate('project');
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    // @ts-ignore
    const projectOwner = task.project.owner?.toString();
    if (projectOwner !== owner)
      return res.status(403).json({ success: false, message: 'Not authorized' });

    await Task.findByIdAndDelete(id);
    res.json({ success: true, message: 'Task deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error', error: err });
  }
};
