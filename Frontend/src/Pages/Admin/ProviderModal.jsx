import React from "react";
import { motion } from "framer-motion";

const ProviderModal = ({ provider, onClose }) => (
    // Fixed position with extremely high z-index to stay above sidebars
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#080C1C]/90 backdrop-blur-xl"
        />

        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-[#0F172A]/40 backdrop-blur-3xl border border-white/10 w-full max-w-2xl rounded-[32px] shadow-[0_40px_100px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col max-h-[85vh]"
        >
            {/* Header with Aurora effect */}
            <div className="p-8 border-b border-white/5 relative overflow-hidden bg-white/[0.02]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 blur-3xl -mr-16 -mt-16" />
                <div className="flex justify-between items-start relative z-10">
                    <div>
                        <h3 className="text-3xl font-fraunces font-black text-white leading-tight">
                            {provider.username}
                        </h3>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs font-black uppercase tracking-widest text-teal-400">
                                {provider.serviceType}
                            </span>
                            {provider.isProfessional && <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] rounded-md border border-amber-500/20 font-bold">PRO ⭐</span>}
                        </div>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all text-2xl">&times;</button>
                </div>
            </div>

            <div className="p-8 overflow-y-auto space-y-8 custom-scrollbar">
                {/* Contact/Location Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/[0.03] p-6 rounded-2xl border border-white/5 group hover:border-teal-500/30 transition-colors">
                        <p className="text-[10px] text-teal-500 font-black uppercase tracking-[0.2em] mb-4">Contact Info</p>
                        <div className="space-y-2">
                            <p className="text-sm text-white/70 flex items-center gap-3">
                                <span className="text-lg">📧</span> {provider.email}
                            </p>
                            <p className="text-sm text-white/70 flex items-center gap-3">
                                <span className="text-lg">📞</span> {provider.phone}
                            </p>
                        </div>
                    </div>
                    <div className="bg-white/[0.03] p-6 rounded-2xl border border-white/5 group hover:border-teal-500/30 transition-colors">
                        <p className="text-[10px] text-teal-500 font-black uppercase tracking-[0.2em] mb-4">Base Location</p>
                        <div className="space-y-1">
                            <p className="text-sm text-white/70 flex items-center gap-3">
                                <span className="text-lg">📍</span> {provider.address?.street}
                            </p>
                            <p className="text-sm text-white/40 ml-8">{provider.address?.city}, {provider.address?.pincode}</p>
                        </div>
                    </div>
                </div>

                {/* Bio Section */}
                <div className="space-y-4">
                    <p className="text-[10px] text-teal-500 font-black uppercase tracking-[0.2em]">Professional Bio</p>
                    <div className="text-sm text-white/60 bg-white/[0.02] p-6 rounded-2xl border border-white/5 leading-relaxed">
                        <div className="flex items-center gap-2 mb-4 p-3 bg-teal-500/5 rounded-lg border border-teal-500/10 w-fit">
                            <span className="text-teal-400 font-bold uppercase text-[10px] tracking-wider">Years of Practice:</span>
                            <span className="text-white font-black">{provider.experience} Years</span>
                        </div>
                        {provider.bio || "No biography provided."}
                    </div>
                </div>

                {/* Documents */}
                <div className="space-y-4">
                    <p className="text-[10px] text-teal-500 font-black uppercase tracking-[0.2em]">Verification Vault</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <DocCard label="Government ID" icon="🪪" href={provider.documents.idProof} />
                        <DocCard label="Live Portrait" icon="🤳" href={provider.documents.photoproof} />
                        {provider.isProfessional && provider.documents.certification && (
                            <DocCard label="Professional License" icon="📜" href={provider.documents.certification} isGold />
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    </div>
);

const DocCard = ({ label, icon, href, isGold }) => (
    <motion.a
        whileHover={{ scale: 1.02 }}
        href={href} target="_blank" rel="noreferrer"
        className={`flex items-center gap-5 p-5 rounded-2xl border transition-all ${isGold ? 'bg-amber-500/5 border-amber-500/20 hover:border-amber-500/50' : 'bg-white/5 border-white/10 hover:border-teal-500/40'}`}
    >
        <span className="text-3xl filter drop-shadow-md">{icon}</span>
        <div>
            <p className={`text-[11px] font-black uppercase tracking-widest ${isGold ? 'text-amber-400' : 'text-white/80'}`}>{label}</p>
            <p className="text-[10px] text-white/30 font-bold mt-0.5">Secure View →</p>
        </div>
    </motion.a>
);

export default ProviderModal;