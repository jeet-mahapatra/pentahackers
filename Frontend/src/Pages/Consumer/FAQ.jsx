import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronDown,
    FileText,
    UserCheck,
    CreditCard,
    ShieldQuestion,
    Stethoscope,
    CalendarClock,
    BadgeCheck,
    Settings2,
    AlertTriangle,
} from 'lucide-react';

// ─── USER FAQs ────────────────────────────────────────────────────────────────
const USER_FAQS = {
    bookings: [
        {
            q: "How do I book a service on EasyFind?",
            a: "Browse or search for a verified professional by category (Doctor, Tutor, Plumber, etc.), pick an available time slot on their profile, and confirm the booking from your dashboard. You'll receive a confirmation notification instantly.",
        },
        {
            q: "Can I reschedule or cancel a booking?",
            a: "Yes. Go to 'My Bookings' in your dashboard, select the appointment, and choose Reschedule or Cancel. Changes are allowed up to 12 hours before the scheduled time. Cancellations within 12 hours may be subject to the provider's cancellation policy.",
        },
        {
            q: "How do I know which time slots are available?",
            a: "Each provider manages their own availability calendar. When you open a provider's profile, only open and unbooked slots are shown — greyed-out slots are already taken or blocked by the provider.",
        },
        {
            q: "Can I book multiple professionals at the same time?",
            a: "You can book multiple professionals across different time slots, but the same slot cannot be double-booked with two different providers simultaneously. The system will alert you if a conflict exists.",
        },
    ],
    urgent: [
        {
            q: "What is the Urgent Need feature?",
            a: "The Urgent Need feature lets you connect immediately with a verified, currently-available professional without scheduling in advance. It's designed for emergencies — sudden health issues, water pipe leakage, electrical short circuits, and similar situations.",
        },
        {
            q: "How do I trigger an urgent request?",
            a: "On the home or service page, tap the 'Urgent' button in the relevant category. Provide a brief description of the issue. The system instantly notifies verified providers who are marked available for urgent cases. Once one accepts, a real-time chat opens immediately.",
        },
        {
            q: "What happens if no provider accepts my urgent request?",
            a: "If no provider responds within the set time window, you will be notified and can try again or fall back to a standard booking. You can also contact our concierge team directly for manual assistance.",
        },
    ],
    payments: [
        {
            q: "Is it safe to pay through EasyFind?",
            a: "Yes. All transactions are processed through secure, PCI-compliant payment gateways. Funds are only released to the provider after the service has been marked completed, protecting you from no-show or substandard service.",
        },
        {
            q: "What payment methods are accepted?",
            a: "EasyFind supports UPI, debit/credit cards, and net banking. Payment methods available to you may vary by provider or service category.",
        },
        {
            q: "Can I get a refund?",
            a: "Yes. If you cancel within the allowed window or if a provider fails to show up, a full refund is initiated automatically. For quality-related disputes, report within 24 hours of service completion and our team will review your case.",
        },
    ],
    safety: [
        {
            q: "How are providers verified on EasyFind?",
            a: "Every provider submits a government-issued photo ID and professional documents (degree, license, certificate). An admin manually reviews all submissions. A provider is only made visible in search results after admin approval — no unverified provider can offer services.",
        },
        {
            q: "What is the Satisfaction Guarantee?",
            a: "If you're not satisfied with a completed service, report it within 24 hours from your dashboard. Our team reviews the case and offers a resolution, which may include a partial or full refund depending on the situation.",
        },
        {
            q: "Can I report a provider for misconduct?",
            a: "Absolutely. Use the 'Report' option on the provider's profile or contact our concierge team. Reported providers are placed under review and may be suspended pending investigation.",
        },
    ],
};

// ─── PROVIDER FAQs ────────────────────────────────────────────────────────────
const PROVIDER_FAQS = {
    verification: [
        {
            q: "How does the verification process work?",
            a: "After registering, upload your government-issued ID (required for all) and professional certification if you offer a credentialed service (Doctor, Lawyer, Tutor, etc.). Our admin team reviews all documents — typically within 1–3 business days. You'll be notified by email with the result.",
        },
        {
            q: "My application was rejected. What do I do?",
            a: "You'll receive a rejection email specifying which document was insufficient. Simply re-upload the correct document(s) from your profile dashboard and resubmit. If the issue is unclear, contact our concierge team for guidance.",
        },
        {
            q: "Can I update my documents after approval?",
            a: "Yes, you can update expired or outdated documents from the 'My Documents' section. Updated documents will go through a brief re-review. Your account remains active during this process unless a critical document expires.",
        },
    ],
    appointments: [
        {
            q: "How do I manage my availability?",
            a: "Go to your provider dashboard and open the 'Schedule' tab. Set your working days, available time windows, and block off days you are unavailable. These slots are shown in real time to users searching for providers.",
        },
        {
            q: "How do I accept or decline appointment requests?",
            a: "Incoming appointment requests appear under 'My Appointments → Pending'. You can Accept, Decline, or Suggest a new time. Users are immediately notified of your decision.",
        },
        {
            q: "Can I reschedule an appointment I've already accepted?",
            a: "Yes, but only up to 12 hours before the appointment. Use the reschedule option in 'My Appointments'. Frequent last-minute reschedules may impact your provider rating.",
        },
        {
            q: "How do I enable urgent case availability?",
            a: "In your dashboard, toggle 'Available for Urgent Requests' to ON. When active, you may receive real-time urgent notifications from users. You can switch this off whenever you are unavailable for emergencies.",
        },
    ],
    account: [
        {
            q: "How do I update my service area or city?",
            a: "Go to Profile → Edit Details and update your city and pincode. Your profile will appear in search results for users in that area.",
        },
        {
            q: "What happens if my account is suspended?",
            a: "You'll receive an email with the reason for suspension. Common causes include repeated policy violations or expired documents. Contact our concierge team to resolve the issue. Suspension is typically temporary pending investigation.",
        },
        {
            q: "How do I permanently delete my account?",
            a: "Submit an account deletion request through the Settings → Account section. Your account will be scheduled for deletion after a 7-day grace period, during which you can cancel the request. All your data is permanently removed after that window.",
        },
    ],
    payments: [
        {
            q: "How and when do I receive payments?",
            a: "Payments are released to your linked bank account after a service is marked as completed by the user or after the review window closes (24 hours post-service). Payouts are typically processed within 3–5 business days.",
        },
        {
            q: "What happens if a user disputes my service?",
            a: "You'll be notified of the dispute and given the opportunity to respond with your perspective. Our team mediates and makes a final decision based on chat logs, booking records, and both parties' statements.",
        },
    ],
};

// ─── CATEGORY CONFIGS ─────────────────────────────────────────────────────────
const USER_CATEGORIES = [
    { id: "bookings", label: "Bookings", icon: <FileText size={16} /> },
    { id: "urgent", label: "Urgent Needs", icon: <AlertTriangle size={16} /> },
    { id: "payments", label: "Payments", icon: <CreditCard size={16} /> },
    { id: "safety", label: "Safety", icon: <ShieldQuestion size={16} /> },
];

const PROVIDER_CATEGORIES = [
    { id: "verification", label: "Verification", icon: <BadgeCheck size={16} /> },
    { id: "appointments", label: "Appointments", icon: <CalendarClock size={16} /> },
    { id: "payments", label: "Payments", icon: <CreditCard size={16} /> },
    { id: "account", label: "Account", icon: <Settings2 size={16} /> },
];

// ─── COMPONENT ────────────────────────────────────────────────────────────────
const FAQ = ({ searchQuery, activeTab, setActiveTab, userRole }) => {
    const [openFaq, setOpenFaq] = useState(null);

    // Determine if viewer is a provider
    const isProvider = userRole === 'approved_provider' || userRole === 'pending_provider';

    const faqData = isProvider ? PROVIDER_FAQS : USER_FAQS;
    const categories = isProvider ? PROVIDER_CATEGORIES : USER_CATEGORIES;
    const defaultTab = isProvider ? 'verification' : 'bookings';

    // Keep activeTab valid when role changes
    const validTab = faqData[activeTab] ? activeTab : defaultTab;

    const filteredFaqs = useMemo(() => {
        if (!searchQuery) return faqData[validTab] || [];

        const allFaqs = Object.values(faqData).flat();
        return allFaqs.filter(
            faq =>
                faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                faq.a.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, validTab, faqData]);

    return (
        <div className="py-12 max-w-4xl mx-auto" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
            <div className="text-center mb-16">
                <h2 
                    className="text-3xl md:text-5xl font-black tracking-tight mb-4 text-white"
                    style={{ fontFamily: "'Fraunces', serif" }}
                >
                    Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2DD4BF] to-[#0EA5E9] italic">Questions</span>
                </h2>
                
                {/* Role badge */}
                <div className="inline-flex items-center gap-2 bg-white/[0.03] border border-white/[0.08] rounded-full px-4 py-1.5 backdrop-blur-sm">
                    <span className={`w-2 h-2 rounded-full ${isProvider ? 'bg-[#F59E0B]' : 'bg-[#2DD4BF]'}`} />
                    <span className="text-white/60 text-[12px] font-bold tracking-widest uppercase">
                        {isProvider ? 'Service Providers' : 'Service Users'}
                    </span>
                </div>

                {/* Tabs — hidden while searching */}
                {!searchQuery && (
                    <div className="flex flex-wrap justify-center gap-3 mt-10">
                        {categories.map(cat => {
                            const isActive = validTab === cat.id;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => {
                                        setActiveTab(cat.id);
                                        setOpenFaq(null);
                                    }}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-[14px] font-bold text-[13px] tracking-wide transition-all duration-300 ${
                                        isActive
                                            ? 'bg-[#2DD4BF]/10 text-[#2DD4BF] border border-[#2DD4BF]/30 shadow-[0_4px_15px_rgba(45,212,191,0.15)]'
                                            : 'bg-white/[0.02] border border-white/[0.05] text-white/40 hover:bg-white/[0.05] hover:text-white/80 hover:border-white/[0.1]'
                                    }`}
                                >
                                    {cat.icon} {cat.label}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            <motion.div layout className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {filteredFaqs.length > 0 ? (
                        filteredFaqs.map((faq, index) => {
                            const isOpen = openFaq === index;
                            return (
                                <motion.div
                                    layout
                                    key={faq.q}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    className={`rounded-3xl border transition-all duration-300 overflow-hidden ${
                                        isOpen 
                                        ? 'bg-white/[0.04] border-[#2DD4BF]/30 shadow-[0_10px_30px_rgba(0,0,0,0.3)]' 
                                        : 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.03] hover:border-[#2DD4BF]/20'
                                    }`}
                                >
                                    <button
                                        onClick={() => setOpenFaq(isOpen ? null : index)}
                                        className="w-full px-6 py-5 flex items-center justify-between text-left group"
                                    >
                                        <span className={`font-bold text-[16px] pr-6 transition-colors duration-300 ${isOpen ? 'text-[#2DD4BF]' : 'text-white/90 group-hover:text-white'}`}>
                                            {faq.q}
                                        </span>
                                        <motion.div 
                                            animate={{ rotate: isOpen ? 180 : 0 }} 
                                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                            className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-[#2DD4BF]/20' : 'bg-white/5 group-hover:bg-[#2DD4BF]/10'}`}
                                        >
                                            <ChevronDown className={isOpen ? 'text-[#2DD4BF]' : 'text-white/40 group-hover:text-[#2DD4BF]'} size={18} />
                                        </motion.div>
                                    </button>

                                    <AnimatePresence>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                            >
                                                <div className="px-6 pb-6 pt-2 text-white/50 leading-[1.75] text-[15px] font-medium border-t border-white/[0.05]">
                                                    {faq.a}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-24 rounded-3xl border border-white/[0.05] bg-white/[0.01]"
                        >
                            <ShieldQuestion size={56} className="mx-auto text-white/20 mb-5" />
                            <p className="text-white/40 text-lg font-medium">
                                No results found for "<span className="text-white/80">{searchQuery}</span>"
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default FAQ;