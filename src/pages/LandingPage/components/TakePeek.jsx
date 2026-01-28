
import React, { useEffect, useRef, useState } from 'react';
import { Heart, MessageCircle, Send, Bookmark } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import resume1 from '../../../assets/resumes/resume1.mp4';
import resume2 from '../../../assets/resumes/resume2.mp4';
import resume3 from '../../../assets/resumes/resume3.mp4';
import resume4 from '../../../assets/resumes/resume4.mp4';
import resume5 from '../../../assets/resumes/resume5.mp4';
import resume6 from '../../../assets/resumes/resume6.mp4';

gsap.registerPlugin(ScrollTrigger);

const resumeData = [
    {
        id: 1,
        video: resume1,
        name: "Abril",
        role: "Product Designer",
        company: "TechFlow",
        likes: "1.2k",
        comments: "45",
        shares: "12",
        avatarId: '1573496359142-b8d87734a5a2'
    },
    {
        id: 2,
        video: resume2,
        name: "Nassma Bendriss",
        role: "Frontend Developer",
        company: "Creative Inc",
        likes: "892",
        comments: "32",
        shares: "8",
        avatarId: '1560250097-0b93528c311a'
    },
    {
        id: 3,
        video: resume3,
        name: "Colleen Yu",
        role: "Marketing Manager",
        company: "GrowthHacker",
        likes: "2.1k",
        comments: "120",
        shares: "45",
        avatarId: '1573497019940-1c28c88b4f3e'
    },
    {
        id: 4,
        video: resume4,
        name: "Q Froost",
        role: "Data Scientist",
        company: "DataMind",
        likes: "567",
        comments: "15",
        shares: "5",
        avatarId: '1506794778202-cad84cf45f1d'
    },
    {
        id: 5,
        video: resume5,
        name: "Sasha Purdy",
        role: "UX Researcher",
        company: "UserFirst",
        likes: "1.5k",
        comments: "89",
        shares: "24",
        avatarId: '1535713875002-d1d0cf377fde'
    },
    {
        id: 6,
        video: resume6,
        name: "Balqis Shaaqish",
        role: "Software Engineer",
        company: "CodeBase",
        likes: "3.4k",
        comments: "210",
        shares: "86",
        avatarId: '1507003211169-0a1dd7228f2d'
    }
];

const TakePeek = () => {
    const headerRef = useRef(null);
    const [selectedResumes, setSelectedResumes] = useState([]);

    useEffect(() => {
        // Randomly select 3 unique resumes
        const shuffled = [...resumeData].sort(() => 0.5 - Math.random());
        setSelectedResumes(shuffled.slice(0, 3));

        const ctx = gsap.context(() => {
            gsap.from(headerRef.current, {
                opacity: 0,
                scale: 0.9,
                y: 30,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: headerRef.current,
                    start: "top 85%",
                }
            });
        });
        return () => ctx.revert();
    }, []);

    return (
        <section className="py-24 bg-kinetic-bg relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-[120px]" />

            <div className="container mx-auto px-6 relative z-10">
                {/* Divider-style Header */}
                <div className="py-24 flex items-center gap-8 max-w-full overflow-hidden mb-16">
                    <div className="h-px bg-gradient-to-r from-transparent via-white/40 to-white/10 flex-1" />
                    <span ref={headerRef} className="text-4xl md:text-8xl font-bold tracking-tighter uppercase text-white whitespace-nowrap">
                        <span className="text-white">Take a </span><span className="text-[#34D399]">Peek</span>
                    </span>
                    <div className="h-px bg-gradient-to-l from-transparent via-white/40 to-white/10 flex-1" />
                </div>

                {/* Reel Interview Screens - Full Width */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {selectedResumes.map((resume, index) => (
                        <div key={resume.id} className="flex flex-col items-center">
                            {/* Strict Rectangle Screen - No Rounded Edges */}
                            <div className="w-full aspect-[9/16] bg-kinetic-card overflow-hidden shadow-2xl shadow-white/10 relative">
                                {/* Reel Interview Content */}
                                <div className="w-full h-full bg-gradient-to-br from-gray-800 via-gray-900 to-black relative">
                                    {/* Video Background - Real Footage */}
                                    <div className="absolute inset-0">
                                        <video
                                            src={resume.video}
                                            className="w-full h-full object-cover"
                                            autoPlay
                                            loop
                                            muted
                                            playsInline
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/90" />

                                        {/* Play Icon Overlay */}
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <div className="w-12 h-12 rounded-full bg-black/20 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                                                <div className="text-white fill-white ml-1">▶</div>
                                            </div>
                                        </div>
                                    </div>


                                    {/* Profile Info at Bottom */}
                                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
                                        <div className="mb-4">
                                            <h3 className="text-white text-lg font-bold">{resume.name}</h3>
                                        </div>

                                        {/* Interaction Buttons */}
                                        <div className="flex items-center gap-6">
                                            <button className="flex flex-col items-center gap-1">
                                                <Heart size={24} className="text-[#34D399]" />
                                                <span className="text-white text-xs">{resume.likes}</span>
                                            </button>
                                            <button className="flex flex-col items-center gap-1">
                                                <MessageCircle size={24} className="text-white" />
                                                <span className="text-white text-xs">{resume.comments}</span>
                                            </button>
                                            <button className="flex flex-col items-center gap-1">
                                                <Send size={24} className="text-white" />
                                                <span className="text-white text-xs">{resume.shares}</span>
                                            </button>
                                            <button className="flex flex-col items-center gap-1 ml-auto">
                                                <Bookmark size={24} className="text-white" />
                                            </button>
                                        </div>
                                    </div>


                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TakePeek;
