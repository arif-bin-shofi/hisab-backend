import mongoose from "mongoose";

const dailyHisabSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    date: { type: Date, required: true },

    bikash: { type: Number, default: 0 },
    nogod: { type: Number, default: 0 },
    rocket: { type: Number, default: 0 },
    flexiload: { type: Number, default: 0 },
    gp: { type: Number, default: 0 },
    robi: { type: Number, default: 0 },
    banglalink: { type: Number, default: 0 },
    skitto: { type: Number, default: 0 },
    others: { type: Number, default: 0 },

    total: { type: Number, default: 0 },
    previousTotal: { type: Number, default: 0 },
    todayTotal: { type: Number, default: 0 },
    profitLoss: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("DailyHisab", dailyHisabSchema);