// Run this once (locally, or as a one-off command on your host) to create
// the first admin login. It reads ADMIN_EMAIL and ADMIN_PASSWORD from your
// .env file, hashes the password with bcrypt, and stores only the hash.
// Usage: npm run seed:admin

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');

async function run() {
  const email = (process.env.ADMIN_EMAIL || '').toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD in your .env file first.');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);

  const existing = await Admin.findOne({ email });
  if (existing) {
    console.log(`Admin ${email} already exists. Nothing to do.`);
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await Admin.create({ email, passwordHash });

  console.log(`Admin account created for ${email}. You can now log in at /admin/login.`);
  process.exit(0);
}

run().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
