import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Upload } from 'lucide-react';

const AIContextSidebar = ({ isAnalyzing, analysisProgress, getRootProps, getInputProps, isDragActive, suggestedComponents, addComponent, setActiveTab }) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-600/60">Project Analysis</h3>
          <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
        </div>

        {isAnalyzing ? (
          <div className="p-8 border border-indigo-100 rounded-2xl bg-indigo-50/20 space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="text-indigo-600/60 font-medium">Analyzing Project Structure...</span>
              <span className="font-mono text-indigo-600">{analysisProgress}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${analysisProgress}%` }}
                className="h-full bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.5)]"
              />
            </div>
            <p className="text-[10px] text-indigo-600/40 animate-pulse font-medium">Scanning imports, components, and styles...</p>
          </div>
        ) : (
          <div {...getRootProps()} className={`border border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all ${isDragActive ? 'border-indigo-600 bg-indigo-50/50' : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50/50'}`}>
            <input {...getInputProps()} />
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
              <Upload className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-semibold text-gray-600">Drop project folder</p>
              <p className="text-xs text-gray-600/50 leading-relaxed max-w-[180px] mx-auto font-medium">
                AI will analyze your stack and suggest compatible components
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-600/60">Compatible Suggestions</h3>
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {suggestedComponents.map((comp) => (
              <motion.div
                key={comp.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group p-4 bg-white border border-gray-100 rounded-2xl hover:border-indigo-600/30 transition-all cursor-pointer relative overflow-hidden shadow-sm"
              >
                <div className="flex items-start gap-4 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-400 group-hover:text-indigo-600 transition-colors border border-indigo-100/50">
                    {comp.icon}
                  </div>
                  <div>
                    <p className="text-xs font text-gray-600">{comp.name}</p>
                    <p className="text-[10px] text-gray-900/50 font-medium">{comp.library}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    addComponent(comp.name);
                    setActiveTab('visual');
                  }}
                  className="w-full py-2 text-[10px] font-black uppercase tracking-widest bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 shadow-lg shadow-indigo-100"
                >
                  Add to Canvas
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AIContextSidebar;
