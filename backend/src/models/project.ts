import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  status: {type: String, enum: ["Active", "Completed"], default: "Active"}
},{timestamps: true});

export const Project = mongoose.model('Project', projectSchema);