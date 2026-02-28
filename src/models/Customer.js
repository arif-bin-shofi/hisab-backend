import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    name: { type: String, required: true },
    mobile: { type: String },
    address: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model("Customer", customerSchema);