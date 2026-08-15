const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    duration: { type: Number, required: true, min: 5, comment: 'duration in minutes' },
    category: {
      type: String,
      required: true,
      enum: ['Barber', 'Beauty'],
    },
    image: { type: String, default: '' },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

serviceSchema.index({ category: 1, active: 1 });

module.exports = mongoose.model('Service', serviceSchema);
