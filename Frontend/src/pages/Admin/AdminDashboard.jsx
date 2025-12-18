import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import Overview from './Overview';
import Providers from './Providers';
import Users from './Users';
import Appointments from './Appointments';
import UrgentRequests from './UrgentRequests';

const TABS = [
  'Dashboard',
  'Provider Verify',
  'Users',
  'Appointments',
  'Urgent Requests',
  'Reports',
  'Settings',
];

const AdminDashboard = () => {
  const [active, setActive] = useState('Dashboard');
  const name = sessionStorage.getItem('civicName') || 'Admin';

  function renderMain() {
    switch (active) {
      case 'Dashboard':
        return <Overview />;
      case 'Provider Verify':
        return <Providers />;
      case 'Users':
        return <Users />;
      case 'Appointments':
        return <Appointments />;
      case 'Urgent Requests':
        return <UrgentRequests />;
      default:
        return (
          <div className="p-6">
            <h3 className="text-xl font-semibold">{active}</h3>
            <p className="text-gray-600 mt-2">Coming soon.</p>
          </div>
        );
    }
  }

  return (
    <AdminLayout
      name={name}
      tabs={TABS}
      active={active}
      onChangeTab={setActive}
    >
      {renderMain()}
    </AdminLayout>
  );
};

export default AdminDashboard;
