import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import ContactChannels from './ContactChannels';
import FAQ from './FAQ';

import ConciergeModal from "./ConciergeModal";
import { UserContext } from "../../Context/UserContext";

const Support = () => {
    const { user } = useContext(UserContext);

    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('bookings');
    const [conciergeOpen, setConciergeOpen] = useState(false);

    return (
        <div
            className="min-h-screen relative overflow-hidden font-sans"
            style={{
                background: "#080C1C",
                color: "#fff",
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
            }}
        >
            {/* ── Aurora Mesh & Grid Background (From Landing) ── */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                {/* Blob 1 — Teal */}
                <motion.div
                    animate={{ x: [0, 60, -30, 0], y: [0, -40, 60, 0], scale: [1, 1.15, 0.95, 1] }}
                    transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute w-[700px] h-[700px] rounded-full top-[-10%] left-[-10%] blur-[60px]"
                    style={{ background: "radial-gradient(circle, rgba(45,212,191,0.12) 0%, transparent 70%)" }}
                />
                {/* Blob 2 — Amber */}
                <motion.div
                    animate={{ x: [0, -80, 40, 0], y: [0, 60, -50, 0], scale: [1, 0.9, 1.2, 1] }}
                    transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 3 }}
                    className="absolute w-[600px] h-[600px] rounded-full top-[20%] right-[-10%] blur-[70px]"
                    style={{ background: "radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)" }}
                />
                {/* Grid Overlay */}
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
                        `,
                        backgroundSize: "60px 60px"
                    }}
                />
            </div>

            {/* ── Hero & Search ── */}
            <section className="relative pt-32 pb-16 px-6 z-10 flex flex-col items-center">
                <div className="max-w-4xl mx-auto text-center w-full">

                    {/* Landing Page Style Pill Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.6 }}
                        className="inline-flex items-center gap-2 bg-[#2DD4BF]/10 border border-[#2DD4BF]/20 rounded-full px-4 py-1.5 mb-8 backdrop-blur-md"
                    >
                        <span className="w-2 h-2 rounded-full bg-[#2DD4BF] animate-pulse" />
                        <span className="text-[#2DD4BF] text-[11px] font-bold tracking-widest uppercase">
                            24/7 Support Center
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                        className="text-4xl md:text-5xl lg:text-[66px] leading-[1.07] font-black mb-6 tracking-tight"
                        style={{ fontFamily: "'Fraunces', serif" }}
                    >
                        How can we <br className="md:hidden" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2DD4BF] to-[#F59E0B] italic">help you?</span>
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="relative mt-12 group max-w-2xl mx-auto"
                    >
                        {/* Search Input Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#2DD4BF]/20 to-[#0EA5E9]/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none" />

                        <Search className="absolute z-[2] left-6 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[#2DD4BF] transition-colors w-5 h-5" />
                        <input
                            type="text"
                            value={searchQuery}
                            placeholder="Search for articles, bookings, or guides..."
                            className="relative w-full bg-[#080C1C]/80 border border-white/[0.08] p-5 pl-14 pr-14 rounded-2xl outline-none focus:border-[#2DD4BF]/50 focus:bg-white/[0.04] transition-all duration-300 text-[15px] font-medium placeholder-white/30 backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute z-[2] right-5 top-1/2 -translate-y-1/2 text-white/40 hover:text-[#FB923C] p-1 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* ── Contact Channels ── */}
            <section className="relative z-10 px-6 max-w-6xl mx-auto">
                <ContactChannels />
            </section>

            {/* ── FAQ — role-aware ── */}
            <section className="relative z-10 px-6 max-w-6xl mx-auto mt-12">
                <FAQ
                    searchQuery={searchQuery}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    userRole={user?.role}
                />
            </section>

            {/* ── CTA Bottom (Matches Landing CTA Banner) ── */}
            <section className="py-24 px-6 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="max-w-4xl mx-auto p-12 lg:p-16 rounded-[30px] border border-[#2DD4BF]/20 bg-[#080C1C]/90 backdrop-blur-2xl shadow-[0_40px_100px_rgba(0,0,0,0.5)] relative overflow-hidden"
                >
                    {/* Animated Corner Accents from Landing */}
                    <div className="absolute top-0 left-0 w-[200px] h-[200px] bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.15),transparent_60%)] pointer-events-none" />
                    <div className="absolute bottom-0 right-0 w-[200px] h-[200px] bg-[radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.15),transparent_60%)] pointer-events-none" />

                    {/* Spinning Orbital Rings */}
                    <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute top-[-60px] right-[-60px] w-[180px] h-[180px] border border-[#2DD4BF]/10 rounded-full pointer-events-none"
                    />
                    <motion.div
                        animate={{ rotate: [360, 0] }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                        className="absolute bottom-[-80px] left-[-80px] w-[240px] h-[240px] border border-[#F59E0B]/10 rounded-full pointer-events-none"
                    />

                    <h2
                        className="text-3xl md:text-4xl lg:text-[46px] font-black mb-5 tracking-tight relative z-10"
                        style={{ fontFamily: "'Fraunces', serif" }}
                    >
                        Didn't find what you <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2DD4BF] to-[#F59E0B] italic">needed?</span>
                    </h2>
                    <p className="text-white/40 mb-10 text-[16px] leading-[1.75] max-w-xl mx-auto relative z-10 font-medium">
                        Our concierge team is available 24/7 to assist with complex service arrangements, immediate troubleshooting, or emergency support.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
                        {/* Primary Button styled like .btn-primary */}
                        <motion.button
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setConciergeOpen(true)}
                            className="relative overflow-hidden group bg-gradient-to-br from-[#2DD4BF] to-[#0EA5E9] text-[#080C1C] px-8 py-3.5 rounded-xl font-bold tracking-wide shadow-[0_16px_48px_rgba(45,212,191,0.4)] transition-all duration-300 w-full sm:w-auto ring-1 ring-[#2DD4BF]/30 flex items-center justify-center gap-2"
                        >
                            <span className="relative z-10">Contact Concierge</span>
                            <svg className="w-4 h-4 relative z-10" viewBox="0 0 16 16" fill="none">
                                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            {/* Inner white glow on hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                        </motion.button>

                        <span className="text-white/30 font-bold uppercase text-[11px] tracking-widest hidden sm:block">or</span>

                        {/* Ghost Button styling for Email */}
                        <a
                            href="mailto:support@servicehub.com"
                            className="bg-white/5 border border-white/10 text-white/80 px-8 py-3.5 rounded-xl font-semibold hover:bg-white/10 hover:border-white/20 hover:text-white hover:-translate-y-0.5 transition-all duration-300 backdrop-blur-md w-full sm:w-auto text-center"
                        >
                            Send us an Email
                        </a>
                    </div>
                </motion.div>
            </section>

            {/* ── Concierge Modal ── */}
            <ConciergeModal
                isOpen={conciergeOpen}
                onClose={() => setConciergeOpen(false)}
            />
        </div>
    );
};

export default Support;