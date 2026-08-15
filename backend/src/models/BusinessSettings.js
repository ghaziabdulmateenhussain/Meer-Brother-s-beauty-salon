const mongoose = require('mongoose');

const businessSettingsSchema = new mongoose.Schema(
  {
    businessName: { type: String, default: "Meer Brother's Salon" },
    tagline: { type: String, default: 'Your Beauty, Our Passion' },
    email: { type: String, default: 'ghaziabdulmateen786@gmail.com' },
    phone: { type: String, default: '03430945567' },
    whatsapp: { type: String, default: '03430945567' },
    address: { type: String, default: 'Near Post Office, Kunjah, District Gujrat, Pakistan' },
    openingHours: {
      type: Map,
      of: String,
      default: {
        Monday: '10:00 AM - 8:00 PM',
        Tuesday: '10:00 AM - 8:00 PM',
        Wednesday: '10:00 AM - 8:00 PM',
        Thursday: '10:00 AM - 8:00 PM',
        Friday: '2:00 PM - 8:00 PM',
        Saturday: '10:00 AM - 9:00 PM',
        Sunday: '10:00 AM - 9:00 PM',
      },
    },
    socialLinks: {
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      tiktok: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('BusinessSettings', businessSettingsSchema);
