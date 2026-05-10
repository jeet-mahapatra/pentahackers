import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
    Headphones, RefreshCw, Filter, ChevronDown,
    Clock, CheckCircle2, XCircle, Loader2,
    AlertTriangle, MailOpen, X, Save,
    ArrowLeft, ArrowRight,
} from 'lucide-react';

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const STATUS_OPTIONS = ['open', 'in_progress', 'resolved', 'closed'];
const PRIORITY_MAP = {
    low: { label: 'Low', cls: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
    medium: { label: 'Medium', cls: 'bg-blue-500/20  text-blue-400  border-blue-500/30' },
    high: { label: 'High', cls: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
    urgent: { label: 'Urgent', cls: 'bg-red-500/20   text-red-400   border-red-500/30' },
};
const STATUS_MAP = {
    open: { label: 'Open', icon: <MailOpen size={13} />, cls: 'bg-[#00C4CC]/15 text-[#00C4CC] border-[#00C4CC]/30' },
    in_progress: { label: 'In Progress', icon: <Clock size={13} />, cls: 'bg-blue-500/20  text-blue-400  border-blue-500/30' },
    resolved: { label: 'Resolved', icon: <CheckCircle2 size={13} />, cls: 'bg-green-500/20 text-green-400 border-green-500/30' },
    closed: { label: 'Closed', icon: <XCircle size={13} />, cls: 'bg-gray-500/20  text-gray-400  border-gray-500/30' },
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
    const cfg = map[value] || { label: value, cls: 'bg-white/10 text-gray-400' };
    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${cfg.cls}`}>
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
            // ✅ Close modal after 1.2s so user sees the "Saved!" confirmation
            setTimeout(() => {
                setSaved(false);
                onClose(); // <-- add this
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={e => e.stopPropagation()}
                className="custom-scrollbar w-full max-w-xl max-h-[90vh] overflow-y-auto bg-[#0F172A] border border-white/10 rounded-[2.5rem] shadow-2xl"
            >
                {/* Header */}
                <div className="sticky top-0 bg-[#0F172A] flex items-center justify-between px-8 pt-8 pb-4 border-b border-white/5 z-10">
                    <h3 className="font-black text-white text-lg">Request Detail</h3>
                    <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                        <X size={18} />
                    </button>
                </div>

                <div className="px-8 py-6 space-y-5">
                    {/* Sender info */}
                    <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
                        <p className="text-white font-bold text-base">{request.senderName}</p>
                        <p className="text-gray-400 text-sm">{request.senderEmail}</p>
                        {request.senderPhone && <p className="text-gray-500 text-sm">{request.senderPhone}</p>}
                        <div className="flex flex-wrap gap-2 pt-1">
                            <Badge map={PRIORITY_MAP} value={request.priority} />
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border bg-white/5 text-gray-400 border-white/10">
                                {request.senderRole}
                            </span>
                        </div>
                    </div>

                    {/* Subject & Category */}
                    <div>
                        <p className="text-xs uppercase tracking-widest text-gray-500 mb-1 font-bold">Subject</p>
                        <p className="text-white font-semibold">{request.subject}</p>
                        <p className="text-[#00C4CC] text-xs mt-1">{CATEGORY_LABELS[request.category] || request.category}</p>
                    </div>

                    {/* Message */}
                    <div>
                        <p className="text-xs uppercase tracking-widest text-gray-500 mb-2 font-bold">Message</p>
                        <p className="text-gray-300 text-sm leading-relaxed bg-white/[0.02] border border-white/5 rounded-2xl p-4">
                            {request.message}
                        </p>
                    </div>

                    {/* Submitted on */}
                    <p className="text-gray-600 text-xs">
                        Submitted: {new Date(request.createdAt).toLocaleString()}
                    </p>

                    {/* Status control */}
                    <div>
                        <p className="text-xs uppercase tracking-widest text-gray-500 mb-2 font-bold">Update Status</p>
                        <div className="flex flex-wrap gap-2">
                            {STATUS_OPTIONS.map(s => (
                                <button
                                    key={s}
                                    onClick={() => setStatus(s)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${status === s
                                        ? 'bg-[#00C4CC]/20 border-[#00C4CC]/50 text-[#00C4CC]'
                                        : 'bg-white/[0.03] border-white/10 text-gray-400 hover:bg-white/[0.06]'
                                        }`}
                                >
                                    {STATUS_MAP[s]?.label || s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Admin note */}
                    <div>
                        <p className="text-xs uppercase tracking-widest text-gray-500 mb-2 font-bold">Admin Note (internal)</p>
                        <textarea
                            rows={3}
                            value={adminNote}
                            onChange={e => setAdminNote(e.target.value)}
                            maxLength={1000}
                            placeholder="Add internal notes, resolution steps, or follow-up details..."
                            className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-[#00C4CC]/60 transition-all text-sm resize-none"
                        />
                    </div>

                    {/* Save button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full bg-[#00C4CC] text-[#0F172A] py-3.5 rounded-2xl font-black text-sm shadow-[0_8px_24px_rgba(0,196,204,0.2)] hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                        {saving ? (
                            <><Loader2 size={16} className="animate-spin" /> Saving…</>
                        ) : saved ? (
                            <><CheckCircle2 size={16} /> Saved!</>
                        ) : (
                            <><Save size={16} /> Save Changes</>
                        )}
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
            // remove empty filter keys
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

    const filterCls = 'bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-[#00C4CC]/50 transition-all';

    return (
        <div className="bg-[#0F172A] min-h-screen text-white p-6 lg:p-10 font-[fangsong]">

            {/* ── Page Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#00C4CC]/10 flex items-center justify-center">
                        <Headphones className="text-[#00C4CC]" size={22} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black">Concierge Requests</h1>
                        <p className="text-gray-500 text-sm">{total} total requests</p>
                    </div>
                </div>
                <button
                    onClick={() => { fetchRequests(); fetchStats(); }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all text-sm font-bold"
                >
                    <RefreshCw size={16} /> Refresh
                </button>
            </div>

            {/* ── Stats Cards ── */}
            {stats && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                    {[
                        { label: 'Open', value: stats.open, cls: 'text-[#00C4CC]' },
                        { label: 'In Progress', value: stats.in_progress, cls: 'text-blue-400' },
                        { label: 'Resolved', value: stats.resolved, cls: 'text-green-400' },
                        { label: 'Closed', value: stats.closed, cls: 'text-gray-400' },
                        { label: 'Urgent Active', value: stats.urgent, cls: 'text-red-400' },
                    ].map(s => (
                        <div key={s.label} className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 text-center">
                            <p className={`text-3xl font-black ${s.cls}`}>{s.value}</p>
                            <p className="text-gray-500 text-xs mt-1 font-bold">{s.label}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Filters ── */}
            <div className="flex flex-wrap gap-3 items-center mb-6 p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                <Filter size={16} className="text-gray-500" />
                <select value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))} className={filterCls}>
                    <option value="">All Statuses</option>
                    {STATUS_OPTIONS.map(s => <option key={s} value={s} className="bg-[#1E293B]">{STATUS_MAP[s]?.label || s}</option>)}
                </select>
                <select value={filters.priority} onChange={e => setFilters(f => ({ ...f, priority: e.target.value }))} className={filterCls}>
                    <option value="">All Priorities</option>
                    {['low', 'medium', 'high', 'urgent'].map(p => <option key={p} value={p} className="bg-[#1E293B]">{PRIORITY_MAP[p].label}</option>)}
                </select>
                <select value={filters.category} onChange={e => setFilters(f => ({ ...f, category: e.target.value }))} className={filterCls}>
                    <option value="">All Categories</option>
                    {Object.entries(CATEGORY_LABELS).map(([v, l]) => <option key={v} value={v} className="bg-[#1E293B]">{l}</option>)}
                </select>
                {(filters.status || filters.priority || filters.category) && (
                    <button onClick={() => setFilters({ status: '', priority: '', category: '' })} className="text-[#00C4CC] text-xs font-bold hover:underline flex items-center gap-1">
                        <X size={12} /> Clear
                    </button>
                )}
            </div>

            {/* ── Table ── */}
            {loading ? (
                <div className="flex items-center justify-center py-24">
                    <Loader2 size={36} className="animate-spin text-[#00C4CC]" />
                </div>
            ) : requests.length === 0 ? (
                <div className="text-center py-24 text-gray-600">
                    <Headphones size={48} className="mx-auto mb-4" />
                    <p className="text-xl italic">No requests found</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {requests.map(req => (
                        <motion.div
                            key={req._id}
                            whileHover={{ x: 4 }}
                            onClick={() => setSelected(req)}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-[#00C4CC]/20 transition-all cursor-pointer"
                        >
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <p className="text-white font-bold truncate">{req.subject}</p>
                                    {req.priority === 'urgent' && (
                                        <AlertTriangle size={14} className="text-red-400 shrink-0" />
                                    )}
                                </div>
                                <p className="text-gray-500 text-xs truncate">
                                    {req.senderName} · {req.senderEmail} · {CATEGORY_LABELS[req.category] || req.category}
                                </p>
                                <p className="text-gray-600 text-xs mt-0.5">
                                    {new Date(req.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 flex-wrap">
                                <Badge map={PRIORITY_MAP} value={req.priority} />
                                <Badge map={STATUS_MAP} value={req.status} />
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* ── Pagination ── */}
            {pages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-8">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-40"
                    >
                        <ArrowLeft size={16} />
                    </button>
                    <span className="text-gray-400 text-sm font-bold">Page {page} of {pages}</span>
                    <button
                        disabled={page === pages}
                        onClick={() => setPage(p => p + 1)}
                        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-40"
                    >
                        <ArrowRight size={16} />
                    </button>
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
        </div>
    );
};

export { AdminConcierge };