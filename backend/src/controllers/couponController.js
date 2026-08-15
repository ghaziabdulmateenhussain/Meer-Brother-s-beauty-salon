const Coupon = require('../models/Coupon');

// GET /api/coupons (admin only - listing all coupons)
async function getCoupons(req, res, next) {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ success: true, count: coupons.length, coupons });
  } catch (err) {
    next(err);
  }
}

// POST /api/coupons/validate (customer) body: { code, servicePrice }
async function validateCoupon(req, res, next) {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({ code: (code || '').toUpperCase() });

    if (!coupon || !coupon.isValid()) {
      return res.status(400).json({ success: false, message: 'This coupon is invalid or has expired.' });
    }

    res.json({ success: true, coupon: { code: coupon.code, type: coupon.type, value: coupon.value } });
  } catch (err) {
    next(err);
  }
}

async function createCoupon(req, res, next) {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, coupon });
  } catch (err) {
    next(err);
  }
}

async function updateCoupon(req, res, next) {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found.' });
    res.json({ success: true, coupon });
  } catch (err) {
    next(err);
  }
}

async function deleteCoupon(req, res, next) {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found.' });
    res.json({ success: true, message: 'Coupon deleted.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getCoupons, validateCoupon, createCoupon, updateCoupon, deleteCoupon };
