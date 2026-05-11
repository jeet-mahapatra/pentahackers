import React from "react";

const StatusBadge = ({ status }) => {
    const styles = {
        pending: "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]",
        approved: "bg-teal-500/10 text-teal-400 border-teal-500/20 shadow-[0_0_15px_rgba(45,212,191,0.1)]",
        rejected: "bg-slate-500/10 text-slate-400 border-slate-500/20",
        suspended: "bg-orange-500/10 text-orange-400 border-orange-500/20",
        schedule_for_deletion: "bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]",
        active: "bg-teal-500/10 text-teal-400 border-teal-500/20",
    };

    const currentStyle = styles[status] || styles.active;
    const displayStatus = status ? status.replace(/_/g, ' ') : 'active';

    return (
        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.12em] border ${currentStyle} backdrop-blur-md`}>
            {displayStatus}
        </span>
    );
};

export default StatusBadge;