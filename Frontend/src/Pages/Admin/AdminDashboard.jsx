import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import { UserContext } from "../../Context/UserContext";
import { AdminConcierge } from "./Adminconcierge";
import ProfileTab from "./ProfileTab";
import ProvidersTab from "./ProvidersTab";
import UsersTab from "./UsersTab";

axios.defaults.withCredentials = true;
const API_BASE = "http://localhost:3000/api/admin";

export const AdminDashboard = () => {
    const { user } = useContext(UserContext);
    const [activeTab, setActiveTab] = useState("overview");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const tabs = [
        { id: "overview", label: "Overview", icon: "📊" },
        { id: "providers", label: "Providers", icon: "🪪" },
        { id: "users", label: "Users", icon: "👥" },
        { id: "reports", label: "Concierge", icon: "📈" },
        { id: "profile", label: "Profile", icon: "⚙️" },
    ];

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    const SidebarContent = () => (
        <>
            <div className="p-8 mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#2DD4BF] to-[#F59E0B] rounded-xl flex items-center justify-center text-[#080C1C] font-black shadow-lg">
                        ◈
                    </div>
                    <div>
                        <h1 className="text-xl font-bold font-serif italic leading-none">Admin<span className="text-[#2DD4BF] not-italic font-sans">Hub</span></h1>
                        <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-black mt-1">System Control</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => {
                            setActiveTab(tab.id);
                            setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-300 text-sm font-bold tracking-tight
                            ${activeTab === tab.id
                                ? "bg-gradient-to-r from-[#2DD4BF] to-[#0EA5E9] text-[#080C1C] shadow-lg shadow-[#2DD4BF]/20"
                                : "text-white/40 hover:text-white hover:bg-white/5"}`}
                    >
                        <span className="text-lg">{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </nav>

            <div className="p-6 border-t border-white/5">
                <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#2DD4BF] flex items-center justify-center text-[#080C1C] font-bold text-xs uppercase">
                        {user?.username?.charAt(0)}
                    </div>
                    <div className="truncate">
                        <p className="text-xs font-bold truncate text-white">{user?.username || "Admin"}</p>
                        <p className="text-[10px] text-white/30 tracking-widest uppercase font-black leading-none mt-1">Root Access</p>
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <div className="min-h-screen bg-[#080C1C] text-white flex flex-col md:flex-row font-sans overflow-hidden">

            {/* ── MOBILE HEADER ── */}
            <div className="md:hidden flex items-center justify-between p-4 bg-[#0D1226]/90 backdrop-blur-3xl border-b border-white/5 z-[60]">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#2DD4BF] to-[#F59E0B] rounded-lg flex items-center justify-center text-[#080C1C] text-xs">◈</div>
                    <h1 className="text-lg font-bold font-serif italic">AdminHub</h1>
                </div>
                <button
                    onClick={toggleMobileMenu}
                    className="w-10 h-10 flex flex-col items-center justify-center gap-1.5 bg-white/5 rounded-xl border border-white/10"
                >
                    <motion.div animate={{ rotate: isMobileMenuOpen ? 45 : 0, y: isMobileMenuOpen ? 7 : 0 }} className="w-5 h-0.5 bg-white rounded-full" />
                    <motion.div animate={{ opacity: isMobileMenuOpen ? 0 : 1 }} className="w-5 h-0.5 bg-white rounded-full" />
                    <motion.div animate={{ rotate: isMobileMenuOpen ? -45 : 0, y: isMobileMenuOpen ? -7 : 0 }} className="w-5 h-0.5 bg-white rounded-full" />
                </button>
            </div>

            {/* ── DESKTOP SIDEBAR ── (Reduced z-index to 40) */}
            <aside className="hidden md:flex w-72 bg-[#0D1226]/80 backdrop-blur-3xl border-r border-white/5 flex-col z-10">
                <SidebarContent />
            </aside>

            {/* ── MOBILE MENU OVERLAY ── (Reduced z-index to 50) */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[45] md:hidden"
                        />
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-4/5 max-w-[300px] bg-[#0D1226] border-r border-white/10 flex flex-col z-[50] md:hidden shadow-2xl"
                        >
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* ── MAIN CONTENT ── */}
            <main className="flex-1 relative overflow-y-auto custom-scrollbar bg-[#080C1C] z-10">
                {/* Background Decor */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <motion.div
                        animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute w-[600px] h-[600px] top-[-10%] right-[-10%] rounded-full bg-[#2DD4BF]/5 blur-[120px]"
                    />
                </div>

                <div className="relative z-10 p-6 md:p-12 max-w-7xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        >
                            {activeTab === "overview" && <OverviewTab />}
                            {activeTab === "providers" && <ProvidersTab API_BASE={API_BASE} />}
                            {activeTab === "users" && <UsersTab API_BASE={API_BASE} />}
                            {activeTab === "profile" && <ProfileTab adminId={user?._id} API_BASE={API_BASE} />}
                            {activeTab === "reports" && <AdminConcierge />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
            `}</style>
        </div>
    );
};

const OverviewTab = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        axios.get(`${API_BASE}/dashboard-stats`)
            .then(res => setStats(res.data))
            .catch(() => toast.error("⚠️ Failed to load stats"));
    }, []);

    if (!stats) return (
        <div className="flex items-center gap-3 text-[#2DD4BF] font-serif italic">
            <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="text-xl">◈</motion.span>
            Syncing control panel...
        </div>
    );

    return (
        <div className="space-y-10">
            <header>
                <span className="text-[#2DD4BF] text-xs font-bold tracking-[0.3em] uppercase">Executive Terminal</span>
                <h2 className="text-4xl md:text-5xl font-bold font-serif italic tracking-tight mt-2">System <span style={{
                    background: "linear-gradient(135deg, #2DD4BF 0%, #F59E0B 100%)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                }}>Metrics</span></h2>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Users" value={stats.totalUsers} icon="👥" accent="#0EA5E9" delay={0.1} />
                <StatCard title="Total Providers" value={stats.providerStats.total} icon="🪪" accent="#2DD4BF" delay={0.2} />
                <StatCard title="Pending Approvals" value={stats.providerStats.pending} icon="⏳" accent="#F59E0B" delay={0.3} />
                <StatCard title="Deletion Queue" value={stats.providerStats.scheduledForDeletion} icon="🗑" accent="#FB923C" delay={0.4} />
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, accent, delay }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay, duration: 0.5 }}
        whileHover={{ y: -5 }}
        className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl relative group overflow-hidden"
    >
        <div className="absolute top-0 right-0 p-4 opacity-10 text-4xl group-hover:scale-125 transition-transform duration-500">{icon}</div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-2">{title}</p>
        <h3 className="text-4xl font-black font-serif italic" style={{ color: accent }}>{value}</h3>
        <div className="h-1 w-8 mt-4 rounded-full opacity-30" style={{ backgroundColor: accent }} />
    </motion.div>
);