/**
 * Seed a Super Admin account.
 * Run with:  node scripts/seed.js
 * Requires MONGODB_URI in .env.local
 */
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Load env from .env.local
require("fs")
  .readFileSync(path.join(__dirname, "..", ".env.local"), "utf8")
  .split("\n")
  .forEach((line) => {
    const m = line.match(/^\s*([\w.-]+)\s*=\s*"?([^"]*)"?\s*$/);
    if (m) process.env[m[1]] = m[2];
  });

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: String,
    gymId: mongoose.Schema.Types.ObjectId,
    isActive: { type: Boolean, default: true },
    emailVerified: { type: Boolean, default: true },
  },
  { timestamps: true }
);

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const User = mongoose.models.User || mongoose.model("User", UserSchema);

  const email = "superadmin@fithub.app";
  const existing = await User.findOne({ email });
  if (existing) {
    console.log("Super admin already exists:", email);
  } else {
    const password = await bcrypt.hash("Admin@123", 12);
    await User.create({
      name: "Super Admin",
      email,
      password,
      role: "super_admin",
      emailVerified: true,
    });
    console.log("✅ Super admin created!");
    console.log("   Email:    superadmin@fithub.app");
    console.log("   Password: Admin@123");
  }
  await mongoose.disconnect();
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
