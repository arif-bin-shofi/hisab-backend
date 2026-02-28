import Customer from "../models/Customer.js";
import Bakeya from "../models/BakeyaTransaction.js";

export const createCustomer = async (req, res) => {
  const customer = await Customer.create({
    ...req.body,
    userId: req.user.id
  });

  res.status(201).json(customer);
};

export const getCustomers = async (req, res) => {
  try {
    // শুধুমাত্র বর্তমান ইউজারের কাস্টমারদের খুঁজে বের করা
    const customers = await Customer.find({ userId: req.user.id }).sort({ name: 1 });
    res.json({
      success: true,
      data: customers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addBakeya = async (req, res) => {
  const bakeya = await Bakeya.create({
    ...req.body,
    userId: req.user.id
  });

  res.status(201).json(bakeya);
};

export const customerReport = async (req, res) => {
  const transactions = await Bakeya.find({
    customerId: req.params.id
  });

  let totalDue = 0;

  transactions.forEach(t => {
    totalDue += t.bakeyaAmount - t.paidAmount;
  });

  res.json({
    transactions,
    totalDue
  });
};