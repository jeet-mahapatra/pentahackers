import React, { useEffect, useState } from 'react';

const Providers = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch('/serviceProviders');
      const data = await res.json();
      setProviders(data);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id, status) {
    if (!confirm(`Set provider ${id} => ${status}?`)) return;
    try {
      await fetch(`/serviceProviders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verificationStatus: status }),
      });
    } catch (e) {
      console.warn('PATCH failed, applying locally', e);
      // fallthrough to local update
    }
    setProviders((prev) => prev.map((p) => (p.id === id ? { ...p, verificationStatus: status } : p)));
  }

  const pending = providers.filter((p) => p.verificationStatus === 'pending');

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Provider Verification</h2>
      <p className="text-sm text-gray-600 mb-4">Review newly registered providers and their documents.</p>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="space-y-4">
          {pending.length === 0 && <div className="text-gray-600">No pending providers.</div>}
          {pending.map((p) => (
            <div key={p.id} className="bg-white p-4 rounded shadow">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold">{p.name || p.businessName || 'Provider #' + p.id}</div>
                  <div className="text-sm text-gray-500">{p.email}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateStatus(p.id, 'verified')}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updateStatus(p.id, 'rejected')}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Reject
                  </button>
                </div>
              </div>
              <div className="mt-3 text-sm">
                <div className="font-medium">Uploaded Documents:</div>
                <pre className="mt-2 bg-gray-50 p-2 rounded text-xs overflow-auto">{JSON.stringify(p.documents || p.files || {}, null, 2)}</pre>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Providers;
