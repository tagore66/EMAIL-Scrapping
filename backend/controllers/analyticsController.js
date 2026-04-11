const mongoose = require('mongoose');
const Email = require('../models/Email');
const Telemetry = require('../models/Telemetry');

const getAnalytics = async (req, res) => {
  const { userId } = req.query;

  try {
    const totalSpending = await Email.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const categoryDistribution = await Email.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: '$category', count: { $sum: 1 }, totalAmount: { $sum: '$amount' } } }
    ]);

    const monthlyTrends = await Email.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
          total: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const topSenders = await Email.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: '$sender', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      totalSpending: totalSpending[0]?.total || 0,
      categoryDistribution,
      monthlyTrends,
      topSenders
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
};

const getTelemetry = async (req, res) => {
  try {
    const data = await Telemetry.find({ userId: req.query.userId }).sort({ createdAt: -1 }).limit(10);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch telemetry' });
  }
};

module.exports = { getAnalytics, getTelemetry };
