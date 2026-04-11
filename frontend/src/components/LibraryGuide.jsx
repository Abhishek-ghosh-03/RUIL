import { motion } from "framer-motion";
import { UI_LIBRARIES } from "../data/libraries";
import { Terminal, Check, Copy, AlertTriangle, Lightbulb, PackageOpen, ArrowRight, Sparkles } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const LibraryGuide = ({ selectedId }) => {
  const [copied, setCopied] = useState("");
  const scrollContainerRef = useRef(null);
  const lib = UI_LIBRARIES.find((l) => l.id === selectedId) || UI_LIBRARIES[0];

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [selectedId]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(""), 2000);
  };

  return (
    <div 
      ref={scrollContainerRef}
      className="flex-grow overflow-y-auto bg-white p-4 md:p-8 lg:p-12 h-full custom-scrollbar"
    >
      <motion.div
        key={lib.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-gray-100 pb-12">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <span className="px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                Installation Guide
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                v1.4.2 Ready
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight mb-4">
              {lib.name}
            </h1>
            <p className="text-gray-500 text-lg max-w-xl leading-relaxed font-medium">
              Everything you need to integrate <span className="text-gray-900 font-bold">{lib.name}</span> into your React ecosystem.
            </p>
          </div>
          <div className="flex gap-4">
             <button className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all text-sm flex items-center gap-2">
               Docs <ArrowRight className="w-4 h-4" />
             </button>
             <button className="px-5 py-2.5 bg-white text-gray-600 font-bold rounded-xl border border-gray-200 hover:text-gray-900 hover:border-gray-400 transition-all text-sm">
               GitHub
             </button>
          </div>
        </div>

        {/* Updates Section */}
        {lib.updates && lib.updates.length > 0 && (
          <section className="mb-12">
            <h3 className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">
              <Sparkles className="w-4 h-4 text-purple-500" /> Recent Updates & Changes
            </h3>
            <div className="space-y-4">
              {lib.updates.map((update, idx) => (
                <div key={update.version} className="bg-gray-50 border border-gray-200 rounded-2xl p-6 relative overflow-hidden group">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                    <div className="flex items-center gap-3">
                       <div className={`w-2.5 h-2.5 rounded-full ${idx === 0 ? 'bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.5)]' : 'bg-gray-300'}`}></div>
                       <span className="text-lg font-black text-gray-900 tracking-tight">{update.version}</span>
                       <span className="px-2 py-0.5 bg-white border border-gray-200 text-gray-500 text-[10px] font-bold rounded uppercase">
                         {update.date}
                       </span>
                    </div>
                    <p className="text-sm text-gray-600 font-medium flex-grow md:ml-8 leading-relaxed">
                      {update.text}
                    </p>
                  </div>
                  {idx === 0 && (
                    <div className="absolute top-0 right-0 px-3 py-1 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-tighter rounded-bl-xl shadow-md">
                      Latest Release
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Installation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Commands */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h3 className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
                <Terminal className="w-4 h-4 text-indigo-500" /> CLI Commands
              </h3>
              <div className="space-y-3">
                {lib.installCommands.map((cmd) => (
                  <div key={cmd} className="group relative bg-gray-50 border border-gray-200 rounded-xl p-4 font-mono text-sm text-gray-900 overflow-hidden">
                    <div className="flex justify-between items-center relative z-10 font-bold">
                      <span className="flex items-center gap-2">
                         <span className="text-gray-400">$</span> {cmd}
                      </span>
                      <button 
                         onClick={() => handleCopy(cmd)}
                         className="p-1.5 hover:bg-white rounded-lg text-gray-400 hover:text-indigo-600 transition-all opacity-0 group-hover:opacity-100 shadow-sm border border-transparent hover:border-gray-200"
                      >
                         {copied === cmd ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="absolute inset-y-0 left-0 w-1 bg-indigo-600 transform -translate-x-full group-hover:translate-x-0 transition-transform"></div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
                <PackageOpen className="w-4 h-4 text-indigo-500" /> Usage Example
              </h3>
              <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-xl">
                <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                   <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Main.jsx</span>
                   <button 
                     onClick={() => handleCopy(lib.importExample)}
                     className="text-[10px] text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
                   >
                     {copied === lib.importExample ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} Copy Code
                   </button>
                </div>
                <pre className="p-6 text-xs md:text-sm text-indigo-200 font-mono leading-relaxed overflow-x-auto">
                  {lib.importExample}
                </pre>
              </div>
            </section>
          </div>

          {/* Sidebar Specs */}
          <div className="space-y-6">
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
              <h4 className="flex items-center gap-2 text-xs font-bold text-gray-900 uppercase tracking-widest mb-6">
                <Lightbulb className="w-4 h-4 text-yellow-600" /> Prerequisites
              </h4>
              <ul className="space-y-4">
                {lib.prerequisites.map(step => (
                  <li key={step} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-50 border border-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-sm text-gray-600 font-medium">{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 font-medium">
              <h4 className="flex items-center gap-2 text-xs font-bold text-orange-700 uppercase tracking-widest mb-3">
                <AlertTriangle className="w-4 h-4" /> Important Note
              </h4>
              <p className="text-sm text-orange-900/70 leading-relaxed">
                {lib.warning}
              </p>
            </div>

            <div className="p-1 px-6">
              <p className="text-[11px] text-gray-500 italic font-medium">
                {lib.notes}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LibraryGuide;
