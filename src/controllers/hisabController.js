import DailyHisab from "../models/DailyHisab.js";

export const createHisab = async (req, res) => {
  const data = req.body;

  const total =
    data.bikash +
    data.nogod +
    data.rocket +
    data.flexiload +
    data.gp +
    data.robi +
    data.banglalink +
    data.skitto +
    data.others;

  const todayTotal = total;
  const profitLoss = todayTotal - data.previousTotal;

  const hisab = await DailyHisab.create({
    ...data,
    total,
    todayTotal,
    profitLoss,
    userId: req.user.id
  });

  res.status(201).json(hisab);
};

export const getHisab = async (req, res) => {
  const data = await DailyHisab.find({ userId: req.user.id }).sort({ date: -1 });
  res.json(data);
};