import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ArrowUpRight, Calendar, User, Lock, X, Check } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Mock Data for Gallery/Blogs
const initialGalleryItems = [
    {
        id: 1,
        title: "The Future of AI in Recruitment",
        category: "Technology",
        author: "Sarah Jenks",
        date: "Oct 24, 2025",
        image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
        excerpt: "How artificial intelligence is reshaping the landscape of talent acquisition."
    },
    {
        id: 2,
        title: "Building a Personal Brand",
        category: "Career Growth",
        author: "Mike Ross",
        date: "Oct 22, 2025",
        image: "https://images.unsplash.com/photo-1493612276216-ee3925520721?auto=format&fit=crop&w=800&q=80",
        excerpt: "Why your online presence matters more than your resume in 2026."
    },
    {
        id: 3,
        title: "Remote Work: The New Standard",
        category: "Workplace",
        author: "Jessica Pearson",
        date: "Oct 20, 2025",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
        excerpt: "Adapting to the decentralized workforce and maintaining culture."
    },
    {
        id: 4,
        title: "SwipeScout's Design Philosophy",
        category: "Design",
        author: "Harvey Specter",
        date: "Oct 18, 2025",
        image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80",
        excerpt: "A deep dive into the kinetic aesthetics of our platform."
    },
    {
        id: 5,
        title: "Hiring for Culture Add",
        category: "HR Strategy",
        author: "Louis Litt",
        date: "Oct 15, 2025",
        image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80",
        excerpt: "Moving beyond 'culture fit' to build diverse, resilient teams."
    },
    {
        id: 6,
        title: "The Death of the Cover Letter",
        category: "Applications",
        author: "Donna Paulsen",
        date: "Oct 12, 2025",
        image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80",
        excerpt: "Video intros are taking over. Here's how to master them."
    }
];



const UploadModal = ({ isOpen, onClose, onUpload }) => {
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        author: '',
        image: '',
        excerpt: ''
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpload({
            ...formData,
            id: Date.now(),
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        });
        onClose();
        setFormData({ title: '', category: '', author: '', image: '', excerpt: '' });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-kinetic-card border border-white/10 p-8 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
                <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white">
                    <X size={24} />
                </button>
                <h3 className="text-3xl font-bold text-white mb-8 uppercase tracking-widest">Post Article</h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-[#34D399]">Title</label>
                        <input
                            required
                            type="text"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-black/20 border border-white/10 p-4 text-white focus:outline-none focus:border-[#34D399] transition-colors rounded-none placeholder:text-zinc-700"
                            placeholder="Enter article title..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-[#34D399]">Category</label>
                            <input
                                required
                                type="text"
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 p-4 text-white focus:outline-none focus:border-[#34D399] transition-colors rounded-none placeholder:text-zinc-700"
                                placeholder="e.g. Technology"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-[#34D399]">Author</label>
                            <input
                                required
                                type="text"
                                value={formData.author}
                                onChange={e => setFormData({ ...formData, author: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 p-4 text-white focus:outline-none focus:border-[#34D399] transition-colors rounded-none placeholder:text-zinc-700"
                                placeholder="e.g. John Doe"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-[#34D399]">Image URL</label>
                        <input
                            required
                            type="url"
                            value={formData.image}
                            onChange={e => setFormData({ ...formData, image: e.target.value })}
                            className="w-full bg-black/20 border border-white/10 p-4 text-white focus:outline-none focus:border-[#34D399] transition-colors rounded-none placeholder:text-zinc-700"
                            placeholder="https://..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-[#34D399]">Excerpt</label>
                        <textarea
                            required
                            rows={4}
                            value={formData.excerpt}
                            onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                            className="w-full bg-black/20 border border-white/10 p-4 text-white focus:outline-none focus:border-[#34D399] transition-colors rounded-none placeholder:text-zinc-700 resize-none"
                            placeholder="Brief description..."
                        />
                    </div>

                    <button type="submit" className="w-full bg-[#34D399] text-black font-bold py-4 hover:bg-[#34D399]/90 transition-colors uppercase tracking-wider rounded-none">
                        Publish Article
                    </button>
                </form>
            </div>
        </div>
    );
};

const GalleryPage = () => {
    const headerRef = useRef(null);
    const [items, setItems] = useState(initialGalleryItems);

    const [showUpload, setShowUpload] = useState(false);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(headerRef.current, {
                opacity: 0,
                y: 50,
                duration: 1,
                ease: "power3.out"
            });
        });
        return () => ctx.revert();
    }, []);



    const handleUpload = (newItem) => {
        setItems(prev => [newItem, ...prev]);
        setShowUpload(false);
    };

    return (
        <main className="min-h-screen bg-kinetic-bg text-white selection:bg-kinetic-primary selection:text-white pb-32">
            {/* Noise Overlay */}
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-50"></div>

            <UploadModal
                isOpen={showUpload}
                onClose={() => setShowUpload(false)}
                onUpload={handleUpload}
            />

            <div className="container mx-auto px-6 pt-32">
                {/* Header */}
                <div ref={headerRef} className="flex flex-col md:flex-row justify-between items-end mb-24 border-b border-white/10 pb-12 gap-8">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#34D399] mb-4">
                            <div className="w-2 h-2 bg-[#34D399] rounded-full animate-pulse" />
                            SwipeScout Gallery
                        </div>
                        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9]">
                            Our <span className="text-gray-500">Stories.</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <p className="text-white/60 max-w-sm text-right leading-relaxed text-sm md:text-base">
                            Read our latest stories and insights from the SwipeScout team.
                        </p>


                    </div>
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {items.map((item, index) => (
                        <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="group relative bg-kinetic-card border border-white/10 overflow-hidden hover:border-white/30 transition-colors duration-500"
                        >
                            {/* Image Container */}
                            <div className="aspect-[4/3] overflow-hidden relative">
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute top-4 left-4 z-20">
                                    <span className="px-3 py-1 bg-black/50 backdrop-blur-md border border-white/10 rounded-none text-xs font-mono uppercase tracking-wider text-[#34D399]">
                                        {item.category}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-8">
                                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                    <div className="flex items-center gap-1">
                                        <User size={14} />
                                        <span>{item.author}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar size={14} />
                                        <span>{item.date}</span>
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold mb-4 group-hover:text-[#34D399] transition-colors leading-tight">
                                    {item.title}
                                </h3>
                                <p className="text-gray-400 mb-8 line-clamp-2">
                                    {item.excerpt}
                                </p>

                                <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#34D399]">
                                    Read Article <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default GalleryPage;
