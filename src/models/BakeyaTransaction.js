import mongoose from "mongoose";

const bakeyaSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    date: { type: Date, required: true },
    

    description: { type: String, default: "" },

    rate: { type: Number, default: 0 },

    quantity: { type: Number, default: 1 },

    bakeyaAmount: { type: Number, default: 0 },

    paidAmount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("BakeyaTransaction", bakeyaSchema);