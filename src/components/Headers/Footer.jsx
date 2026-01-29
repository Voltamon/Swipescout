import React from "react";
import { Linkedin, Twitter, Instagram } from 'lucide-react';
import { FaTiktok } from "react-icons/fa6";

const Footer = () => {
    return (
        <footer className="bg-black pt-20 pb-10 border-t border-white/10">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 mb-16">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-full bg-kinetic-primary/20 flex items-center justify-center">
                                <span className="w-2 h-2 rounded-full bg-kinetic-primary animate-pulse" />
                            </div>
                            <span className="font-bold text-white tracking-tight text-xl">SwipeScout</span>
                        </div>
                        <p className="text-gray-400 max-w-xs text-sm leading-relaxed">
                            The future of video recruitment. Connect with talent and opportunities through engaging video profiles.
                        </p>
                    </div>

                    <div className="flex items-center gap-6">
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all group">
                            <Linkedin size={18} />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all group">
                            <Twitter size={18} />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all group">
                            <Instagram size={18} />
                        </a>
                        <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all group">
                            <FaTiktok size={18} />
                        </a>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-gray-500">
                    <p>© 2026 SwipeScout Inc. All rights reserved.</p>

                    <div className="flex items-center gap-8">
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
