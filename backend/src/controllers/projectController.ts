import type { Request, Response } from "express";
import { Project } from "../models/project.js";

const LIMIT = 7;

// CREATE
export const createProject = async (
  req: Request & { user?: string },
  res: Response
) => {
  try {
    const { title, description, status } = req.body;
    const owner = req.user;

    if (!owner)
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized" });

    const project = await Project.create({ owner, title, description, status });

    const total = await Project.countDocuments({ owner });
    const pages = Math.ceil(total / LIMIT);

    res.status(201).json({
      success: true,
      project,
      pagination: { total, pages },
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: err });
  }
};

// READ (paginated list)
export const getProjects = async (
  req: Request & { user?: string },
  res: Response
) => {
  try {
    const owner = req.user;
    if (!owner)
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized" });

    const page = Math.max(Number(req.query.page) || 1, 1);
    const search = String(req.query.search || "").trim();

    const query: any = { owner };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const totalProjects = await Project.countDocuments(query);

    const projects = await Project.find(query)
      .sort({ createdAt: -1 }) // newest first
      .skip((page - 1) * LIMIT)
      .limit(LIMIT)
      .lean();

    res.json({
      success: true,
      projects,
      pagination: {
        total: totalProjects,
        pages: Math.max(1, Math.ceil(totalProjects / LIMIT)),
        page,
      },
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: err });
  }
};

// READ (single project)
export const getProjectById = async (
  req: Request & { user?: string },
  res: Response
) => {
  try {
    const { id } = req.params;
    const owner = req.user;
    if (!owner)
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized" });

    const project = await Project.findOne({ _id: id, owner }).lean();
    if (!project)
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });

    res.json({ success: true, project });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: err });
  }
};

// UPDATE
export const updateProject = async (
  req: Request & { user?: string },
  res: Response
) => {
  try {
    const { id } = req.params;
    const owner = req.user;
    if (!owner)
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized" });

    const update = req.body;
    const project = await Project.findOneAndUpdate(
      { _id: id, owner },
      update,
      { new: true }
    ).lean();

    if (!project)
      return res.status(404).json({
        success: false,
        message: "Project not found or not authorized",
      });

    res.json({ success: true, project });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: err });
  }
};

// DELETE
export const deleteProject = async (
  req: Request & { user?: string },
  res: Response
) => {
  try {
    const { id } = req.params;
    const owner = req.user;
    if (!owner)
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized" });

    const project = await Project.findOneAndDelete({ _id: id, owner });
    if (!project)
      return res.status(404).json({
        success: false,
        message: "Project not found or not authorized",
      });

    const total = await Project.countDocuments({ owner });
    const pages = Math.max(1, Math.ceil(total / LIMIT));

    res.json({
      success: true,
      message: "Project deleted",
      pagination: { total, pages },
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: err });
  }
};
