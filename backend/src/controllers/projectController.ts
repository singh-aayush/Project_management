import type { Request, Response } from 'express';
import {Project} from '../models/project.js';
import {Task} from '../models/task.js';

/**
 * Create Project
 * POST /api/projects
 */
export const createProject = async (req: Request & { user?: string }, res: Response) => {
  try {
    const { title, description, status } = req.body;
    const owner = req.user;
    const project = await Project.create({ owner, title, description, status });
    res.status(201).json({ success: true, project });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error', error: err });
  }
};

/**
 * Get all projects for authenticated user
 * GET /api/projects
 */
export const getProjects = async (req: Request & { user?: string }, res: Response) => {
  try {
    const owner = req.user;
    const projects = await Project.find({ owner }).sort({ createdAt: -1 });
    res.json({ success: true, projects });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error', error: err });
  }
};

/**
 * Get project by id (with tasks)
 * GET /api/projects/:id
 */
export const getProjectById = async (req: Request & { user?: string }, res: Response) => {
  try {
    const { id } = req.params;
    const owner = req.user;
    const project = await Project.findOne({ _id: id, owner }).lean();
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    const tasks = await Task.find({ project: project._id }).sort({ createdAt: -1 });
    res.json({ success: true, project, tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error', error: err });
  }
};

/**
 * Update project (owner only)
 * PUT /api/projects/:id
 */
export const updateProject = async (req: Request & { user?: string }, res: Response) => {
  try {
    const { id } = req.params;
    const owner = req.user;
    const update = req.body;
    const project = await Project.findOneAndUpdate({ _id: id, owner }, update, { new: true });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found or not authorized' });
    res.json({ success: true, project });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error', error: err });
  }
};

/**
 * Delete project (owner only) - also deletes tasks belonging to it
 * DELETE /api/projects/:id
 */
export const deleteProject = async (req: Request & { user?: string }, res: Response) => {
  try {
    const { id } = req.params;
    const owner = req.user;
    const project = await Project.findOneAndDelete({ _id: id, owner });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found or not authorized' });

    await Task.deleteMany({ project: project._id });
    res.json({ success: true, message: 'Project and tasks deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error', error: err });
  }
};
