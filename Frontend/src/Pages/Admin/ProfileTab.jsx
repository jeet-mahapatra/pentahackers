import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";


const ProfileTab = ({ adminId, API_BASE }) => {
    const [profile, setProfile] = useState({
        username: "", email: "", fullName: "", phoneNumber: "", bio: "",
        address: "", state: "", country: "", pinCode: "", timezone: "" // 🟢 Added state defaults
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("Admin ID:", adminId);
        if (!adminId) return;
        axios.get(`${API_BASE}/profile/${adminId}`)
            .then(res => {
                const data = res.data.admin;
                setProfile({
                    username: data.username || "",
                    email: data.email || "",
                    fullName: data.fullName || "",
                    phoneNumber: data.phoneNumber || "",
                    bio: data.bio || "",
                    address: data.address || "",
                    state: data.state || "",
                    country: data.country || "",
                    pinCode: data.pinCode || "",
                    timezone: data.timezone || ""
                });
            })
            .catch(() => toast.error("Failed to load profile"))
            .finally(() => setLoading(false));
    }, [adminId]);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const promise = axios.patch(`${API_BASE}/profile/${adminId}`, profile);
        await toast.promise(promise, {
            pending: 'Saving profile...',
            success: 'Profile updated successfully! ✅',
            error: 'Failed to update profile ❌'
        });
    };

    if (loading) return <p className="animate-pulse text-teal-400">Loading profile...</p>;

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-10">
            <h2 className="text-2xl font-bold text-white mb-6">Admin Profile</h2>

            <form onSubmit={handleSave} className="bg-slate-900/40 p-6 md:p-8 rounded-2xl border border-slate-800 shadow-2xl space-y-8">

                {/* Visual Avatar Placeholder */}
                <div className="flex items-center gap-6 pb-6 border-b border-slate-800">
                    <div className="w-20 h-20 rounded-full bg-teal-500/20 border-2 border-teal-500 flex items-center justify-center text-3xl font-black text-teal-400 uppercase">
                        {profile.username?.charAt(0) || "A"}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">{profile.fullName || profile.username || "Admin"}</h3>
                        <p className="text-sm text-teal-500/80 font-bold tracking-widest uppercase">System Administrator</p>
                    </div>
                </div>

                {/* Section 1: Contact Details */}
                <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-teal-500 mb-4">Account & Contact</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-2">Username</label>
                            <input type="text" name="username" value={profile.username} onChange={handleChange} required
                                className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-teal-500 transition-colors" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-2">Email Address</label>
                            <input type="email" name="email" value={profile.email} onChange={handleChange} required
                                className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-teal-500 transition-colors" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-2">Full Name</label>
                            <input type="text" name="fullName" value={profile.fullName} onChange={handleChange} placeholder="John Doe"
                                className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-teal-500 transition-colors" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-2">Phone Number</label>
                            <input type="text" name="phoneNumber" value={profile.phoneNumber} onChange={handleChange} placeholder="+1 234 567 8900"
                                className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-teal-500 transition-colors" />
                        </div>
                    </div>
                </div>

                {/* Section 2: Location Details */}
                <div className="space-y-4 pt-4 border-t border-slate-800">
                    <h4 className="text-xs font-black uppercase tracking-widest text-teal-500 mb-4">Location Details</h4>

                    <div>
                        <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-2">Street Address</label>
                        <input type="text" name="address" value={profile.address} onChange={handleChange} placeholder="123 Admin Blvd, Suite 400"
                            className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-teal-500 transition-colors" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-2">State / Province</label>
                            <input type="text" name="state" value={profile.state} onChange={handleChange} placeholder="California"
                                className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-teal-500 transition-colors" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-2">Country</label>
                            <input type="text" name="country" value={profile.country} onChange={handleChange} placeholder="United States"
                                className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-teal-500 transition-colors" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-2">Pin / Zip Code</label>
                            <input type="text" name="pinCode" value={profile.pinCode} onChange={handleChange} placeholder="90210"
                                className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-teal-500 transition-colors" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-2">Timezone</label>
                            <input type="text" name="timezone" value={profile.timezone} onChange={handleChange} placeholder="GMT-8 (PST)"
                                className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-teal-500 transition-colors" />
                        </div>
                    </div>
                </div>

                {/* Section 3: Bio */}
                <div className="pt-4 border-t border-slate-800">
                    <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-2">Administrator Bio</label>
                    <textarea name="bio" value={profile.bio} onChange={handleChange} rows="4" placeholder="Brief description of your role and responsibilities..."
                        className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-teal-500 transition-colors resize-none"></textarea>
                </div>

                <div className="flex justify-end pt-2">
                    <button type="submit" className="bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold px-8 py-3 rounded-xl transition-colors shadow-lg shadow-teal-500/20 tracking-wide">
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfileTab;