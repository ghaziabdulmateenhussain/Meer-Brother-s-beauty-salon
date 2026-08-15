import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import DashboardCard from '../../components/DashboardCard';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/admin/dashboard').then((res) => setStats(res.data.stats));
  }, []);

  if (!stats) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        <DashboardCard label="Total Bookings" value={stats.totalBookings} accent />
        <DashboardCard label="Pending" value={stats.pendingBookings} />
        <DashboardCard label="Approved" value={stats.approvedBookings} />
        <DashboardCard label="Completed" value={stats.completedBookings} />
        <DashboardCard label="Cancelled" value={stats.cancelledBookings} />
        <DashboardCard label="Rejected" value={stats.rejectedBookings} />
        <DashboardCard label="Customers" value={stats.totalCustomers} />
        <DashboardCard label="Services" value={stats.totalServices} />
        <DashboardCard label="Staff" value={stats.totalStaff} />
        <DashboardCard label="Revenue" value={`Rs. ${stats.revenue}`} accent />
      </div>
    </div>
  );
}
