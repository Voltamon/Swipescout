import Footer from '@/components/Headers/Footer';
import React, { useEffect, useRef } from 'react';
import Hero from './components/Hero';
import BentoGrid from './components/BentoGrid';
import HowItWorks from './components/HowItWorks';
import TiltedCTA from './components/TiltedCTA';

import Masonry from './components/Masonry';
import TakePeek from './components/TakePeek';
import AboutSwipeScout from './components/AboutSwipeScout';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
    const dividerRef = useRef(null);

    // Force dark mode on mount and setup animations
    useEffect(() => {
        document.documentElement.classList.add('dark');

        const ctx = gsap.context(() => {
            // Divider Text Animation
            gsap.from(dividerRef.current, {
                opacity: 0,
                scale: 0.9,
                y: 30,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: dividerRef.current,
                    start: "top 85%",
                }
            });
        });

        return () => {
            // Optional: Remove if other pages shouldn't be dark
            // document.documentElement.classList.remove('dark');
            ctx.revert();
        };
    }, []);

    return (
        <main className="min-h-screen bg-kinetic-bg text-white overflow-x-hidden selection:bg-kinetic-primary selection:text-white pb-32">
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-50"></div>



            <Hero />
            <AboutSwipeScout />
            <TakePeek />
            <BentoGrid />
            <HowItWorks />

            {/* Testimonials Header - Editorial Style */}
            <div className="container mx-auto px-6 mb-12 mt-32">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end border-b border-white/10 pb-12">
                    <div className="md:col-span-8">
                        <h2 className="text-6xl md:text-8xl font-bold text-white tracking-tighter leading-[0.9]">
                            People<br />
                            <span className="text-[#34D399]">Testimonials.</span>
                        </h2>
                    </div>
                </div>
            </div>

            <Masonry />

            {/* Divider Section */}
            <div className="py-24 flex items-center gap-8 container mx-auto px-6 max-w-full overflow-hidden">
                <div className="h-px bg-gradient-to-r from-transparent via-white/40 to-white/10 flex-1" />
                <span ref={dividerRef} className="text-4xl md:text-8xl font-bold tracking-tighter uppercase text-white whitespace-nowrap">
                    <span className="text-white">The </span><span className="text-[#34D399]">Future</span><span className="text-white"> is Here</span>
                </span>
                <div className="h-px bg-gradient-to-l from-transparent via-white/40 to-white/10 flex-1" />
            </div>

            <TiltedCTA />

            {/* Footer */}
            <footer className="py-12 border-t border-white/10 text-center text-gray-500 text-sm">
                <p>© 2026 SwipeScout Inc. The future of hiring.</p>
            </footer>
        </main>
    );
};

export default LandingPage;
