import React from 'react';
import { motion } from "framer-motion";
import {
    Mail,
    Phone,
    ExternalLink,
    X
} from 'lucide-react';

const ContactChannels = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
        visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: "easeOut" } }
    };

    const channels = [
        {
            icon: <Mail className="text-[#00C4CC]" />,
            title: "Email Support",
            desc: "tourguy4002@gmail.com",
            action: "Send Email",
            link: "mailto:tourguy4002@gmail.com?subject=Support Request"
        },
        {
            icon: <Phone className="text-purple-400" />,
            title: "24/7 Assistance",
            desc: "(+91) 83480-34909",
            action: "Call Now",
            link: "tel:+918348034909"
        }
    ];



    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="py-12 px-6"
        >
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                {channels.map((item, i) => (
                    <motion.div
                        key={i}
                        variants={itemVariants}
                        whileHover={{ y: -8, backgroundColor: "rgba(255,255,255,0.04)" }}
                        className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 flex flex-col items-center text-center group shadow-lg shadow-[#00C4CC]/30"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            {item.icon}
                        </div>
                        <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                        <p className="text-gray-500 text-sm mb-6">{item.desc}</p>
                        <button
                            onClick={() => window.open(item.link, "_blank")}
                            className="text-xs font-black uppercase tracking-widest text-[#00C4CC] flex items-center gap-2 hover:gap-3 transition-all cursor-pointer"
                        >
                            {item.action} <ExternalLink size={14} />
                        </button>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    )
}

export default ContactChannels
