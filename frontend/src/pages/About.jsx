import React from 'react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="section max-w-4xl">
      <p className="section-eyebrow text-center">About Us</p>
      <h1 className="section-title text-center">Meer Brother's Salon</h1>
      <p className="text-center text-gold-light italic mb-10">"Your Beauty, Our Passion"</p>

      <div className="space-y-6 text-onyx/70 dark:text-white/70 leading-relaxed">
        <p>
          Meer Brother's Salon is a premium barber and beauty salon located near the Post Office in
          Kunjah, District Gujrat, Pakistan. We bring together traditional barbering craftsmanship and
          modern beauty artistry under one roof, serving men, women and children with equal care.
        </p>
        <p>
          Our team of experienced barbers and beauticians is dedicated to giving every client a
          personalized, comfortable experience &mdash; whether it's a classic haircut, a bridal makeover,
          or a relaxing facial. We use quality products and stay current with the latest styles and
          techniques.
        </p>
        <p>
          What sets us apart is our attention to detail and genuine passion for our craft. We believe
          everyone deserves to look and feel their best, and we're proud to be Kunjah's trusted name in
          beauty and grooming.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 text-center">
        <div className="card p-6">
          <p className="text-3xl font-bold text-gold mb-1">10+</p>
          <p className="text-sm text-onyx/60 dark:text-white/60">Years Combined Experience</p>
        </div>
        <div className="card p-6">
          <p className="text-3xl font-bold text-gold mb-1">19+</p>
          <p className="text-sm text-onyx/60 dark:text-white/60">Services Offered</p>
        </div>
        <div className="card p-6">
          <p className="text-3xl font-bold text-gold mb-1">5</p>
          <p className="text-sm text-onyx/60 dark:text-white/60">Expert Team Members</p>
        </div>
      </div>

      <div className="text-center mt-12">
        <Link to="/booking" className="btn-gold">Book Your Appointment</Link>
      </div>
    </div>
  );
}
