import mongoose from "mongoose";

const DietPlanSchema = new mongoose.Schema(
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
    },
    bmi: { type: Number, default: 0 },
    category: {
      type: String,
      enum: ["Underweight", "Normal", "Overweight", "Obese", "Unknown"],
      default: "Unknown",
    },
    goal: {
      type: String,
      enum: ["Weight Loss", "Muscle Gain", "Maintenance"],
      default: "Maintenance",
    },
    plan: {
      breakfast: { type: String, default: "" },
      lunch: { type: String, default: "" },
      dinner: { type: String, default: "" },
      snacks: { type: String, default: "" },
      water: { type: String, default: "" },
      calories: { type: Number, default: 0 },
    },
    // true once a trainer has manually edited the auto-generated plan.
    customized: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.DietPlan ||
  mongoose.model("DietPlan", DietPlanSchema);
