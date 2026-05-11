
import React from 'react';
import { motion } from "framer-motion";
import { Mail, Phone, ExternalLink } from 'lucide-react';

const ContactChannels = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
        visible: { 
            opacity: 1, 
            y: 0, 
            filter: 'blur(0px)', 
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
        }
    };

    const channels = [
        {
            icon: <Mail size={24} className="text-[#2DD4BF]" />,
            title: "Email Support",
            desc: "tourguy4002@gmail.com",
            action: "Send Email",
            link: "mailto:tourguy4002@gmail.com?subject=Support Request",
            accent: "#2DD4BF",
            hoverBorder: "hover:border-[#2DD4BF]/40",
            glow: "rgba(45,212,191,0.12)"
        },
        {
            icon: <Phone size={24} className="text-[#F59E0B]" />,
            title: "24/7 Assistance",
            desc: "(+91) 83480-34909",
            action: "Call Now",
            link: "tel:+918348034909",
            accent: "#F59E0B",
            hoverBorder: "hover:border-[#F59E0B]/40",
            glow: "rgba(245,158,11,0.12)"
        }
    ];

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="py-6"
            style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                {channels.map((item, i) => (
                    <motion.div
                        key={i}
                        variants={itemVariants}
                        whileHover={{ y: -6 }}
                        className={`relative group overflow-hidden p-10 lg:p-12 rounded-[32px] bg-white/[0.02] border border-white/[0.05] ${item.hoverBorder} transition-all duration-500 flex flex-col items-center text-center shadow-[0_20px_60px_rgba(0,0,0,0.3)] backdrop-blur-md`}
                    >
                        {/* Ambient Reveal Glow on Hover */}
                        <div 
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" 
                            style={{ background: `radial-gradient(circle at center, ${item.glow} 0%, transparent 70%)` }} 
                        />

                        {/* Icon Container */}
                        <div 
                            className="relative z-10 w-16 h-16 rounded-[20px] flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 shadow-lg"
                            style={{ backgroundColor: `${item.accent}15`, border: `1px solid ${item.accent}30` }}
                        >
                            {item.icon}
                        </div>

                        {/* Text Content */}
                        <h3 
                            className="relative z-10 text-2xl font-black mb-2 tracking-tight text-white" 
                            style={{ fontFamily: "'Fraunces', serif" }}
                        >
                            {item.title}
                        </h3>
                        <p className="relative z-10 text-white/50 text-[15px] font-medium mb-8">
                            {item.desc}
                        </p>

                        {/* Action Button */}
                        <button
                            onClick={() => window.open(item.link, "_blank")}
                            className="relative z-10 text-[12px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all cursor-pointer group/btn px-6 py-2 rounded-full border"
                            style={{ 
                                color: item.accent, 
                                backgroundColor: `${item.accent}0A`, 
                                borderColor: `${item.accent}20`
                            }}
                        >
                            {item.action} 
                            <ExternalLink 
                                size={14} 
                                className="transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform duration-300" 
                            />
                        </button>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default ContactChannels;
