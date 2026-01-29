import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, ArrowUpRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Footer from '@/components/Headers/Footer';
import { useNavigate } from 'react-router-dom';
import { teamMembers } from '../../data/teamMembers';


gsap.registerPlugin(ScrollTrigger);

// Reuse the SwissCard aesthetic from BentoGrid but adapted for Team Members
const TeamCard = ({ children, className = '', name, role, social, image, delay = 0, size = "normal", onClick }) => (
    <motion.div
        onClick={onClick}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
        className={`
      bg-kinetic-card group relative overflow-hidden flex flex-col cursor-pointer
      border border-white/10 transition-all duration-500 hover:border-white/20 hover:shadow-2xl hover:shadow-kinetic-primary/10
      ${className}
    `}
    >
        {/* Subtle Grain Texture Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none" />

        {/* Hover Gradient Glow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br from-kinetic-primary/5 via-transparent to-transparent pointer-events-none" />

        {/* Content Container */}
        <div className="relative z-10 h-full flex flex-col">

            {/* Image Section */}
            <div className={`relative overflow-hidden w-full bg-black/50 aspect-square md:aspect-auto ${size === 'medium' ? 'md:h-[80%]' : 'md:aspect-square'}`}>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 opacity-80" />
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter grayscale-0 group-hover:grayscale"
                />


            </div>

            {/* Text Content */}
            <div className="p-6 md:p-8 flex-1 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent mt-[-100px] z-20">
                <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
                    <span className="inline-block px-3 py-1 mb-3 text-xs font-bold tracking-[0.2em] uppercase text-kinetic-primary bg-kinetic-primary/10 rounded-full border border-kinetic-primary/20">
                        {role}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-2">
                        {name}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed max-w-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 h-0 group-hover:h-auto overflow-hidden">
                        {children}
                    </p>
                </div>
            </div>

            {/* Corner Accent */}
            <div className="absolute bottom-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <ArrowUpRight className="text-kinetic-primary w-6 h-6" />
            </div>
        </div>
    </motion.div>
);

const TeamsPage = () => {
    const headerRef = useRef(null);
    const networkRef = useRef(null);

    useEffect(() => {
        document.documentElement.classList.add('dark');

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

            gsap.from(networkRef.current, {
                opacity: 0,
                scale: 0.9,
                y: 30,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: networkRef.current,
                    start: "top 85%",
                }
            });
        });

        return () => ctx.revert();
    }, []);

    const navigate = useNavigate();

    return (
        <main className="min-h-screen bg-kinetic-bg text-white overflow-x-hidden selection:bg-kinetic-primary selection:text-white pb-32 relative">
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-50"></div>

            <div className="container mx-auto px-6 pt-32 mb-20">
                {/* Editorial Header */}
                <div ref={headerRef} className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end border-b border-white/10 pb-12 mb-16">
                    <div className="md:col-span-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-widest text-gray-400 mb-6">
                            <span className="w-2 h-2 rounded-full bg-kinetic-primary animate-pulse"></span>
                            SwipeScout Team
                        </div>
                        <h1 className="text-5xl md:text-7xl lg:text-9xl font-bold tracking-tighter leading-[0.9]">
                            <span className="text-white">The</span> <span className="text-kinetic-primary">Builders.</span>
                        </h1>
                    </div>
                    <div className="md:col-span-4 text-left md:text-right pb-2">
                        <p className="text-lg text-gray-400 max-w-xs ml-auto">
                            A diverse group of visionaries, engineers, and creatives united by a single mission.
                        </p>
                    </div>
                </div>

                {/* Bento Grid Layout - Builders */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(300px,auto)]">

                    {/* Member 0: CEO (2x2) - Top Left */}
                    <TeamCard
                        {...teamMembers[0]}
                        className="md:col-span-2 md:row-span-2 md:min-h-[500px]"
                        onClick={() => navigate(`/teams/${teamMembers[0].id}`)}
                    >
                        {teamMembers[0].bio}
                    </TeamCard>

                    {/* Member 1: CFO (1x1) - Top Right */}
                    <TeamCard
                        {...teamMembers[1]}
                        className="md:col-span-1 md:row-span-1"
                        delay={0.1}
                        onClick={() => navigate(`/teams/${teamMembers[1].id}`)}
                    >
                        {teamMembers[1].bio}
                    </TeamCard>

                    {/* Member 2: CTO (1x2) - Middle Right (Under CFO) */}
                    <TeamCard
                        {...teamMembers[2]}
                        className="md:col-span-1 md:row-span-2"
                        delay={0.2}
                        onClick={() => navigate(`/teams/${teamMembers[2].id}`)}
                    >
                        {teamMembers[2].bio}
                    </TeamCard>

                    {/* Member 3: CMO (1x1) - Bottom Left */}
                    <TeamCard
                        {...teamMembers[3]}
                        className="md:col-span-1 md:row-span-1"
                        delay={0.3}
                        onClick={() => navigate(`/teams/${teamMembers[3].id}`)}
                    >
                        {teamMembers[3].bio}
                    </TeamCard>

                    {/* Member 4: COO (1x1) - Bottom Middle */}
                    <TeamCard
                        {...teamMembers[4]}
                        className="md:col-span-1 md:row-span-1"
                        delay={0.4}
                        onClick={() => navigate(`/teams/${teamMembers[4].id}`)}
                    >
                        {teamMembers[4].bio}
                    </TeamCard>

                </div>

                {/* Network Section Divider */}
                <div className="py-24 flex items-center gap-8 max-w-full overflow-hidden">
                    <div className="h-px bg-gradient-to-r from-transparent via-white/40 to-white/10 flex-1" />
                    <span ref={networkRef} className="text-4xl md:text-8xl font-bold tracking-tighter uppercase text-white whitespace-nowrap">
                        <span className="text-white">The </span><span className="text-[#34D399]">Network</span>
                    </span>
                    <div className="h-px bg-gradient-to-l from-transparent via-white/40 to-white/10 flex-1" />
                </div>

                {/* Network Members Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[minmax(300px,auto)]">
                    {/* Remaining Members */}
                    {teamMembers.slice(5).map((member, i) => (
                        <TeamCard
                            key={i}
                            {...member}
                            className="md:col-span-1 md:row-span-1"
                            delay={0.1 + (i * 0.1)}
                            onClick={() => navigate(`/teams/${member.id}`)}
                        >
                            {member.bio}
                        </TeamCard>
                    ))}

                    {/* Join Us Card */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                        className="md:col-span-1 md:row-span-1 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex flex-col items-center justify-center p-8 text-center group cursor-pointer"
                    >
                        <div className="w-16 h-16 rounded-full border border-dashed border-white/30 flex items-center justify-center mb-4 group-hover:border-kinetic-primary group-hover:text-kinetic-primary transition-colors">
                            <span className="text-2xl">+</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Join the Team</h3>
                        <p className="text-sm text-gray-500 mb-4">We are always looking for exceptional talent.</p>
                        <span className="text-kinetic-primary text-sm font-bold uppercase tracking-widest group-hover:underline decoration-kinetic-primary underline-offset-4">View Openings</span>
                    </motion.div>

                </div>
            </div>

            <Footer />
        </main>
    );
};

export default TeamsPage;
