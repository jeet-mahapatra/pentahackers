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
    { value: 'low', label: 'Low', color: 'text-gray-400' },
    { value: 'medium', label: 'Medium', color: 'text-blue-400' },
    { value: 'high', label: 'High', color: 'text-yellow-400' },
    { value: 'urgent', label: 'Urgent', color: 'text-red-400' },
];

// Backdrop overlay variants
const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.25 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
};

// Modal panel variants
const panelVariants = {
    hidden: { opacity: 0, scale: 0.92, y: 40 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 22, stiffness: 280 } },
    exit: { opacity: 0, scale: 0.94, y: 20, transition: { duration: 0.18 } },
};

const InputField = ({ label, error, children }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold uppercase tracking-widest text-gray-400">{label}</label>
        {children}
        {error && (
            <p className="text-red-400 text-xs flex items-center gap-1">
                <AlertCircle size={12} /> {error}
            </p>
        )}
    </div>
);

const inputCls =
    'w-full bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-[#00C4CC]/60 transition-all text-sm';

const ConciergeModal = ({ isOpen, onClose }) => {
    const { user } = useContext(UserContext);

    console.log("Concierge Modal - User Context:", user); // Debugging line
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
        // small delay so exit animation plays before reset
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
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                    onClick={handleClose}
                >
                    {/* Panel — stop propagation so clicks inside don't close */}
                    <motion.div
                        key="concierge-panel"
                        variants={panelVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={e => e.stopPropagation()}
                        className="custom-scrollbar relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-[#0F172A] border border-white/10 rounded-[2.5rem] shadow-2xl shadow-[#00C4CC]/10"
                    >
                        {/* ── Header ── */}
                        <div className="sticky top-0 z-10 flex items-center justify-between px-8 pt-8 pb-4 bg-[#0F172A] border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-[#00C4CC]/10 flex items-center justify-center">
                                    <Headphones className="text-[#00C4CC]" size={20} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black text-white">Contact Concierge</h2>
                                    <p className="text-gray-500 text-xs">We respond within 24 hours</p>
                                </div>
                            </div>
                            <button
                                onClick={handleClose}
                                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors text-gray-400 hover:text-white"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* ── Body ── */}
                        <div className="px-8 py-6">
                            <AnimatePresence mode="wait">
                                {success ? (
                                    /* ── SUCCESS STATE ── */
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex flex-col items-center text-center py-10 gap-4"
                                    >
                                        <div className="w-20 h-20 rounded-full bg-[#00C4CC]/10 flex items-center justify-center">
                                            <CheckCircle2 size={40} className="text-[#00C4CC]" />
                                        </div>
                                        <h3 className="text-2xl font-black text-white">Request Submitted!</h3>
                                        <p className="text-gray-500 text-sm max-w-xs">
                                            Our concierge team has received your message and will reach out within 24 hours.
                                        </p>
                                        <button
                                            onClick={handleClose}
                                            className="mt-4 bg-[#00C4CC] text-[#0F172A] px-10 py-3 rounded-2xl font-black text-sm shadow-[0_8px_24px_rgba(0,196,204,0.3)] hover:brightness-110 transition-all"
                                        >
                                            Done
                                        </button>
                                    </motion.div>
                                ) : (
                                    /* ── FORM STATE ── */
                                    <motion.div key="form" className="flex flex-col gap-5">

                                        {/* Row: Name + Email */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <InputField label="Your Name" error={errors.senderName}>
                                                <input
                                                    type="text"
                                                    value={form.senderName}
                                                    onChange={e => handleChange('senderName', e.target.value)}
                                                    placeholder="John Doe"
                                                    className={inputCls}
                                                />
                                            </InputField>
                                            <InputField label="Email" error={errors.senderEmail}>
                                                <input
                                                    type="email"
                                                    value={form.senderEmail}
                                                    onChange={e => handleChange('senderEmail', e.target.value)}
                                                    placeholder="you@email.com"
                                                    className={inputCls}
                                                />
                                            </InputField>
                                        </div>

                                        {/* Phone (optional) */}
                                        <InputField label="Phone (optional)">
                                            <input
                                                type="tel"
                                                value={form.senderPhone}
                                                onChange={e => handleChange('senderPhone', e.target.value)}
                                                placeholder="+91 98765 43210"
                                                className={inputCls}
                                            />
                                        </InputField>

                                        {/* Subject */}
                                        <InputField label="Subject" error={errors.subject}>
                                            <input
                                                type="text"
                                                value={form.subject}
                                                onChange={e => handleChange('subject', e.target.value)}
                                                placeholder="Brief summary of your issue"
                                                maxLength={120}
                                                className={inputCls}
                                            />
                                        </InputField>

                                        {/* Category + Priority */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <InputField label="Category">
                                                <div className="relative">
                                                    <select
                                                        value={form.category}
                                                        onChange={e => handleChange('category', e.target.value)}
                                                        className={`${inputCls} appearance-none cursor-pointer pr-10`}
                                                    >
                                                        {CATEGORIES.map(c => (
                                                            <option key={c.value} value={c.value} className="bg-[#1E293B]">
                                                                {c.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                                                </div>
                                            </InputField>

                                            <InputField label="Priority">
                                                <div className="flex gap-2 flex-wrap">
                                                    {PRIORITIES.map(p => (
                                                        <button
                                                            key={p.value}
                                                            type="button"
                                                            onClick={() => handleChange('priority', p.value)}
                                                            className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${form.priority === p.value
                                                                ? 'bg-[#00C4CC]/15 border-[#00C4CC]/60 text-[#00C4CC]'
                                                                : 'bg-white/[0.03] border-white/10 text-gray-400 hover:bg-white/[0.06]'
                                                                }`}
                                                        >
                                                            {p.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </InputField>
                                        </div>

                                        {/* Message */}
                                        <InputField label={`Message (${form.message.length}/1500)`} error={errors.message}>
                                            <textarea
                                                rows={5}
                                                value={form.message}
                                                onChange={e => handleChange('message', e.target.value)}
                                                placeholder="Describe your issue or request in detail..."
                                                maxLength={1500}
                                                className={`${inputCls} resize-none`}
                                            />
                                        </InputField>

                                        {/* API error */}
                                        {apiErr && (
                                            <p className="text-red-400 text-sm flex items-center gap-2 bg-red-500/10 px-4 py-3 rounded-2xl border border-red-500/20">
                                                <AlertCircle size={16} /> {apiErr}
                                            </p>
                                        )}

                                        {/* Submit */}
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.97 }}
                                            onClick={handleSubmit}
                                            disabled={loading}
                                            className="w-full bg-[#00C4CC] text-[#0F172A] py-4 rounded-2xl font-black text-sm shadow-[0_8px_24px_rgba(0,196,204,0.25)] hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                                        >
                                            {loading ? (
                                                <><Loader2 size={18} className="animate-spin" /> Sending…</>
                                            ) : (
                                                <><Send size={16} /> Send Request</>
                                            )}
                                        </motion.button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ConciergeModal;