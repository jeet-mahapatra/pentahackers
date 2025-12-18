import React, { useEffect, useState } from 'react';

const Overview = () => {
  const [counts, setCounts] = useState({ users: 0, providers: 0, pending: 0, urgent: 0, appointmentsToday: 0 });

  useEffect(() => {
    async function load() {
      try {
        const [uRes, pRes, urRes, aRes] = await Promise.all([
          fetch('/users'),
          fetch('/serviceProviders'),
          fetch('/urgentRequests'),
          fetch('/appointments'),
        ]);
        const [users, providers, urgents, appointments] = await Promise.all([
          uRes.json(),
          pRes.json(),
          urRes.json(),
          aRes.json(),
        ]);

        const pending = providers.filter((p) => p.verificationStatus === 'pending').length;
        const today = new Date().toISOString().slice(0, 10);
        const appointmentsToday = appointments.filter((a) => a.date && a.date.startsWith(today)).length;

        setCounts({
          users: users.length,
          providers: providers.length,
          pending,
          urgent: urgents.length,
          appointmentsToday,
        });
      } catch (e) {
        console.warn('Overview load error', e);
      }
    }
    load();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Total Users</div>
          <div className="text-2xl font-bold">{counts.users}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Service Providers</div>
          <div className="text-2xl font-bold">{counts.providers}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Pending Verifications</div>
          <div className="text-2xl font-bold text-yellow-600">{counts.pending}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Active Urgent Requests</div>
          <div className="text-2xl font-bold text-red-600">{counts.urgent}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Today's Appointments</div>
          <div className="text-2xl font-bold">{counts.appointmentsToday}</div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
