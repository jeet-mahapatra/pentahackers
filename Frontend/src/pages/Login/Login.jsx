import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import db from '../../../db.json';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('user');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [lastDebug, setLastDebug] = useState('');

  const roleLabel = { user: 'User', provider: 'Provider', admin: 'Admin' };
  const demoUsers = (db?.users || [])
    .filter(u => ['user', 'provider', 'admin'].includes(u.role))
    .map(u => ({ label: `${roleLabel[u.role] || u.role}: ${u.name}`, email: u.email, password: u.password, role: u.role }));

  const submit = (e) => {
    e.preventDefault();
    setErr('');
    const emailNorm = (email || '').trim().toLowerCase();
    const passwordTrim = (password || '').trim();
    const users = db?.users || [];
    setLastDebug('Checking for ' + emailNorm + ' …');
    // find user by email (case-insensitive)
    const found = users.find(u => ((u.email || '').trim().toLowerCase() === emailNorm));
    if (!found) {
      setLastDebug('No account with that email');
      setErr('Invalid email or password');
      return;
    }
    // check password
    if ((found.password || '').trim() !== passwordTrim) {
      setLastDebug('Password mismatch (entered: ' + (passwordTrim ? '[provided]' : '[empty]') + ')');
      setErr('Invalid email or password');
      return;
    }
    // ensure role matches (case-insensitive)
    const actualRole = (found.role || '').toString().trim().toLowerCase();
    const selRole = (selectedRole || '').toString().trim().toLowerCase();
    if (actualRole !== selRole) {
      setLastDebug('Role mismatch: account=' + actualRole + ' selection=' + selRole);
      setErr('Selected role does not match account role');
      return;
    }
    // persist session and navigate
    sessionStorage.setItem('civicName', found.name);
    sessionStorage.setItem('userId', String(found.id));
    sessionStorage.setItem('role', found.role);
    setLastDebug('Login OK — routing to ' + (actualRole === 'provider' ? '/provider/dashboard' : actualRole === 'admin' ? '/admin/dashboard' : '/dashboard'));
    if (actualRole === 'admin') navigate('/admin/dashboard');
    else if (actualRole === 'provider') navigate('/provider/dashboard');
    else navigate('/dashboard');
  };

  const fill = (u) => {
    setEmail(u.email);
    setPassword(u.password);
    setSelectedRole(u.role || 'user');
    setErr('');
  };

  // Using static import of frontend/db.json for demo data (no backend required)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-pink-50 px-6">
      <div className="w-full max-w-md p-8 bg-white/80 backdrop-blur-sm ring-1 ring-gray-200 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 to-pink-500 rounded-lg flex items-center justify-center text-white text-lg font-bold shadow-md">EF</div>
          <div>
            <h2 className="text-2xl font-semibold">Welcome Back</h2>
            <p className="text-sm text-gray-600">Sign in to access your dashboard</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-5">
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-gray-500">Loading demo users...</div>
          ) : fetchError ? (
            <div className="text-sm text-red-500">{fetchError}</div>
          ) : (
            demoUsers.map((d) => (
              <button
                key={d.email}
                onClick={() => fill(d)}
                disabled={loading}
                className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-lg transition-shadow text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {d.label}
              </button>
            ))
          )}
        </div>

        <form onSubmit={submit} className="grid gap-3">
          <label className="block text-sm text-gray-700">
            Role
            <select
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value)}
              className="mt-1 w-full bg-white/60 backdrop-blur-sm border border-gray-200 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="user">User</option>
              <option value="provider">Service Provider</option>
              <option value="admin">Admin</option>
            </select>
          </label>

          <label className="block text-sm text-gray-700">
            Email
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="mt-1 w-full bg-white/60 backdrop-blur-sm border border-gray-200 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </label>

          <label className="block text-sm text-gray-700">
            Password
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="mt-1 w-full bg-white/60 backdrop-blur-sm border border-gray-200 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </label>

          <button type="submit" className="mt-2 bg-gradient-to-r from-indigo-600 to-pink-500 text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:scale-[1.01] transform transition">
            Sign in
          </button>
          {err && <div className="text-red-600">{err}</div>}
        </form>

        <section className="mt-6 bg-white/60 border border-gray-100 rounded-lg p-4">
          <h4 className="text-lg font-medium">Demo Credentials</h4>
          <ul className="list-inside list-disc mt-2 text-sm text-gray-700 space-y-1">
            {demoUsers.map(u => (
              <li key={u.email}>{u.label} — email: {u.email} — password: {u.password}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Login;