import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import db from '../../../db.json';

const SidebarItem = ({ label, icon, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left hover:bg-indigo-50 ${active ? 'bg-indigo-100 font-medium' : 'text-gray-700'}`}>
    <span className="text-indigo-500">{icon}</span>
    <span>{label}</span>
  </button>
);

const StatCard = ({ title, value, color = 'from-indigo-500 to-pink-500' }) => (
  <div className="p-4 rounded-xl bg-gradient-to-r shadow-md text-white" style={{ backgroundImage: `linear-gradient(90deg, rgba(99,102,241,1), rgba(236,72,153,1))` }}>
    <div className="text-sm opacity-90">{title}</div>
    <div className="text-2xl font-bold mt-1">{value}</div>
  </div>
);

const ProviderCard = ({ p, userInfo, onBook, onChat, onUrgent }) => (
  <div className="bg-white rounded-xl p-4 shadow-sm border">
    <div className="flex items-center justify-between">
      <div>
        <div className="font-semibold">{userInfo?.name || 'Provider'}</div>
        <div className="text-sm text-gray-500">{p.category} — {p.specialization}</div>
        <div className="text-xs text-gray-400">{userInfo?.address || ''}</div>
      </div>
      <div className="text-right">
        <div className="text-sm">{p.rating} ⭐</div>
        <div className="text-xs mt-1 inline-block px-2 py-1 bg-green-50 text-green-800 rounded-full">{p.verificationStatus === 'verified' ? 'Verified' : p.verificationStatus}</div>
      </div>
    </div>
    <div className="flex gap-2 mt-4">
      <button onClick={() => onBook(p)} className="flex-1 bg-indigo-600 text-white py-2 rounded-md">Book Appointment</button>
      <button onClick={() => onChat(p)} className="px-3 py-2 bg-gray-100 rounded-md">Chat</button>
      <button onClick={() => onUrgent(p)} className="px-3 py-2 bg-red-50 text-red-600 rounded-md">Urgent</button>
    </div>
  </div>
);

const UserDashboard = () => {
  const navigate = useNavigate();
  const userId = Number(sessionStorage.getItem('userId'));
  const [active, setActive] = useState('home');
  const [mobileOpen, setMobileOpen] = useState(false);

  // Local state mirrors db.json (static import) so we can use data without backend
  const [appointments, setAppointments] = useState((db.appointments || []).filter(a => a.userId === userId));
  const [urgentRequests, setUrgentRequests] = useState((db.urgentRequests || []).filter(r => r.userId === userId));
  const [chats, setChats] = useState((db.chats || []).filter(c => c.userId === userId));
  const [providers, setProviders] = useState(db.serviceProviders || []);
  const [reviews, setReviews] = useState((db.reviews || []).filter(r => r.userId === userId));

  const user = db.users.find(u => Number(u.id) === userId);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  // Local alias for the static import (keeps previous code that referenced `dbData` working)
  const dbData = db;

  const verifiedProviders = useMemo(() => providers.filter(p => p.verificationStatus === 'verified'), [providers]);

  const logout = () => {
    sessionStorage.removeItem('civicName');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('role');
    navigate('/login');
  };

  const quickBook = (provider) => {
    const appt = {
      id: Date.now(),
      userId,
      providerId: provider.id,
      date: new Date().toISOString().slice(0,10),
      time: '10:00 AM',
      status: 'pending'
    };
    const updatedAppointments = [appt, ...appointments];
    setAppointments(updatedAppointments);
    // Note: persistence to file is not possible from browser without a backend. This updates in-memory state only.
    alert('Appointment requested — check My Appointments');
  };

  const startChatWith = (provider) => {
    const existing = chats.find(c => c.providerId === provider.id);
    if (!existing) {
      const chat = { id: Date.now(), userId, providerId: provider.id, messages: [] };
      const updated = [chat, ...chats];
      setChats(updated);
      // in-memory only
      setActive('chats');
    } else setActive('chats');
  };

  const urgentWith = (provider) => {
    setActive('urgent');
    // could prefill urgent creation with provider info
  };

  const cancelAppointment = (id) => {
    const updated = appointments.map(a => a.id === id ? { ...a, status: 'cancelled' } : a);
    setAppointments(updated);
    // in-memory only
  };

  // Search/filter state for Find Services
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [minRating, setMinRating] = useState(0);

  const filteredProviders = verifiedProviders.filter(p => {
    if (categoryFilter !== 'All' && p.category !== categoryFilter) return false;
    if (p.rating < minRating) return false;
    const providerUser = db.users.find(u => Number(u.id) === p.userId) || {};
    if (search && !(`${p.specialization} ${providerUser.address || ''} ${providerUser.name || ''}`).toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // Chat helpers
  const sendMessage = (chatId, text) => {
    const updated = chats.map(c => c.id === chatId ? { ...c, messages: [...c.messages, { sender: 'user', text, time: new Date().toLocaleTimeString() }] } : c);
    setChats(updated);
    // in-memory only
  };

  // Reviews
  const leaveReview = (providerId, rating, comment) => {
    const r = { id: Date.now(), userId, providerId, rating, comment };
    const updated = [r, ...reviews];
    setReviews(updated);
    // in-memory only
    alert('Thanks for your review!');
  };

  // Urgent request creation
  const createUrgent = (category, description) => {
    const r = { id: Date.now(), userId, category, description, status: 'searching', assignedProviderId: null };
    const updated = [r, ...urgentRequests];
    setUrgentRequests(updated);
    // in-memory only
    alert('Urgent request created — we are searching for providers');
  };

  // Stats
  const stats = {
    totalAppointments: appointments.length,
    activeChats: chats.length,
    urgentCount: urgentRequests.length,
    completed: appointments.filter(a => a.status === 'completed').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <div className="bg-white shadow sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 rounded-md bg-gray-100" onClick={() => setMobileOpen(v => !v)}>☰</button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center text-white font-bold">EF</div>
              <div>
                <div className="font-semibold">EasyFind</div>
                <div className="text-xs text-gray-500">Find verified professionals</div>
              </div>
            </div>
          </div>

          <div className="flex-1 max-w-xl">
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search (doctor / plumber / teacher / location)" className="w-full px-4 py-2 rounded-lg border focus:outline-none" />
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button className="p-2 rounded-full bg-gray-100">🔔</button>
              {appointments.some(a=>a.status==='approved') && <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">!</span>}
            </div>
            <div className="flex items-center gap-2"> 
              <div className="text-sm text-gray-700">{user?.name}</div>
              <button onClick={logout} className="px-3 py-1 bg-red-500 text-white rounded">Logout</button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <aside className={`col-span-12 md:col-span-3 lg:col-span-2 ${mobileOpen ? 'block' : 'hidden md:block'}`}>
          <div className="bg-white p-4 rounded-xl shadow-sm sticky top-24">
            <div className="mb-4 text-sm text-gray-500">Quick Actions</div>
            <SidebarItem label="Dashboard" icon="🏠" active={active==='home'} onClick={()=>{setActive('home'); setMobileOpen(false);}} />
            <SidebarItem label="Find Services" icon="🔍" active={active==='find'} onClick={()=>{setActive('find'); setMobileOpen(false);}} />
            <SidebarItem label="My Appointments" icon="📅" active={active==='appointments'} onClick={()=>{setActive('appointments'); setMobileOpen(false);}} />
            <SidebarItem label="Urgent Help" icon="⚡" active={active==='urgent'} onClick={()=>{setActive('urgent'); setMobileOpen(false);}} />
            <SidebarItem label="Chats" icon="💬" active={active==='chats'} onClick={()=>{setActive('chats'); setMobileOpen(false);}} />
            <SidebarItem label="My Reviews" icon="⭐" active={active==='reviews'} onClick={()=>{setActive('reviews'); setMobileOpen(false);}} />
            <SidebarItem label="Profile Settings" icon="👤" active={active==='profile'} onClick={()=>{setActive('profile'); setMobileOpen(false);}} />
            <div className="mt-4">
              <button onClick={logout} className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100">Logout</button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="col-span-12 md:col-span-9 lg:col-span-10">
          {active === 'home' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-indigo-600 to-pink-500 text-white p-6 rounded-2xl shadow-md flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">Welcome back, {user?.name} 👋</h3>
                  <p className="opacity-90 mt-1">Find verified professionals instantly</p>
                </div>
                <div className="flex gap-4">
                  <button className="bg-white text-indigo-600 px-4 py-2 rounded-md font-medium" onClick={()=>setActive('find')}>Find Services</button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard title="Total Appointments" value={stats.totalAppointments} />
                <StatCard title="Active Chats" value={stats.activeChats} />
                <StatCard title="Urgent Requests" value={stats.urgentCount} />
                <StatCard title="Completed" value={stats.completed} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 shadow">
                  <h4 className="font-semibold mb-2">Upcoming Appointments</h4>
                  {appointments.length === 0 ? <div className="text-sm text-gray-500">No upcoming appointments</div> : (
                    <ul className="space-y-2">
                      {appointments.slice(0,4).map(a=> (
                        <li key={a.id} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                          <div>
                            <div className="font-medium">{a.date} — {a.time}</div>
                            <div className="text-xs text-gray-500">Status: {a.status}</div>
                          </div>
                          <div className="flex gap-2">
                            <button className="text-sm text-red-500" onClick={()=>cancelAppointment(a.id)}>Cancel</button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="bg-white rounded-xl p-4 shadow">
                  <h4 className="font-semibold mb-2">Recent Reviews</h4>
                  {reviews.length === 0 ? <div className="text-sm text-gray-500">No reviews yet</div> : (
                    <ul className="space-y-3">
                      {reviews.slice(0,4).map(r=> (
                        <li key={r.id} className="text-sm">
                          <div className="font-medium">Provider ID: {r.providerId} — {r.rating} ⭐</div>
                          <div className="text-gray-600">{r.comment}</div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}

          {active === 'find' && (
            <div className="space-y-4">
              <div className="flex gap-3">
                <select value={categoryFilter} onChange={e=>setCategoryFilter(e.target.value)} className="px-3 py-2 rounded border">
                  <option>All</option>
                  <option>Doctor</option>
                  <option>Teacher</option>
                  <option>Electrician</option>
                  <option>Plumber</option>
                  <option>Technician</option>
                </select>
                <select value={minRating} onChange={e=>setMinRating(Number(e.target.value))} className="px-3 py-2 rounded border">
                  <option value={0}>Any rating</option>
                  <option value={3}>3+</option>
                  <option value={4}>4+</option>
                </select>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search specialization or location" className="flex-1 px-3 py-2 rounded border" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredProviders.length === 0 ? <div className="text-gray-500">No providers match your search.</div> : filteredProviders.map(p => (
                  <ProviderCard key={p.id} p={p} userInfo={dbData?.users?.find(u=>u.id===p.userId)} onBook={quickBook} onChat={startChatWith} onUrgent={urgentWith} />
                ))}
              </div>
            </div>
          )}

          {active === 'appointments' && (
            <div className="bg-white p-4 rounded-xl shadow">
              <h3 className="font-semibold mb-4">My Appointments</h3>
              {appointments.length===0 ? <div className="text-gray-500">No appointments</div> : (
                <ul className="space-y-3">
                  {appointments.map(a=> (
                    <li key={a.id} className="p-3 border rounded flex items-center justify-between">
                      <div>
                        <div className="font-medium">{a.date} {a.time}</div>
                        <div className="text-xs text-gray-500">Status: {a.status}</div>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-3 py-1 bg-gray-100 rounded" onClick={()=>startChatWith(providers.find(p=>p.id===a.providerId))}>Chat</button>
                        <button className="px-3 py-1 bg-red-50 text-red-600 rounded" onClick={()=>cancelAppointment(a.id)}>Cancel</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {active === 'urgent' && (
            <div className="bg-white p-4 rounded-xl shadow">
              <h3 className="font-semibold mb-4">Urgent Help</h3>
              <UrgentHelp createUrgent={createUrgent} urgentRequests={urgentRequests} />
            </div>
          )}

          {active === 'chats' && (
            <div className="bg-white p-4 rounded-xl shadow">
              <h3 className="font-semibold mb-4">Chats</h3>
              <ChatPanel chats={chats} sendMessage={sendMessage} providers={providers} users={dbData?.users || []} />
            </div>
          )}

          {active === 'reviews' && (
            <div className="bg-white p-4 rounded-xl shadow">
              <h3 className="font-semibold mb-4">My Reviews</h3>
              <ReviewPanel reviews={reviews} providers={providers} leaveReview={leaveReview} users={dbData?.users || []} />
            </div>
          )}

          {active === 'profile' && (
            <div className="bg-white p-4 rounded-xl shadow">
              <h3 className="font-semibold mb-4">Profile Settings</h3>
              <ProfileForm user={user} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const UrgentHelp = ({ createUrgent, urgentRequests }) => {
  const [category, setCategory] = useState('Doctor');
  const [desc, setDesc] = useState('');

  return (
    <div>
      <div className="flex gap-3 mb-4">
        <select value={category} onChange={e=>setCategory(e.target.value)} className="px-3 py-2 rounded border">
          <option>Doctor</option>
          <option>Plumber</option>
          <option>Electrician</option>
        </select>
        <input value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Short description" className="flex-1 px-3 py-2 rounded border" />
        <button onClick={()=>{ if(desc.trim()) { createUrgent(category, desc); setDesc(''); } }} className="bg-red-500 text-white px-4 py-2 rounded">Request Urgent Help</button>
      </div>

      <div>
        <h4 className="font-semibold mb-2">My Urgent Requests</h4>
        {urgentRequests.length===0 ? <div className="text-gray-500">No urgent requests</div> : (
          <ul className="space-y-2">
            {urgentRequests.map(r=> (
              <li key={r.id} className="p-3 border rounded flex items-center justify-between">
                <div>
                  <div className="font-medium">{r.category} — {r.description}</div>
                  <div className="text-xs text-gray-500">Status: {r.status}</div>
                </div>
                <div className="text-sm text-gray-500">{r.assignedProviderId ? `Provider: ${r.assignedProviderId}` : 'Searching'}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const ChatPanel = ({ chats, sendMessage, providers, users }) => {
  const [activeChat, setActiveChat] = useState(chats[0]?.id || null);
  const [text, setText] = useState('');

  useEffect(()=>{
    if (chats.length && !activeChat) setActiveChat(chats[0].id);
  },[chats]);

  const current = chats.find(c=>c.id===activeChat);

  return (
    <div className="md:flex gap-4">
      <div className="md:w-1/3">
        <ul className="space-y-2">
          {chats.map(c=> (
            <li key={c.id} className={`p-3 rounded hover:bg-gray-50 cursor-pointer ${c.id===activeChat?'bg-indigo-50':''}`} onClick={()=>setActiveChat(c.id)}>
              <div className="font-medium">{users.find(u=>u.id===providers.find(p=>p.id===c.providerId)?.userId)?.name || 'Provider'}</div>
              <div className="text-xs text-gray-500">{c.messages.length? c.messages[c.messages.length-1].text : 'No messages yet'}</div>
            </li>
          ))}
        </ul>
      </div>
      <div className="md:flex-1 bg-gray-50 p-4 rounded">
        {current ? (
          <div className="flex flex-col h-80">
            <div className="flex-1 overflow-auto mb-3">
              {current.messages.map((m,i)=> (
                <div key={i} className={`mb-2 ${m.sender==='user'?'text-right':''}`}>
                  <div className={`inline-block p-2 rounded ${m.sender==='user' ? 'bg-indigo-600 text-white' : 'bg-white'}`}>{m.text}</div>
                  <div className="text-xs text-gray-400">{m.time}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={text} onChange={e=>setText(e.target.value)} className="flex-1 px-3 py-2 rounded border" />
              <button onClick={()=>{ if(text.trim()){ sendMessage(current.id, text); setText(''); } }} className="px-4 py-2 bg-indigo-600 text-white rounded">Send</button>
            </div>
          </div>
        ) : <div className="text-gray-500">Select a chat to start messaging</div>}
      </div>
    </div>
  );
};

const ReviewPanel = ({ reviews, providers, leaveReview, users }) => {
  const [provId, setProvId] = useState(providers[0]?.id || '');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  return (
    <div>
      <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-2">
        <select className="col-span-1 md:col-span-1 px-3 py-2 rounded border" value={provId} onChange={e=>setProvId(Number(e.target.value))}>
          <option value="">Choose provider</option>
          {providers.map(p=> <option key={p.id} value={p.id}>{users.find(u=>u.id===p.userId)?.name || p.category}</option>)}
        </select>
        <select className="px-3 py-2 rounded border" value={rating} onChange={e=>setRating(Number(e.target.value))}>
          {[5,4,3,2,1].map(n=> <option key={n} value={n}>{n} ⭐</option>)}
        </select>
        <input className="px-3 py-2 rounded border md:col-span-2" placeholder="Write feedback" value={comment} onChange={e=>setComment(e.target.value)} />
        <div className="col-span-1 md:col-span-4">
          <button onClick={()=>{ if(provId && comment.trim()){ leaveReview(provId, rating, comment); setComment(''); } }} className="px-4 py-2 bg-indigo-600 text-white rounded mt-2">Submit Review</button>
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-2">My Past Reviews</h4>
        {reviews.length===0 ? <div className="text-gray-500">No reviews yet</div> : (
          <ul className="space-y-2">
            {reviews.map(r=> (
              <li key={r.id} className="p-3 border rounded">
                <div className="font-medium">Provider ID: {r.providerId} — {r.rating} ⭐</div>
                <div className="text-gray-600">{r.comment}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const ProfileForm = ({ user }) => {
  const [name, setName] = useState(user?.name||'');
  const [phone, setPhone] = useState(user?.phone||'');
  const [address, setAddress] = useState(user?.address||'');

  return (
    <div className="max-w-xl">
      <div className="grid gap-3">
        <input value={name} onChange={e=>setName(e.target.value)} className="px-3 py-2 rounded border" />
        <input value={phone} onChange={e=>setPhone(e.target.value)} className="px-3 py-2 rounded border" />
        <input value={address} onChange={e=>setAddress(e.target.value)} className="px-3 py-2 rounded border" />
        <button className="px-4 py-2 bg-indigo-600 text-white rounded">Save Profile</button>
      </div>
    </div>
  );
};

export default UserDashboard;