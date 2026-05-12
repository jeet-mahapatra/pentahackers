


import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
    Headphones, RefreshCw, Filter, ChevronDown,
    Clock, CheckCircle2, XCircle, Loader2,
    AlertTriangle, MailOpen, X, Save,
    ArrowLeft, ArrowRight,
} from 'lucide-react';

// ─── CONSTANTS & THEME MAPS ───────────────────────────────────────────────────
const STATUS_OPTIONS = ['open', 'in_progress', 'resolved', 'closed'];

const PRIORITY_MAP = {
    low: { label: 'Low', cls: 'bg-[#2DD4BF]/10 text-[#2DD4BF] border-[#2DD4BF]/30 shadow-[0_0_10px_rgba(45,212,191,0.1)]' },
    medium: { label: 'Medium', cls: 'bg-[#0EA5E9]/10 text-[#0EA5E9] border-[#0EA5E9]/30 shadow-[0_0_10px_rgba(14,165,233,0.1)]' },
    high: { label: 'High', cls: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30 shadow-[0_0_10px_rgba(245,158,11,0.1)]' },
    urgent: { label: 'Urgent', cls: 'bg-[#FB923C]/10 text-[#FB923C] border-[#FB923C]/30 shadow-[0_0_10px_rgba(251,146,60,0.15)] animate-pulse' },
};

const STATUS_MAP = {
    open: { label: 'Open', icon: <MailOpen size={13} />, cls: 'bg-[#2DD4BF]/15 text-[#2DD4BF] border-[#2DD4BF]/40' },
    in_progress: { label: 'In Progress', icon: <Clock size={13} />, cls: 'bg-[#0EA5E9]/15 text-[#0EA5E9] border-[#0EA5E9]/40' },
    resolved: { label: 'Resolved', icon: <CheckCircle2 size={13} />, cls: 'bg-[#34D399]/15 text-[#34D399] border-[#34D399]/40' },
    closed: { label: 'Closed', icon: <XCircle size={13} />, cls: 'bg-white/5 text-white/40 border-white/10' },
};

const CATEGORY_LABELS = {
    general_inquiry: '💬 General Inquiry',
    booking_issue: '📅 Booking Issue',
    payment_issue: '💳 Payment Issue',
    account_issue: '👤 Account Issue',
    verification_query: '🔍 Verification Query',
    urgent_support: '🚨 Urgent Support',
    report_provider: '⚠️ Report Provider',
    other: '🗂️ Other',
};

// ─── BADGE ────────────────────────────────────────────────────────────────────
const Badge = ({ map, value }) => {
    const cfg = map[value] || { label: value, cls: 'bg-white/5 text-white/40 border-white/10' };
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest border transition-colors ${cfg.cls}`}>
            {cfg.icon} {cfg.label}
        </span>
    );
};

// ─── DETAIL MODAL ─────────────────────────────────────────────────────────────
const DetailModal = ({ request, onClose, onUpdate }) => {
    const [status, setStatus] = useState(request.status);
    const [adminNote, setAdminNote] = useState(request.adminNote || '');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        try {
            const { data } = await axios.patch(`/api/concierge/${request._id}`, { status, adminNote });
            onUpdate(data.request);
            setSaved(true);
            setTimeout(() => {
                setSaved(false);
                onClose();
            }, 1200);
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#080C1C]/80 backdrop-blur-md"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, y: 30, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.96, y: 20, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                onClick={e => e.stopPropagation()}
                className="custom-scrollbar relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#080C1C]/95 backdrop-blur-3xl border border-white/[0.08] rounded-[32px] shadow-[0_40px_100px_rgba(0,0,0,0.6)]"
            >
                {/* Internal Glow */}
                <div className="absolute top-0 left-0 w-full h-[200px] bg-gradient-to-b from-[#2DD4BF]/5 to-transparent pointer-events-none" />

                {/* Header */}
                <div className="sticky top-0 z-20 flex items-center justify-between px-8 pt-8 pb-5 bg-[#080C1C]/80 backdrop-blur-xl border-b border-white/[0.05]">
                    <div>
                        <h3 className="text-xl font-black text-white tracking-tight" style={{ fontFamily: "'Fraunces', serif" }}>
                            Request <span className="italic text-[#0EA5E9]">Detail</span>
                        </h3>
                        <p className="text-white/40 text-[12px] font-medium mt-0.5">ID: {request._id.slice(-8).toUpperCase()}</p>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors">
                        <X size={18} />
                    </button>
                </div>

                <div className="px-8 py-8 space-y-6 relative z-10">
                    {/* Sender info */}
                    <div className="p-6 rounded-[20px] bg-white/[0.02] border border-white/[0.05] shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] space-y-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-white font-bold text-lg">{request.senderName}</p>
                                <p className="text-white/50 text-[13px] font-medium mt-0.5">{request.senderEmail}</p>
                                {request.senderPhone && <p className="text-white/50 text-[13px] font-medium">{request.senderPhone}</p>}
                            </div>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase border bg-white/[0.05] text-white/60 border-white/[0.1]">
                                {request.senderRole}
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-2 border-t border-white/[0.05]">
                            <Badge map={PRIORITY_MAP} value={request.priority} />
                            <Badge map={STATUS_MAP} value={request.status} />
                        </div>
                    </div>

                    {/* Subject & Category */}
                    <div>
                        <p className="text-[11px] uppercase tracking-widest text-white/40 mb-1.5 font-bold pl-1">Subject</p>
                        <p className="text-white font-semibold text-[15px] bg-white/[0.02] border border-white/[0.05] rounded-xl px-4 py-3">{request.subject}</p>
                        <p className="text-[#2DD4BF] text-[13px] mt-2 font-semibold pl-1">{CATEGORY_LABELS[request.category] || request.category}</p>
                    </div>

                    {/* Message */}
                    <div>
                        <p className="text-[11px] uppercase tracking-widest text-white/40 mb-1.5 font-bold pl-1">Message</p>
                        <p className="text-white/80 text-[14px] leading-relaxed bg-white/[0.02] border border-white/[0.05] rounded-2xl p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] whitespace-pre-wrap">
                            {request.message}
                        </p>
                    </div>

                    <p className="text-white/30 text-[11px] font-bold tracking-widest uppercase pl-1">
                        Submitted: {new Date(request.createdAt).toLocaleString()}
                    </p>

                    {/* Status control */}
                    <div className="pt-4 border-t border-white/[0.05]">
                        <p className="text-[11px] uppercase tracking-widest text-white/40 mb-2.5 font-bold pl-1">Update Status</p>
                        <div className="flex flex-wrap gap-2">
                            {STATUS_OPTIONS.map(s => (
                                <button
                                    key={s}
                                    onClick={() => setStatus(s)}
                                    className={`px-5 py-2.5 rounded-xl text-[12px] uppercase tracking-widest font-bold border transition-all duration-300 ${
                                        status === s
                                            ? 'bg-[#2DD4BF]/15 border-[#2DD4BF]/50 text-[#2DD4BF] shadow-[0_0_15px_rgba(45,212,191,0.2)]'
                                            : 'bg-white/[0.02] border-white/[0.05] text-white/40 hover:bg-white/[0.05] hover:text-white/80'
                                    }`}
                                >
                                    {STATUS_MAP[s]?.label || s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Admin note */}
                    <div>
                        <p className="text-[11px] uppercase tracking-widest text-white/40 mb-2.5 font-bold pl-1">Admin Note (Internal)</p>
                        <textarea
                            rows={3}
                            value={adminNote}
                            onChange={e => setAdminNote(e.target.value)}
                            maxLength={1000}
                            placeholder="Add internal notes, resolution steps, or follow-up details..."
                            className="w-full bg-white/[0.02] border border-white/[0.08] rounded-2xl px-5 py-4 text-white placeholder-white/30 outline-none focus:border-[#2DD4BF]/50 focus:bg-white/[0.04] transition-all duration-300 text-[14px] resize-none custom-scrollbar shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]"
                        />
                    </div>

                    {/* Save button */}
                    <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full relative overflow-hidden group bg-gradient-to-br from-[#2DD4BF] to-[#0EA5E9] text-[#080C1C] py-4 rounded-xl font-bold text-[15px] tracking-wide shadow-[0_12px_30px_rgba(45,212,191,0.3)] hover:shadow-[0_16px_40px_rgba(45,212,191,0.4)] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            {saving ? (
                                <><Loader2 size={18} className="animate-spin" /> Saving…</>
                            ) : saved ? (
                                <><CheckCircle2 size={18} /> Saved!</>
                            ) : (
                                <><Save size={18} /> Save Changes</>
                            )}
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-br from-white/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const AdminConcierge = () => {
    const [requests, setRequests] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [total, setTotal] = useState(0);

    const [filters, setFilters] = useState({ status: '', priority: '', category: '' });

    const fetchRequests = useCallback(async () => {
        setLoading(true);
        try {
            const params = { page, limit: 15, ...filters };
            Object.keys(params).forEach(k => !params[k] && delete params[k]);

            const { data } = await axios.get('/api/concierge', { params });
            setRequests(data.requests);
            setPages(data.pages);
            setTotal(data.total);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [page, filters]);

    const fetchStats = useCallback(async () => {
        try {
            const { data } = await axios.get('/api/concierge/stats');
            setStats(data.stats);
        } catch (err) {
            console.error(err);
        }
    }, []);

    useEffect(() => {
        fetchRequests();
        fetchStats();
    }, [fetchRequests, fetchStats]);

    const handleUpdate = (updated) => {
        setRequests(prev => prev.map(r => r._id === updated._id ? updated : r));
        fetchStats();
    };

    const filterCls = 'appearance-none bg-white/[0.02] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white/80 text-[13px] font-medium outline-none focus:border-[#2DD4BF]/50 focus:bg-white/[0.04] transition-all duration-300 cursor-pointer pr-10 shadow-[0_4px_15px_rgba(0,0,0,0.1)]';

    return (
        <div 
            className="min-h-screen relative overflow-hidden font-sans p-6 lg:p-10"
            style={{ 
                background: "#080C1C", 
                color: "#fff",
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" 
            }}
        >
            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(45,212,191,0.05)_0%,transparent_60%)] rounded-full blur-[80px] pointer-events-none z-0" />
            <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(14,165,233,0.04)_0%,transparent_60%)] rounded-full blur-[80px] pointer-events-none z-0" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* ── Page Header ── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-[18px] bg-gradient-to-br from-[#2DD4BF]/20 to-[#0EA5E9]/20 border border-[#2DD4BF]/30 flex items-center justify-center shadow-[0_0_20px_rgba(45,212,191,0.15)]">
                            <Headphones className="text-[#2DD4BF]" size={24} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight" style={{ fontFamily: "'Fraunces', serif" }}>
                                Concierge <span className="italic text-[#0EA5E9]">Requests</span>
                            </h1>
                            <p className="text-white/40 text-[13px] font-medium mt-0.5 tracking-wide">{total} total support tickets</p>
                        </div>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => { fetchRequests(); fetchStats(); }}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-300 text-[13px] font-bold tracking-wide shadow-[0_4px_15px_rgba(0,0,0,0.1)]"
                    >
                        <RefreshCw size={16} /> Refresh Data
                    </motion.button>
                </div>

                {/* ── Stats Cards ── */}
                {stats && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10"
                    >
                        {[
                            { label: 'Open', value: stats.open, color: '#2DD4BF' },
                            { label: 'In Progress', value: stats.in_progress, color: '#0EA5E9' },
                            { label: 'Resolved', value: stats.resolved, color: '#34D399' },
                            { label: 'Closed', value: stats.closed, color: 'rgba(255,255,255,0.4)' },
                            { label: 'Urgent Active', value: stats.urgent, color: '#FB923C', pulse: true },
                        ].map((s, i) => (
                            <motion.div 
                                key={s.label} 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1, duration: 0.4 }}
                                className="p-5 rounded-[22px] bg-white/[0.02] border border-white/[0.05] text-center shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:bg-white/[0.03] transition-colors"
                            >
                                <p 
                                    className={`text-4xl font-black mb-1 ${s.pulse ? 'animate-pulse' : ''}`} 
                                    style={{ color: s.color, fontFamily: "'Fraunces', serif" }}
                                >
                                    {s.value}
                                </p>
                                <p className="text-white/40 text-[11px] font-bold tracking-widest uppercase">{s.label}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {/* ── Filters ── */}
                <div className="flex flex-wrap gap-4 items-center mb-8 p-5 rounded-[22px] bg-white/[0.015] border border-white/[0.05] shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
                    <Filter size={18} className="text-[#2DD4BF]" />
                    
                    <div className="relative">
                        <select value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))} className={filterCls}>
                            <option value="">All Statuses</option>
                            {STATUS_OPTIONS.map(s => <option key={s} value={s} className="bg-[#080C1C]">{STATUS_MAP[s]?.label || s}</option>)}
                        </select>
                        <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                    </div>

                    <div className="relative">
                        <select value={filters.priority} onChange={e => setFilters(f => ({ ...f, priority: e.target.value }))} className={filterCls}>
                            <option value="">All Priorities</option>
                            {['low', 'medium', 'high', 'urgent'].map(p => <option key={p} value={p} className="bg-[#080C1C]">{PRIORITY_MAP[p].label}</option>)}
                        </select>
                        <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                    </div>

                    <div className="relative">
                        <select value={filters.category} onChange={e => setFilters(f => ({ ...f, category: e.target.value }))} className={filterCls}>
                            <option value="">All Categories</option>
                            {Object.entries(CATEGORY_LABELS).map(([v, l]) => <option key={v} value={v} className="bg-[#080C1C]">{l}</option>)}
                        </select>
                        <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                    </div>

                    {(filters.status || filters.priority || filters.category) && (
                        <button onClick={() => setFilters({ status: '', priority: '', category: '' })} className="text-[#FB923C] text-[12px] font-bold hover:underline flex items-center gap-1.5 ml-2 tracking-wide">
                            <X size={14} /> Clear Filters
                        </button>
                    )}
                </div>

                {/* ── Table / List ── */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32">
                        <Loader2 size={40} className="animate-spin text-[#2DD4BF] mb-4" />
                        <p className="text-white/40 text-[12px] font-bold tracking-widest uppercase">Fetching Records...</p>
                    </div>
                ) : requests.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="text-center py-32 border border-white/[0.05] rounded-[32px] bg-white/[0.01]"
                    >
                        <div className="w-20 h-20 bg-white/[0.02] border border-white/[0.05] rounded-full flex items-center justify-center mx-auto mb-6">
                            <Headphones size={32} className="text-white/20" />
                        </div>
                        <h3 className="text-2xl font-black text-white/80 mb-2" style={{ fontFamily: "'Fraunces', serif" }}>Inbox Clear</h3>
                        <p className="text-white/40 text-[14px] font-medium">No requests match your current criteria.</p>
                    </motion.div>
                ) : (
                    <div className="space-y-3">
                        <AnimatePresence>
                            {requests.map((req, index) => (
                                <motion.div
                                    key={req._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05, duration: 0.4 }}
                                    whileHover={{ x: 6 }}
                                    onClick={() => setSelected(req)}
                                    className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 md:p-6 rounded-[24px] bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-[#2DD4BF]/30 transition-all duration-300 cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_rgba(45,212,191,0.1)] relative overflow-hidden"
                                >
                                    {/* Hover gradient sweep */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#2DD4BF]/0 via-[#2DD4BF]/5 to-[#2DD4BF]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />

                                    <div className="flex-1 min-w-0 relative z-10">
                                        <div className="flex items-center gap-3 flex-wrap mb-1.5">
                                            <p className="text-white/90 font-bold text-[16px] truncate tracking-tight">{req.subject}</p>
                                            {req.priority === 'urgent' && (
                                                <span className="flex items-center gap-1 text-[#FB923C] text-[10px] font-bold uppercase tracking-widest bg-[#FB923C]/10 px-2 py-0.5 rounded-md border border-[#FB923C]/20">
                                                    <AlertTriangle size={12} /> Urgent
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-white/50 text-[13px] font-medium truncate mb-1.5 flex items-center gap-2">
                                            <span className="text-white/80">{req.senderName}</span>
                                            <span className="w-1 h-1 rounded-full bg-white/20" />
                                            <span>{req.senderEmail}</span>
                                            <span className="w-1 h-1 rounded-full bg-white/20" />
                                            <span className="text-[#2DD4BF]">{CATEGORY_LABELS[req.category] || req.category}</span>
                                        </p>
                                        <p className="text-white/30 text-[11px] font-bold uppercase tracking-widest mt-1">
                                            {new Date(req.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0 flex-wrap relative z-10">
                                        <Badge map={PRIORITY_MAP} value={req.priority} />
                                        <Badge map={STATUS_MAP} value={req.status} />
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}

                {/* ── Pagination ── */}
                {pages > 1 && (
                    <div className="flex items-center justify-center gap-6 mt-12">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="w-12 h-12 rounded-full bg-white/[0.03] border border-white/[0.1] flex items-center justify-center text-white/60 hover:text-white hover:border-[#2DD4BF]/50 hover:bg-[#2DD4BF]/10 transition-all duration-300 disabled:opacity-30 disabled:pointer-events-none shadow-[0_4px_15px_rgba(0,0,0,0.2)]"
                        >
                            <ArrowLeft size={18} />
                        </motion.button>
                        <span className="text-white/50 text-[13px] font-bold tracking-widest uppercase">Page <span className="text-white mx-1">{page}</span> of {pages}</span>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            disabled={page === pages}
                            onClick={() => setPage(p => p + 1)}
                            className="w-12 h-12 rounded-full bg-white/[0.03] border border-white/[0.1] flex items-center justify-center text-white/60 hover:text-white hover:border-[#2DD4BF]/50 hover:bg-[#2DD4BF]/10 transition-all duration-300 disabled:opacity-30 disabled:pointer-events-none shadow-[0_4px_15px_rgba(0,0,0,0.2)]"
                        >
                            <ArrowRight size={18} />
                        </motion.button>
                    </div>
                )}

                {/* ── Detail Modal ── */}
                <AnimatePresence>
                    {selected && (
                        <DetailModal
                            request={selected}
                            onClose={() => setSelected(null)}
                            onUpdate={(updated) => {
                                handleUpdate(updated);
                                setSelected(updated);
                            }}
                        />
                    )}
                </AnimatePresence>

                <style>{`
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 6px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: rgba(255, 255, 255, 0.1);
                        border-radius: 10px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: rgba(255, 255, 255, 0.2);
                    }
                `}</style>
            </div>
        </div>
    );
};

export { AdminConcierge };