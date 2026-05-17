import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Send, ChevronDown, Loader2,
    CheckCircle2, AlertCircle, Headphones,
} from 'lucide-react';
import axios from 'axios';
import { UserContext } from '../../Context/UserContext';

const CATEGORIES = [
    { value: 'general_inquiry', label: '💬 General Inquiry' },
    { value: 'booking_issue', label: '📅 Booking Issue' },
    { value: 'payment_issue', label: '💳 Payment Issue' },
    { value: 'account_issue', label: '👤 Account Issue' },
    { value: 'verification_query', label: '🔍 Verification Query' },
    { value: 'urgent_support', label: '🚨 Urgent Support' },
    { value: 'report_provider', label: '⚠️  Report a Provider' },
    { value: 'other', label: '🗂️ Other' },
];

const PRIORITIES = [
    { value: 'low', label: 'Low', color: '#2DD4BF' },
    { value: 'medium', label: 'Medium', color: '#0EA5E9' },
    { value: 'high', label: 'High', color: '#F59E0B' },
    { value: 'urgent', label: 'Urgent', color: '#FB923C' },
];

// Backdrop overlay variants
const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
};

// Modal panel variants
const panelVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 40 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 300 } },
    exit: { opacity: 0, scale: 0.96, y: 20, transition: { duration: 0.25 } },
};

const InputField = ({ label, error, children }) => (
    <div className="flex flex-col gap-2 relative z-10">
        <label className="text-[11px] font-bold uppercase tracking-widest text-white/40 pl-1">{label}</label>
        {children}
        {error && (
            <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-xs flex items-center gap-1.5 pl-1 font-medium mt-1">
                <AlertCircle size={14} /> {error}
            </motion.p>
        )}
    </div>
);

const inputCls =
    'w-full bg-white/[0.02] border border-white/[0.08] rounded-2xl px-5 py-3.5 text-white placeholder-white/30 outline-none focus:border-[#2DD4BF]/50 focus:bg-white/[0.05] transition-all duration-300 text-[14px] font-medium shadow-[0_4px_20px_rgba(0,0,0,0.1)]';

const conciergeModal = ({ isOpen, onClose }) => {
    const { user } = useContext(UserContext);

    const [form, setForm] = useState({
        senderName: user?.username || '',
        senderEmail: user?.email || '',
        senderPhone: '',
        subject: '',
        category: 'general_inquiry',
        priority: 'medium',
        message: '',
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [apiErr, setApiErr] = useState('');

    const validate = () => {
        const e = {};
        if (!form.senderName.trim()) e.senderName = 'Name is required';
        if (!form.senderEmail.trim()) e.senderEmail = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(form.senderEmail)) e.senderEmail = 'Invalid email';
        if (!form.subject.trim()) e.subject = 'Subject is required';
        if (form.subject.length > 120) e.subject = 'Max 120 characters';
        if (!form.message.trim()) e.message = 'Message is required';
        if (form.message.length > 1500) e.message = 'Max 1500 characters';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        setLoading(true);
        setApiErr('');
        try {
            await axios.post('/api/concierge', {
                ...form,
                senderRole: user?.role || 'guest',
                senderId: user?._id || null,
            });
            setSuccess(true);
        } catch (err) {
            setApiErr(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        onClose();
        setTimeout(() => {
            setSuccess(false);
            setApiErr('');
            setErrors({});
            if (!user) setForm({ senderName: '', senderEmail: '', senderPhone: '', subject: '', category: 'general_inquiry', priority: 'medium', message: '' });
        }, 300);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    key="concierge-overlay"
                    variants={overlayVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#080C1C]/80 backdrop-blur-xl"
                    onClick={handleClose}
                    style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
                >
                    {/* Panel */}
                    <motion.div
                        key="concierge-panel"
                        variants={panelVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={e => e.stopPropagation()}
                        className="custom-scrollbar relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#080C1C]/90 backdrop-blur-3xl border border-[#2DD4BF]/20 rounded-[32px] shadow-[0_40px_100px_rgba(0,0,0,0.6)]"
                    >
                        {/* ── Landing Page Animated Aurora Mesh (Modal Sized) ── */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[32px] z-0">
                            {/* Teal Blob */}
                            <motion.div
                                animate={{ x: [0, 40, -20, 0], y: [0, -30, 40, 0] }}
                                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute w-[300px] h-[300px] rounded-full top-[-10%] left-[-10%] blur-[50px]"
                                style={{ background: "radial-gradient(circle, rgba(45,212,191,0.15) 0%, transparent 70%)" }}
                            />
                            {/* Amber Blob */}
                            <motion.div
                                animate={{ x: [0, -50, 30, 0], y: [0, 40, -40, 0] }}
                                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                                className="absolute w-[400px] h-[400px] rounded-full bottom-[-10%] right-[-10%] blur-[60px]"
                                style={{ background: "radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)" }}
                            />
                            {/* Grid Overlay */}
                            <div className="absolute inset-0" style={{
                                backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
                                backgroundSize: "40px 40px"
                            }} />
                        </div>

                        {/* ── Header ── */}
                        <div className="sticky top-0 z-30 flex items-center justify-between px-8 pt-8 pb-5 bg-[#080C1C]/80 backdrop-blur-xl border-b border-white/[0.05]">
                            {/* Shimmer Line from Landing */}
                            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#2DD4BF]/60 to-transparent animate-shimmer" style={{ backgroundSize: "200% 100%" }} />

                            <div className="flex items-center gap-4 relative z-10">
                                <motion.div 
                                    whileHover={{ rotate: 15, scale: 1.05 }}
                                    className="w-12 h-12 rounded-[18px] bg-gradient-to-br from-[#2DD4BF]/20 to-[#0EA5E9]/20 border border-[#2DD4BF]/30 flex items-center justify-center shadow-[0_0_20px_rgba(45,212,191,0.2)]"
                                >
                                    <Headphones className="text-[#2DD4BF]" size={22} />
                                </motion.div>
                                <div>
                                    <h2 className="text-xl font-black text-white tracking-tight" style={{ fontFamily: "'Fraunces', serif" }}>
                                        Contact <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#2DD4BF] to-[#F59E0B]">Concierge</span>
                                    </h2>
                                    <p className="text-white/40 text-[12px] font-medium mt-0.5">We respond within 24 hours</p>
                                </div>
                            </div>
                            <button
                                onClick={handleClose}
                                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors text-white/40 hover:text-white hover:rotate-90 duration-300 relative z-10"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* ── Body ── */}
                        <div className="px-8 py-8 relative z-20">
                            <AnimatePresence mode="wait">
                                {success ? (
                                    /* ── SUCCESS STATE ── */
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex flex-col items-center text-center py-16 gap-6 relative"
                                    >
                                        {/* Spinning Orbital Rings from Landing CTA */}
                                        <motion.div
                                            animate={{ rotate: [0, 360] }}
                                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                            className="absolute top-10 w-[160px] h-[160px] border border-[#2DD4BF]/20 rounded-full pointer-events-none"
                                        />
                                        <motion.div
                                            animate={{ rotate: [360, 0] }}
                                            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                                            className="absolute top-6 w-[192px] h-[192px] border border-[#0EA5E9]/15 rounded-full pointer-events-none"
                                        />

                                        <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-[#2DD4BF]/20 to-[#0EA5E9]/20 flex items-center justify-center border border-[#2DD4BF]/30 shadow-[0_0_40px_rgba(45,212,191,0.3)] z-10">
                                            <CheckCircle2 size={48} className="text-[#2DD4BF]" />
                                        </div>
                                        
                                        <div className="relative z-10">
                                            <h3 className="text-3xl font-black text-white tracking-tight mb-3" style={{ fontFamily: "'Fraunces', serif" }}>
                                                Request Submitted!
                                            </h3>
                                            <p className="text-white/50 text-[15px] max-w-md mx-auto font-medium leading-relaxed">
                                                Our concierge team has received your message and will reach out to you within 24 hours.
                                            </p>
                                        </div>

                                        <motion.button
                                            whileHover={{ scale: 1.05, y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleClose}
                                            className="mt-6 relative z-10 bg-gradient-to-br from-[#2DD4BF] to-[#0EA5E9] text-[#080C1C] px-14 py-3.5 rounded-xl font-bold tracking-wide shadow-[0_16px_48px_rgba(45,212,191,0.4)] transition-all duration-300"
                                        >
                                            Done
                                        </motion.button>
                                    </motion.div>
                                ) : (
                                    /* ── FORM STATE ── */
                                    <motion.div key="form" className="flex flex-col gap-6">

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <InputField label="Your Name" error={errors.senderName}>
                                                <input type="text" value={form.senderName} onChange={e => handleChange('senderName', e.target.value)} placeholder="John Doe" className={inputCls} />
                                            </InputField>
                                            <InputField label="Email" error={errors.senderEmail}>
                                                <input type="email" value={form.senderEmail} onChange={e => handleChange('senderEmail', e.target.value)} placeholder="you@email.com" className={inputCls} />
                                            </InputField>
                                        </div>

                                        <InputField label="Phone (optional)">
                                            <input type="tel" value={form.senderPhone} onChange={e => handleChange('senderPhone', e.target.value)} placeholder="+1 (555) 000-0000" className={inputCls} />
                                        </InputField>

                                        <InputField label="Subject" error={errors.subject}>
                                            <input type="text" value={form.subject} onChange={e => handleChange('subject', e.target.value)} placeholder="Brief summary of your issue" maxLength={120} className={inputCls} />
                                        </InputField>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <InputField label="Category">
                                                <div className="relative">
                                                    <select value={form.category} onChange={e => handleChange('category', e.target.value)} className={`${inputCls} appearance-none cursor-pointer pr-10`}>
                                                        {CATEGORIES.map(c => (
                                                            <option key={c.value} value={c.value} className="bg-[#080C1C] text-white">{c.label}</option>
                                                        ))}
                                                    </select>
                                                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                                                </div>
                                            </InputField>

                                            <InputField label="Priority">
                                                <div className="flex gap-2 flex-wrap">
                                                    {PRIORITIES.map(p => (
                                                        <button
                                                            key={p.value}
                                                            type="button"
                                                            onClick={() => handleChange('priority', p.value)}
                                                            className={`flex-1 py-3 rounded-[14px] text-[13px] font-bold border transition-all duration-300 ${
                                                                form.priority === p.value
                                                                    ? `bg-[${p.color}]/10 border-[${p.color}]/40 text-[${p.color}] shadow-[0_4px_15px_rgba(45,212,191,0.15)]`
                                                                    : 'bg-white/[0.02] border-white/[0.05] text-white/40 hover:bg-white/[0.06] hover:text-white/80'
                                                            }`}
                                                            style={form.priority === p.value ? { color: p.color, borderColor: `${p.color}66`, backgroundColor: `${p.color}1A` } : {}}
                                                        >
                                                            {p.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </InputField>
                                        </div>

                                        <InputField label={`Message (${form.message.length}/1500)`} error={errors.message}>
                                            <textarea rows={5} value={form.message} onChange={e => handleChange('message', e.target.value)} placeholder="Describe your issue or request in detail..." maxLength={1500} className={`${inputCls} resize-none custom-scrollbar`} />
                                        </InputField>

                                        {apiErr && (
                                            <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-[13px] font-medium flex items-center gap-2 bg-red-500/10 px-5 py-3.5 rounded-xl border border-red-500/20">
                                                <AlertCircle size={18} /> {apiErr}
                                            </motion.p>
                                        )}

                                        {/* Landing Page style Primary Button */}
                                        <motion.button
                                            whileHover={{ scale: 1.02, y: -2 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleSubmit}
                                            disabled={loading}
                                            className="w-full mt-2 relative overflow-hidden group bg-gradient-to-br from-[#2DD4BF] to-[#0EA5E9] text-[#080C1C] py-4 rounded-xl font-bold text-[15px] tracking-wide shadow-[0_16px_48px_rgba(45,212,191,0.4)] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none ring-1 ring-[#2DD4BF]/30"
                                        >
                                            <span className="relative z-10 flex items-center gap-2">
                                                {loading ? <><Loader2 size={20} className="animate-spin" /> Sending…</> : <><Send size={18} /> Submit Request</>}
                                            </span>
                                            {/* Button Hover Glow Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-white/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                        </motion.button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </motion.div>
            )}

            <style>{`
                @keyframes shimmer {
                    0% { background-position: -200% center; }
                    100% { background-position: 200% center; }
                }
                .animate-shimmer {
                    animation: shimmer 3s linear infinite;
                }
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
        </AnimatePresence>
    );
};

export default ConciergeModal;