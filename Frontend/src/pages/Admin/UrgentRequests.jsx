import React, { useEffect, useState } from 'react';

const UrgentRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      const res = await fetch('/urgentRequests');
      const data = await res.json();
      setRequests(data);
    } catch (e) { console.warn(e); }
  }

  async function updateStatus(id, status) {
    try {
      await fetch(`/urgentRequests/${id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }),
      });
    } catch (e) { console.warn('PATCH failed', e); }
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Urgent Requests</h2>
      <div className="bg-white rounded shadow overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 text-left">Requester</th>
              <th className="p-2 text-left">Location</th>
              <th className="p-2">Status</th>
              <th className="p-2">Provider</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-2">{r.userName || r.userId}</td>
                <td className="p-2">{r.location || '-'}</td>
                <td className="p-2 text-center">{r.status}</td>
                <td className="p-2 text-center">{r.providerId || '-'}</td>
                <td className="p-2 text-center">
                  <div className="flex gap-2 justify-center">
                    {r.status !== 'accepted' && (
                      <button onClick={() => updateStatus(r.id, 'accepted')} className="px-2 py-1 bg-green-600 text-white rounded">Accept</button>
                    )}
                    {r.status !== 'closed' && (
                      <button onClick={() => updateStatus(r.id, 'closed')} className="px-2 py-1 bg-gray-600 text-white rounded">Close</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UrgentRequests;
