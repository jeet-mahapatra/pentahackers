import React from 'react';

const AdminDashboard = () => {
  const name = sessionStorage.getItem('civicName') || 'Admin';
  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-sm rounded">
      <h2 className="text-2xl font-semibold mb-4">Admin Dashboard</h2>
      <p className="text-gray-700">Welcome, {name}. This is the admin dashboard.</p>
    </div>
  );
};

export default AdminDashboard;
