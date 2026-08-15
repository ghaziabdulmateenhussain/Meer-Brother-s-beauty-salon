const Loyalty = require('../models/Loyalty');

// GET /api/loyalty/my (customer)
async function getMyLoyalty(req, res, next) {
  try {
    let loyalty = await Loyalty.findOne({ customer: req.user._id });
    if (!loyalty) {
      loyalty = { points: 0, transactions: [] };
    }
    res.json({ success: true, loyalty });
  } catch (err) {
    next(err);
  }
}

// GET /api/loyalty (admin) - list all customers' loyalty balances
async function getAllLoyalty(req, res, next) {
  try {
    const records = await Loyalty.find().populate('customer', 'name email phone').sort({ points: -1 });
    res.json({ success: true, count: records.length, records });
  } catch (err) {
    next(err);
  }
}

module.exports = { getMyLoyalty, getAllLoyalty };
