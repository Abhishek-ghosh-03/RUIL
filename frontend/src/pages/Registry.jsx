import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Filter, BookOpen } from "lucide-react";
import Navbar from "../components/Navbar";
import LibrarySidebar from "../components/LibrarySidebar";
import LibraryGuide from "../components/LibraryGuide";
import { UI_LIBRARIES } from "../data/libraries";

const Registry = () => {
  const [selectedLibId, setSelectedLibId] = useState(UI_LIBRARIES[0].id);
  const [isMobileListOpen, setIsMobileListOpen] = useState(false);

  const selectedLib = UI_LIBRARIES.find(l => l.id === selectedLibId);

  return (
    <div className="h-screen bg-white text-gray-900 flex flex-col overflow-hidden">
      <Navbar />
      
      {/* Mobile Library Selector Bar */}
      <div className="md:hidden mt-20 px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
            {selectedLib?.logoURL ? (
              <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center p-1.5 shadow-sm overflow-hidden flex-shrink-0">
                 <img src={selectedLib?.logoURL} alt={selectedLib?.name} className="w-full h-full object-contain" />
              </div>
            ) : (
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${selectedLib?.color} flex items-center justify-center text-white shadow-md flex-shrink-0`}>
                <BookOpen size={16} />
              </div>
            )}
            <div className="min-w-0">
              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-none block mb-0.5">Ecosystem</span>
              <h3 className="text-xs font-black text-gray-900 leading-none truncate">{selectedLib?.name}</h3>
            </div>
        </div>
        <button 
          onClick={() => setIsMobileListOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold shadow-lg shadow-indigo-100"
        >
          <Filter size={14} /> Browse All
        </button>
      </div>

      <div className="flex flex-grow md:pt-20 overflow-hidden min-h-0">
        {/* Desktop Sidebar (Hidden on Mobile) */}
        <div className="hidden md:block">
          <LibrarySidebar 
            selectedId={selectedLibId} 
            onSelect={setSelectedLibId} 
          />
        </div>

        {/* Mobile Library List Drawer */}
        <AnimatePresence>
          {isMobileListOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileListOpen(false)}
                className="fixed inset-0 bg-black/60 z-[80] md:hidden"
              />
              <motion.div 
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 w-[85%] bg-white z-[90] md:hidden flex flex-col"
              >
                 <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-xl font-black text-gray-900">Registry</h2>
                    <button onClick={() => setIsMobileListOpen(false)} className="p-2 bg-gray-100 rounded-full">
                       <ChevronRight size={20} className="rotate-180" />
                    </button>
                 </div>
                 <div className="flex-1 overflow-hidden">
                    <LibrarySidebar 
                      selectedId={selectedLibId} 
                      onSelect={(id) => {
                        setSelectedLibId(id);
                        setIsMobileListOpen(false);
                      }}
                    />
                 </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
        
        {/* Main Content Area */}
        <div className="flex-grow relative flex flex-col min-h-0 h-full">
          <LibraryGuide selectedId={selectedLibId} />
        </div>
      </div>
    </div>
  );
};

export default Registry;
