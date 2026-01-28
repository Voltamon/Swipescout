import React, { useState, useEffect, useRef } from 'react';
import { UserPlus, Video, HeartHandshake, Briefcase, ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const steps = [
    {
        id: 1,
        title: "Create Profile",
        desc: "Sign up in seconds. Builders get a portfolio, companies get a dashboard.",
        icon: UserPlus,
        image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 2,
        title: "Record or Upload",
        desc: "Showcase your skills. Record a 60s intro or upload your best work clips.",
        icon: Video,
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 3,
        title: "Swipe & Connect",
        desc: "AI suggests the best fits. Swipe right to connect and start chatting.",
        icon: HeartHandshake,
        image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 4,
        title: "Get Hired",
        desc: "Sign the offer and start your new journey. Fast, transparent, and seamless.",
        icon: Briefcase,
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
    }
];

const HowItWorks = () => {
    const [activeId, setActiveId] = useState(1);
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
        });
        return () => ctx.revert();
    }, []);

    // Auto-cycle through accordions every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveId(prev => prev === 4 ? 1 : prev + 1);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="hidden md:block py-24 bg-kinetic-bg relative overflow-hidden">
            {/* Background Elements - Subtle monochrome grain/glow instead of purple */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-[120px]" />

            <div className="container mx-auto px-6 relative z-10 w-full">
                <div ref={headerRef} className="mb-24 flex flex-col items-center">
                    <h2 className="text-5xl md:text-8xl font-bold text-center text-white tracking-tighter leading-[0.9] mb-8">
                        <span className="text-white">How it </span><span className="text-[#34D399]">Works.</span>
                    </h2>
                    {/* Visual Bar Divider */}
                    <div className="w-24 h-2 bg-white/20 rounded-full" />
                </div>

                <div className="flex flex-col md:flex-row gap-3 md:gap-4 h-auto md:h-[907px] w-full mx-auto">
                    {steps.map((step) => {
                        const isActive = activeId === step.id;
                        return (
                            <div
                                key={step.id}
                                onClick={() => setActiveId(step.id)}
                                className={`
                                    relative overflow-hidden rounded-none transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer
                                    ${isActive
                                        ? 'md:flex-[3] h-auto md:h-full bg-kinetic-card border border-white/20'
                                        : 'md:flex-[1] h-auto md:h-full bg-kinetic-card/30 border border-white/5 hover:border-white/10 hover:bg-kinetic-card/50'
                                    }
                                `}
                            >
                                {/* Active Background Gradient - Monochrome */}
                                <div className={`absolute inset-0 bg-gradient-to-b from-transparent to-white/5 transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`} />

                                <div className="absolute inset-0 flex flex-col md:flex-row">

                                    {/* Sidebar Area: Icon + Vertical Title (Always Visible) */}
                                    <div className="md:w-24 h-full flex md:flex-col items-center justify-between md:justify-start p-4 md:p-6 md:py-12 gap-4 md:gap-8 z-20">

                                        {/* Icon */}
                                        <div className={`
                                            shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500
                                            ${isActive
                                                ? 'bg-[#34D399] text-black scale-110'
                                                : 'bg-white/5 text-gray-400 group-hover:bg-white/10 group-hover:text-white'
                                            }
                                        `}>
                                            <step.icon size={24} />
                                        </div>

                                        {/* Helper for text rotation container */}
                                        <div className="relative flex-1 hidden md:flex items-center justify-center min-h-[200px]">
                                            <h3 className={`
                                                text-2xl font-bold tracking-wider uppercase whitespace-nowrap
                                                absolute rotate-[-90deg] origin-center
                                                transition-colors duration-300
                                                ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}
                                             `}>
                                                {step.title}
                                            </h3>
                                        </div>

                                        {/* Mobile Only Title (Horizontal) */}
                                        <h3 className="text-xl font-bold text-white md:hidden ml-4">
                                            {step.title}
                                        </h3>

                                        <div className="md:hidden ml-auto">
                                            <ArrowRight className={`transition-transform duration-300 ${isActive ? 'rotate-90 text-white' : 'text-gray-500'}`} />
                                        </div>
                                    </div>

                                    {/* Content Area (Description) - Desktop: Only visible when active */}
                                    <div className={`
                                        relative flex-1 h-full flex flex-col justify-center p-8 md:pl-0 z-10
                                        transition-all duration-700 delay-100
                                        ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 hidden md:flex'}
                                    `}>
                                        <div className="max-w-md hidden md:block">
                                            {/* Image */}
                                            <div className="w-full aspect-square mb-6 rounded-lg overflow-hidden border border-white/10 relative group-hover:border-kinetic-primary/50 transition-colors">
                                                <img
                                                    src={step.image}
                                                    alt={step.title}
                                                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                            </div>

                                            <h3 className="text-3xl font-bold text-white mb-6 leading-tight">
                                                {step.title}
                                            </h3>
                                            <p className="text-gray-400 text-lg leading-relaxed">
                                                {step.desc}
                                            </p>


                                        </div>

                                        {/* Mobile Content */}
                                        <div className={`md:hidden overflow-hidden transition-all duration-500 ${isActive ? 'max-h-[800px] mt-1 opacity-100' : 'max-h-0 opacity-0'}`}>
                                            {/* Image for Mobile */}
                                            <div className="w-full aspect-video mb-4 rounded-lg overflow-hidden border border-white/10 relative">
                                                <img
                                                    src={step.image}
                                                    alt={step.title}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                            </div>
                                            <p className="text-gray-400 text-lg leading-relaxed">
                                                {step.desc}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
