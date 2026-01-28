import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const testimonials = Array.from({ length: 28 }).map((_, i) => ({
    id: i,
    content: [
        "Revolutionary tool for our hiring process.",
        "The video reels changed everything.",
        "Simple, fast, and effective.",
        "Found our lead dev in 2 days.",
        "A game changer for HR.",
        "Best UI/UX in the industry.",
        "Support is incredible.",
        "Matching algorithm is spot on.",
    ][i % 8],
    author: `User ${i + 1}`,
    role: ["Founder", "HR Manager", "CTO", "Recruiter"][i % 4],
    rating: 5
}));

const GridMotion = () => {
    const gridRef = useRef(null);
    const rowRefs = useRef([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Entrance Animation: Staggered fade in
            gsap.from(".grid-card", {
                duration: 1,
                y: 100,
                opacity: 0,
                stagger: {
                    amount: 1.5,
                    grid: "auto",
                    from: "center",
                },
                ease: "power3.out",
                scrollTrigger: {
                    trigger: gridRef.current,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse"
                }
            });

            // Continuous Floating Motion (Parallax Columns)
            // Odd columns move up slightly, Even columns move down slightly on scroll
            // Note: Since we are using a grid, we can target items by nth-child logic for columns if we want column-specific motion,
            // but for a true "Grid Motion" feel, we'll animate rows or random items.
            // Let's create a subtle random floating effect for all cards to make it feel alive.

            gsap.to(".grid-card", {
                y: "random(-20, 20)",
                duration: "random(2, 4)",
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                stagger: {
                    amount: 2,
                    from: "random"
                }
            });

        }, gridRef);

        return () => ctx.revert();
    }, []);

    return (
        <section className="py-24 bg-kinetic-bg overflow-hidden">
            <div className="container mx-auto px-6">
                <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {testimonials.map((item, index) => (
                        <div
                            key={item.id}
                            className="grid-card p-6 rounded-2xl bg-kinetic-card border border-white/5 hover:border-white/20 transition-colors backdrop-blur-sm group"
                        >
                            <div className="flex gap-1 mb-4 text-kinetic-primary group-hover:text-white transition-colors">
                                {[...Array(item.rating)].map((_, i) => (
                                    <Star key={i} size={14} fill="currentColor" />
                                ))}
                            </div>
                            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                                "{item.content}"
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-700 to-gray-900 border border-white/10 flex items-center justify-center text-sm font-bold text-white">
                                    {item.author.charAt(0)}
                                </div>
                                <div>
                                    <div className="text-white text-xs font-bold">{item.author}</div>
                                    <div className="text-gray-500 text-[10px] uppercase tracking-wider">{item.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default GridMotion;
