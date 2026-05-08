import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import connectDB from '../config/database.js';
import { User } from '../models/user.model.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../../../.env') });

const [, , email] = process.argv;
if (!email) {
  console.error('Usage: node backend/src/scripts/seed-admin.js <email>');
  process.exit(1);
}

await connectDB();

const user = await User.findOneAndUpdate(
  { email },
  { role: 'admin' },
  { new: true }
);

if (!user) {
  console.error(`No user found with email: ${email}`);
  process.exit(1);
}

console.log(`✓ ${user.email} promoted to admin`);
process.exit(0);
