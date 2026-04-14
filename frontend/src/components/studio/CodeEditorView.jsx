import React from 'react';
import { Maximize2, Terminal, Activity, Eye, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const CodeEditorView = ({ jsxCode, setJsxCode, isMobile, viewportWidths, viewportSize }) => {
  return (
    <div 
      className={`bg-white border border-gray-200 transition-all duration-500 relative flex flex-col h-full overflow-hidden ${isMobile ? 'w-full rounded-xl' : 'rounded-3xl shadow-[0_40px_100px_rgba(0,0,0,0.08)]'}`}
      style={{ width: isMobile ? '100%' : viewportWidths[viewportSize], maxWidth: '100%' }}
    >
      {/* Top Header */}
      <div className="h-12 border-b border-gray-100 px-6 flex items-center justify-between bg-white z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center border border-indigo-100/50">
            <Terminal className="w-4 h-4 text-indigo-600" />
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-gray-900">Source Editor</span>
        </div>
        <div className="flex items-center gap-2">
            <div className="px-4 py-1.5 bg-gray-50 rounded-lg border border-gray-100 text-[10px] text-gray-400 font-mono tracking-wide hidden sm:block">
              comp-v1.jsx
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors"><Maximize2 className="w-4 h-4" /></button>
        </div>
      </div>

      <div className={`flex-1 flex flex-col ${isMobile ? 'overflow-y-auto custom-scrollbar' : 'overflow-hidden'}`}>
        {/* Code Editor Part */}
        <div className={`${isMobile ? 'h-[250px] shrink-0' : 'flex-1'} bg-gray-50 flex overflow-hidden border-b border-gray-100`}>
          <div className="w-10 sm:w-14 border-r border-gray-200 bg-white flex flex-col items-center pt-8 text-gray-300 font-mono text-[9px] sm:text-[10px] select-none space-y-2 opacity-50">
            {Array.from({length: 30}).map((_, i) => <div key={i} className="h-[18px] sm:h-[21px] flex items-center">{i+1}</div>)}
          </div>
          <textarea 
            value={jsxCode}
            onChange={(e) => setJsxCode(e.target.value)}
            spellCheck={false}
            className="flex-1 bg-transparent p-4 sm:p-8 font-mono text-[11px] sm:text-xs text-indigo-950 focus:outline-none resize-none custom-scrollbar leading-[1.8] caret-indigo-600"
          />
        </div>

        {/* Improved Live Render Section */}
        <div className={`${isMobile ? 'min-h-[400px] pb-32' : 'h-[45%]'} border-t border-gray-100 bg-[#F9FBFF] flex flex-col overflow-hidden`}>
          {/* Section Header */}
          <div className="px-6 h-12 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md">
             <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <h5 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-900">Live Snapshot</h5>
                </div>
                <div className="h-4 w-px bg-gray-200" />
                <div className="flex items-center gap-2 px-2.5 py-1 bg-emerald-50 rounded-full border border-emerald-100">
                    <RefreshCw className="w-2.5 h-2.5 text-emerald-600 animate-spin-slow" />
                    <span className="text-[9px] font-black text-emerald-700 uppercase tracking-tighter">Compiled</span>
                </div>
             </div>
             
             <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-gray-400 hover:text-indigo-600 transition-colors">
                   <Eye className="w-3.5 h-3.5" />
                   <span className="text-[10px] font-black uppercase tracking-widest">Inspect</span>
                </button>
             </div>
          </div>
          
          {/* Preview Canvas */}
          <div className="flex-1 p-6 flex items-center justify-center bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[size:20px_20px]">
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="w-full max-w-3xl bg-white rounded-[32px] border border-gray-200/60 shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative overflow-hidden group"
             >
                {/* Simulated Notch/Header */}
                <div className="h-6 border-b border-gray-50 bg-gray-50/30 flex items-center justify-center px-4">
                   <div className="w-12 h-1 bg-gray-200 rounded-full" />
                </div>

                <div className="p-8 sm:p-12 overflow-auto max-h-[250px] custom-scrollbar selection:bg-indigo-100">
                   {/* Centered content with responsive scaling helper */}
                   <div className="flex items-center justify-center min-h-[100px] origin-top transform scale-[0.85] sm:scale-100 transition-transform duration-500">
                      <div dangerouslySetInnerHTML={{ __html: jsxCode.replace(/className=/g, 'class=').replace(/<([^>]+)>/g, (m) => m.toLowerCase()) }} />
                   </div>
                </div>
                
                {/* Floating tooltips inside preview */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="px-3 py-1 bg-black/80 backdrop-blur-md text-white text-[9px] font-bold rounded-full shadow-xl">
                      Real-time Render
                   </div>
                </div>
             </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditorView;
