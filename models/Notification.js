import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, default: "" },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: [
        "payment_due",
        "attendance_alert",
        "diet_update",
        "trainer_assigned",
        "announcement",
        "review",
        "general",
      ],
      default: "general",
    },
    link: { type: String, default: "" }, // optional in-app deep link
    read: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

export default mongoose.models.Notification ||
  mongoose.model("Notification", NotificationSchema);
