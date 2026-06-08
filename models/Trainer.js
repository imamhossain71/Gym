import mongoose from "mongoose";

const AvailabilitySchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    },
    from: String, // "09:00"
    to: String, // "17:00"
  },
  { _id: false }
);

const TrainerSchema = new mongoose.Schema(
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
    specialization: { type: [String], default: [] },
    experience: { type: Number, default: 0 }, // years
    bio: { type: String, default: "" },
    availability: { type: [AvailabilitySchema], default: [] },
    rating: { type: Number, default: 0 }, // cached avg rating
    reviewCount: { type: Number, default: 0 },
    monthlyRate: { type: Number, default: 0 },
    isAcceptingClients: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Trainer ||
  mongoose.model("Trainer", TrainerSchema);
