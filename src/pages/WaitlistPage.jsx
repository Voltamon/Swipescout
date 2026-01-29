import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const WaitlistPage = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');

        // Simulate API call
        setTimeout(() => {
            setStatus('success');
            setEmail('');
        }, 1500);
    };

    return (
        <main className="min-h-screen bg-kinetic-bg text-white flex flex-col relative overflow-hidden">
            {/* Background Noise */}
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-50"></div>

            {/* Back Button */}
            <div className="absolute top-8 left-8 z-[60]">
                <Link
                    to="/"
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/5"
                >
                    <ArrowRight className="rotate-180" size={20} />
                    Back to Home
                </Link>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
                <div className="max-w-md w-full space-y-12 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-6"
                    >
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white leading-[0.9]">
                            Join the <br />
                            <span className="text-[#34D399]">Waitlist</span>
                        </h1>
                        <p className="text-xl text-gray-400 leading-relaxed">
                            Be the first to experience the future of hiring. <br className="hidden md:block" />
                            Join thousands of builders today.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        {status === 'success' ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-[#34D399]/10 border border-[#34D399]/20 rounded-2xl p-8 flex flex-col items-center gap-6"
                            >
                                <div className="w-20 h-20 rounded-full bg-[#34D399]/20 flex items-center justify-center text-[#34D399] shadow-[0_0_30px_rgba(52,211,153,0.3)]">
                                    <Check size={40} />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-3xl font-bold text-white">You're on the list!</h3>
                                    <p className="text-gray-400">Keep an eye on your inbox. We'll be in touch soon.</p>
                                </div>
                                <button
                                    onClick={() => setStatus('idle')}
                                    className="text-sm text-gray-500 hover:text-white transition-colors mt-4"
                                >
                                    Join with another email
                                </button>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="relative group">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#34D399] to-emerald-600 rounded-xl blur opacity-30 group-hover:opacity-75 transition duration-500"></div>
                                    <input
                                        type="email"
                                        placeholder="name@company.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="relative w-full bg-[#0a0a0a] border border-white/10 text-white placeholder:text-gray-600 h-16 pl-6 pr-6 rounded-xl focus:outline-none focus:border-[#34D399]/50 focus:ring-1 focus:ring-[#34D399]/50 transition-all text-lg"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="w-full h-16 bg-white text-black hover:bg-[#34D399] hover:text-white text-xl font-bold rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(52,211,153,0.4)] flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {status === 'loading' ? (
                                        <span className="flex items-center gap-2">
                                            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                            Joining...
                                        </span>
                                    ) : (
                                        <>
                                            Join Waitlist
                                            <ArrowRight size={24} />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Footer */}
            <footer className="py-8 text-center text-gray-700 text-sm relative z-10">
                <p>© 2026 SwipeScout Inc. The future of hiring.</p>
            </footer>
        </main>
    );
};

export default WaitlistPage;
