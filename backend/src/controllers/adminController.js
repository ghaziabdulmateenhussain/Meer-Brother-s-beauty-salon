const Booking = require('../models/Booking');
const User = require('../models/User');
const Service = require('../models/Service');
const Staff = require('../models/Staff');
const Loyalty = require('../models/Loyalty');
const { sendEmail } = require('../config/mailer');
const { bookingStatusCustomerEmail } = require('../utils/emailTemplates');

const POINTS_PER_COMPLETED_BOOKING = 10;

// GET /api/admin/dashboard
async function getDashboard(req, res, next) {
  try {
    const [
      totalCustomers,
      totalBookings,
      pending,
      approved,
      completed,
      cancelled,
      rejected,
      totalServices,
      totalStaff,
      revenueAgg,
    ] = await Promise.all([
      User.countDocuments({ role: 'customer' }),
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'PENDING' }),
      Booking.countDocuments({ status: 'APPROVED' }),
      Booking.countDocuments({ status: 'COMPLETED' }),
      Booking.countDocuments({ status: 'CANCELLED' }),
      Booking.countDocuments({ status: 'REJECTED' }),
      Service.countDocuments(),
      Staff.countDocuments(),
      Booking.aggregate([
        { $match: { status: 'COMPLETED', paymentStatus: 'PAID' } },
        { $group: { _id: null, total: { $sum: '$finalPrice' } } },
      ]),
    ]);

    res.json({
      success: true,
      stats: {
        totalCustomers,
        totalBookings,
        pendingBookings: pending,
        approvedBookings: approved,
        completedBookings: completed,
        cancelledBookings: cancelled,
        rejectedBookings: rejected,
        totalServices,
        totalStaff,
        revenue: revenueAgg[0]?.total || 0,
      },
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/bookings?status=&search=
async function getAllBookings(req, res, next) {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.search) {
      const re = new RegExp(req.query.search, 'i');
      filter.$or = [{ customerName: re }, { bookingId: re }, { customerEmail: re }, { customerPhone: re }];
    }

    const bookings = await Booking.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: bookings.length, bookings });
  } catch (err) {
    next(err);
  }
}

// PUT /api/admin/bookings/:id/status  body: { status: 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED' }
async function updateBookingStatus(req, res, next) {
  try {
    const { status } = req.body;
    const allowed = ['APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });

    const validTransitions = {
      PENDING: ['APPROVED', 'REJECTED', 'CANCELLED'],
      APPROVED: ['COMPLETED', 'CANCELLED'],
      REJECTED: [],
      COMPLETED: [],
      CANCELLED: [],
    };

    if (!validTransitions[booking.status].includes(status)) {
      return res.status(400).json({
        success: false,
        message: `A booking that is ${booking.status.toLowerCase()} cannot be moved to ${status.toLowerCase()}.`,
      });
    }

    booking.status = status;
    await booking.save();

    // Award loyalty points on completion - server-side only, never trusts the client.
    if (status === 'COMPLETED') {
      let loyalty = await Loyalty.findOne({ customer: booking.customer });
      if (!loyalty) {
        loyalty = await Loyalty.create({ customer: booking.customer, points: 0, transactions: [] });
      }
      loyalty.points += POINTS_PER_COMPLETED_BOOKING;
      loyalty.transactions.push({
        type: 'earned',
        points: POINTS_PER_COMPLETED_BOOKING,
        booking: booking._id,
        note: `Completed booking ${booking.bookingId}`,
      });
      await loyalty.save();
    }

    const statusLabelMap = {
      APPROVED: 'Approved',
      REJECTED: 'Rejected',
      COMPLETED: 'Completed',
      CANCELLED: 'Cancelled',
    };

    sendEmail({
      to: booking.customerEmail,
      subject: `Booking ${statusLabelMap[status]}: ${booking.bookingId}`,
      html: bookingStatusCustomerEmail(booking, statusLabelMap[status]),
    }).catch(() => {});

    res.json({ success: true, booking });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/customers?search=
async function getCustomers(req, res, next) {
  try {
    const filter = { role: 'customer' };
    if (req.query.search) {
      const re = new RegExp(req.query.search, 'i');
      filter.$or = [{ name: re }, { email: re }, { phone: re }];
    }

    const customers = await User.find(filter).sort({ createdAt: -1 });
    const withCounts = await Promise.all(
      customers.map(async (c) => {
        const bookingCount = await Booking.countDocuments({ customer: c._id });
        return { ...c.toSafeObject(), bookingCount };
      })
    );

    res.json({ success: true, count: withCounts.length, customers: withCounts });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/customers/:id/bookings
async function getCustomerBookings(req, res, next) {
  try {
    const bookings = await Booking.find({ customer: req.params.id }).sort({ createdAt: -1 });
    res.json({ success: true, count: bookings.length, bookings });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getDashboard,
  getAllBookings,
  updateBookingStatus,
  getCustomers,
  getCustomerBookings,
};
