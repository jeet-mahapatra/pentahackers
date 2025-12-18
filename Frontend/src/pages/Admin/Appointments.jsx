import React, { useEffect, useState } from 'react';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [status, setStatus] = useState('all');

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      const res = await fetch('/appointments');
      const data = await res.json();
      setAppointments(data);
    } catch (e) { console.warn(e); }
  }

  const filtered = appointments.filter((a) => (status === 'all' ? true : a.status === status));

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Appointments</h2>
      <div className="mb-4 flex items-center gap-4">
        <label className="text-sm text-gray-600">Status:</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="border px-2 py-1">
          <option value="all">All</option>
          <option value="pending">pending</option>
          <option value="approved">approved</option>
          <option value="completed">completed</option>
          <option value="rejected">rejected</option>
        </select>
      </div>

      <div className="bg-white rounded shadow overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 text-left">User</th>
              <th className="p-2 text-left">Provider</th>
              <th className="p-2">Date</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id} className="border-t">
                <td className="p-2">{a.userName || a.userId}</td>
                <td className="p-2">{a.providerName || a.providerId}</td>
                <td className="p-2 text-center">{a.date}</td>
                <td className="p-2 text-center">{a.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Appointments;
