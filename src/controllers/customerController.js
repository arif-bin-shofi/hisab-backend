import Customer from "../models/Customer.js";
import Bakeya from "../models/BakeyaTransaction.js";

export const createCustomer = async (req, res) => {
  try {
    const customer = await Customer.create({
      ...req.body,
      userId: req.user.id
    });

    res.status(201).json({
      success: true,
      data: customer
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({ userId: req.user.id }).sort({ name: 1 });
    res.json({
      success: true,
      data: customers
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found"
      });
    }

    res.json({
      success: true,
      data: customer
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOneAndUpdate(
      { 
        _id: req.params.id, 
        userId: req.user.id 
      },
      req.body,
      { new: true, runValidators: true }
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found"
      });
    }

    res.json({
      success: true,
      data: customer
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export const deleteCustomer = async (req, res) => {
  try {

    const hasTransactions = await Bakeya.exists({ 
      customerId: req.params.id,
      userId: req.user.id 
    });

    if (hasTransactions) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete customer with existing bakeya transactions. Delete transactions first."
      });
    }

    const customer = await Customer.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found"
      });
    }

    res.json({
      success: true,
      message: "Customer deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};


export const addBakeya = async (req, res) => {
  try {
  
    const customer = await Customer.findOne({
      _id: req.body.customerId,
      userId: req.user.id
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found"
      });
    }

    const bakeya = await Bakeya.create({
      ...req.body,
      userId: req.user.id
    });

    res.status(201).json({
      success: true,
      data: bakeya
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export const getBakeyas = async (req, res) => {
  try {
    const { customerId } = req.query;
    let query = { userId: req.user.id };

    if (customerId) {
      query.customerId = customerId;
    }

    const bakeyas = await Bakeya.find(query)
      .populate('customerId', 'name phone address')
      .sort({ date: -1 });

    res.json({
      success: true,
      data: bakeyas
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export const getBakeyaById = async (req, res) => {
  try {
    const bakeya = await Bakeya.findOne({
      _id: req.params.id,
      userId: req.user.id
    }).populate('customerId', 'name phone address');

    if (!bakeya) {
      return res.status(404).json({
        success: false,
        message: "Bakeya transaction not found"
      });
    }

    res.json({
      success: true,
      data: bakeya
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export const updateBakeya = async (req, res) => {
  try {
    const bakeya = await Bakeya.findOneAndUpdate(
      { 
        _id: req.params.id, 
        userId: req.user.id 
      },
      req.body,
      { new: true, runValidators: true }
    ).populate('customerId', 'name phone address');

    if (!bakeya) {
      return res.status(404).json({
        success: false,
        message: "Bakeya transaction not found"
      });
    }

    res.json({
      success: true,
      data: bakeya
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export const deleteBakeya = async (req, res) => {
  try {
    const bakeya = await Bakeya.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!bakeya) {
      return res.status(404).json({
        success: false,
        message: "Bakeya transaction not found"
      });
    }

    res.json({
      success: true,
      message: "Bakeya transaction deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};


export const customerReport = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found"
      });
    }

    const transactions = await Bakeya.find({
      customerId: req.params.id,
      userId: req.user.id
    }).sort({ date: -1 });

    let totalBakeya = 0;
    let totalPaid = 0;
    let totalDue = 0;

    transactions.forEach(t => {
      totalBakeya += t.bakeyaAmount;
      totalPaid += t.paidAmount;
      totalDue += t.bakeyaAmount - t.paidAmount;
    });

    res.json({
      success: true,
      data: {
        customer: {
          id: customer._id,
          name: customer.name,
          phone: customer.phone,
          address: customer.address
        },
        summary: {
          totalTransactions: transactions.length,
          totalBakeya,
          totalPaid,
          totalDue,
          status: totalDue === 0 ? 'Cleared' : totalDue > 0 ? 'Due' : 'Overpaid'
        },
        transactions
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export const getAllReports = async (req, res) => {
  try {
    const { startDate, endDate, status } = req.query;
    
    let query = { userId: req.user.id };
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const transactions = await Bakeya.find(query)
      .populate('customerId', 'name phone')
      .sort({ date: -1 });

    let summary = {
      totalTransactions: transactions.length,
      totalBakeya: 0,
      totalPaid: 0,
      totalDue: 0,
      customersWithDue: new Set()
    };

    transactions.forEach(t => {
      summary.totalBakeya += t.bakeyaAmount;
      summary.totalPaid += t.paidAmount;
      const due = t.bakeyaAmount - t.paidAmount;
      summary.totalDue += due;
      
      if (due > 0) {
        summary.customersWithDue.add(t.customerId?._id || t.customerId);
      }
    });

    let filteredTransactions = transactions;
    if (status === 'due') {
      filteredTransactions = transactions.filter(t => (t.bakeyaAmount - t.paidAmount) > 0);
    } else if (status === 'paid') {
      filteredTransactions = transactions.filter(t => (t.bakeyaAmount - t.paidAmount) === 0);
    }

    res.json({
      success: true,
      data: {
        summary: {
          ...summary,
          customersWithDueCount: summary.customersWithDue.size
        },
        transactions: filteredTransactions
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export const getDueCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({ userId: req.user.id });
    const dueCustomers = [];

    for (const customer of customers) {
      const transactions = await Bakeya.find({
        customerId: customer._id,
        userId: req.user.id
      });

      let totalDue = 0;
      transactions.forEach(t => {
        totalDue += t.bakeyaAmount - t.paidAmount;
      });

      if (totalDue > 0) {
        dueCustomers.push({
          customer,
          totalDue,
          lastTransactionDate: transactions.length > 0 ? transactions[transactions.length - 1].date : null
        });
      }
    }

    dueCustomers.sort((a, b) => b.totalDue - a.totalDue);

    res.json({
      success: true,
      data: dueCustomers
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};