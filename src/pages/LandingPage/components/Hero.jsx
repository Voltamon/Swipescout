
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Play, TrendingUp, Users } from 'lucide-react';


import KineticButton from './KineticButton';
import logo from '../../../assets/logo.png';



gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
    const containerRef = useRef(null);
    const textContainerRef = useRef(null);
    const cardsRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                defaults: { ease: "power3.out" }
            });

            // Set initial states
            gsap.set(".hero-badge-reveal", { y: "100%" });
            gsap.set(".hero-title-reveal", { y: "100%" }); // Added this based on the animation logic
            gsap.set(".hero-desc-reveal", { y: "100%" }); // Added this based on the animation logic
            gsap.set(".hero-fade-in", { opacity: 0, y: 20 });
            gsap.set(cardsRef.current, { x: 100, opacity: 0 });

            // 1. Badge Reveal
            tl.to(".hero-badge-reveal", {
                y: "0%",
                duration: 0.8,
            })
                // 2. Main Title Reveal
                .to(".hero-title-reveal", {
                    y: "0%",
                    duration: 1,
                    stagger: 0.1,
                }, "-=0.6")
                // 3. Description Reveal
                .to(".hero-desc-reveal", {
                    y: "0%",
                    duration: 0.8,
                    stagger: 0.05,
                }, "-=0.8")
                // 4. Cards Entrance (Synced with text)
                .to(cardsRef.current, {
                    x: 0,
                    opacity: 1,
                    duration: 1.2,
                    ease: "power2.out"
                }, "-=1")
                // 5. Buttons & Stats Fade In
                .to(".hero-fade-in", {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.1,
                }, "-=0.8");

            // Floating animation for cards (separate from timeline)
            gsap.to('.hero-card', {
                y: -15,
                duration: 2.5,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={containerRef}
            className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-kinetic-bg"
        >
            {/* Background Kinetic Field (CSS - No Three.js) */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {/* 1. Ambient Living Orbs */}
                <div className="absolute top-[-20%] left-[20%] w-[400px] h-[400px] bg-kinetic-primary/20 rounded-full blur-[100px] animate-blob mix-blend-screen" />
                <div className="absolute top-[20%] right-[-10%] w-[300px] h-[300px] bg-kinetic-accent/15 rounded-full blur-[80px] animate-blob animation-delay-2000 mix-blend-screen" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-kinetic-primary/10 rounded-full blur-[120px] animate-blob animation-delay-4000 mix-blend-screen" />

                {/* 2. Technical Grid Overlay */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                <div className="absolute inset-0"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                                    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)`,
                        backgroundSize: '40px 40px',
                        maskImage: 'radial-gradient(circle at 50% 50%, black, transparent 80%)'
                    }}
                />

                {/* 3. Scanning Line Animation */}
                <div className="absolute inset-0 w-full h-[2px] bg-gradient-to-r from-transparent via-kinetic-primary/50 to-transparent animate-scan opacity-30 shadow-[0_0_15px_rgba(52,211,153,0.3)]"></div>

                {/* 4. Floating Particles (Simple CSS) */}
                <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white/40 rounded-full animate-float" />
                <div className="absolute top-3/4 right-1/3 w-1.5 h-1.5 bg-kinetic-accent/40 rounded-full animate-float-delayed" />
                <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-kinetic-primary/40 rounded-full animate-float animation-delay-2000" />
            </div>

            <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center relative z-10 pt-20 min-h-[80vh]">

                {/* Text Content */}
                <div ref={textContainerRef} className="text-left space-y-8 flex-1 z-20">
                    {/* Badge */}
                    <div className="overflow-hidden">
                        <div className="hero-badge-reveal inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300">
                            <span className="w-2 h-2 rounded-full bg-kinetic-accent animate-pulse" />
                            The Future of Recruitment is Here
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="font-bold text-white leading-tight tracking-tight overflow-hidden">
                        <div className="hero-title-reveal text-5xl md:text-7xl lg:text-9xl block mb-4 origin-bottom-left">SwipeScout</div>
                    </h1>

                    {/* Description */}
                    <div className="text-2xl text-gray-400 max-w-2xl space-y-2">
                        <div className="overflow-hidden">
                            <div className="hero-desc-reveal">
                                <span className="text-white font-medium">7 seconds.</span> That's how long a recruiter looks at a PDF.
                            </div>
                        </div>
                        <div className="overflow-hidden">
                            <div className="hero-desc-reveal">
                                Stop being a keyword. Start being a person.
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-start">
                        <div className="hero-fade-in">
                            <KineticButton onClick={() => navigate('/waitlist')}>
                                Join Waitlist <TrendingUp size={18} />
                            </KineticButton>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="hero-fade-in pt-8 flex items-center gap-8 justify-start text-gray-500">
                        <div className="flex items-center gap-2">
                            <Users size={20} />
                            <span>5k+ Candidates</span>
                        </div>
                        <div className="w-px h-8 bg-white/10" />
                        <div className="flex items-center gap-2">
                            <div className="flex -space-x-4">
                                {[
                                    "https://logo.clearbit.com/google.com",
                                    "https://logo.clearbit.com/microsoft.com",
                                    "https://logo.clearbit.com/spotify.com",
                                    "https://logo.clearbit.com/airbnb.com"
                                ].map((logoUrl, i) => (
                                    <div key={i} className="w-10 h-10 rounded-full bg-white border border-white/10 flex items-center justify-center overflow-hidden p-1.5 shadow-lg relative z-0 hover:z-10 transition-all hover:scale-110">
                                        <img src={logoUrl} alt="Company Logo" className="w-full h-full object-contain filter grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100" />
                                    </div>
                                ))}
                            </div>
                            <span>Trusted by Top Teams</span>
                        </div>
                    </div>

                </div>

                {/* Hero Visual (Logo) */}
                <div className="flex-1 flex justify-center lg:justify-end relative z-20 mt-12 lg:mt-0">
                    <div className="relative w-[280px] md:w-[450px] lg:w-[600px] aspect-square animate-float">
                        <div className="absolute inset-0 bg-gradient-to-tr from-kinetic-primary/20 to-transparent rounded-full blur-[100px] -z-10" />
                        <img
                            src={logo}
                            alt="SwipeScout Logo"
                            className="w-full h-full object-contain drop-shadow-[0_0_50px_rgba(16,185,129,0.3)] hover:scale-105 transition-transform duration-700 ease-out"
                        />
                    </div>
                </div>
            </div>
        </section >
    );
};

export default Hero;
