import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import db from '../../../db.json';

const SidebarItem = ({ label, active, onClick }) => (
  <button onClick={onClick} className={`w-full text-left px-4 py-3 rounded-lg hover:bg-indigo-50 ${active ? 'bg-indigo-100 font-medium' : 'text-gray-700'}`}>
    {label}
  </button>
);

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const userId = Number(sessionStorage.getItem('userId'));
  const role = sessionStorage.getItem('role');
  const name = sessionStorage.getItem('civicName') || 'Provider';

  useEffect(() => {
    if (!userId || role !== 'provider') navigate('/login');
  }, [userId, role, navigate]);

  // Find provider entry in db.json
  const provider = db.serviceProviders.find(p => p.userId === userId);
  // For safety, some demo setups might store providerId directly
  const providerId = provider ? provider.id : null;

  // Local in-memory copies (simulate GET/PATCH against db.json)
  const [dbCopy, setDbCopy] = useState(() => ({ ...db }));
  const [active, setActive] = useState('dashboard');
  const [available, setAvailable] = useState(provider?.available ?? false);
  const [selectedAppt, setSelectedAppt] = useState(null);

  // Derived lists
  const myAppointments = useMemo(() => (dbCopy.appointments || []).filter(a => a.providerId === providerId), [dbCopy, providerId]);
  const myUrgents = useMemo(() => (dbCopy.urgentRequests || []).filter(u => u.assignedProviderId === providerId || (u.status === 'open')), [dbCopy, providerId]);
  const myChats = useMemo(() => (dbCopy.chats || []).filter(c => c.providerId === providerId), [dbCopy, providerId]);
  const myReviews = useMemo(() => (dbCopy.reviews || []).filter(r => r.providerId === providerId), [dbCopy, providerId]);
  const myServices = useMemo(() => dbCopy.serviceProviders.find(s => s.id === providerId) || {}, [dbCopy, providerId]);
  const myUserRecord = useMemo(() => dbCopy.users.find(u => u.id === userId) || {}, [dbCopy, userId]);

  const logout = () => {
    sessionStorage.removeItem('civicName');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('role');
    navigate('/login');
  };

  // Helpers to simulate PATCH operations on dbCopy
  const patchServiceProvider = (id, patch) => {
    setDbCopy(prev => {
      const svc = (prev.serviceProviders || []).map(s => s.id === id ? { ...s, ...patch } : s);
      return { ...prev, serviceProviders: svc };
    });
  };

  const patchAppointment = (id, patch) => {
    setDbCopy(prev => {
      const appts = (prev.appointments || []).map(a => a.id === id ? { ...a, ...patch } : a);
      return { ...prev, appointments: appts };
    });
  };

  const patchUrgent = (id, patch) => {
    setDbCopy(prev => {
      const urg = (prev.urgentRequests || []).map(u => u.id === id ? { ...u, ...patch } : u);
      return { ...prev, urgentRequests: urg };
    });
  };

  const patchChat = (id, patch) => {
    setDbCopy(prev => {
      const chats = (prev.chats || []).map(c => c.id === id ? { ...c, ...patch } : c);
      return { ...prev, chats };
    });
  };

  const patchUser = (id, patch) => {
    setDbCopy(prev => {
      const users = (prev.users || []).map(u => u.id === id ? { ...u, ...patch } : u);
      return { ...prev, users };
    });
  };

  // Availability toggle
  const toggleAvailable = () => {
    const next = !available;
    setAvailable(next);
    if (provider) patchServiceProvider(provider.id, { available: next });
    alert(`Availability set to ${next ? 'Available' : 'Not available'} (in-memory)`);
  };

  // Appointment actions
  const approveAppointment = (id) => {
    patchAppointment(id, { status: 'approved' });
    alert('Appointment approved');
  };
  const rejectAppointment = (id) => {
    patchAppointment(id, { status: 'rejected' });
    alert('Appointment rejected');
  };
  const completeAppointment = (id) => {
    patchAppointment(id, { status: 'completed' });
    alert('Appointment marked completed');
  };

  // Urgent actions
  const acceptUrgent = (id) => {
    if (!providerId) return alert('Provider ID not found');
    patchUrgent(id, { status: 'accepted', assignedProviderId: providerId });
    alert('Accepted urgent request');
  };
  const closeUrgent = (id) => {
    patchUrgent(id, { status: 'closed' });
    alert('Closed urgent request');
  };

  // Chat actions
  const sendMessage = (chatId, text) => {
    const chat = (dbCopy.chats || []).find(c => c.id === chatId);
    if (!chat) return;
    const messages = [...(chat.messages || []), { senderRole: 'provider', text, timestamp: new Date().toISOString() }];
    patchChat(chatId, { messages });
  };

  // Services update
  const updateSlots = (slots) => {
    if (!provider) return;
    patchServiceProvider(provider.id, { slots });
    alert('Slots updated (in-memory)');
  };

  // Profile update
  const saveProfile = (patch) => {
    patchUser(userId, patch);
    alert('Profile updated (in-memory)');
  };

  // Export current in-memory db copy to JSON file for manual persistence
  const downloadDB = () => {
    const blob = new Blob([JSON.stringify(dbCopy, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'db_snapshot.json';
    a.click();
    URL.revokeObjectURL(url);
    alert('Downloaded db_snapshot.json — replace frontend/db.json if you want to persist changes');
  };

  if (!provider) return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-sm rounded">
      <h2 className="text-2xl font-semibold mb-4">Provider Dashboard</h2>
      <p className="text-gray-700">No provider profile found for this account. Please ensure you are logged in as a provider.</p>
      <div className="mt-4"><button onClick={() => navigate('/login')} className="px-4 py-2 bg-indigo-600 text-white rounded">Go to Login</button></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center text-white font-bold">EF</div>
            <div>
              <div className="font-semibold">EasyFind — Provider</div>
              <div className="text-xs text-gray-500">{myServices.category || 'Service' } • {myUserRecord.name}</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Availability</span>
              <button onClick={toggleAvailable} className={`px-3 py-1 rounded ${available ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>{available ? 'Available' : 'Not available'}</button>
            </div>
            <button className="p-2 rounded-full bg-gray-100">🔔</button>
            <div className="flex items-center gap-2">
              <div className="text-sm text-gray-700">{name}</div>
              <button onClick={logout} className="px-3 py-1 bg-red-500 text-white rounded">Logout</button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-12 gap-6">
        <aside className="col-span-12 md:col-span-3 lg:col-span-2">
          <div className="bg-white p-4 rounded-xl shadow-sm sticky top-24">
            <SidebarItem label="Dashboard" active={active==='dashboard'} onClick={()=>setActive('dashboard')} />
            <SidebarItem label="Appointments" active={active==='appointments'} onClick={()=>setActive('appointments')} />
            <SidebarItem label="Urgent Requests" active={active==='urgent'} onClick={()=>setActive('urgent')} />
            <SidebarItem label="Chats" active={active==='chats'} onClick={()=>setActive('chats')} />
            <SidebarItem label="My Services" active={active==='services'} onClick={()=>setActive('services')} />
            <SidebarItem label="Profile Settings" active={active==='profile'} onClick={()=>setActive('profile')} />
            <div className="mt-4">
              <button onClick={logout} className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100">Logout</button>
            </div>
            <div className="mt-4 text-sm text-gray-500">Storage: in-memory only • <button onClick={downloadDB} className="text-indigo-600">Download DB</button></div>
          </div>
        </aside>

        <main className="col-span-12 md:col-span-9 lg:col-span-10">
          {active === 'dashboard' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-indigo-600 to-pink-500 text-white p-6 rounded-2xl shadow-md flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">Welcome, {name}</h3>
                  <p className="opacity-90 mt-1">Manage appointments, urgent requests, and chats</p>
                </div>
                <div className="text-right">
                  <div className="text-sm">Avg rating</div>
                  <div className="text-xl font-bold">{(myReviews.reduce((s,r)=>s+r.rating,0)/(myReviews.length||1)).toFixed(1)} ⭐</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-white rounded shadow">Total Appointments<div className="text-2xl font-bold mt-2">{myAppointments.length}</div></div>
                <div className="p-4 bg-white rounded shadow">Pending<div className="text-2xl font-bold mt-2">{myAppointments.filter(a=>a.status==='pending').length}</div></div>
                <div className="p-4 bg-white rounded shadow">Active Urgent<div className="text-2xl font-bold mt-2">{myUrgents.filter(u=>u.status!=='closed').length}</div></div>
                <div className="p-4 bg-white rounded shadow">Active Chats<div className="text-2xl font-bold mt-2">{myChats.length}</div></div>
              </div>
            </div>
          )}

          {active === 'appointments' && (
            <div className="bg-white p-4 rounded-xl shadow">
              <h3 className="font-semibold mb-4">Appointments</h3>
              {myAppointments.length===0 ? <div className="text-gray-500">No appointments</div> : (
                <ul className="space-y-3">
                  {myAppointments.map(a=> (
                    <li key={a.id} className="p-3 border rounded flex items-center justify-between">
                      <div>
                        <div className="font-medium">User: {dbCopy.users.find(u=>u.id===a.userId)?.name || a.userId}</div>
                        <div className="text-xs text-gray-500">{a.date} {a.time} — Status: {a.status}</div>
                      </div>
                      <div className="flex gap-2">
                        {a.status==='pending' && <button onClick={()=>approveAppointment(a.id)} className="px-3 py-1 bg-green-500 text-white rounded">Approve</button>}
                        {a.status==='pending' && <button onClick={()=>rejectAppointment(a.id)} className="px-3 py-1 bg-red-50 text-red-600 rounded">Reject</button>}
                        {a.status==='approved' && <button onClick={()=>completeAppointment(a.id)} className="px-3 py-1 bg-indigo-600 text-white rounded">Complete</button>}
                        <button onClick={()=>{ setSelectedAppt(a); setActive('chats'); }} className="px-3 py-1 bg-gray-100 rounded">Chat</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {active === 'urgent' && (
            <div className="bg-white p-4 rounded-xl shadow">
              <h3 className="font-semibold mb-4">Urgent Requests</h3>
              {myUrgents.length===0 ? <div className="text-gray-500">No urgent requests</div> : (
                <ul className="space-y-3">
                  {myUrgents.map(u=> (
                    <li key={u.id} className="p-3 border rounded flex items-center justify-between">
                      <div>
                        <div className="font-medium">{u.category} — {u.description}</div>
                        <div className="text-xs text-gray-500">Status: {u.status} {u.assignedProviderId? `(Assigned: ${u.assignedProviderId})` : ''}</div>
                      </div>
                      <div className="flex gap-2">
                        {u.status==='open' && <button onClick={()=>acceptUrgent(u.id)} className="px-3 py-1 bg-green-500 text-white rounded">Accept</button>}
                        {u.status!=='closed' && <button onClick={()=>closeUrgent(u.id)} className="px-3 py-1 bg-red-50 text-red-600 rounded">Close</button>}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {active === 'chats' && (
            <div className="bg-white p-4 rounded-xl shadow">
              <h3 className="font-semibold mb-4">Chats</h3>
              <div>
                {myChats.length===0 ? <div className="text-gray-500">No chats yet</div> : (
                  myChats.map(c => (
                    <div key={c.id} className="mb-4 p-3 border rounded">
                      <div className="font-medium">Chat with User: {dbCopy.users.find(u=>u.id===c.userId)?.name || c.userId}</div>
                      <div className="max-h-48 overflow-auto mt-2 mb-2">
                        {(c.messages||[]).map((m,i)=> (
                          <div key={i} className={`mb-2 ${m.senderRole==='provider' ? 'text-right' : ''}`}>
                            <div className={`inline-block p-2 rounded ${m.senderRole==='provider' ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}>{m.text}</div>
                            <div className="text-xs text-gray-400">{new Date(m.timestamp || m.time || m.date || Date.now()).toLocaleString()}</div>
                          </div>
                        ))}
                      </div>
                      <ChatInput onSend={(text)=>sendMessage(c.id, text)} />
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {active === 'services' && (
            <div className="bg-white p-4 rounded-xl shadow">
              <h3 className="font-semibold mb-4">My Services</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Category</div>
                  <div className="font-medium">{myServices.category} — {myServices.specialization}</div>
                  <div className="text-xs text-gray-500 mt-2">Verification: {myServices.verificationStatus}</div>
                </div>
                <div>
                  <SlotsEditor slots={(myServices.slots||[])} onSave={updateSlots} />
                </div>
              </div>
            </div>
          )}

          {active === 'profile' && (
            <div className="bg-white p-4 rounded-xl shadow">
              <h3 className="font-semibold mb-4">Profile Settings</h3>
              <ProfileEditor user={myUserRecord} onSave={saveProfile} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const ChatInput = ({ onSend }) => {
  const [text, setText] = useState('');
  return (
    <div className="flex gap-2">
      <input value={text} onChange={e=>setText(e.target.value)} className="flex-1 px-3 py-2 rounded border" placeholder="Write a message" />
      <button onClick={() => { if (text.trim()) { onSend(text); setText(''); } }} className="px-4 py-2 bg-indigo-600 text-white rounded">Send</button>
    </div>
  );
};

const SlotsEditor = ({ slots = [], onSave }) => {
  const [local, setLocal] = useState(slots.slice());
  const [input, setInput] = useState('');
  return (
    <div>
      <div className="mb-2">Available slots</div>
      <ul className="mb-2">
        {local.map((s,i)=> <li key={i} className="flex items-center justify-between p-2 border rounded mb-1"><div>{s}</div><button onClick={()=>setLocal(local.filter(x=>x!==s))} className="text-red-500">Remove</button></li>)}
      </ul>
      <div className="flex gap-2 mb-2">
        <input value={input} onChange={e=>setInput(e.target.value)} className="flex-1 px-3 py-2 rounded border" placeholder="e.g. 10:00 AM" />
        <button onClick={()=>{ if(input.trim()){ setLocal([...local, input.trim()]); setInput(''); } }} className="px-3 py-1 bg-gray-100 rounded">Add</button>
      </div>
      <button onClick={()=>onSave(local)} className="px-4 py-2 bg-indigo-600 text-white rounded">Save Slots</button>
    </div>
  );
};

const ProfileEditor = ({ user = {}, onSave }) => {
  const [name, setName] = useState(user.name||'');
  const [phone, setPhone] = useState(user.phone||'');
  const [address, setAddress] = useState(user.address||'');
  return (
    <div className="max-w-xl">
      <div className="grid gap-3">
        <input value={name} onChange={e=>setName(e.target.value)} className="px-3 py-2 rounded border" />
        <input value={phone} onChange={e=>setPhone(e.target.value)} className="px-3 py-2 rounded border" />
        <input value={address} onChange={e=>setAddress(e.target.value)} className="px-3 py-2 rounded border" />
        <div className="flex gap-2">
          <button onClick={()=>onSave({ name, phone, address })} className="px-4 py-2 bg-indigo-600 text-white rounded">Save</button>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
