import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import ContactChannels from './ContactChannels';
import FAQ from './FAQ';
import ConciergeModal from './ConciergeModal';
import { UserContext } from "../../Context/UserContext";

const Support = () => {
    const { user } = useContext(UserContext);

    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('bookings');
    const [conciergeOpen, setConciergeOpen] = useState(false);

    return (
        <div className="bg-[#0F172A] text-white min-h-screen font-[fangsong]">

            {/* ── Hero & Search ── */}
            <section className="relative pt-24 pb-12 px-6 overflow-hidden">
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9, filter: 'blur(15px)' }}
                        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                        transition={{ duration: 1 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 italic"
                    >
                        How can we <span className="text-[#00C4CC]">help you?</span>
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="relative mt-10 group"
                    >
                        <Search className="absolute z-[2] left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#00C4CC] transition-colors" />
                        <input
                            type="text"
                            value={searchQuery}
                            placeholder="Search for articles, bookings, or safety tips..."
                            className="w-full bg-white/[0.03] border border-white/10 p-4 lg:p-6 pl-14 lg:pl-16 rounded-[2rem] outline-none focus:border-[#00C4CC]/50 transition-all text-lg backdrop-blur-md shadow-2xl"
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </motion.div>
                </div>

                {/* Background glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-cyan-500/5 blur-[120px] -z-0" />
            </section>

            {/* ── Contact Channels ── */}
            <section>
                <ContactChannels />
            </section>

            {/* ── FAQ — role-aware ── */}
            <section>
                <FAQ
                    searchQuery={searchQuery}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    userRole={user?.role}
                />
            </section>

            {/* ── CTA Bottom ── */}
            <section className="py-24 px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mx-auto p-12 rounded-[3.5rem] border border-white/5 bg-gradient-to-tr from-white/[0.02] to-transparent shadow-2xl shadow-[#00C4CC]/20"
                >
                    <h2 className="text-3xl md:text-4xl font-black mb-4 italic">
                        Didn't find what you needed?
                    </h2>
                    <p className="text-gray-500 mb-8">
                        Our concierge team is available 24/7 to assist with complex travel
                        arrangements or emergency support.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setConciergeOpen(true)}
                            className="bg-[#00C4CC] text-[#0F172A] px-12 py-3 rounded-2xl font-black text-lg shadow-[0_10px_30px_rgba(0,196,204,0.3)]"
                        >
                            Contact Concierge
                        </motion.button>

                        <span className="text-gray-600 font-bold uppercase text-xs tracking-widest">or</span>

                        <a
                            href="mailto:tourguy4002@gmail.com"
                            className="text-white font-bold hover:text-[#00C4CC] transition-colors border-b border-white/10 pb-1"
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