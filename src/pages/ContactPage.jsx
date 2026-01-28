import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, MapPin, Twitter, Linkedin, Globe, Send, ArrowRight, Plus, Minus, Instagram } from 'lucide-react';
import { FaTiktok } from "react-icons/fa6";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';
import TiltedCTA from './LandingPage/components/TiltedCTA';
// Header removed to use CardNav from PublicLayout
import Footer from "../components/Headers/Footer";

gsap.registerPlugin(ScrollTrigger);

// Swiss Card Component (Adapted for Contact Page)
const SwissCard = ({ children, className = '', title, subtitle, icon: Icon, delay = 0, href }) => {
  const CardContent = (
    <>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none" />

      <div className="relative z-10 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white bg-white/5">
            <Icon size={18} />
          </div>
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400">{subtitle}</span>
        </div>
        <h3 className="text-3xl md:text-4xl font-bold text-white leading-tight tracking-tight max-w-md">
          {title}
        </h3>
      </div>

      <div className="flex-1 relative z-10 w-full min-h-[150px] bg-black/20 rounded-xl overflow-hidden border border-white/5">
        {children}
      </div>
    </>
  );

  const containerClasses = `
    bg-kinetic-card group relative overflow-hidden flex flex-col p-8 md:p-10
    border border-white/10 transition-colors duration-500 hover:border-white/20
    ${href ? 'cursor-pointer hover:bg-white/5' : ''}
    ${className}
  `;

  if (href) {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
        className={containerClasses}
      >
        {CardContent}
      </motion.a>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={containerClasses}
    >
      {CardContent}
    </motion.div>
  );
};

// Swiss Accordion Component
const SwissAccordion = ({ question, answer, isOpen, onClick, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={`
        group relative overflow-hidden flex flex-col
        border border-white/10 transition-all duration-500
        ${isOpen ? 'bg-white/5 border-white/20' : 'bg-kinetic-card hover:border-white/20'}
      `}
    >
      {/* Grain Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none" />

      {/* Header / Trigger */}
      <button
        onClick={onClick}
        className="relative z-10 w-full p-6 md:p-8 flex items-center justify-between text-left focus:outline-none"
      >
        <h3 className={`text-2xl md:text-3xl font-bold transition-colors duration-300 ${isOpen ? 'text-[#34D399]' : 'text-white group-hover:text-gray-200'}`}>
          {question}
        </h3>
        <div className={`
          ml-4 flex-shrink-0 w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300
          ${isOpen ? 'border-[#34D399] bg-[#34D399]/10 text-[#34D399] rotate-180' : 'border-white/10 bg-white/5 text-white group-hover:border-white/30'}
        `}>
          {isOpen ? <Minus size={24} /> : <Plus size={24} />}
        </div>
      </button>

      {/* Content */}
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
        className="relative z-10 overflow-hidden"
      >
        <div className="p-6 md:p-8 pt-0 text-gray-400 text-lg leading-relaxed max-w-3xl">
          {answer}
        </div>
      </motion.div>
    </motion.div>
  );
};

const ContactPage = () => {
  const { t } = useTranslation(['contact', 'faq']);
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    { key: 'whatIsSwipeScout', ns: 'faq' },
    { key: 'createVideoResume', ns: 'faq' },
    { key: 'jobPostingCost', ns: 'faq' },
    { key: 'howMatching', ns: 'faq' },
    { key: 'videoVisibility', ns: 'faq' },
    { key: 'videoFormats', ns: 'faq' }
  ];
  const headerRef = useRef(null);
  const dividerRef = useRef(null);

  // Force dark mode
  useEffect(() => {
    document.documentElement.classList.add('dark');
    return () => {
      // Optional: document.documentElement.classList.remove('dark');
    };
  }, []);

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
      gsap.from(dividerRef.current, {
        opacity: 0,
        scale: 0.9,
        y: 30,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: dividerRef.current,
          start: "top 85%",
        }
      });
    }, headerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-kinetic-bg text-white overflow-x-hidden selection:bg-kinetic-primary selection:text-white">
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-50"></div>



      <main className="pt-32 pb-32 container mx-auto px-6">

        {/* Header */}
        <div ref={headerRef} className="mb-24 grid grid-cols-1 md:grid-cols-12 gap-8 items-end border-b border-white/10 pb-12">
          <div className="md:col-span-8">
            <h2 className="text-5xl md:text-6xl lg:text-8xl font-bold tracking-tighter leading-[0.9]">
              <span className="text-white">Get in</span><br />
              <span className="text-[#34D399]">Touch.</span>
            </h2>
          </div>
        </div>

        {/* Organic Split Layout (Non-Grid) */}
        <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-24">

          {/* Left Side - Information & Socials (Floating/Organic) */}
          <div className="flex-1 space-y-12 lg:pt-8">

            {/* Context */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-[#34D399]">
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5 text-white">
                  <MessageSquare size={18} />
                </div>
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400">Socials</span>
              </div>
              <h3 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                Follow our<br />Journey.
              </h3>
              <p className="text-gray-400 text-lg leading-relaxed max-w-md">
                We are building a community of forward-thinkers. Join the conversation, share your ideas, and help us shape the future of recruitment.
              </p>
            </div>

            {/* Social Links List */}
            <div className="flex flex-col border-t border-white/10">
              {/* LinkedIn */}
              <a href="#" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between py-6 border-b border-white/10 hover:pl-4 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <Linkedin size={24} className="text-blue-600" />
                  <span className="text-xl font-medium text-gray-300 group-hover:text-white transition-colors">LinkedIn</span>
                </div>
                <ArrowRight size={20} className="text-blue-600 opacity-0 group-hover:opacity-100 transition-all" />
              </a>

              {/* Twitter */}
              <a href="#" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between py-6 border-b border-white/10 hover:pl-4 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <Twitter size={24} className="text-blue-400" />
                  <span className="text-xl font-medium text-gray-300 group-hover:text-white transition-colors">Twitter</span>
                </div>
                <ArrowRight size={20} className="text-blue-400 opacity-0 group-hover:opacity-100 transition-all" />
              </a>

              {/* Instagram */}
              <a href="#" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between py-6 border-b border-white/10 hover:pl-4 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <Instagram size={24} className="text-pink-500" />
                  <span className="text-xl font-medium text-gray-300 group-hover:text-white transition-colors">Instagram</span>
                </div>
                <ArrowRight size={20} className="text-pink-500 opacity-0 group-hover:opacity-100 transition-all" />
              </a>

              {/* TikTok */}
              <a href="#" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between py-6 border-b border-white/10 hover:pl-4 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <FaTiktok size={24} className="text-white" />
                  <span className="text-xl font-medium text-gray-300 group-hover:text-white transition-colors">TikTok</span>
                </div>
                <ArrowRight size={20} className="text-white opacity-0 group-hover:opacity-100 transition-all" />
              </a>

              {/* Email */}
              <a href="mailto:hello@swipescout.com" className="group flex items-center justify-between py-6 border-b border-white/10 hover:pl-4 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <Mail size={24} className="text-emerald-400" />
                  <span className="text-xl font-medium text-gray-300 group-hover:text-white transition-colors">Email</span>
                </div>
                <ArrowRight size={20} className="text-emerald-400 opacity-0 group-hover:opacity-100 transition-all" />
              </a>
            </div>
          </div>

          {/* Right Side - Project Inquiry Form */}
          <div className="flex-1 w-full lg:max-w-2xl">
            <div className="bg-kinetic-card border border-white/10 w-full rounded-none overflow-hidden shadow-2xl h-full p-8 md:p-12 flex flex-col justify-center">

              <div className="mb-10">
                <h3 className="text-3xl font-bold text-white mb-3">Feedback Inquiry</h3>
                <p className="text-gray-400 text-lg">Tell us a bit about how you are using SwipeScout.</p>
              </div>

              <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                {/* Name Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-400 block uppercase tracking-wide">First name</label>
                    <input
                      type="text"
                      placeholder="Jane"
                      className="w-full bg-white/5 border border-white/10 p-4 text-white focus:border-[#34D399] outline-none transition-colors rounded-none placeholder-gray-600"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-400 block uppercase tracking-wide">Last name</label>
                    <input
                      type="text"
                      placeholder="Doe"
                      className="w-full bg-white/5 border border-white/10 p-4 text-white focus:border-[#34D399] outline-none transition-colors rounded-none placeholder-gray-600"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-400 block uppercase tracking-wide">Email</label>
                  <input
                    type="email"
                    placeholder="jane@company.com"
                    className="w-full bg-white/5 border border-white/10 p-4 text-white focus:border-[#34D399] outline-none transition-colors rounded-none placeholder-gray-600"
                  />
                </div>

                {/* Project Details */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-400 block uppercase tracking-wide">Feedback</label>
                  <textarea
                    placeholder="I'm loving SwipeScout..."
                    className="w-full bg-white/5 border border-white/10 p-4 text-white focus:border-[#34D399] outline-none transition-colors rounded-none placeholder-gray-600 min-h-[160px] resize-none leading-relaxed"
                  />
                </div>

                {/* Submit Button */}
                <button className="w-full bg-white text-black font-bold py-5 rounded-none hover:bg-[#34D399] transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-widest active:scale-[0.99] mt-4">
                  Send Feedback
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Divider Section */}
      <div className="py-24 flex items-center gap-8 container mx-auto px-6 max-w-full overflow-hidden">
        <div className="h-px bg-gradient-to-r from-transparent via-white/40 to-white/10 flex-1" />
        <span ref={dividerRef} className="text-4xl md:text-8xl font-bold tracking-tighter uppercase text-white whitespace-nowrap">
          <span className="text-white">Build </span><span className="text-[#34D399]">Together</span>
        </span>
        <div className="h-px bg-gradient-to-l from-transparent via-white/40 to-white/10 flex-1" />
      </div>

      <TiltedCTA
        title="Build the Future with Us."
        description="We're always looking for exceptional talent to join our mission. Revolutionize hiring with us."
        ctaText="View Openings"
        onClick={() => window.open('https://linkedin.com', '_blank')}
      />

      {/* FAQ Section */}
      <section className="py-32 container mx-auto px-6">
        <div className="mb-16 grid grid-cols-1 md:grid-cols-12 gap-8 items-end border-b border-white/10 pb-8">
          <div className="md:col-span-8">
            <h2 className="text-5xl md:text-6xl lg:text-8xl font-bold tracking-tighter leading-[0.9]">
              <span className="text-white">Common<br /></span>
              <span className="text-[#34D399]">Questions.</span>
            </h2>
          </div>
        </div>

        <div className="flex flex-col gap-px bg-white/10 border border-white/10 overflow-hidden">
          {faqs.map((faq, index) => (
            <SwissAccordion
              key={faq.key}
              question={t(`questions.${faq.key}.question`, { ns: 'faq' })}
              answer={t(`questions.${faq.key}.answer`, { ns: 'faq' })}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              delay={index * 0.1}
            />
          ))}
        </div>
      </section>


      <Footer />
    </div>
  );
};

export default ContactPage;
