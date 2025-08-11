import mongoose, { Schema, Document } from 'mongoose';

// User Schema
export interface UserDocument extends Document {
  email: string;
  password: string;
  name: string;
}

const userSchema = new Schema<UserDocument>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
}, {timestamps: true});

export const User = mongoose.model<UserDocument>('User', userSchema);