import React from 'react';

const AdminTopbar = ({ name }) => {
  function handleLogout() {
    sessionStorage.clear();
    window.location.href = '/';
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-bold">EasyFind</h1>
          <span className="text-sm text-gray-500">Admin Dashboard</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-700">{name}</div>
          <button
            onClick={handleLogout}
            className="text-sm bg-red-500 text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;
