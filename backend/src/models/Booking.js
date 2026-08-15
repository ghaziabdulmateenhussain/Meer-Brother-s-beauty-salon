const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookingId: { type: String, required: true, unique: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    serviceName: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    duration: { type: Number, required: true },
    date: { type: String, required: true, comment: 'YYYY-MM-DD' },
    time: { type: String, required: true, comment: 'HH:mm 24hr' },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED'],
      default: 'PENDING',
    },
    paymentMethod: {
      type: String,
      enum: ['JazzCash', 'Easypaisa', 'BankTransfer', 'Card', 'PayAtSalon'],
      default: 'PayAtSalon',
    },
    paymentStatus: {
      type: String,
      enum: ['UNPAID', 'PENDING', 'PAID', 'FAILED', 'REFUNDED'],
      default: 'UNPAID',
    },
    coupon: { type: String, default: null },
    discountAmount: { type: Number, default: 0 },
    finalPrice: { type: Number, required: true },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

// Speeds up the availability check: "is this date+time already taken".
bookingSchema.index({ date: 1, time: 1, status: 1 });
bookingSchema.index({ customer: 1, createdAt: -1 });

module.exports = mongoose.model('Booking', bookingSchema);
