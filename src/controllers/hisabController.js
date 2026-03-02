import DailyHisab from "../models/DailyHisab.js";

export const createHisab = async (req, res) => {
  try {
    const data = req.body;

    const total =
      (data.bikash || 0) +
      (data.nogod || 0) +
      (data.rocket || 0) +
      (data.flexiload || 0) +
      (data.gp || 0) +
      (data.robi || 0) +
      (data.banglalink || 0) +
      (data.skitto || 0) +
      (data.others || 0);

    const todayTotal = total;
    const profitLoss = todayTotal - (data.previousTotal || 0);

    const hisab = await DailyHisab.create({
      ...data,
      total,
      todayTotal,
      profitLoss,
      userId: req.user.id
    });

    res.status(201).json({
      success: true,
      data: hisab
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export const getHisab = async (req, res) => {
  try {
    const { startDate, endDate, limit } = req.query;
    
    let query = { userId: req.user.id };
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    let hisabQuery = DailyHisab.find(query).sort({ date: -1 });
    
    if (limit) {
      hisabQuery = hisabQuery.limit(parseInt(limit));
    }

    const data = await hisabQuery;

    res.json({
      success: true,
      data
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export const getHisabById = async (req, res) => {
  try {
    const hisab = await DailyHisab.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!hisab) {
      return res.status(404).json({
        success: false,
        message: "Daily hisab not found"
      });
    }

    res.json({
      success: true,
      data: hisab
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export const updateHisab = async (req, res) => {
  try {
    const data = req.body;

    if (data.bikash || data.nogod || data.rocket || data.flexiload || 
        data.gp || data.robi || data.banglalink || data.skitto || data.others) {
      
      const total =
        (data.bikash || 0) +
        (data.nogod || 0) +
        (data.rocket || 0) +
        (data.flexiload || 0) +
        (data.gp || 0) +
        (data.robi || 0) +
        (data.banglalink || 0) +
        (data.skitto || 0) +
        (data.others || 0);

      data.total = total;
      data.todayTotal = total;
      data.profitLoss = total - (data.previousTotal || 0);
    }

    const hisab = await DailyHisab.findOneAndUpdate(
      { 
        _id: req.params.id, 
        userId: req.user.id 
      },
      data,
      { new: true, runValidators: true }
    );

    if (!hisab) {
      return res.status(404).json({
        success: false,
        message: "Daily hisab not found"
      });
    }

    res.json({
      success: true,
      data: hisab
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export const deleteHisab = async (req, res) => {
  try {
    const hisab = await DailyHisab.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!hisab) {
      return res.status(404).json({
        success: false,
        message: "Daily hisab not found"
      });
    }

    res.json({
      success: true,
      message: "Daily hisab deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export const getHisabSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let query = { userId: req.user.id };
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const hisabEntries = await DailyHisab.find(query);

    const summary = {
      totalEntries: hisabEntries.length,
      totalBikash: 0,
      totalNogod: 0,
      totalRocket: 0,
      totalFlexiload: 0,
      totalGp: 0,
      totalRobi: 0,
      totalBanglalink: 0,
      totalSkitto: 0,
      totalOthers: 0,
      totalRevenue: 0,
      totalProfitLoss: 0,
      averageDailyRevenue: 0,
      bestDay: null,
      worstDay: null
    };

    if (hisabEntries.length > 0) {
      let maxRevenue = -Infinity;
      let minRevenue = Infinity;
      let bestDayEntry = null;
      let worstDayEntry = null;

      hisabEntries.forEach(entry => {
     
        summary.totalBikash += entry.bikash || 0;
        summary.totalNogod += entry.nogod || 0;
        summary.totalRocket += entry.rocket || 0;
        summary.totalFlexiload += entry.flexiload || 0;
        summary.totalGp += entry.gp || 0;
        summary.totalRobi += entry.robi || 0;
        summary.totalBanglalink += entry.banglalink || 0;
        summary.totalSkitto += entry.skitto || 0;
        summary.totalOthers += entry.others || 0;
        summary.totalRevenue += entry.total || 0;
        summary.totalProfitLoss += entry.profitLoss || 0;

  
        const revenue = entry.total || 0;
        if (revenue > maxRevenue) {
          maxRevenue = revenue;
          bestDayEntry = {
            date: entry.date,
            revenue: revenue,
            profitLoss: entry.profitLoss
          };
        }
        if (revenue < minRevenue) {
          minRevenue = revenue;
          worstDayEntry = {
            date: entry.date,
            revenue: revenue,
            profitLoss: entry.profitLoss
          };
        }
      });

      summary.averageDailyRevenue = summary.totalRevenue / hisabEntries.length;
      summary.bestDay = bestDayEntry;
      summary.worstDay = worstDayEntry;
    }

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export const getMonthlyReport = async (req, res) => {
  try {
    const { year, month } = req.params;
    
    const startDate = new Date(year, month - 1, 1); 
    const endDate = new Date(year, month, 0, 23, 59, 59); 

    const hisabEntries = await DailyHisab.find({
      userId: req.user.id,
      date: {
        $gte: startDate,
        $lte: endDate
      }
    }).sort({ date: 1 });

    const dailyBreakdown = hisabEntries.map(entry => ({
      date: entry.date,
      total: entry.total,
      bikash: entry.bikash,
      nogod: entry.nogod,
      rocket: entry.rocket,
      flexiload: entry.flexiload,
      mobileRecharge: (entry.gp || 0) + (entry.robi || 0) + (entry.banglalink || 0) + (entry.skitto || 0),
      others: entry.others,
      profitLoss: entry.profitLoss,
      note: entry.note
    }));


    const monthlyTotals = {
      totalBikash: hisabEntries.reduce((sum, e) => sum + (e.bikash || 0), 0),
      totalNogod: hisabEntries.reduce((sum, e) => sum + (e.nogod || 0), 0),
      totalRocket: hisabEntries.reduce((sum, e) => sum + (e.rocket || 0), 0),
      totalFlexiload: hisabEntries.reduce((sum, e) => sum + (e.flexiload || 0), 0),
      totalGp: hisabEntries.reduce((sum, e) => sum + (e.gp || 0), 0),
      totalRobi: hisabEntries.reduce((sum, e) => sum + (e.robi || 0), 0),
      totalBanglalink: hisabEntries.reduce((sum, e) => sum + (e.banglalink || 0), 0),
      totalSkitto: hisabEntries.reduce((sum, e) => sum + (e.skitto || 0), 0),
      totalOthers: hisabEntries.reduce((sum, e) => sum + (e.others || 0), 0),
      totalRevenue: hisabEntries.reduce((sum, e) => sum + (e.total || 0), 0),
      totalProfitLoss: hisabEntries.reduce((sum, e) => sum + (e.profitLoss || 0), 0)
    };

    res.json({
      success: true,
      data: {
        month: `${year}-${month}`,
        daysWithData: hisabEntries.length,
        dailyBreakdown,
        monthlyTotals
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export const getLatestHisab = async (req, res) => {
  try {
    const latest = await DailyHisab.findOne({ userId: req.user.id })
      .sort({ date: -1 });

    if (!latest) {
      return res.json({
        success: true,
        data: null,
        message: "No entries found"
      });
    }

    res.json({
      success: true,
      data: latest
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export const bulkDeleteHisab = async (req, res) => {
  try {
    const { ids } = req.body; 

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide an array of IDs to delete"
      });
    }

    const result = await DailyHisab.deleteMany({
      _id: { $in: ids },
      userId: req.user.id
    });

    res.json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} entries`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};