import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, Cpu, Lightbulb, MessageSquare } from 'lucide-react';

const AIConsultant = ({ isOpen, onClose }) => {
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [suggestion, setSuggestion] = useState(null);

    const handleConsult = () => {
        if (!prompt.trim()) return;
        setLoading(true);
        // Simulate AI response
        setTimeout(() => {
            const suggestions = [
                {
                    type: "E-Commerce",
                    components: ["Product Grid", "Filter Sidebar", "Shopping Cart Drawer", "Review Stars", "Image Gallery with Zoom"],
                    libraries: ["shadcn/ui", "NextUI"]
                },
                {
                    type: "SaaS Dashboard",
                    components: ["Data Table with Sorting", "Side Navigation", "Area Charts", "Status Badges", "User Profile Dropdown"],
                    libraries: ["MUI", "Mantine"]
                },
                {
                    type: "Landing Page",
                    components: ["Hero Section with Video", "Feature Grid", "Testimonial Carousel", "Pricing Cards", "Sticky Navbar"],
                    libraries: ["NextUI", "daisyUI"]
                }
            ];

            // Pick a random one or match based on keywords (simple mock)
            let result = suggestions[0];
            if (prompt.toLowerCase().includes("dashboard") || prompt.toLowerCase().includes("admin")) result = suggestions[1];
            if (prompt.toLowerCase().includes("landing") || prompt.toLowerCase().includes("home")) result = suggestions[2];

            setSuggestion(result);
            setLoading(false);
        }, 1500);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-indigo-50/50">
                            <div className="flex items-center gap-3 text-indigo-600">
                                <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200">
                                    <Cpu size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 leading-none">AI UI Consultant</h3>
                                    <span className="text-[10px] uppercase font-black tracking-widest text-indigo-400">Powered by RUIL AI</span>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-gray-400 hover:text-gray-900 shadow-sm border border-transparent hover:border-gray-100">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <MessageSquare size={12} /> Describe your project
                                </label>
                                <div className="relative">
                                    <textarea
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        placeholder="e.g. I want to build a modern dashboard for a crypto exchange with dark mode support."
                                        className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all min-h-[120px] resize-none"
                                    />
                                    <button
                                        onClick={handleConsult}
                                        disabled={loading || !prompt.trim()}
                                        className="absolute bottom-4 right-4 p-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-50 disabled:shadow-none transition-all active:scale-95"
                                    >
                                        {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send size={20} />}
                                    </button>
                                </div>
                            </div>

                            <AnimatePresence mode="wait">
                                {suggestion ? (
                                    <motion.div
                                        key="suggestion"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-5 bg-indigo-50 rounded-2xl border border-indigo-100 space-y-4"
                                    >
                                        <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
                                            <Lightbulb size={16} /> Suggestions for: {suggestion.type}
                                        </div>

                                        <div className="space-y-3">
                                            <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Recommended Components</p>
                                            <div className="flex flex-wrap gap-2">
                                                {suggestion.components.map((c, i) => (
                                                    <span key={i} className="px-3 py-1.5 bg-white border border-indigo-200 rounded-lg text-xs font-medium text-indigo-700 shadow-sm">
                                                        {c}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Best Libraries for this UI</p>
                                            <div className="flex gap-4">
                                                {suggestion.libraries.map((l, i) => (
                                                    <div key={i} className="flex items-center gap-1.5 text-xs text-indigo-900 font-bold">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                                        {l}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : loading ? (
                                    <motion.div
                                        key="loading"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="py-12 flex flex-col items-center justify-center text-indigo-400"
                                    >
                                        <Sparkles size={32} className="animate-pulse mb-4" />
                                        <p className="text-xs font-bold text-indigo-600/60 uppercase tracking-widest">Consulting RUIL AI Database...</p>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="empty"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="py-8 text-center"
                                    >
                                        <p className="text-sm text-gray-400 font-medium">Ask RUIL AI to suggest the best components and libraries for your next big idea.</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="p-4 bg-gray-50 text-[10px] text-gray-400 text-center font-medium border-t border-gray-100">
                            RUIL AI Assistant • UI Suggestions Only
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AIConsultant;
