import React from 'react';
import { Plus, MousePointer2, Settings2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MobileDock = ({ leftSidebarOpen, setLeftSidebarOpen, rightSidebarOpen, setRightSidebarOpen, activeTab, setActiveTab }) => {
  const isCanvasActive = !leftSidebarOpen && !rightSidebarOpen;

  const NavItem = ({ onClick, isActive, icon: Icon, label }) => (
    <button 
      onClick={onClick}
      className="relative flex flex-col items-center justify-center w-20 h-full group"
    >
      <div className={`relative z-10 flex flex-col items-center gap-1.5 transition-all duration-300 ${isActive ? 'scale-110 -translate-y-1' : 'opacity-60 grayscale'}`}>
         <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-gray-500'}`} />
         <span className={`text-[8px] font-black uppercase tracking-widest ${isActive ? 'text-indigo-600' : 'text-gray-500'}`}>{label}</span>
      </div>
      
      {/* Active Indicator Background */}
      <AnimatePresence>
        {isActive && (
          <motion.div 
            layoutId="activePill"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-x-2 inset-y-2 bg-indigo-50 rounded-xl -z-0"
          />
        )}
      </AnimatePresence>
    </button>
  );

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-[400px] bg-white/90 backdrop-blur-2xl border border-gray-100 rounded-[24px] h-20 flex items-center justify-between px-4 z-[200] shadow-[0_20px_50px_rgba(0,0,0,0.15)] ring-1 ring-black/5">
      <NavItem 
        onClick={() => { setLeftSidebarOpen(true); setRightSidebarOpen(false); }}
        isActive={leftSidebarOpen}
        icon={Plus}
        label="Tools"
      />
      
      <div className="w-[1px] h-8 bg-gray-100" />

      <NavItem 
        onClick={() => { setLeftSidebarOpen(false); setRightSidebarOpen(false); setActiveTab('visual'); }}
        isActive={isCanvasActive}
        icon={MousePointer2}
        label="Canvas"
      />

      <div className="w-[1px] h-8 bg-gray-100" />

      <NavItem 
        onClick={() => { setRightSidebarOpen(true); setLeftSidebarOpen(false); }}
        isActive={rightSidebarOpen}
        icon={Settings2}
        label="Props"
      />
    </div>
  );
};

export default MobileDock;
