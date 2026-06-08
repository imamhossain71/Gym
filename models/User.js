import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    // Excluded from queries by default; select("+password") to load it.
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["super_admin", "gym_admin", "trainer", "member"],
      default: "member",
      index: true,
    },
    gymId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gym",
      index: true,
      default: null,
    },
    photo: { type: String, default: "" },
    phone: { type: String, default: "" },
    emailVerified: { type: Boolean, default: false },
    verifyToken: { type: String, select: false },
    resetToken: { type: String, select: false },
    resetTokenExpiry: { type: Date, select: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
