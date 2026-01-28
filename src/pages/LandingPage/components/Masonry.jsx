import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';

const personas = [
    {
        name: "Kazimir Volkov",
        role: "Product Designer",
        content: "SwipeScout's visual-first approach is exactly what the industry needed. As a designer, my portfolio speaks louder than my resume, and this platform puts it front and center.",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    },
    {
        name: "Kenjiro Sado",
        role: "Frontend Dev",
        content: "I landed three interviews in my first week. The video intro allowed me to showcase my communication skills alongside my GitHub profile. A total game changer.",
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    },
    {
        name: "Zahra El-Baz",
        role: "Content Creator",
        content: "Finally, a hiring platform that understands the creator economy. Using video reels to pitch my brand partnerships experience felt natural and effective.",
        avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    },
    {
        name: "Ciro Vantucci",
        role: "Business Dev",
        content: "Speed is everything in sales. SwipeScout connected me with high-growth startups looking for closers immediately. No time wasted on lengthy applications.",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    },
    {
        name: "Liora Haze",
        role: "Software Engineer",
        content: "The matching algorithm is surprisingly accurate. I only saw roles that actually fit my tech stack and career goals. It saved me hours of scrolling.",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    },
    {
        name: "Kwame Zindzi",
        role: "Founder",
        content: "We built our core team specifically using SwipeScout. The ability to see a candidate's personality before the first call streamlined our vetting process immensely.",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    },
    {
        name: "Sunja Pak",
        role: "Marketing Director",
        content: "SwipeScout feels modern and dynamic. It attracts the kind of forward-thinking talent we want at our agency. Traditional job boards feel obsolete now.",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    },
    {
        name: "Anders Vinter",
        role: "Full Stack Dev",
        content: "Simple, fast, and effective. I love that I can swipe through opportunities on my phone. It makes job hunting feel less like a chore.",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    },
    {
        name: "Valeria Solis",
        role: "Recruiter",
        content: "As a recruiter, this tool is invaluable. Seeing a candidate's presentation style upfront helps me place them in the right culture much faster.",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    },
    {
        name: "Breccan Vane",
        role: "CTO",
        content: "The quality of engineering talent here is top-tier. We successfully hired a Lead Architect who we wouldn't have found on generic platforms.",
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    },
    {
        name: "Priya Varma",
        role: "UX Researcher",
        content: "I appreciate the transparency. Matches are bidirectional, so I know the companies I'm talking to are genuinely interested in my specific profile.",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    },
    {
        name: "Dmitri Krov",
        role: "Product Manager",
        content: "Finding a role that aligns with my product philosophy was easy. The video prompts help highlight strategic thinking in a way resumes can't.",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    },
    {
        name: "Elodie Vane",
        role: "Social Media Mgr",
        content: "Visual storytelling is my job, and SwipeScout lets me demonstrate that skills from day one. It's the perfect platform for creative professionals.",
        avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    },
    {
        name: "Soren Kael",
        role: "Backend Engineer",
        content: "Efficient and devoid of noise. I can focus on companies using the tech stack I love without filtering through hundreds of irrelevant listings.",
        avatar: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    },
    {
        name: "Luciana Vega",
        role: "HR Specialist",
        content: "It has simplified our screening process significantly. We can assess soft skills instantly, which are crucial for our client-facing roles.",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    },
    {
        name: "Renato Vim",
        role: "Mobile Dev",
        content: "The mobile app experience is buttery smooth. It's refreshing to use a job search app that feels as polished as the apps I build.",
        avatar: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    },
    {
        name: "Freya Strome",
        role: "Copywriter",
        content: "Words are my trade, but the video element added a new dimension to my applications. It helped me land a great gig at a top agency.",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    },
    {
        name: "Zephyr Kade",
        role: "Data Scientist",
        content: "I found a remote role with a great culture. The platform gave me a good sense of the company vibe before I even applied.",
        avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    },
    {
        name: "Nala Zuri",
        role: "Sales Director",
        content: "Recruiting for sales teams is tough. SwipeScout helped us find candidates with the right energy and drive much faster than traditional methods.",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    },
    {
        name: "Magnus Steele",
        role: "DevOps Eng",
        content: "Straightforward and effective. I connected with a tech lead directly and skipped the usual HR hurdles. Highly recommended for senior engineers.",
        avatar: "https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    }
];

const testimonials = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    // Cycle through personas to fill the cards
    items: Array.from({ length: 5 }).map((__, j) => {
        const personaIndex = (i + j * 3) % personas.length;
        return {
            ...personas[personaIndex],
            // Add a unique ID for React keys if needed inside sub-components
            uniqueId: `${i}-${j}`
        };
    }),
    size: ['large', 'medium', 'small', 'medium'][i % 4]
}));

const getHeightClass = (size) => {
    if (size === 'large') return 'h-80';
    if (size === 'medium') return 'h-72';
    return 'h-60';
};

const FlipCard = ({ item, index }) => {
    const [rotation, setRotation] = useState(0);
    const [frontIndex, setFrontIndex] = useState(0);
    const [backIndex, setBackIndex] = useState(1);
    const [isAnimating, setIsAnimating] = useState(false);

    const handleFlip = () => {
        if (!isAnimating) {
            setRotation(prev => prev + 180);
            setIsAnimating(true);
        }
    };

    const handleAnimationComplete = () => {
        setIsAnimating(false);
        // If we just flipped to Back (180, 540...), update Front for next time
        // If we just flipped to Front (360, 720...), update Back for next time

        const isBackVisible = (rotation % 360) === 180;

        if (isBackVisible) {
            // Back is now visible, update Front to be the next item (current back + 1)
            setFrontIndex((backIndex + 1) % 5);
        } else {
            // Front is now visible, update Back to be the next item (current front + 1)
            setBackIndex((frontIndex + 1) % 5);
        }
    };

    return (
        <div
            className={`flip-card relative group cursor-pointer perspective-1000 ${getHeightClass(item.size)}`}
            onClick={handleFlip}
            style={{ zIndex: isAnimating ? 50 : 'auto' }}
        >
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                    opacity: { duration: 0.5, delay: index * 0.05 },
                    y: { duration: 0.5, delay: index * 0.05 },
                    rotateX: { duration: 0.6, ease: "easeInOut" } // Slower flip for elegance
                }}
                animate={{ rotateX: rotation }}
                onAnimationComplete={handleAnimationComplete}
                style={{ transformStyle: "preserve-3d", willChange: "transform" }}
                className="w-full h-full relative"
            >
                {/* Front Face */}
                <div
                    className="absolute inset-0 backface-hidden rounded-none bg-kinetic-card border border-white/5 group-hover:border-white/20 transition-colors backdrop-blur-sm flex flex-col"
                    style={{ backfaceVisibility: 'hidden', transform: "translateZ(1px)" }}
                >
                    <CardContent data={item.items[frontIndex]} />
                </div>

                {/* Back Face - Rotated 180deg around X axis */}
                <div
                    className="absolute inset-0 backface-hidden rounded-none bg-zinc-950 border border-white/10 transition-colors flex flex-col"
                    style={{ backfaceVisibility: 'hidden', transform: "rotateX(180deg) translateZ(1px)" }}
                >
                    <CardContent data={item.items[backIndex]} isBack />
                </div>
            </motion.div>
        </div >
    );
};

const CardContent = ({ data, isBack }) => (
    <div className="flex flex-row h-full relative overflow-hidden group">

        {/* Background Hover Image */}
        <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute inset-0 bg-black/60 z-10" />
            <img
                src={data.avatar}
                alt=""
                className="w-full h-full object-cover opacity-0 group-hover:opacity-30 transition-opacity duration-700 transform scale-110 group-hover:scale-100 filter grayscale"
            />
        </div>

        {/* Vertical Stripe for Role (Left Side) */}
        <div className={`w-12 h-full border-r border-white/5 flex flex-col items-center justify-center py-4 relative overflow-hidden transition-colors duration-500 z-20 bg-[#34D399]`}>
            <div className="absolute inset-0 flex flex-col items-center justify-center -rotate-180" style={{ writingMode: 'vertical-rl' }}>
                <span className={`text-[10px] uppercase tracking-widest font-bold opacity-80 whitespace-nowrap text-white`}>
                    {data.role}
                </span>
            </div>
        </div>

        {/* Content Area (Right Side) */}
        <div className="flex-1 flex flex-col p-6 min-w-0 justify-center relative z-20">
            {/* Profile Picture */}
            <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg border border-white/10 shrink-0 mb-4 bg-zinc-900">
                <img
                    src={data.avatar}
                    alt={data.name}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Name */}
            <div className={`text-base font-bold mb-2 text-white`}>
                {data.name}
            </div>

            {/* Quote */}
            <div>
                <p className={`text-sm leading-relaxed text-gray-400 group-hover:text-gray-200 transition-colors`}>
                    "{data.content}"
                </p>
            </div>
        </div>
    </div>
);

const Masonry = () => {
    const [columns, setColumns] = useState(3);

    useEffect(() => {
        const updateColumns = () => {
            if (window.innerWidth < 640) setColumns(1);
            else if (window.innerWidth < 1024) setColumns(2);
            else setColumns(3);
        };

        updateColumns();
        window.addEventListener('resize', updateColumns);
        return () => window.removeEventListener('resize', updateColumns);
    }, []);

    const distributedColumns = useMemo(() => {
        const cols = Array.from({ length: columns }, () => []);
        // Limit to 5 cards on mobile (1 column), show all otherwise
        const activeTestimonials = columns === 1 ? testimonials.slice(0, 5) : testimonials;

        activeTestimonials.forEach((item, i) => {
            cols[i % columns].push(item);
        });
        return cols;
    }, [columns]);

    // Auto-flip 2 random cards from different columns every 3 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            // Create a map of card index to column index
            const cardToColumn = {};
            let cardIndex = 0;
            distributedColumns.forEach((col, colIndex) => {
                col.forEach(() => {
                    cardToColumn[cardIndex] = colIndex;
                    cardIndex++;
                });
            });

            // Get all card indices
            const allCardIndices = Object.keys(cardToColumn).map(Number);

            if (allCardIndices.length < 2) return;

            // Select first random card
            const firstCard = allCardIndices[Math.floor(Math.random() * allCardIndices.length)];
            const firstColumn = cardToColumn[firstCard];

            // Select second random card from a different column
            const eligibleCards = allCardIndices.filter(idx => cardToColumn[idx] !== firstColumn);

            if (eligibleCards.length === 0) return;

            const secondCard = eligibleCards[Math.floor(Math.random() * eligibleCards.length)];

            // Trigger flip on these cards by dispatching custom events
            const cards = document.querySelectorAll('.flip-card');
            if (cards[firstCard]) cards[firstCard].click();
            if (cards[secondCard]) cards[secondCard].click();
        }, 3000);

        return () => clearInterval(interval);
    }, [distributedColumns]);

    return (
        <section className="py-24 bg-kinetic-bg overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex gap-6 items-start">
                    {distributedColumns.map((col, colIndex) => (
                        <div key={colIndex} className="flex-1 flex flex-col gap-6">
                            {col.map((item, itemIndex) => (
                                <FlipCard key={item.id} item={item} index={itemIndex} />
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .perspective-1000 { perspective: 1000px; }
                .backface-hidden { backface-visibility: hidden; }
            `}</style>
        </section>
    );
};

export default Masonry;
