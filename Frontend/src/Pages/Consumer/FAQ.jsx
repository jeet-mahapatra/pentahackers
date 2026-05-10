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
        <div className="py-20 px-6 max-w-5xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-black italic mb-2 text-white/90">
                    Frequently Asked Questions
                </h2>
                {/* Role badge */}
                <p className="text-gray-500 text-sm">
                    {isProvider
                        ? '🔧 Showing FAQs for Service Providers'
                        : '👤 Showing FAQs for Users'}
                </p>

                {/* Tabs — hidden while searching */}
                {!searchQuery && (
                    <div className="flex flex-wrap justify-center gap-2 mt-8">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => {
                                    setActiveTab(cat.id);
                                    setOpenFaq(null);
                                }}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all ${validTab === cat.id
                                        ? 'bg-[#00C4CC] text-[#0F172A]'
                                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                    }`}
                            >
                                {cat.icon} {cat.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <motion.div layout className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {filteredFaqs.length > 0 ? (
                        filteredFaqs.map((faq, index) => (
                            <motion.div
                                layout
                                key={faq.q}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="mb-4"
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                    className="w-full p-5 lg:p-6 rounded-3xl bg-white/[0.03] border border-white/5 flex items-center justify-between hover:bg-white/[0.05] transition-all text-left group"
                                >
                                    <span className="font-bold text-base pr-4 group-hover:text-white transition-colors">
                                        {faq.q}
                                    </span>
                                    <motion.div animate={{ rotate: openFaq === index ? 180 : 0 }} className="shrink-0">
                                        <ChevronDown className="text-[#00C4CC]" size={20} />
                                    </motion.div>
                                </button>

                                <AnimatePresence>
                                    {openFaq === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="p-6 lg:p-8 text-gray-400 leading-relaxed border-x border-b border-white/5 rounded-b-3xl -mt-4 bg-white/[0.01] text-sm">
                                                {faq.a}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20"
                        >
                            <ShieldQuestion size={56} className="mx-auto text-gray-700 mb-4" />
                            <p className="text-gray-500 text-xl italic">
                                No results found for "{searchQuery}"
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default FAQ;