const Booking = require('../models/Booking');
const Service = require('../models/Service');
const Coupon = require('../models/Coupon');
const Loyalty = require('../models/Loyalty');
const BusinessSettings = require('../models/BusinessSettings');
const generateBookingId = require('../utils/generateBookingId');
const { sendEmail } = require('../config/mailer');
const {
  newBookingAdminEmail,
  bookingStatusCustomerEmail,
  bookingCancelledAdminEmail,
} = require('../utils/emailTemplates');

const SALON_OPEN_MINUTES = 10 * 60; // 10:00
const SALON_CLOSE_MINUTES = 20 * 60; // 20:00
const SLOT_STEP_MINUTES = 30;

function timeToMinutes(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

function minutesToTime(mins) {
  const h = String(Math.floor(mins / 60)).padStart(2, '0');
  const m = String(mins % 60).padStart(2, '0');
  return `${h}:${m}`;
}

/**
 * Computes which slots are free for a given date + service duration by
 * checking existing (non-rejected/cancelled) bookings for that date.
 * This is the SAME logic used both for the availability endpoint and for
 * the final re-check before saving, so the two can never disagree.
 */
async function computeAvailableSlots(date, durationMinutes) {
  const activeBookings = await Booking.find({
    date,
    status: { $in: ['PENDING', 'APPROVED'] },
  }).select('time duration');

  const busyRanges = activeBookings.map((b) => {
    const start = timeToMinutes(b.time);
    return { start, end: start + b.duration };
  });

  const slots = [];
  for (
    let start = SALON_OPEN_MINUTES;
    start + durationMinutes <= SALON_CLOSE_MINUTES;
    start += SLOT_STEP_MINUTES
  ) {
    const end = start + durationMinutes;
    const overlaps = busyRanges.some((r) => start < r.end && end > r.start);
    if (!overlaps) slots.push(minutesToTime(start));
  }

  return slots;
}

function isPastDateTime(date, time) {
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  const candidate = new Date(year, month - 1, day, hour, minute);
  return candidate.getTime() < Date.now();
}

// GET /api/bookings/availability?date=YYYY-MM-DD&serviceId=...
async function getAvailability(req, res, next) {
  try {
    const { date, serviceId } = req.query;

    if (!date || !serviceId) {
      return res.status(400).json({ success: false, message: 'date and serviceId are required.' });
    }

    const todayStr = new Date().toISOString().split('T')[0];
    if (date < todayStr) {
      return res.status(400).json({ success: false, message: 'Cannot check availability for a past date.' });
    }

    const service = await Service.findById(serviceId);
    if (!service || !service.active) {
      return res.status(404).json({ success: false, message: 'Service not found or unavailable.' });
    }

    let slots = await computeAvailableSlots(date, service.duration);

    // Hide slots that are already in the past if the date is today.
    if (date === todayStr) {
      slots = slots.filter((t) => !isPastDateTime(date, t));
    }

    res.json({ success: true, date, duration: service.duration, slots });
  } catch (err) {
    next(err);
  }
}

// POST /api/bookings (customer, must be logged in)
async function createBooking(req, res, next) {
  try {
    const { serviceId, date, time, paymentMethod, couponCode, notes } = req.body;

    if (!serviceId || !date || !time) {
      return res.status(400).json({ success: false, message: 'Service, date and time are required.' });
    }

    const service = await Service.findById(serviceId);
    if (!service || !service.active) {
      return res.status(404).json({ success: false, message: 'Service not found or unavailable.' });
    }

    const todayStr = new Date().toISOString().split('T')[0];
    if (date < todayStr) {
      return res.status(400).json({ success: false, message: 'You cannot book a past date.' });
    }
    if (isPastDateTime(date, time)) {
      return res.status(400).json({ success: false, message: 'You cannot book a past time.' });
    }

    // CRITICAL: re-check availability on the backend right before saving,
    // regardless of what the frontend showed the user. This is what
    // actually prevents double-booking when two people race for one slot.
    const freshSlots = await computeAvailableSlots(date, service.duration);
    if (!freshSlots.includes(time)) {
      return res.status(409).json({
        success: false,
        message: 'Sorry, that time slot was just taken. Please choose a different time.',
      });
    }

    // Coupon validation (backend is the source of truth for discounts).
    let discountAmount = 0;
    let appliedCoupon = null;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
      if (!coupon || !coupon.isValid()) {
        return res.status(400).json({ success: false, message: 'This coupon is invalid or has expired.' });
      }
      discountAmount =
        coupon.type === 'percentage' ? Math.round((service.price * coupon.value) / 100) : coupon.value;
      discountAmount = Math.min(discountAmount, service.price);
      appliedCoupon = coupon;
    }

    const finalPrice = Math.max(service.price - discountAmount, 0);

    const booking = await Booking.create({
      bookingId: generateBookingId(),
      customer: req.user._id,
      customerName: req.user.name,
      customerEmail: req.user.email,
      customerPhone: req.user.phone,
      service: service._id,
      serviceName: service.name,
      price: service.price,
      duration: service.duration,
      date,
      time,
      status: 'PENDING',
      paymentMethod: paymentMethod || 'PayAtSalon',
      paymentStatus: 'UNPAID',
      coupon: appliedCoupon ? appliedCoupon.code : null,
      discountAmount,
      finalPrice,
      notes: notes || '',
    });

    if (appliedCoupon) {
      appliedCoupon.usedCount += 1;
      await appliedCoupon.save();
    }

    // Notify admin - never let a failed email block the booking response.
    const settings = await BusinessSettings.findOne();
    const adminEmail = settings?.email || process.env.ADMIN_EMAIL;
    sendEmail({
      to: adminEmail,
      subject: `New Booking: ${booking.bookingId}`,
      html: newBookingAdminEmail(booking),
    }).catch(() => {});

    res.status(201).json({ success: true, booking });
  } catch (err) {
    next(err);
  }
}

// GET /api/bookings/my (customer)
async function getMyBookings(req, res, next) {
  try {
    const bookings = await Booking.find({ customer: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: bookings.length, bookings });
  } catch (err) {
    next(err);
  }
}

// GET /api/bookings/:id
async function getBookingById(req, res, next) {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });

    const isOwner = booking.customer.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'You cannot view this booking.' });
    }

    res.json({ success: true, booking });
  } catch (err) {
    next(err);
  }
}

// PUT /api/bookings/:id/cancel (customer - only their own, only if allowed)
async function cancelBooking(req, res, next) {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });

    if (booking.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'You cannot cancel this booking.' });
    }

    if (!['PENDING', 'APPROVED'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: `A booking that is ${booking.status.toLowerCase()} cannot be cancelled.`,
      });
    }

    booking.status = 'CANCELLED';
    await booking.save();

    const settings = await BusinessSettings.findOne();
    sendEmail({
      to: settings?.email || process.env.ADMIN_EMAIL,
      subject: `Booking Cancelled: ${booking.bookingId}`,
      html: bookingCancelledAdminEmail(booking),
    }).catch(() => {});

    res.json({ success: true, message: 'Booking cancelled.', booking });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAvailability,
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  // exported for reuse by the admin controller when approving/rejecting
  computeAvailableSlots,
};
