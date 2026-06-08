import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
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
    amount: { type: Number, required: true },
    method: {
      type: String,
      enum: ["cash", "card", "mobile_banking", "bank_transfer"],
      default: "cash",
    },
    status: {
      type: String,
      enum: ["paid", "due", "overdue", "partial"],
      default: "due",
      index: true,
    },
    dueDate: { type: Date },
    paidDate: { type: Date, default: null },
    invoiceId: { type: String, unique: true, sparse: true },
    note: { type: String, default: "" },
    // For plan renewals: which billing period this payment covers.
    periodStart: { type: Date },
    periodEnd: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.Payment ||
  mongoose.model("Payment", PaymentSchema);
