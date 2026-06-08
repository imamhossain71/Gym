import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema(
  {
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true,
      index: true,
    },
    gymId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gym",
      required: true,
      index: true,
    },
    checkIn: { type: Date, default: Date.now },
    checkOut: { type: Date, default: null },
    // Normalised YYYY-MM-DD string for fast per-day uniqueness / queries.
    date: { type: String, required: true, index: true },
    method: { type: String, enum: ["manual", "qr"], default: "manual" },
  },
  { timestamps: true }
);

// One attendance record per member per day.
AttendanceSchema.index({ memberId: 1, date: 1 }, { unique: true });

export default mongoose.models.Attendance ||
  mongoose.model("Attendance", AttendanceSchema);
