import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ProviderModal from "./ProviderModal";
import StatusBadge from "./StatusBadge";
import ActionButton from "./ActionButton";
import ConfirmToast from "./ConfirmToast";

const ProvidersTab = ({ API_BASE }) => {
    const [providers, setProviders] = useState([]);
    const [selectedProvider, setSelectedProvider] = useState(null);

    const fetchProviders = () => {
        axios.get(`${API_BASE}/providers`)
            .then(res => setProviders(res.data.providers))
            .catch(console.error);
    };

    useEffect(() => { fetchProviders(); }, []);

    const updateStatus = (id, status) => {
        toast(({ closeToast }) => (
            <ConfirmToast
                message={`Authorize status update to ${status.toUpperCase()}?`}
                onConfirm={async () => {
                    const promise = axios.patch(`${API_BASE}/providers/${id}/status`, { status });
                    await toast.promise(promise, {
                        pending: 'Authorizing...',
                        success: 'Registry updated! ✅',
                        error: 'Update failed ❌'
                    });
                    fetchProviders();
                }}
                closeToast={closeToast}
            />
        ));
    };

    return (
        <div className="space-y-8 font-plus-jakarta">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-fraunces font-black text-white tracking-tight">
                    Provider
                    <span
                        style={{
                            background: "linear-gradient(135deg, #2DD4BF 0%, #F59E0B 100%)",
                            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                        }}>Management</span>
                </h2>
                <div className="text-xs font-bold text-white/30 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                    Total Records: {providers.length}
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#0F172A]/30 backdrop-blur-3xl rounded-[32px] border border-white/10 overflow-hidden shadow-2xl"
            >
                <div className="overflow-x-auto custom-scrollbarx">
                    <table className="w-full text-left text-sm min-w-[700px]">
                        <thead className="bg-white/[0.03] border-b border-white/5">
                            <tr>
                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Provider Details</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Service Scope</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Verification Status</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 text-right">Administrative Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {providers.map((p, idx) => (
                                <motion.tr
                                    key={p._id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="hover:bg-white/[0.03] transition-colors group"
                                >
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500/20 to-blue-500/20 flex items-center justify-center text-teal-400 font-black border border-teal-500/10 uppercase">
                                                {p.username.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-white group-hover:text-teal-400 transition-colors text-base leading-tight">
                                                    {p.username}
                                                </p>
                                                <p className="text-xs text-white/30 mt-1 font-medium">{p.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className="px-3 py-1 bg-white/5 rounded-lg text-[11px] font-bold text-white/60 border border-white/5 tracking-wider uppercase">
                                            {p.serviceType}
                                        </span>
                                    </td>
                                    <td className="p-6">
                                        <StatusBadge status={p.verificationStatus} />
                                        {p.verificationStatus === 'schedule_for_deletion' && p.deletionDate && (
                                            <p className="text-[10px] text-rose-500 mt-2 font-black tracking-wider uppercase opacity-80">
                                                PURGE: {new Date(p.deletionDate).toLocaleDateString()}
                                            </p>
                                        )}
                                    </td>
                                    <td className="p-6">
                                        <div className="flex gap-2 justify-end">
                                            <ActionButton onClick={() => setSelectedProvider(p)} color="slate">View</ActionButton>

                                            {p.verificationStatus === 'pending' && (
                                                <>
                                                    <ActionButton onClick={() => updateStatus(p._id, 'approved')} color="teal">Approve</ActionButton>
                                                    <ActionButton onClick={() => updateStatus(p._id, 'rejected')} color="rose">Reject</ActionButton>
                                                </>
                                            )}

                                            {p.verificationStatus === 'approved' && (
                                                <>
                                                    <ActionButton onClick={() => updateStatus(p._id, 'suspended')} color="amber">Suspend</ActionButton>
                                                    <ActionButton onClick={() => updateStatus(p._id, 'schedule_for_deletion')} color="rose">Delete</ActionButton>
                                                </>
                                            )}

                                            {(p.verificationStatus === 'suspended' || p.verificationStatus === 'schedule_for_deletion') && (
                                                <ActionButton onClick={() => updateStatus(p._id, 'approved')} color="teal">Restore</ActionButton>
                                            )}
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            <AnimatePresence>
                {selectedProvider && (
                    <ProviderModal
                        provider={selectedProvider}
                        onClose={() => setSelectedProvider(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProvidersTab;