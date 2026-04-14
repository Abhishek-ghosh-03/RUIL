import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, Monitor, Trash2, Plus, MousePointer2 } from 'lucide-react';

const VisualEditor = ({ components, selectedId, setSelectedId, setComponents, viewportWidths, viewportSize, isMobile }) => {
  return (
    <div
      className={`bg-white border border-gray-200 transition-all duration-500 relative flex flex-col h-full overflow-hidden ${isMobile ? 'w-full rounded-xl' : 'rounded-3xl shadow-[0_40px_100px_rgba(0,0,0,0.08)]'}`}
      style={{ width: isMobile ? '100%' : viewportWidths[viewportSize], maxWidth: '100%' }}
    >
      {/* Browser Bar - Refined */}
      <div className="h-12 border-b border-gray-100 px-6 flex items-center justify-between bg-white z-20">
        <div className="flex gap-1.5 sm:gap-2">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-400 border border-red-500 shadow-sm" />
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-400 border border-amber-500 shadow-sm" />
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-400 border border-emerald-500 shadow-sm" />
        </div>
        <div className="flex-1 max-w-[120px] sm:max-w-none mx-4 sm:mx-8 flex items-center gap-2 px-3 sm:px-6 py-1.5 rounded-lg border border-gray-100 text-[10px] text-gray-500 font-mono tracking-wide sm:min-w-[300px] justify-center shadow-inner overflow-hidden">
          <span className="opacity-40 hidden sm:inline">https://</span><span className="truncate">ruil.studio/builder-v1</span>
        </div>
        <div className="flex items-center gap-4">
          {!isMobile && <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{viewportWidths[viewportSize]}</span>}
          <Maximize2 className="w-4 h-4 text-gray-400 hover:text-indigo-600 transition-colors cursor-pointer" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-12 custom-scrollbar bg-[#FDFDFF]" onClick={() => setSelectedId(null)}>
        <div className="w-full max-w-5xl mx-auto min-h-full">
          <AnimatePresence>
            {components.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`${isMobile ? 'h-[400px]' : 'h-[550px]'} border-2 border-dashed border-indigo-100 rounded-[32px] sm:rounded-[48px] flex flex-col items-center justify-center gap-6 sm:gap-10 bg-white/50 relative overflow-hidden group shadow-sm`}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(79,70,229,0.05),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                <div className="relative">
                  <div className="absolute inset-0 bg-indigo-600/20 blur-[60px] rounded-full group-hover:bg-indigo-600/30 transition-all duration-700 animate-pulse" />
                  <div className="relative w-28 h-28 rounded-[36px] bg-white border border-indigo-50 shadow-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-700">
                    <Plus className="w-12 h-12 text-indigo-400 group-hover:text-indigo-600" />
                  </div>
                </div>

                <div className="text-center space-y-3 relative z-10 px-6 sm:px-8">
                  <div className="space-y-1 sm:space-y-2">
                    <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Your Infinite Canvas</h3>
                    <p className="text-[11px] sm:text-sm text-gray-400 max-w-[280px] sm:max-w-[320px] mx-auto leading-relaxed font-medium">
                      Start building by dragging components from the registry or using AI suggestions.
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-3 pt-4">
                    <div className="px-4 py-2 bg-indigo-50 rounded-full text-[10px] font-black text-indigo-600 uppercase tracking-wider border border-indigo-100">Ready to build</div>
                    <div className="px-4 py-2 bg-gray-50 rounded-full text-[10px] font-black text-gray-400 uppercase tracking-wider border border-gray-100">Zero Code</div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-16 pb-40 pt-10">
                {components.map((comp) => (
                  <motion.div
                    layoutId={comp.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={comp.id}
                    className={`relative group p-4 border transition-all duration-500 rounded-[32px] ${selectedId === comp.id ? 'bg-indigo-50/20 border-indigo-200 shadow-2xl shadow-indigo-100/20' : 'border-transparent hover:bg-gray-50/50'}`}
                    onClick={(e) => { e.stopPropagation(); setSelectedId(comp.id); }}
                  >
                    {/* Interactive Selection indicators */}
                    <AnimatePresence>
                      {selectedId === comp.id && (
                        <>
                          {/* Corner indicators */}
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-indigo-600 rounded-tl-lg" />
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-indigo-600 rounded-tr-lg" />
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-indigo-600 rounded-bl-lg" />
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-indigo-600 rounded-br-lg" />

                          {/* Floating actions */}
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30"
                          >
                            <div className="px-4 py-1.5 bg-indigo-600 text-white text-[9px] font-black rounded-full shadow-2xl uppercase tracking-widest flex items-center gap-2">
                              <MousePointer2 className="w-3 h-3 fill-current" />
                              {comp.name}
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setComponents(components.filter(c => c.id !== comp.id));
                                setSelectedId(null);
                              }}
                              className="w-8 h-8 rounded-full bg-white border border-gray-100 text-red-500 flex items-center justify-center shadow-xl hover:bg-red-50 hover:text-red-700 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>

                    {/* Mock Component Visualization - High Quality */}
                    <div
                      className="p-16 bg-white border border-gray-100 overflow-hidden min-h-[250px] flex items-center justify-center transition-all duration-700 relative group/inner shadow-sm"
                      style={{
                        borderRadius: `${comp.props.radius || 28}px`,
                        boxShadow: `0 ${comp.props.elevation || 10}px 70px rgba(0,0,0,0.06)`,
                        filter: `hue-rotate(${(comp.props.theme || 50) - 50}deg)`
                      }}
                    >
                      <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.4),transparent)] pointer-events-none" />

                      <div className="text-center space-y-6 relative z-10">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className="w-16 h-16 rounded-[24px] bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto mb-4 shadow-sm group-hover/inner:shadow-indigo-100 transition-all duration-500"
                        >
                          <Monitor className="w-8 h-8 text-gray-200 group-hover/inner:text-indigo-600 transition-colors" />
                        </motion.div>
                        <div className="space-y-1">
                          <p className="text-lg font-black text-gray-900 tracking-tight uppercase group-hover/inner:text-indigo-600 transition-colors">{comp.props.text || comp.name}</p>
                          <p className="text-[10px] text-gray-400 font-mono tracking-widest font-bold opacity-60">ID: {comp.id}</p>
                        </div>
                        <div className="flex items-center gap-3 justify-center opacity-0 group-hover/inner:opacity-100 transition-all duration-500 transform translate-y-2 group-hover/inner:translate-y-0">
                          <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-600">Active Node</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default VisualEditor;
