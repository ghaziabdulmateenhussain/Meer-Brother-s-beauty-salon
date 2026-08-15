const express = require('express');
const router = express.Router();
const {
  getAvailability,
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createBookingRules } = require('../validators/bookingValidators');

router.get('/availability', getAvailability);
router.post('/', protect, createBookingRules, validate, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/:id', protect, getBookingById);
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;
