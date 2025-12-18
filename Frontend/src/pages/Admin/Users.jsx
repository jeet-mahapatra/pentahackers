import React, { useEffect, useState } from 'react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState('all');

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      const res = await fetch('/users');
      const data = await res.json();
      setUsers(data);
    } catch (e) { console.warn(e); }
  }

  async function toggleBlock(u) {
    const blocked = !u.blocked;
    try {
      await fetch(`/users/${u.id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ blocked }),
      });
    } catch (e) {
      console.warn('PATCH failed, updating locally', e);
    }
    setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, blocked } : x)));
  }

  const filtered = users.filter((u) => (role === 'all' ? true : u.role === role));

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Users</h2>
      <div className="mb-4 flex items-center gap-4">
        <label className="text-sm text-gray-600">Filter:</label>
        <select value={role} onChange={(e) => setRole(e.target.value)} className="border px-2 py-1">
          <option value="all">All</option>
          <option value="user">User</option>
          <option value="provider">Provider</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="bg-white rounded shadow overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2">Role</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="p-2">{u.name || u.username}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2 text-center">{u.role}</td>
                <td className="p-2 text-center">{u.blocked ? 'Blocked' : 'Active'}</td>
                <td className="p-2 text-center">
                  <button onClick={() => toggleBlock(u)} className="px-2 py-1 bg-yellow-500 text-white rounded">
                    {u.blocked ? 'Unblock' : 'Block'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
