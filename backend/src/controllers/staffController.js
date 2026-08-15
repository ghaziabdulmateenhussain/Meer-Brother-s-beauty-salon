const Staff = require('../models/Staff');

async function getStaff(req, res, next) {
  try {
    const filter = req.query.all === 'true' && req.user?.role === 'admin' ? {} : { active: true };
    const staff = await Staff.find(filter).sort({ createdAt: 1 });
    res.json({ success: true, count: staff.length, staff });
  } catch (err) {
    next(err);
  }
}

async function getStaffById(req, res, next) {
  try {
    const member = await Staff.findById(req.params.id);
    if (!member) return res.status(404).json({ success: false, message: 'Staff member not found.' });
    res.json({ success: true, staff: member });
  } catch (err) {
    next(err);
  }
}

async function createStaff(req, res, next) {
  try {
    const member = await Staff.create(req.body);
    res.status(201).json({ success: true, staff: member });
  } catch (err) {
    next(err);
  }
}

async function updateStaff(req, res, next) {
  try {
    const member = await Staff.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!member) return res.status(404).json({ success: false, message: 'Staff member not found.' });
    res.json({ success: true, staff: member });
  } catch (err) {
    next(err);
  }
}

async function deleteStaff(req, res, next) {
  try {
    const member = await Staff.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ success: false, message: 'Staff member not found.' });
    res.json({ success: true, message: 'Staff member deleted.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getStaff, getStaffById, createStaff, updateStaff, deleteStaff };
