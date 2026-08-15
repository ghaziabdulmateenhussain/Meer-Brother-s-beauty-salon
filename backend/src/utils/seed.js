require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Service = require('../models/Service');
const Staff = require('../models/Staff');
const Gallery = require('../models/Gallery');
const Coupon = require('../models/Coupon');
const BusinessSettings = require('../models/BusinessSettings');

const barberServices = [
  { name: 'Hair Cut', description: 'Precision haircut tailored to your style.', price: 500, duration: 30, category: 'Barber' },
  { name: 'Beard Trim', description: 'Clean, sharp beard trim and shape-up.', price: 300, duration: 20, category: 'Barber' },
  { name: 'Beard Styling', description: 'Full beard styling with premium oils.', price: 400, duration: 25, category: 'Barber' },
  { name: 'Shaving', description: 'Traditional hot-towel shave.', price: 350, duration: 20, category: 'Barber' },
  { name: 'Hair Styling', description: 'Modern styling for any occasion.', price: 450, duration: 25, category: 'Barber' },
  { name: 'Hair Wash', description: 'Relaxing wash with premium shampoo.', price: 250, duration: 15, category: 'Barber' },
  { name: 'Kids Hair Cut', description: 'Gentle, friendly haircuts for kids.', price: 400, duration: 25, category: 'Barber' },
  { name: 'Hair Treatment', description: 'Restorative treatment for healthy hair.', price: 1200, duration: 45, category: 'Barber' },
  { name: 'Hair Coloring', description: 'Professional hair coloring service.', price: 1800, duration: 60, category: 'Barber' },
];

const beautyServices = [
  { name: 'Facial', description: 'Deep-cleansing rejuvenating facial.', price: 1500, duration: 45, category: 'Beauty' },
  { name: 'Cleanup', description: 'Quick refreshing skin cleanup.', price: 800, duration: 30, category: 'Beauty' },
  { name: 'Skin Care', description: 'Customized skin care session.', price: 1600, duration: 40, category: 'Beauty' },
  { name: 'Makeup', description: 'Everyday professional makeup.', price: 2000, duration: 45, category: 'Beauty' },
  { name: 'Bridal Makeup', description: 'Full bridal makeup package.', price: 8000, duration: 120, category: 'Beauty' },
  { name: 'Party Makeup', description: 'Glamorous makeup for events.', price: 3000, duration: 60, category: 'Beauty' },
  { name: 'Manicure', description: 'Nail care and polish for hands.', price: 700, duration: 30, category: 'Beauty' },
  { name: 'Pedicure', description: 'Relaxing foot and nail care.', price: 900, duration: 40, category: 'Beauty' },
  { name: 'Massage', description: 'Therapeutic relaxation massage.', price: 1800, duration: 45, category: 'Beauty' },
  { name: 'Mehndi', description: 'Traditional and bridal mehndi art.', price: 1500, duration: 60, category: 'Beauty' },
];

const staffMembers = [
  { name: 'Ahmed Meer', position: 'Senior Barber', specialty: 'Classic Cuts & Beard Styling', experience: '10 years', bio: 'Ahmed is a master barber known for precise classic cuts and expert beard sculpting.' },
  { name: 'Bilal Meer', position: 'Master Barber', specialty: 'Modern Fades & Hair Coloring', experience: '8 years', bio: 'Bilal specializes in contemporary fades and creative hair coloring techniques.' },
  { name: 'Sana Malik', position: 'Senior Beautician', specialty: 'Bridal Makeup & Skin Care', experience: '9 years', bio: 'Sana has transformed hundreds of brides with her elegant, camera-ready makeup artistry.' },
  { name: 'Ayesha Khan', position: 'Beautician', specialty: 'Facials & Party Makeup', experience: '6 years', bio: 'Ayesha is passionate about skin care and creating stunning party-ready looks.' },
  { name: 'Usman Meer', position: 'Barber', specialty: 'Kids Cuts & Hair Styling', experience: '5 years', bio: 'Usman brings a gentle, friendly approach that makes him a favorite for kids and families.' },
];

const galleryItems = [
  { title: 'Classic Fade', image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800', category: 'Haircuts', description: 'Sharp classic fade haircut.' },
  { title: 'Beard Sculpting', image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800', category: 'Beard', description: 'Precision beard sculpting.' },
  { title: 'Bridal Glam', image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800', category: 'Bridal', description: 'Full bridal makeup transformation.' },
  { title: 'Evening Makeup', image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800', category: 'Makeup', description: 'Glamorous evening makeup look.' },
  { title: 'Elegant Updo', image: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?w=800', category: 'Hair Styling', description: 'Elegant styled updo.' },
  { title: 'Spa Facial', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800', category: 'Beauty', description: 'Relaxing rejuvenating facial.' },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB for seeding...');

  const adminEmail = process.env.ADMIN_EMAIL || 'ghaziabdulmateen786@gmail.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeThisPassword123!';

  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    await User.create({
      name: process.env.ADMIN_NAME || "Meer Brother's Salon Admin",
      email: adminEmail,
      phone: process.env.ADMIN_PHONE || '03430945567',
      password: adminPassword,
      role: 'admin',
    });
    console.log(`Admin account created: ${adminEmail}`);
  } else {
    console.log('Admin account already exists, skipping.');
  }

  const serviceCount = await Service.countDocuments();
  if (serviceCount === 0) {
    await Service.insertMany([...barberServices, ...beautyServices]);
    console.log(`Seeded ${barberServices.length + beautyServices.length} services.`);
  } else {
    console.log('Services already exist, skipping.');
  }

  const staffCount = await Staff.countDocuments();
  if (staffCount === 0) {
    await Staff.insertMany(staffMembers);
    console.log(`Seeded ${staffMembers.length} staff members.`);
  } else {
    console.log('Staff already exist, skipping.');
  }

  const galleryCount = await Gallery.countDocuments();
  if (galleryCount === 0) {
    await Gallery.insertMany(galleryItems);
    console.log(`Seeded ${galleryItems.length} gallery items.`);
  } else {
    console.log('Gallery already exists, skipping.');
  }

  const couponCount = await Coupon.countDocuments();
  if (couponCount === 0) {
    await Coupon.insertMany([
      {
        code: 'WELCOME10',
        type: 'percentage',
        value: 10,
        expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        usageLimit: 100,
      },
      {
        code: 'FLAT200',
        type: 'fixed',
        value: 200,
        expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        usageLimit: 50,
      },
    ]);
    console.log('Seeded 2 coupons.');
  } else {
    console.log('Coupons already exist, skipping.');
  }

  const settingsCount = await BusinessSettings.countDocuments();
  if (settingsCount === 0) {
    await BusinessSettings.create({});
    console.log('Seeded business settings.');
  } else {
    console.log('Business settings already exist, skipping.');
  }

  console.log('Seeding complete.');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
