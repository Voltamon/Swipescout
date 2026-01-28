import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Linkedin, Twitter, Github, Dribbble, Globe } from 'lucide-react';
import { teamMembers } from '../../data/teamMembers';

// Social Icon Map
const socialIcons = {
    linkedin: Linkedin,
    twitter: Twitter,
    github: Github,
    dribbble: Dribbble,
    website: Globe
};

const TeamMemberBioPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const member = teamMembers.find(m => m.id === id);

    useEffect(() => {
        window.scrollTo(0, 0); // Scroll to top on mount
    }, []);

    if (!member) {
        return (
            <div className="min-h-screen bg-kinetic-bg text-white flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-4xl font-bold mb-4">Member Not Found</h2>
                    <button
                        onClick={() => navigate('/teams')}
                        className="text-kinetic-primary hover:underline"
                    >
                        Back to Team
                    </button>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-kinetic-bg text-white selection:bg-kinetic-primary selection:text-white pb-32">
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-50"></div>

            <div className="container mx-auto px-6 pt-32">
                {/* Back Button */}
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    onClick={() => navigate('/teams')}
                    className="flex items-center gap-2 text-gray-400 hover:text-white mb-12 transition-colors uppercase tracking-widest text-xs font-bold"
                >
                    <ArrowLeft size={16} />
                    Back to Team
                </motion.button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">

                    {/* Left Column - Image & Quick Info */}
                    <div className="lg:col-span-5">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            className="relative aspect-[3/4] rounded-sm overflow-hidden border border-white/10 mb-8"
                        >
                            <img
                                src={member.image}
                                alt={member.name}
                                className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="flex gap-4"
                        >
                            {Object.entries(member.social).map(([platform, url], i) => {
                                const Icon = socialIcons[platform] || Globe;
                                return (
                                    <a
                                        key={platform}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-12 h-12 flex items-center justify-center border border-white/10 rounded-full hover:bg-white hover:text-black transition-all duration-300"
                                    >
                                        <Icon size={20} />
                                    </a>
                                );
                            })}
                        </motion.div>
                    </div>

                    {/* Right Column - Bio Content */}
                    <div className="lg:col-span-7 flex flex-col justify-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                        >
                            <div className="inline-block px-3 py-1 mb-6 text-xs font-bold tracking-[0.2em] uppercase text-kinetic-primary bg-kinetic-primary/10 rounded-full border border-kinetic-primary/20">
                                {member.role}
                            </div>

                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.9] mb-8 text-white">
                                {member.name}
                            </h1>

                            <div className="h-1 w-24 bg-[#34D399] mb-12" />

                            <div className="space-y-8 text-lg md:text-xl text-gray-300 font-light leading-relaxed">
                                <p>{member.bio}</p>
                                <p>{member.fullBio}</p>
                            </div>

                            {/* Additional Details / Metrics (Mock) */}
                            <div className="grid grid-cols-2 gap-8 mt-16 border-t border-white/10 pt-12">
                                <div>
                                    <span className="block text-4xl font-bold text-white mb-2">5+</span>
                                    <span className="text-xs uppercase tracking-widest text-[#34D399]">Years Experience</span>
                                </div>
                                <div>
                                    <span className="block text-4xl font-bold text-white mb-2">12</span>
                                    <span className="text-xs uppercase tracking-widest text-[#34D399]">Projects Led</span>
                                </div>
                            </div>

                        </motion.div>
                    </div>

                </div>
            </div>
        </main>
    );
};

export default TeamMemberBioPage;
