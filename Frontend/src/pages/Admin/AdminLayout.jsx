import React from 'react';
import AdminTopbar from './AdminTopbar';
import AdminSidebar from './AdminSidebar';

const AdminLayout = ({ name, tabs, active, onChangeTab, children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminTopbar name={name} />
      <div className="flex">
        <AdminSidebar tabs={tabs} active={active} onChangeTab={onChangeTab} />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
