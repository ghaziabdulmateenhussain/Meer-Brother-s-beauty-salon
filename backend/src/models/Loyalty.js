const mongoose = require('mongoose');

const loyaltyTransactionSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['earned', 'redeemed'], required: true },
    points: { type: Number, required: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    note: { type: String, default: '' },
    date: { type: Date, default: Date.now },
  },
  { _id: false }
);

const loyaltySchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    points: { type: Number, default: 0, min: 0 },
    transactions: [loyaltyTransactionSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Loyalty', loyaltySchema);
