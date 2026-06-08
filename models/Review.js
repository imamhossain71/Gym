import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true,
      index: true,
    },
    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trainer",
      default: null,
      index: true,
    },
    gymId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gym",
      required: true,
      index: true,
    },
    // "trainer" review targets a trainer; "gym" review targets the gym overall.
    target: { type: String, enum: ["trainer", "gym"], default: "trainer" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: "" },
    reply: { type: String, default: "" }, // admin / trainer response
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending", // moderation queue
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Review ||
  mongoose.model("Review", ReviewSchema);
