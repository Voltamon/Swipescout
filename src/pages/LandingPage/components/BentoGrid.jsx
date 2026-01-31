import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Globe, Sparkles, MessageCircle, Shield, MapPin, Scan } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import fingerprintImg from '../../../assets/fingerprint.png';

gsap.registerPlugin(ScrollTrigger);

// Swiss Card Component - Cleaner, bolder, less "glassy"
const SwissCard = ({ children, className = '', title, subtitle, icon: Icon, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }} // Custom "Swiss" ease
        className={`
      bg-kinetic-card group relative overflow-hidden flex flex-col p-8 md:p-10
      border border-white/10 transition-colors duration-500 hover:border-white/20
      ${className}
    `}
    >
        {/* Subtle Grain Texture Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none" />

        {/* Header Content */}
        <div className="relative z-10 mb-8">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white bg-white/5">
                    <Icon size={18} />
                </div>
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400">{subtitle}</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-white leading-tight tracking-tight max-w-md">
                {title}
            </h3>
        </div>

        {/* Dynamic Content Area */}
        <div className="flex-1 relative z-10 w-full min-h-[200px] bg-black/20 rounded-xl overflow-hidden border border-white/5">
            {children}
        </div>
    </motion.div>
);

const BentoGrid = () => {
    const headerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(headerRef.current, {
                opacity: 0,
                y: 50,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: headerRef.current,
                    start: "top 80%",
                }
            });
        }, headerRef);
        return () => ctx.revert();
    }, []);

    const candidates = [
        { name: "Sarah Jenkins", role: "Product Designer", location: "San Francisco, USA", flag: "🇺🇸", color: "bg-blue-500" },
        { name: "David Lee", role: "Frontend Dev", location: "London, UK", flag: "🇬🇧", color: "bg-red-500" },
        { name: "Akira Tanaka", role: "Data Scientist", location: "Tokyo, JP", flag: "🇯🇵", color: "bg-purple-500" },
    ];

    return (
        <section className="py-32 bg-kinetic-bg text-white">
            <div className="container mx-auto px-6">

                {/* Editorial Section Header */}
                <div ref={headerRef} className="mb-24 grid grid-cols-1 md:grid-cols-12 gap-8 items-end border-b border-white/10 pb-12">
                    <div className="md:col-span-8">
                        <h2 className="text-5xl md:text-6xl lg:text-8xl font-bold tracking-tighter leading-[0.9]">
                            <span className="text-[#34D399]">Hiring,</span><br />
                            <span className="text-white">Reimagined.</span>
                        </h2>
                    </div>
                </div>

                {/* SWISS GRID LAYOUT (Max 4 Features) */}
                {/* Asymmetrical 2x2 Grid */}
                <div className="relative grid grid-cols-1 md:grid-cols-12 grid-rows-[auto_auto] gap-px bg-white/10 border border-white/10 overflow-hidden">
                    {/* Overlay to prevent hover interactions */}
                    <div className="absolute inset-0 z-50" />

                    {/* 1. Global Talent (Large Left - 7 cols) */}
                    <SwissCard
                        title="Talent without borders."
                        subtitle="Global Reach"
                        icon={Globe}
                        className="md:col-span-7 border-r border-b-0 md:border-b border-white/10"
                    >
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-950/30 to-black overflow-hidden">
                            {/* World Map Image */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-40 mix-blend-screen">
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/World_map_blank_without_borders.svg/2000px-World_map_blank_without_borders.svg.png"
                                    alt="World Map"
                                    className="w-[120%] h-auto object-cover invert"
                                    loading="lazy"
                                />
                            </div>

                            {/* Overlay Animations (SVG) */}
                            <div className="absolute inset-0 w-full h-full">
                                <svg viewBox="0 0 1000 500" className="w-full h-full drop-shadow-2xl">
                                    <defs>
                                        <radialGradient id="hub-glow" cx="0.5" cy="0.5" r="0.5">
                                            <stop offset="0%" stopColor="#86efac" stopOpacity="1" />
                                            <stop offset="100%" stopColor="#86efac" stopOpacity="0" />
                                        </radialGradient>
                                        <linearGradient id="gradient-line-green" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="rgba(34, 197, 94, 0)" /> {/* Green-500 transparent */}
                                            <stop offset="50%" stopColor="#4ade80" /> {/* Green-400 */}
                                            <stop offset="100%" stopColor="rgba(34, 197, 94, 0)" />
                                        </linearGradient>
                                    </defs>

                                    {/* Connection Arcs - Geographically Aligned & Green */}
                                    {/* SF (160, 145) -> London (500, 107) */}
                                    <motion.path
                                        d="M100,50 Q330,20 500,107"
                                        fill="none"
                                        stroke="url(#gradient-line-green)"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        whileInView={{ pathLength: 1, opacity: 0.6 }}
                                        transition={{ duration: 2, repeat: Infinity, repeatType: "loop", ease: "easeInOut", repeatDelay: 1 }}
                                    />
                                    {/* London (500, 107) -> Tokyo (888, 150) */}
                                    <motion.path
                                        d="M500,107 Q700,20 850, 140"
                                        fill="none"
                                        stroke="url(#gradient-line-green)"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        whileInView={{ pathLength: 1, opacity: 0.6 }}
                                        transition={{ duration: 2.2, delay: 0.5, repeat: Infinity, repeatType: "loop", ease: "easeInOut", repeatDelay: 1 }}
                                    />
                                    {/* Sao Paulo (370, 315) -> London (500, 107) */}
                                    <motion.path
                                        d="M270,315 Q400,200 500,107"
                                        fill="none"
                                        stroke="url(#gradient-line-green)"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        whileInView={{ pathLength: 1, opacity: 0.4 }}
                                        transition={{ duration: 2.5, delay: 1, repeat: Infinity, repeatType: "loop", ease: "easeInOut", repeatDelay: 1 }}
                                    />
                                    {/* Sydney (920, 345) -> Tokyo (888, 150) */}
                                    <motion.path
                                        d="M950,370 Q950,250 850,140"
                                        fill="none"
                                        stroke="url(#gradient-line-green)"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        whileInView={{ pathLength: 1, opacity: 0.4 }}
                                        transition={{ duration: 2, delay: 0.8, repeat: Infinity, repeatType: "loop", ease: "easeInOut", repeatDelay: 1 }}
                                    />
                                    {/* SF (160, 145) -> Sao Paulo (370, 315) */}
                                    <motion.path
                                        d="M100,50 Q200,250 270,315"
                                        fill="none"
                                        stroke="url(#gradient-line-green)"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        whileInView={{ pathLength: 1, opacity: 0.3 }}
                                        transition={{ duration: 2.5, delay: 1.5, repeat: Infinity, repeatType: "loop", ease: "easeInOut", repeatDelay: 1 }}
                                    />

                                    {/* Glowing Hubs - Green & Static (No Hover) */}
                                    {[
                                        { cx: 100, cy: 50 }, // SF
                                        { cx: 500, cy: 107 }, // London
                                        { cx: 850, cy: 140 }, // Tokyo
                                        { cx: 950, cy: 370 }, // Sydney
                                        { cx: 270, cy: 315 }, // Sao Paulo
                                    ].map((dot, i) => (
                                        <g key={i}>
                                            <circle cx={dot.cx} cy={dot.cy} r="4" fill="url(#hub-glow)" opacity="0.8" />
                                            <circle cx={dot.cx} cy={dot.cy} r="1.5" fill="#fff" />
                                            <motion.circle
                                                cx={dot.cx}
                                                cy={dot.cy}
                                                r="8"
                                                fill="none"
                                                stroke="url(#hub-glow)"
                                                strokeWidth="0.5"
                                                initial={{ scale: 0.5, opacity: 1 }}
                                                animate={{ scale: 1.5, opacity: 0 }}
                                                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                                            />
                                        </g>
                                    ))}
                                </svg>
                            </div>
                        </div>
                    </SwissCard>

                    {/* 2. AI Analysis (Narrow Right - 5 cols) */}
                    <SwissCard
                        title="AI that listens between the lines."
                        subtitle="Intelligence"
                        icon={Sparkles}
                        className="md:col-span-5 border-b border-white/10"
                        delay={0.1}
                    >
                        <div className="absolute inset-0 p-8 flex flex-col justify-center gap-4 bg-gradient-to-br from-kinetic-primary/5 to-transparent">
                            {/* Data Visualization */}
                            <div className="space-y-4">
                                {['Confidence', 'Clarity', 'Technical Terminology'].map((label, i) => (
                                    <div key={label} className="space-y-1">
                                        <div className="flex justify-between text-xs uppercase tracking-wider text-gray-500 font-bold">
                                            <span>{label}</span>
                                            <span className="text-kinetic-primary">{90 - i * 5}%</span>
                                        </div>
                                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${90 - i * 5}%` }}
                                                transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                                                className="h-full bg-kinetic-primary"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </SwissCard>

                    {/* 3. Security (Narrow Left - 5 cols) - Swapped */}
                    <SwissCard
                        title="Identity Verified."
                        subtitle="Security"
                        icon={Scan}
                        className="md:col-span-5 border-r border-white/10"
                        delay={0.2}
                    >
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-tr from-green-900/10 to-transparent">
                            {/* Glass Container for Fingerprint */}
                            <div className="relative w-40 h-40 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl flex items-center justify-center overflow-hidden">

                                {/* Inner Glow */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />

                                {/* Fingerprint Image */}
                                <div className="w-24 h-24 opacity-80 invert filter mix-blend-screen">
                                    <img src={fingerprintImg} alt="Fingerprint" className="w-full h-full object-contain" loading="lazy" />
                                </div>

                                {/* Scan Line */}
                                <motion.div
                                    className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-green-400 to-transparent shadow-[0_0_15px_rgba(74,222,128,0.8)]"
                                    animate={{ top: ["0%", "100%"], opacity: [0, 1, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                />

                                {/* Corner Accents */}
                                <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-white/30 rounded-tl-lg" />
                                <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-white/30 rounded-tr-lg" />
                                <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-white/30 rounded-bl-lg" />
                                <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-white/30 rounded-br-lg" />
                            </div>
                        </div>
                    </SwissCard>

                    {/* 4. Instant Chat (Large Right - 7 cols) - Swapped */}
                    <SwissCard
                        title="Direct messaging, zero friction."
                        subtitle="Communication"
                        icon={MessageCircle}
                        className="md:col-span-7"
                        delay={0.3}
                    >
                        <div className="absolute inset-0 flex flex-col justify-center p-8 bg-black">
                            <div className="flex items-center justify-center gap-6 w-full px-4">
                                <div className="bg-white/10 p-4 rounded-3xl rounded-bl-sm text-sm text-gray-200 -rotate-3 origin-center shadow-lg backdrop-blur-sm border border-white/5">
                                    Create an interview next Tuesday?
                                </div>
                                <div className="bg-kinetic-primary p-4 rounded-3xl rounded-br-sm text-sm text-black font-medium rotate-2 origin-center shadow-lg transform translate-y-4">
                                    Perfect. 2 PM works.
                                </div>
                            </div>
                        </div>
                    </SwissCard>

                </div>

            </div>
        </section>
    );
};

export default BentoGrid;
