import mongoose from "mongoose";

const MemberSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    gymId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gym",
      required: true,
      index: true,
    },
    membershipPlan: {
      type: String,
      enum: ["monthly", "quarterly", "yearly"],
      default: "monthly",
    },
    status: {
      type: String,
      enum: ["active", "expired", "suspended"],
      default: "active",
      index: true,
    },
    joinDate: { type: Date, default: Date.now },
    expiryDate: { type: Date },
    // Physical / goal profile
    height: { type: Number, default: 0 }, // cm
    weight: { type: Number, default: 0 }, // kg
    age: { type: Number, default: 0 },
    gender: { type: String, enum: ["male", "female", "other"], default: "male" },
    goal: {
      type: String,
      enum: ["Weight Loss", "Muscle Gain", "Maintenance"],
      default: "Maintenance",
    },
    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trainer",
      default: null,
      index: true,
    },
    emergencyContact: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Member || mongoose.model("Member", MemberSchema);
