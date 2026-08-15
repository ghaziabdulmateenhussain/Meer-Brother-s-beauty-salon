import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ServiceCard from '../components/ServiceCard';
import StaffCard from '../components/StaffCard';
import ReviewCard from '../components/ReviewCard';
import GalleryGrid from '../components/GalleryGrid';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Home() {
  const [services, setServices] = useState([]);
  const [staff, setStaff] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/services'),
      api.get('/staff'),
      api.get('/reviews'),
      api.get('/gallery'),
    ])
      .then(([s, st, r, g]) => {
        setServices(s.data.services.slice(0, 6));
        setStaff(st.data.staff.slice(0, 5));
        setReviews(r.data.reviews.slice(0, 3));
        setGallery(g.data.gallery.slice(0, 6));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner fullscreen />;

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-onyx text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_#C9A227,_transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 md:py-40 text-center">
          <p className="section-eyebrow">Barber + Beauty Salon</p>
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">
            Meer Brother's <span className="text-gold">Salon</span>
          </h1>
          <p className="text-lg md:text-xl text-gold-light italic mb-10">"Your Beauty, Our Passion"</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/booking" className="btn-gold">Book Appointment</Link>
            <Link to="/services" className="btn-outline !border-white !text-white hover:!bg-white hover:!text-onyx">View Services</Link>
            <a
              href="https://wa.me/923430945567"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline !border-[#25D366] !text-[#25D366] hover:!bg-[#25D366] hover:!text-white"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="section text-center max-w-3xl">
        <p className="section-eyebrow">Welcome</p>
        <h2 className="section-title">Premium Grooming &amp; Beauty in Gujrat</h2>
        <p className="text-onyx/70 dark:text-white/70 leading-relaxed">
          Located near the Post Office in Kunjah, District Gujrat, Meer Brother's Salon blends timeless
          barbering craft with modern beauty artistry. From sharp fades to bridal glam, our team delivers
          a premium experience in a warm, welcoming space.
        </p>
      </section>

      {/* Featured Services */}
      <section className="section">
        <div className="text-center mb-10">
          <p className="section-eyebrow">What We Offer</p>
          <h2 className="section-title">Featured Services</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => <ServiceCard key={s._id} service={s} />)}
        </div>
        <div className="text-center mt-10">
          <Link to="/services" className="btn-outline">View All Services</Link>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gold/5 dark:bg-onyx-light">
        <div className="section">
          <div className="text-center mb-10">
            <p className="section-eyebrow">Why Choose Us</p>
            <h2 className="section-title">The Meer Brother's Difference</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              { title: 'Expert Team', desc: 'Skilled barbers and beauticians with years of craft.' },
              { title: 'Premium Products', desc: 'Only quality tools and products for every service.' },
              { title: 'Easy Online Booking', desc: 'Book your slot in seconds, anytime, anywhere.' },
            ].map((f) => (
              <div key={f.title} className="p-6">
                <div className="w-14 h-14 mx-auto rounded-full bg-gold/15 text-gold flex items-center justify-center mb-4 text-xl font-display">&#10022;</div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-onyx/60 dark:text-white/60">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Staff */}
      <section className="section">
        <div className="text-center mb-10">
          <p className="section-eyebrow">Meet The Team</p>
          <h2 className="section-title">Our Staff</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
          {staff.map((m) => <StaffCard key={m._id} member={m} />)}
        </div>
      </section>

      {/* Gallery preview */}
      <section className="section">
        <div className="text-center mb-10">
          <p className="section-eyebrow">Our Work</p>
          <h2 className="section-title">Gallery</h2>
        </div>
        <GalleryGrid items={gallery} />
        <div className="text-center mt-10">
          <Link to="/gallery" className="btn-outline">View Full Gallery</Link>
        </div>
      </section>

      {/* Reviews */}
      {reviews.length > 0 && (
        <section className="bg-gold/5 dark:bg-onyx-light">
          <div className="section">
            <div className="text-center mb-10">
              <p className="section-eyebrow">Testimonials</p>
              <h2 className="section-title">What Our Customers Say</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reviews.map((r) => <ReviewCard key={r._id} review={r} />)}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section text-center">
        <h2 className="section-title">Ready for Your Next Appointment?</h2>
        <p className="text-onyx/60 dark:text-white/60 mb-8">Book online in a few clicks &mdash; it only takes a minute.</p>
        <Link to="/booking" className="btn-gold">Book Appointment Now</Link>
      </section>
    </div>
  );
}
