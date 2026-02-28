import DailyHisab from "../models/DailyHisab.js";
import Customer from "../models/Customer.js";
import Bakeya from "../models/BakeyaTransaction.js";
import mongoose from "mongoose";

export const getDashboard = async (req, res) => {
  try {

    const userId = new mongoose.Types.ObjectId(req.user.id);

    // 🔹 Total Customers
    const totalCustomers = await Customer.countDocuments({ userId });

    // 🔹 Total Hisab Entry
    const totalHisab = await DailyHisab.countDocuments({ userId });

    // 🔹 Total Income (All time total)
    const totalIncomeAgg = await DailyHisab.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          total: { $sum: "$todayTotal" }
        }
      }
    ]);

    const totalIncome = totalIncomeAgg[0]?.total || 0;

    // 🔹 Total Due (Bakeya Calculation)
    const totalDueAgg = await Bakeya.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          totalBakeya: { $sum: "$bakeyaAmount" },
          totalPaid: { $sum: "$paidAmount" }
        }
      }
    ]);

    const totalDue =
      totalDueAgg.length > 0
        ? totalDueAgg[0].totalBakeya - totalDueAgg[0].totalPaid
        : 0;

    // 🔹 Today Summary
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayAgg = await DailyHisab.aggregate([
      {
        $match: {
          userId,
          date: { $gte: todayStart }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$todayTotal" },
          profit: { $sum: "$profitLoss" }
        }
      }
    ]);

    const todayTotal = todayAgg[0]?.total || 0;
    const todayProfit = todayAgg[0]?.profit || 0;

    // 🔹 Last 7 Days Report
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const weeklyReport = await DailyHisab.aggregate([
      {
        $match: {
          userId,
          date: { $gte: last7Days }
        }
      },
      {
        $group: {
          _id: {
            day: { $dayOfMonth: "$date" },
            month: { $month: "$date" }
          },
          total: { $sum: "$todayTotal" }
        }
      },
      { $sort: { "_id.day": 1 } }
    ]);

    // 🔹 Monthly Summary
    const monthlyReport = await DailyHisab.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: { month: { $month: "$date" } },
          total: { $sum: "$todayTotal" }
        }
      },
      { $sort: { "_id.month": 1 } }
    ]);

    res.json({
      success: true,
      data: {
        totalCustomers,
        totalHisab,
        totalIncome,
        totalDue,
        todayTotal,
        todayProfit,
        weeklyReport,
        monthlyReport
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};