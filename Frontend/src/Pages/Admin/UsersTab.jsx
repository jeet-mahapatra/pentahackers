import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import StatusBadge from "./StatusBadge";
import ActionButton from "./ActionButton";
import ConfirmToast from "./ConfirmToast";

const UsersTab = ({ API_BASE }) => {
    const [users, setUsers] = useState([]);

    const fetchUsers = () => {
        axios.get(`${API_BASE}/users`)
            .then(res => setUsers(res.data.users))
            .catch(() => toast.error("Error loading users"));
    };

    useEffect(() => { fetchUsers(); }, []);

    const updateUserStatus = (id, status) => {
        toast(({ closeToast }) => (
            <ConfirmToast
                message={`Initialize status change to ${status.toUpperCase()}?`}
                onConfirm={async () => {
                    const promise = axios.patch(`${API_BASE}/users/${id}/status`, { status });
                    await toast.promise(promise, {
                        pending: 'Executing directive...',
                        success: `Status updated to ${status} successfully.`,
                        error: 'Unauthorized or failed to update.'
                    });
                    fetchUsers();
                }}
                closeToast={closeToast}
            />
        ));
    };

    const deleteUser = (id) => {
        toast(({ closeToast }) => (
            <ConfirmToast
                message="Are you sure you want to delete this user? This action is irreversible."
                onConfirm={async () => {
                    const promise = axios.delete(`${API_BASE}/users/${id}`);
                    await toast.promise(promise, {
                        pending: 'Deleting record...',
                        success: 'User deleted from database. 🗑️',
                        error: 'Failed to delete record.'
                    });
                    fetchUsers();
                }}
                closeToast={closeToast}
            />
        ));
    };

    return (
        <div className="space-y-10">
            <header>
                <span className="text-[#2DD4BF] text-xs font-bold tracking-[0.3em] uppercase">User Management</span>
                <h2 className="text-4xl md:text-5xl font-bold font-serif italic tracking-tight mt-2">
                    Active
                    <span
                        style={{
                            background: "linear-gradient(135deg, #2DD4BF 0%, #F59E0B 100%)",
                            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                        }}>Accounts</span></h2>
            </header>

            <div className="bg-white/[0.02] backdrop-blur-3xl rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.01]">
                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">User Identity</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Created</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Status</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 text-right">System Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {users.map((u, idx) => (
                                <motion.tr
                                    key={u._id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="hover:bg-white/[0.03] transition-colors group"
                                >
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-[#2DD4BF]/10 flex items-center justify-center text-[#2DD4BF] font-black shadow-inner">
                                                {u.username?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-white group-hover:text-[#2DD4BF] transition-colors duration-300">{u.username}</p>
                                                <p className="text-xs text-white/20">{u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6 text-sm text-white/40 font-medium">
                                        {new Date(u.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </td>
                                    <td className="p-6">
                                        <StatusBadge status={u.status || 'active'} />
                                    </td>
                                    <td className="p-6">
                                        <div className="flex gap-3 justify-end">
                                            {(!u.status || u.status === 'active') ? (
                                                <button
                                                    onClick={() => updateUserStatus(u._id, 'suspended')}
                                                    className="bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#F59E0B] hover:text-[#080C1C] transition-all"
                                                >
                                                    Suspend
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => updateUserStatus(u._id, 'active')}
                                                    className="bg-[#2DD4BF]/10 text-[#2DD4BF] border border-[#2DD4BF]/20 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#2DD4BF] hover:text-[#080C1C] transition-all"
                                                >
                                                    Restore
                                                </button>
                                            )}
                                            <button
                                                onClick={() => deleteUser(u._id)}
                                                className="bg-red-500/10 text-red-500 border border-red-500/20 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UsersTab;