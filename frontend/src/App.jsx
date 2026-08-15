import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './layouts/AdminLayout';

import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import ServiceDetails from './pages/ServiceDetails';
import Staff from './pages/Staff';
import Gallery from './pages/Gallery';
import Reviews from './pages/Reviews';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import CustomerDashboard from './pages/CustomerDashboard';
import CustomerProfile from './pages/CustomerProfile';
import Booking from './pages/Booking';
import BookingHistory from './pages/BookingHistory';
import AdminLogin from './pages/AdminLogin';
import NotFound from './pages/NotFound';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBookings from './pages/admin/AdminBookings';
import AdminServices from './pages/admin/AdminServices';
import AdminStaff from './pages/admin/AdminStaff';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminGallery from './pages/admin/AdminGallery';
import AdminReviews from './pages/admin/AdminReviews';
import AdminCoupons from './pages/admin/AdminCoupons';
import AdminLoyalty from './pages/admin/AdminLoyalty';
import AdminSettings from './pages/admin/AdminSettings';

function SiteLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-onyx text-onyx dark:text-white">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Public / customer site */}
      <Route path="/" element={<SiteLayout><Home /></SiteLayout>} />
      <Route path="/about" element={<SiteLayout><About /></SiteLayout>} />
      <Route path="/services" element={<SiteLayout><Services /></SiteLayout>} />
      <Route path="/services/:id" element={<SiteLayout><ServiceDetails /></SiteLayout>} />
      <Route path="/staff" element={<SiteLayout><Staff /></SiteLayout>} />
      <Route path="/gallery" element={<SiteLayout><Gallery /></SiteLayout>} />
      <Route path="/reviews" element={<SiteLayout><Reviews /></SiteLayout>} />
      <Route path="/contact" element={<SiteLayout><Contact /></SiteLayout>} />

      <Route path="/login" element={<SiteLayout><Login /></SiteLayout>} />
      <Route path="/register" element={<SiteLayout><Register /></SiteLayout>} />
      <Route path="/forgot-password" element={<SiteLayout><ForgotPassword /></SiteLayout>} />
      <Route path="/reset-password/:token" element={<SiteLayout><ResetPassword /></SiteLayout>} />

      <Route
        path="/dashboard"
        element={
          <SiteLayout>
            <ProtectedRoute>
              <CustomerDashboard />
            </ProtectedRoute>
          </SiteLayout>
        }
      />
      <Route
        path="/profile"
        element={
          <SiteLayout>
            <ProtectedRoute>
              <CustomerProfile />
            </ProtectedRoute>
          </SiteLayout>
        }
      />
      <Route
        path="/booking"
        element={
          <SiteLayout>
            <ProtectedRoute>
              <Booking />
            </ProtectedRoute>
          </SiteLayout>
        }
      />
      <Route
        path="/booking-history"
        element={
          <SiteLayout>
            <ProtectedRoute>
              <BookingHistory />
            </ProtectedRoute>
          </SiteLayout>
        }
      />

      {/* Admin */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout><AdminDashboard /></AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/bookings"
        element={
          <AdminRoute>
            <AdminLayout><AdminBookings /></AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/services"
        element={
          <AdminRoute>
            <AdminLayout><AdminServices /></AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/staff"
        element={
          <AdminRoute>
            <AdminLayout><AdminStaff /></AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/customers"
        element={
          <AdminRoute>
            <AdminLayout><AdminCustomers /></AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/gallery"
        element={
          <AdminRoute>
            <AdminLayout><AdminGallery /></AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/reviews"
        element={
          <AdminRoute>
            <AdminLayout><AdminReviews /></AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/coupons"
        element={
          <AdminRoute>
            <AdminLayout><AdminCoupons /></AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/loyalty"
        element={
          <AdminRoute>
            <AdminLayout><AdminLoyalty /></AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <AdminRoute>
            <AdminLayout><AdminSettings /></AdminLayout>
          </AdminRoute>
        }
      />

      <Route path="*" element={<SiteLayout><NotFound /></SiteLayout>} />
    </Routes>
  );
}
