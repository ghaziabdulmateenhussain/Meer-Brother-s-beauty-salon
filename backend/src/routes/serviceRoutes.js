const express = require('express');
const router = express.Router();
const {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} = require('../controllers/serviceController');
const { protect, adminOnly } = require('../middleware/auth');

// Public reads; attach user if present so ?all=true works for admins.
function optionalAuth(req, res, next) {
  const { protect: protectFn } = require('../middleware/auth');
  if (req.headers.authorization) return protectFn(req, res, next);
  next();
}

router.get('/', optionalAuth, getServices);
router.get('/:id', getServiceById);
router.post('/', protect, adminOnly, createService);
router.put('/:id', protect, adminOnly, updateService);
router.delete('/:id', protect, adminOnly, deleteService);

module.exports = router;
