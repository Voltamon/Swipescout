import React, { useEffect, useRef } from 'react';
import { Sparkles, Zap, Target, Users, ArrowUpRight, Briefcase } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Swipe } from '@mui/icons-material';

gsap.registerPlugin(ScrollTrigger);

const AboutSwipeScout = () => {
    const containerRef = useRef(null);
    const textRef = useRef(null);
    const stripRef = useRef(null); // Reference for the manifesto strip

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Text Highlight Effect
            gsap.from(".highlight-text", {
                scrollTrigger: {
                    trigger: textRef.current,
                    start: "top 80%",
                    end: "bottom 20%",
                    scrub: 1,
                },
                backgroundSize: "0% 100%",
                ease: "none"
            });

            // Manifesto Strip Scroll Animation
            gsap.to(stripRef.current, {
                xPercent: -23, // Move towards left
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top bottom", // Start when section enters viewport
                    end: "bottom top",   // End when section leaves viewport
                    scrub: 1,            // Link animation to scroll position
                }
            });
        });

        return () => ctx.revert();
    }, []);

    const stats = [
        { label: "AI-Powered", value: "98%", desc: "Proprietary Matching Engine" },
        { label: "Speed", value: "3x", desc: "Faster Hiring Process" },
        { label: "Precision", value: "95%", desc: "Candidate Match Rate" },
        { label: "Community", value: "5K+", desc: "Active Users Daily" }
    ];

    return (
        <section ref={containerRef} className="bg-zinc-950 text-white border-b border-t border-white/10">
            {/* Top Grid: Title and Intro */}
            <div className="grid grid-cols-1 lg:grid-cols-2 border-b border-white/10">
                <div className="p-6 md:p-12 lg:p-20 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-between min-h-[400px]">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#34D399] mb-4">
                            <div className="w-2 h-2 bg-[#34D399] rounded-full animate-pulse" />
                            About Us
                        </div>
                        <h2 className="text-5xl md:text-7xl lg:text-9xl font-bold tracking-tighter leading-[0.85] text-white">
                            SWIPE.<br />
                            CONNECT.<br />
                            <span className="text-[#34D399]">HIRE.</span>
                        </h2>
                    </div>
                    <div className="mt-12">
                        <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-colors cursor-pointer group">
                            <ArrowUpRight className="w-8 h-8 transition-transform group-hover:rotate-45 duration-500" />
                        </div>
                    </div>
                </div>

                <div className="p-6 md:p-12 lg:p-20 flex flex-col justify-center">
                    <p ref={textRef} className="text-2xl lg:text-4xl leading-tight font-light text-white/60">
                        <span className="text-white">SwipeScout</span> is not just a platform; it's a <span className="text-white font-medium">paradigm shift</span>.
                        We are stripping away the noise of traditional recruiting to focus on what matters: <span className="text-white font-medium">Human Potential</span>.
                        Powered by advanced AI, we connect talent to opportunity with the simplicity of a swipe.
                    </p>

                    <div className="mt-12 flex gap-8">
                        <div className="flex flex-col">
                            <span className="text-4xl font-bold text-white">01</span>
                            <span className="text-xs uppercase tracking-widest text-white/50 mt-1">Vision</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-4xl font-bold text-white">02</span>
                            <span className="text-xs uppercase tracking-widest text-white/50 mt-1">Mission</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-4xl font-bold text-white">03</span>
                            <span className="text-xs uppercase tracking-widest text-white/50 mt-1">Impact</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Grid: Stats */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-zinc-950 p-4 md:p-10 group hover:bg-white/5 transition-colors cursor-default">
                        <div className="flex justify-between items-start mb-4 md:mb-8">
                            <div className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-white/40 group-hover:text-[#34D399] transition-colors">{stat.label}</div>
                        </div>
                        <div className="text-3xl md:text-5xl font-bold mb-2 tracking-tight group-hover:scale-105 transition-transform duration-500 origin-left">{stat.value}</div>
                        <div className="text-xs md:text-sm text-white/50">{stat.desc}</div>
                    </div>
                ))}
            </div>

            {/* Manifesto Strip */}
            <div className="border-t border-white/10 overflow-hidden bg-[#34D399] text-black py-4">
                <div ref={stripRef} className="flex whitespace-nowrap">
                    {Array.from({ length: 15 }).map((_, i) => (
                        <div key={i} className="flex items-center mx-8">
                            <span className="text-2xl font-bold uppercase tracking-tighter">The Future of Hiring is Here</span>
                            <Swipe className="w-6 h-6 ml-6 fill-black" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AboutSwipeScout;
