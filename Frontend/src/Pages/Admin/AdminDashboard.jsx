import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import { UserContext } from "../../Context/UserContext";
import { AdminConcierge } from "./Adminconcierge";

axios.defaults.withCredentials = true;
const API_BASE = "http://localhost:3000/api/admin";

// ─── CUSTOM TOASTIFY CONFIRMATION COMPONENT ──────────────────────────────────
const ConfirmToast = ({ message, onConfirm, closeToast }) => (
    <div className="font-mono text-xs">
        <p className="mb-3 font-bold text-slate-200">{message}</p>
        <div className="flex gap-2 justify-end">
            <button onClick={closeToast} className="px-3 py-1 bg-slate-700 rounded text-white font-bold">
                Cancel
            </button>
            <button onClick={() => { onConfirm(); closeToast(); }} className="px-3 py-1 bg-teal-500 rounded text-slate-900 font-black">
                Confirm
            </button>
        </div>
    </div>
);

export const AdminDashboard = () => {
    const { user } = useContext(UserContext);
    const [activeTab, setActiveTab] = useState("overview");

    const tabs = [
        { id: "overview", label: "Overview", icon: "📊" },
        { id: "providers", label: "Providers", icon: "🪪" },
        { id: "users", label: "Users", icon: "👥" },
        { id: "reports", label: "Reports", icon: "📈" },
        { id: "profile", label: "Profile", icon: "⚙️" },
    ];

    return (
        <div className="min-h-screen bg-[#050d0c] text-slate-200 flex flex-col md:flex-row font-mono">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-slate-900/50 border-r border-slate-800/60 flex flex-col">
                <div className="p-6 border-b border-slate-800/60 text-center md:text-left">
                    <h1 className="text-xl font-bold tracking-widest text-teal-400">ADMIN<span className="text-white">PANEL</span></h1>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-bold tracking-wide
                ${activeTab === tab.id
                                    ? "bg-teal-500/15 text-teal-300 border border-teal-500/30"
                                    : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 border border-transparent"}`}
                        >
                            <span className="text-lg">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-6 md:p-10 overflow-y-auto">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === "overview" && <OverviewTab />}
                        {activeTab === "providers" && <ProvidersTab />}
                        {activeTab === "users" && <UsersTab />}
                        {activeTab === "profile" && <ProfileTab adminId={user?.id} />}
                        {activeTab === "reports" && (
                            <AdminConcierge />
                        )}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
};

// ─── PROFILE COMPONENT ────────────────────────────────────────────────
const ProfileTab = ({ adminId }) => {
    const [profile, setProfile] = useState({
        username: "", email: "", fullName: "", phoneNumber: "", bio: "",
        address: "", state: "", country: "", pinCode: "", timezone: "" // 🟢 Added state defaults
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!adminId) return;
        axios.get(`${API_BASE}/profile/${adminId}`)
            .then(res => {
                const data = res.data.admin;
                setProfile({
                    username: data.username || "",
                    email: data.email || "",
                    fullName: data.fullName || "",
                    phoneNumber: data.phoneNumber || "",
                    bio: data.bio || "",
                    address: data.address || "",
                    state: data.state || "",
                    country: data.country || "",
                    pinCode: data.pinCode || "",
                    timezone: data.timezone || ""
                });
            })
            .catch(() => toast.error("Failed to load profile"))
            .finally(() => setLoading(false));
    }, [adminId]);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const promise = axios.patch(`${API_BASE}/profile/${adminId}`, profile);
        await toast.promise(promise, {
            pending: 'Saving profile...',
            success: 'Profile updated successfully! ✅',
            error: 'Failed to update profile ❌'
        });
    };

    if (loading) return <p className="animate-pulse text-teal-400">Loading profile...</p>;

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-10">
            <h2 className="text-2xl font-bold text-white mb-6">Admin Profile</h2>

            <form onSubmit={handleSave} className="bg-slate-900/40 p-6 md:p-8 rounded-2xl border border-slate-800 shadow-2xl space-y-8">

                {/* Visual Avatar Placeholder */}
                <div className="flex items-center gap-6 pb-6 border-b border-slate-800">
                    <div className="w-20 h-20 rounded-full bg-teal-500/20 border-2 border-teal-500 flex items-center justify-center text-3xl font-black text-teal-400 uppercase">
                        {profile.username?.charAt(0) || "A"}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">{profile.fullName || profile.username || "Admin"}</h3>
                        <p className="text-sm text-teal-500/80 font-bold tracking-widest uppercase">System Administrator</p>
                    </div>
                </div>

                {/* Section 1: Contact Details */}
                <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-teal-500 mb-4">Account & Contact</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-2">Username</label>
                            <input type="text" name="username" value={profile.username} onChange={handleChange} required
                                className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-teal-500 transition-colors" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-2">Email Address</label>
                            <input type="email" name="email" value={profile.email} onChange={handleChange} required
                                className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-teal-500 transition-colors" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-2">Full Name</label>
                            <input type="text" name="fullName" value={profile.fullName} onChange={handleChange} placeholder="John Doe"
                                className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-teal-500 transition-colors" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-2">Phone Number</label>
                            <input type="text" name="phoneNumber" value={profile.phoneNumber} onChange={handleChange} placeholder="+1 234 567 8900"
                                className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-teal-500 transition-colors" />
                        </div>
                    </div>
                </div>

                {/* Section 2: Location Details */}
                <div className="space-y-4 pt-4 border-t border-slate-800">
                    <h4 className="text-xs font-black uppercase tracking-widest text-teal-500 mb-4">Location Details</h4>

                    <div>
                        <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-2">Street Address</label>
                        <input type="text" name="address" value={profile.address} onChange={handleChange} placeholder="123 Admin Blvd, Suite 400"
                            className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-teal-500 transition-colors" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-2">State / Province</label>
                            <input type="text" name="state" value={profile.state} onChange={handleChange} placeholder="California"
                                className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-teal-500 transition-colors" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-2">Country</label>
                            <input type="text" name="country" value={profile.country} onChange={handleChange} placeholder="United States"
                                className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-teal-500 transition-colors" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-2">Pin / Zip Code</label>
                            <input type="text" name="pinCode" value={profile.pinCode} onChange={handleChange} placeholder="90210"
                                className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-teal-500 transition-colors" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-2">Timezone</label>
                            <input type="text" name="timezone" value={profile.timezone} onChange={handleChange} placeholder="GMT-8 (PST)"
                                className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-teal-500 transition-colors" />
                        </div>
                    </div>
                </div>

                {/* Section 3: Bio */}
                <div className="pt-4 border-t border-slate-800">
                    <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-2">Administrator Bio</label>
                    <textarea name="bio" value={profile.bio} onChange={handleChange} rows="4" placeholder="Brief description of your role and responsibilities..."
                        className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-teal-500 transition-colors resize-none"></textarea>
                </div>

                <div className="flex justify-end pt-2">
                    <button type="submit" className="bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold px-8 py-3 rounded-xl transition-colors shadow-lg shadow-teal-500/20 tracking-wide">
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

// ─── OVERVIEW COMPONENT ──────────────────────────────────────────────────────

const OverviewTab = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        axios.get(`${API_BASE}/dashboard-stats`)
            .then(res => setStats(res.data))
            .catch(() => toast.error("⚠️ Failed to load stats"));
    }, []);

    if (!stats) return <p className="animate-pulse text-teal-400">Syncing metrics...</p>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">System Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Users" value={stats.totalUsers} icon="👥" color="text-blue-400" bg="bg-blue-500/10" border="border-blue-500/20" />
                <StatCard title="Total Providers" value={stats.providerStats.total} icon="🪪" color="text-teal-400" bg="bg-teal-500/10" border="border-teal-500/20" />
                <StatCard title="Pending Approvals" value={stats.providerStats.pending} icon="⏳" color="text-amber-400" bg="bg-amber-500/10" border="border-amber-500/20" />
                <StatCard title="Scheduled Deletions" value={stats.providerStats.scheduledForDeletion} icon="🗑" color="text-rose-400" bg="bg-rose-500/10" border="border-rose-500/20" />
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, color, bg, border }) => (
    <div className={`p-6 rounded-2xl border ${border} ${bg} backdrop-blur-sm shadow-xl`}>
        <div className="flex justify-between items-start mb-4">
            <p className="text-xs font-bold tracking-widest uppercase text-slate-400">{title}</p>
            <span className="text-xl">{icon}</span>
        </div>
        <h3 className={`text-3xl font-black ${color}`}>{value}</h3>
    </div>
);

// ─── PROVIDERS COMPONENT ─────────────────────────────────────────────────────

const ProvidersTab = () => {
    const [providers, setProviders] = useState([]);
    const [selectedProvider, setSelectedProvider] = useState(null);

    const fetchProviders = () => {
        axios.get(`${API_BASE}/providers`).then(res => setProviders(res.data.providers)).catch(console.error);
    };

    useEffect(() => { fetchProviders(); }, []);

    const updateStatus = (id, status) => {
        toast(({ closeToast }) => (
            <ConfirmToast
                message={`Are you sure you want to ${status.toUpperCase()} this provider?`}
                onConfirm={async () => {
                    const promise = axios.patch(`${API_BASE}/providers/${id}/status`, { status });
                    await toast.promise(promise, {
                        pending: 'Updating status...',
                        success: `Provider has been ${status} successfully! ✅`,
                        error: 'Failed to update status ❌'
                    });
                    fetchProviders();
                }}
                closeToast={closeToast}
            />
        ));
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-white mb-6">Provider Management</h2>
            <div className="bg-slate-900/40 rounded-2xl border border-slate-800 overflow-x-auto shadow-2xl">
                <table className="w-full text-left text-sm min-w-[600px]">
                    <thead className="bg-slate-900/80 text-slate-400 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="p-4">Provider</th>
                            <th className="p-4">Service</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {providers.map(p => (
                            <tr key={p._id} className="hover:bg-slate-800/20 transition-colors group">
                                <td className="p-4">
                                    <p className="font-bold text-slate-200 group-hover:text-teal-400 transition-colors">{p.username}</p>
                                    <p className="text-xs text-slate-500">{p.email}</p>
                                </td>
                                <td className="p-4">
                                    <span className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-300">{p.serviceType}</span>
                                </td>
                                <td className="p-4">
                                    <StatusBadge status={p.verificationStatus} />
                                    {p.verificationStatus === 'schedule_for_deletion' && p.deletionDate && (
                                        <p className="text-[10px] text-rose-500 mt-1 font-bold">Expires: {new Date(p.deletionDate).toLocaleDateString()}</p>
                                    )}
                                </td>
                                <td className="p-4 flex gap-2 justify-end">
                                    <ActionButton onClick={() => setSelectedProvider(p)} color="slate">View</ActionButton>

                                    {p.verificationStatus === 'pending' && (
                                        <>
                                            <ActionButton onClick={() => updateStatus(p._id, 'approved')} color="teal">Approve</ActionButton>
                                            <ActionButton onClick={() => updateStatus(p._id, 'rejected')} color="rose">Reject</ActionButton>
                                        </>
                                    )}
                                    {p.verificationStatus === 'approved' && (
                                        <>
                                            <ActionButton onClick={() => updateStatus(p._id, 'suspended')} color="amber">Suspend</ActionButton>
                                            <ActionButton onClick={() => updateStatus(p._id, 'schedule_for_deletion')} color="rose">Delete</ActionButton>
                                        </>
                                    )}
                                    {p.verificationStatus === 'suspended' && (
                                        <>
                                            <ActionButton onClick={() => updateStatus(p._id, 'approved')} color="teal">Restore</ActionButton>
                                            <ActionButton onClick={() => updateStatus(p._id, 'schedule_for_deletion')} color="rose">Delete</ActionButton>
                                        </>
                                    )}
                                    {p.verificationStatus === 'schedule_for_deletion' && (
                                        <ActionButton onClick={() => updateStatus(p._id, 'approved')} color="teal">Restore</ActionButton>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <AnimatePresence>
                {selectedProvider && <ProviderModal provider={selectedProvider} onClose={() => setSelectedProvider(null)} />}
            </AnimatePresence>
        </div>
    );
};

// ─── USERS COMPONENT ─────────────────────────────────────────────────────────

const UsersTab = () => {
    const [users, setUsers] = useState([]);

    const fetchUsers = () => {
        axios.get(`${API_BASE}/users`).then(res => setUsers(res.data.users)).catch(() => toast.error("Error loading users"));
    };

    useEffect(() => { fetchUsers(); }, []);

    const updateUserStatus = (id, status) => {
        toast(({ closeToast }) => (
            <ConfirmToast
                message={`Are you sure you want to ${status === 'active' ? 'RESTORE' : 'SUSPEND'} this user?`}
                onConfirm={async () => {
                    const promise = axios.patch(`${API_BASE}/users/${id}/status`, { status });
                    await toast.promise(promise, {
                        pending: 'Updating status...',
                        success: `User has been ${status === 'active' ? 'restored' : 'suspended'} successfully! ✅`,
                        error: 'Failed to update status ❌'
                    });
                    fetchUsers();
                }}
                closeToast={closeToast}
            />
        ));
    };

    const deleteUser = (id) => {
        toast(({ closeToast }) => (
            <ConfirmToast
                message="Are you sure you want to permanently delete this user?"
                onConfirm={async () => {
                    const promise = axios.delete(`${API_BASE}/users/${id}`);
                    await toast.promise(promise, {
                        pending: 'Deleting user...',
                        success: 'User has been purged successfully 🗑️',
                        error: 'Deletion failed ❌'
                    });
                    fetchUsers();
                }}
                closeToast={closeToast}
            />
        ));
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">System Users</h2>
            <div className="bg-slate-900/40 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-900/80 text-slate-400 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="p-4">User</th>
                            <th className="p-4">Joined</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {users.map(u => (
                            <tr key={u._id} className="hover:bg-slate-800/20">
                                <td className="p-4">
                                    <p className="font-bold text-slate-200">{u.username}</p>
                                    <p className="text-xs text-slate-500">{u.email}</p>
                                </td>
                                <td className="p-4 text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                                <td className="p-4">
                                    <StatusBadge status={u.status || 'active'} />
                                </td>
                                <td className="p-4 flex gap-2 justify-end">
                                    {(!u.status || u.status === 'active') ? (
                                        <ActionButton onClick={() => updateUserStatus(u._id, 'suspended')} color="amber">Suspend</ActionButton>
                                    ) : (
                                        <ActionButton onClick={() => updateUserStatus(u._id, 'active')} color="teal">Restore</ActionButton>
                                    )}
                                    <ActionButton onClick={() => deleteUser(u._id)} color="rose">Delete</ActionButton>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// ─── UI HELPERS & MODALS ─────────────────────────────────────────────────────

const ActionButton = ({ onClick, color, children }) => {
    const colors = {
        slate: "bg-slate-800 hover:bg-slate-700 text-white border border-transparent",
        teal: "bg-teal-500/10 text-teal-400 hover:bg-teal-500/20 border border-teal-500/30",
        rose: "bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30",
        amber: "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/30",
    };
    return (
        <button onClick={onClick} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-lg ${colors[color]}`}>
            {children}
        </button>
    );
};

const StatusBadge = ({ status }) => {
    const styles = {
        pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        approved: "bg-teal-500/10 text-teal-400 border-teal-500/20",
        rejected: "bg-slate-500/10 text-slate-400 border-slate-500/20",
        suspended: "bg-orange-500/10 text-orange-400 border-orange-500/20",
        schedule_for_deletion: "bg-rose-500/10 text-rose-400 border-rose-500/20",
        active: "bg-teal-500/10 text-teal-400 border-teal-500/20",
    };

    const currentStyle = styles[status] || styles.active;
    const displayStatus = status ? status.replace(/_/g, ' ') : 'active';

    return (
        <span className={`inline-block px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest border ${currentStyle}`}>
            {displayStatus}
        </span>
    );
};

const ProviderModal = ({ provider, onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md" />

        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950">
                <div>
                    <h3 className="text-xl font-bold text-white">{provider.username}</h3>
                    <p className="text-sm text-slate-400 uppercase tracking-tighter">{provider.serviceType} {provider.isProfessional && '⭐'}</p>
                </div>
                <button onClick={onClose} className="text-slate-500 hover:text-white text-3xl">&times;</button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800">
                        <p className="text-[10px] text-teal-500 font-black uppercase tracking-widest mb-2">Contact Info</p>
                        <p className="text-sm text-slate-200">📧 {provider.email}</p>
                        <p className="text-sm text-slate-200 mt-1">📞 {provider.phone}</p>
                    </div>
                    <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800">
                        <p className="text-[10px] text-teal-500 font-black uppercase tracking-widest mb-2">Location</p>
                        <p className="text-sm text-slate-200">{provider.address?.street}</p>
                        <p className="text-sm text-slate-200">{provider.address?.city}, {provider.address?.pincode}</p>
                    </div>
                </div>

                <div>
                    <p className="text-[10px] text-teal-500 font-black uppercase tracking-widest mb-2">Bio & Experience</p>
                    <div className="text-sm text-slate-300 bg-slate-800/40 p-4 rounded-xl border border-slate-700/50 leading-relaxed">
                        <p className="mb-2"><span className="text-teal-400 font-bold">Years of Experience:</span> {provider.experience}</p>
                        {provider.bio || "This provider hasn't filled out their bio yet."}
                    </div>
                </div>

                <div>
                    <p className="text-[10px] text-teal-500 font-black uppercase tracking-widest mb-3">Verification Documents</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <a href={provider.documents.idProof} target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-2xl border border-slate-700 hover:border-teal-500 hover:bg-teal-500/5 transition-all">
                            <span className="text-3xl">🪪</span>
                            <div>
                                <p className="text-xs font-black text-slate-100">Government ID</p>
                                <p className="text-[10px] text-teal-400">Click to Inspect</p>
                            </div>
                        </a>
                        <a href={provider.documents.photoproof} target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-2xl border border-slate-700 hover:border-teal-500 hover:bg-teal-500/5 transition-all">
                            <span className="text-3xl">🤳</span>
                            <div>
                                <p className="text-xs font-black text-slate-100">Live Photograph</p>
                                <p className="text-[10px] text-teal-400">Click to Inspect</p>
                            </div>
                        </a>
                        {provider.isProfessional && provider.documents.certification && (
                            <a href={provider.documents.certification} target="_blank" rel="noreferrer" className="col-span-1 sm:col-span-2 flex items-center gap-4 p-4 bg-amber-900/10 rounded-2xl border border-amber-700/30 hover:border-amber-500 hover:bg-amber-500/5 transition-all">
                                <span className="text-3xl">📜</span>
                                <div>
                                    <p className="text-xs font-black text-amber-200">Professional Certification</p>
                                    <p className="text-[10px] text-amber-400">Click to Inspect</p>
                                </div>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    </div>
);