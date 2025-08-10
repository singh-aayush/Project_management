import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ["To-do", "In-Progress", "Done"], default: "To-do" },
  dueDate: {type: Date}
},{timestamps: true});

export const Task = mongoose.model('Task', taskSchema);