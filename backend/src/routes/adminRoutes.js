const express = require('express');
const router = express.Router();
const {
  getDashboard,
  getAllBookings,
  updateBookingStatus,
  getCustomers,
  getCustomerBookings,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly);

router.get('/dashboard', getDashboard);
router.get('/bookings', getAllBookings);
router.put('/bookings/:id/status', updateBookingStatus);
router.get('/customers', getCustomers);
router.get('/customers/:id/bookings', getCustomerBookings);

module.exports = router;
