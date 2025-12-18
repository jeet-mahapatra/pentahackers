import React from 'react';

const AdminSidebar = ({ tabs, active, onChangeTab }) => {
  return (
    <aside className="w-64 bg-white border-r">
      <nav className="p-4">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => onChangeTab(t)}
            className={`w-full text-left px-3 py-2 rounded mb-1 hover:bg-gray-100 ${
              t === active ? 'bg-gray-100 font-semibold' : 'text-gray-700'
            }`}
          >
            {t}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
