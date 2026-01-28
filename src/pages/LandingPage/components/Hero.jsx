
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Play, TrendingUp, Users } from 'lucide-react';
import FloatingLines from '../../Teams/FloatingLines';

import KineticButton from './KineticButton';

import heroImage from '../../../assets/hero.png';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
    const containerRef = useRef(null);
    const textContainerRef = useRef(null);
    const cardsRef = useRef(null);

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
            {/* Background Gradient Orbs */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-kinetic-primary/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-kinetic-accent/10 rounded-full blur-[100px] animate-[pulse_8s_infinite]" />

            {/* Background Floating Lines */}
            <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
                <FloatingLines
                    linesGradient={['#34D399', '#059669']}
                    enabledWaves={["bottom"]}
                    lineCount={30}
                    lineDistance={200}
                    bendRadius={20}
                    bendStrength={0}
                    interactive={true}
                    parallax={true}
                />
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
                            <KineticButton>
                                Start Hiring <TrendingUp size={18} />
                            </KineticButton>
                        </div>
                        <div className="hero-fade-in">
                            <button className="px-8 py-3 rounded-full font-semibold text-white border border-white/10 hover:bg-white/5 transition-all flex items-center gap-2 justify-center">
                                <Play size={18} fill="currentColor" /> Watch Config
                            </button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="hero-fade-in pt-8 flex items-center gap-8 justify-start text-gray-500">
                        <div className="flex items-center gap-2">
                            <Users size={20} />
                            <span>10k+ Candidates</span>
                        </div>
                        <div className="w-px h-8 bg-white/10" />
                        <div className="flex items-center gap-2">
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-8 h-8 rounded-full bg-gray-700 border-2 border-kinetic-bg" />
                                ))}
                            </div>
                            <span>Trusted by Top Teams</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
