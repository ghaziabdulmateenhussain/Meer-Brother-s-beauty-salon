const express = require('express');
const router = express.Router();
const {
  getStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
} = require('../controllers/staffController');
const { protect, adminOnly } = require('../middleware/auth');

function optionalAuth(req, res, next) {
  const { protect: protectFn } = require('../middleware/auth');
  if (req.headers.authorization) return protectFn(req, res, next);
  next();
}

router.get('/', optionalAuth, getStaff);
router.get('/:id', getStaffById);
router.post('/', protect, adminOnly, createStaff);
router.put('/:id', protect, adminOnly, updateStaff);
router.delete('/:id', protect, adminOnly, deleteStaff);

module.exports = router;
