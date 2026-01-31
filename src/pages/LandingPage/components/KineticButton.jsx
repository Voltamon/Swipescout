import React from 'react';
import { motion } from 'framer-motion';

const KineticButton = ({ children, className = '', onClick }) => {
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={`
        relative overflow-hidden px-8 py-3 rounded-xl font-bold text-black
        bg-kinetic-primary group transition-all duration-300
        hover:shadow-[0_0_30px_rgba(255,255,255,0.6)]
        border border-white/10 ${className}
      `}
        >
            <span className="relative z-10 flex items-center justify-center gap-2">
                {children}
            </span>

            {/* Moving gradient background effect */}


            {/* Shine effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shine_1s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />
        </motion.button>
    );
};

export default KineticButton;
