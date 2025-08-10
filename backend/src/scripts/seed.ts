import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { User } from '../models/user.js';
import { Project } from '../models/project.js';
import { Task } from '../models/task.js';

// 1️⃣ Load environment variables
dotenv.config();

console.log("MONGO_URL from env:", process.env.MONGO_URL);
if (!process.env.MONGO_URL) {
  throw new Error('❌ MONGO_URL not found — check your .env file');
}

// 2️⃣ Config object (no external file)
const config = {
  mongoUrl: process.env.MONGO_URL,
  jwtSecret: process.env.JWT_TOKEN || 'default_secret',
  port: process.env.PORT || 3333,
};

interface TaskData {
  project: mongoose.Types.ObjectId;
  title: string;
  description: string;
  status: string;
}

async function seed(): Promise<void> {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongoUrl!);
    console.log('✅ Connected to MongoDB for seeding');

    const email = 'test@example.com';
    const plainPassword = 'Test@123';
    const name = 'Seed User';

    // Upsert user
    let user = await User.findOne({ email });
    if (!user) {
      const hashed = await bcrypt.hash(plainPassword, 10);
      user = await User.create({ email, password: hashed, name });
      console.log('👤 Created user:', email);
    } else {
      console.log('ℹ️ User already exists:', email);
    }

    // Remove old projects & tasks for this user
    await Project.deleteMany({ owner: user._id });
    await Task.deleteMany({});

    // Create 2 projects
    const projects = await Project.create([
      { owner: user._id, title: 'Project Alpha', description: 'Seed project alpha' },
      { owner: user._id, title: 'Project Beta', description: 'Seed project beta' },
    ]);
    console.log('📁 Created projects:', projects.map((p) => p.title).join(', '));

    // Create 3 tasks for each project
    const tasksData: TaskData[] = [];
    for (const p of projects) {
      tasksData.push(
        { project: p._id, title: 'Setup repo', description: 'Initialize repository, readme', status: 'todo' },
        { project: p._id, title: 'Build auth', description: 'Auth endpoints and JWT', status: 'in-progress' },
        { project: p._id, title: 'Write tests', description: 'Add unit tests', status: 'todo' }
      );
    }
    const tasks = await Task.create(tasksData);
    console.log(`✅ Created ${tasks.length} tasks.`);

    console.log('\n🎯 Seeding complete. Login with:');
    console.log(`Email: ${email}`);
    console.log(`Password: ${plainPassword}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
}

seed();
