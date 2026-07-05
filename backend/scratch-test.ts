import mongoose from 'mongoose';
import { User } from './src/models/User';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://writesphere-mongodb:27017/writesphere';

async function test() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to DB');

  const users = await User.find().select('+password');
  console.log('Total users:', users.length);
  for (const u of users) {
    console.log(`User: ${u.name}, Email: ${u.email}, Hash: ${u.password}`);
    const match = await bcrypt.compare('Password123', u.password || '');
    console.log(`Password match check for 'Password123':`, match);
  }
  process.exit(0);
}

test();
