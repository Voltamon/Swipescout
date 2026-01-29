import React, { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { ArrowRight } from "lucide-react";

const TiltedCTA = ({
    title = "Ready to \n Revolutionize?",
    description = "Join thousands of companies and builders who are changing the way they connect.",
    ctaText = "Join Waitlist",
    onClick
}) => {
    const ref = useRef(null);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = (e) => {
        if (!ref.current) return;

        const { left, top } = ref.current.getBoundingClientRect();
        mouseX.set(e.clientX - left);
        mouseY.set(e.clientY - top);
    };

    return (
        <section className="py-24 bg-kinetic-bg text-white">
            <div className="container mx-auto px-6 flex justify-center">
                <div
                    ref={ref}
                    onMouseMove={handleMouseMove}
                    className="
                        group relative w-full min-h-[500px] h-auto md:h-[720px] rounded-none bg-kinetic-card border border-white/20
                        flex flex-col items-center justify-center text-center p-8 md:p-12
                        overflow-hidden
                    "
                >
                    {/* Background Image */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                            alt="Background"
                            className="w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
                    </div>

                    {/* Hover Spotlight Effect - Surface */}
                    <motion.div
                        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-10"
                        style={{
                            background: useMotionTemplate`
                                radial-gradient(
                                    650px circle at ${mouseX}px ${mouseY}px,
                                    rgba(255, 255, 255, 0.1),
                                    transparent 40%
                                )
                            `,
                        }}
                    />

                    {/* Content */}
                    <div className="relative z-20 space-y-6">
                        <h2 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none text-white drop-shadow-2xl whitespace-pre-line">
                            {title}
                        </h2>

                        <p className="text-xl text-gray-300 max-w-lg mx-auto drop-shadow-md">
                            {description}
                        </p>

                        <button
                            onClick={onClick}
                            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-bold tracking-wide uppercase overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-lg shadow-white/10"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                {ctaText}
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-kinetic-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                        </button>
                    </div>

                    {/* Decorative Elements (Static 2D) */}
                    <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 blur-[80px] pointer-events-none" />
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 blur-[80px] pointer-events-none" />

                    <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-white/10" />
                    <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-white/10" />
                </div>
            </div>
        </section>
    );
};

export default TiltedCTA;
