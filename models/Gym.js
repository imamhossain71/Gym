import mongoose from "mongoose";

const GymSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, default: "" },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    logo: { type: String, default: "" },
    // SaaS subscription tier for the gym itself.
    plan: {
      type: String,
      enum: ["free", "starter", "pro", "enterprise"],
      default: "free",
    },
    isActive: { type: Boolean, default: true },
    rating: { type: Number, default: 0 }, // cached avg gym rating
  },
  { timestamps: true }
);

export default mongoose.models.Gym || mongoose.model("Gym", GymSchema);
