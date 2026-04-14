import React from 'react';
import { MousePointer2, Code2, Sparkles, Smartphone, Tablet, Monitor, Save } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudioHeader = ({ activeTab, setActiveTab, viewportSize, setViewportSize, isMobile }) => {
  return (
    <header className="h-20 border-b border-gray-200 flex items-center justify-between px-4 md:px-6 bg-white/80 backdrop-blur-xl z-[100]">
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 md:gap-3 group">
          <img src="/ruil-logo.png" alt="RUIL" className="w-8 h-8 md:w-9 md:h-9 rounded-lg object-cover group-hover:scale-105 transition-transform" />
        </Link>
        <div className="h-4 w-[1px] bg-gray-200" />
        <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200 shadow-inner">
          <button
            onClick={() => setActiveTab('visual')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${activeTab === 'visual' ? 'bg-white text-indigo-600 shadow-sm border border-gray-200' : 'text-indigo-600/50 hover:text-indigo-600'}`}
          >
            <MousePointer2 className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Visual</span>
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${activeTab === 'code' ? 'bg-white text-indigo-600 shadow-sm border border-gray-200' : 'text-indigo-600/50 hover:text-indigo-600'}`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Editor</span>
          </button>
          {!isMobile && (
            <button
              onClick={() => setActiveTab('context')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${activeTab === 'context' ? 'bg-white text-indigo-600 shadow-sm border border-gray-200' : 'text-indigo-600/50 hover:text-indigo-600'}`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI Context
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {!isMobile && (
          <div className="flex bg-gray-100 rounded-lg border border-gray-200 overflow-hidden p-0.5">
            <button onClick={() => setViewportSize('mobile')} className={`p-1.5 rounded-md transition-all ${viewportSize === 'mobile' ? 'bg-white text-indigo-600 border border-gray-200 shadow-sm' : 'text-indigo-600/40 hover:bg-gray-200'}`}><Smartphone className="w-3.5 h-3.5" /></button>
            <button onClick={() => setViewportSize('tablet')} className={`p-1.5 rounded-md transition-all ${viewportSize === 'tablet' ? 'bg-white text-indigo-600 border border-gray-200 shadow-sm' : 'text-indigo-600/40 hover:bg-gray-200'}`}><Tablet className="w-3.5 h-3.5" /></button>
            <button onClick={() => setViewportSize('desktop')} className={`p-1.5 rounded-md transition-all ${viewportSize === 'desktop' ? 'bg-white text-indigo-600 border border-gray-200 shadow-sm' : 'text-indigo-600/40 hover:bg-gray-200'}`}><Monitor className="w-3.5 h-3.5" /></button>
          </div>
        )}
        <button className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-lg text-[10px] sm:text-xs font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95">
          <Save className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export JSX</span>
          <span className="sm:hidden">Export</span>
        </button>
      </div>
    </header>
  );
};

export default StudioHeader;
