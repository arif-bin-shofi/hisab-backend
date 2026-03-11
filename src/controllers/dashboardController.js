import Customer from "../models/Customer.js";
import Bakeya from "../models/BakeyaTransaction.js";
import mongoose from "mongoose";

export const getDashboard = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const totalCustomers = await Customer.countDocuments({ userId });

     const stats = await Bakeya.aggregate([
      { $match: { userId } },
      {
        $lookup: {
          from: "bakeyatransactions", 
          localField: "relatedTransactionId",
          foreignField: "_id",
          as: "parent"
        }
      },
      {
        $project: {
          bakeyaAmount: 1,
          paidAmount: 1,
          relatedTransactionId: 1,
       
          category: {
            $cond: [
              { $gt: [{ $size: "$parent" }, 0] },
              { $arrayElemAt: ["$parent.description", 0] },
              "$description"
            ]
          }
        }
      },
      {
        $group: {
          _id: "$category",
          totalBakeya: { $sum: "$bakeyaAmount" },
          totalInstallments: { 
            $sum: { $cond: ["$relatedTransactionId", "$paidAmount", 0] } 
          }
        }
      }
    ]);

    const getDue = (cat) => {
      const item = stats.find(s => s._id === cat);
      return item ? (item.totalBakeya - item.totalInstallments) : 0;
    };

    const mobileDue = getDue("মোবাইল ব্যাংকিং");
    const computerDue = getDue("কম্পিউটার সার্ভিস");
    const productDue = getDue("পণ্য বিক্রয়");
    
    const totalDue = stats.reduce((sum, s) => sum + (s.totalBakeya - s.totalInstallments), 0);

    res.json({
      success: true,
      data: {
        totalCustomers,
        totalDue,
        categories: {
          mobile: mobileDue,
          computer: computerDue,
          product: productDue
        }
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};