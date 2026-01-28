import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Users, MessageCircle, Menu, X, Images } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'gallery', icon: Images, label: 'Gallery' },
    { id: 'team', icon: Users, label: 'Team' },
    { id: 'contact', icon: MessageCircle, label: 'Contact' },
];

const CardNav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('home');
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    useEffect(() => {
        if (location.pathname === '/gallery') setActiveTab('gallery');
        else if (location.pathname === '/') setActiveTab('home');
        else if (location.pathname === '/contact') setActiveTab('contact');
        else if (location.pathname === '/teams') setActiveTab('team');
        // Add other mappings if needed
    }, [location.pathname]);

    const handleNavClick = (id) => {
        setActiveTab(id);
        if (id === 'home') navigate('/');
        if (id === 'gallery') navigate('/gallery');
        if (id === 'contact') navigate('/contact');
        // 'team' could navigate to /about or scroll to team section if exists. assuming /about for now or just a placeholder.
        if (id === 'team') navigate('/teams');
    };

    return (
        <>
            {/* Desktop Floating Nav */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 hidden md:block">
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center gap-2 p-2 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]"
                >
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleNavClick(item.id)}
                            className="relative px-6 py-3 rounded-xl flex items-center gap-2 transition-colors duration-200 group"
                        >
                            {activeTab === item.id && (
                                <motion.div
                                    layoutId="nav-bg"
                                    className="absolute inset-0 bg-white/10 rounded-xl border border-white/5"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <item.icon
                                size={20}
                                className={`relative z-10 transition-colors duration-200 ${activeTab === item.id ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'
                                    }`}
                            />
                            <span className={`relative z-10 text-sm font-medium transition-colors duration-200 ${activeTab === item.id ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'
                                }`}>
                                {item.label}
                            </span>
                        </button>
                    ))}

                    <div className="w-px h-6 bg-white/10 mx-2" />

                    <button className="px-6 py-3 rounded-xl bg-kinetic-primary text-black text-sm font-bold shadow-[0_0_20px_rgba(255,255,255,0.5)] hover:bg-kinetic-primary/90 transition-colors">
                        Get Started
                    </button>
                </motion.div>
            </div>

            {/* Mobile Top Nav */}
            <div className="fixed top-0 left-0 right-0 z-50 md:hidden p-4">
                <div className="flex justify-between items-center p-4 rounded-2xl bg-black/50 backdrop-blur-lg border border-white/10">
                    <span className="font-bold text-white">SwipeScout</span>
                    <button
                        onClick={() => setIsMobileOpen(!isMobileOpen)}
                        className="p-2 rounded-full bg-white/10 text-white"
                    >
                        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-40 bg-kinetic-bg pt-24 px-6 md:hidden"
                    >
                        <div className="flex flex-col gap-4">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-4 text-white text-lg font-medium"
                                    onClick={() => {
                                        handleNavClick(item.id);
                                        setIsMobileOpen(false);
                                    }}
                                >
                                    <item.icon size={24} className="text-gray-400" />
                                    {item.label}
                                </button>
                            ))}
                            <button className="mt-4 w-full py-4 rounded-xl bg-kinetic-primary text-black font-bold text-lg shadow-lg">
                                Get Started
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default CardNav;
