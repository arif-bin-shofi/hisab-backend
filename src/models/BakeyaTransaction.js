import mongoose from "mongoose";

const bakeyaSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer"
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    date: { type: Date, required: true },
    description: String,

    bakeyaAmount: { type: Number, default: 0 },
    paidAmount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("BakeyaTransaction", bakeyaSchema);