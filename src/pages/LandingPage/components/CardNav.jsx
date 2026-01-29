import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Users, MessageCircle, Images, Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import StaggeredMenu from './StaggeredMenu';

const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'gallery', icon: Images, label: 'Gallery' },
    { id: 'team', icon: Users, label: 'Team' },
    { id: 'contact', icon: MessageCircle, label: 'Contact' },
];

const menuItems = [
    { label: 'Home', link: '/' },
    { label: 'Gallery', link: '/gallery' },
    { label: 'Team', link: '/teams' },
    { label: 'Contact', link: '/contact' }
];

const socialItems = [
    { label: 'LinkedIn', link: 'https://linkedin.com' },
    { label: 'Twitter', link: 'https://twitter.com' },
    { label: 'Instagram', link: 'https://instagram.com' }
];

const CardNav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('home');

    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (location.pathname === '/gallery') setActiveTab('gallery');
        else if (location.pathname === '/') setActiveTab('home');
        else if (location.pathname === '/contact') setActiveTab('contact');
        else if (location.pathname === '/teams') setActiveTab('team');
    }, [location.pathname]);

    const handleNavClick = (id) => {
        setActiveTab(id);
        if (id !== 'menu') setIsOpen(false); // Close menu if navigating
        if (id === 'home') navigate('/');
        if (id === 'gallery') navigate('/gallery');
        if (id === 'contact') navigate('/contact');
        if (id === 'team') navigate('/teams');
    };

    return (
        <>
            {/* Staggered Mobile Menu */}
            <StaggeredMenu
                isOpen={isOpen}
                onMenuClose={() => setIsOpen(false)}
                items={menuItems}
                socialItems={socialItems}
                className="md:hidden"
            />

            {/* Floating Nav (Unified for Desktop & Mobile) */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-fit max-w-[90vw] flex justify-center">
                <div
                    className="flex items-center gap-1 md:gap-2 p-2 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] transition-all duration-300 ease-in-out"
                >
                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden relative px-3 py-2 rounded-xl flex items-center gap-2 transition-colors duration-200 text-gray-400 hover:text-white"
                    >
                        {isOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                    {/* Desktop Nav Items */}
                    <div className="hidden md:flex items-center gap-1 md:gap-2">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleNavClick(item.id)}
                                className="relative px-3 md:px-6 py-2 md:py-3 rounded-xl flex items-center gap-2 transition-colors duration-200 group whitespace-nowrap"
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
                    </div>

                    <div className="hidden md:block w-px h-6 bg-white/10 mx-1 md:mx-2" />

                    <button className="px-4 md:px-6 py-2 md:py-3 rounded-xl bg-kinetic-primary text-black text-sm font-bold shadow-[0_0_20px_rgba(255,255,255,0.5)] hover:bg-kinetic-primary/90 transition-colors whitespace-nowrap">
                        Join Waitlist
                    </button>
                </div>
            </div>
        </>
    );
};

export default CardNav;
