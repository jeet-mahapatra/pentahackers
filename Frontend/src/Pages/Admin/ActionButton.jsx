import React from "react";
import { motion } from "framer-motion";

const ActionButton = ({ onClick, color, children }) => {
    const colors = {
        slate: "bg-white/5 hover:bg-white/10 text-white border-white/10 hover:border-white/20",
        teal: "bg-teal-500/10 text-teal-400 hover:bg-teal-500/20 border-teal-500/30 hover:shadow-[0_0_20px_rgba(45,212,191,0.2)]",
        rose: "bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border-rose-500/30 hover:shadow-[0_0_20px_rgba(244,63,94,0.2)]",
        amber: "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border-amber-500/30 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]",
    };

    return (
        <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={onClick}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all border backdrop-blur-md ${colors[color]}`}
        >
            {children}
        </motion.button>
    );
};

export default ActionButton;