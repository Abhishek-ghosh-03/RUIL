import { motion } from "framer-motion";
import { UI_LIBRARIES } from "../data/libraries";
import { Search, Package } from "lucide-react";
import { useState } from "react";

const LibrarySidebar = ({ selectedId, onSelect }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLibraries = UI_LIBRARIES.filter((lib) =>
    lib.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-gray-50 border-r border-gray-200 w-full md:w-80">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Registry</h2>
        <p className="text-[10px] text-gray-500 mb-6 uppercase tracking-widest font-black">
          UI Component Ecosystems
        </p>

        {/* Local Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search libraries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl py-2 pl-10 pr-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm"
          />
        </div>

        <nav className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6 max-h-[calc(100vh-250px)]">
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-4 px-2 tracking-tighter">
              Popular Libraries
            </h3>
            <div className="space-y-1">
              {filteredLibraries.map((lib) => {
                const isActive = selectedId === lib.id;

                return (
                  <button
                    key={lib.id}
                    onClick={() => onSelect(lib.id)}
                    className={`w-full group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-white border border-gray-200 text-indigo-600 shadow-sm"
                        : "text-gray-600 hover:bg-gray-200/50 border border-transparent"
                    }`}
                  >
                    {lib.logoURL ? (
                      <div
                        className={`w-8 h-8 rounded-lg bg-white overflow-hidden flex items-center justify-center p-1.5 shadow-sm border border-gray-100 ${
                          isActive ? "scale-110" : "group-hover:scale-110"
                        } transition-transform`}
                      >
                        <img src={lib.logoURL} alt={lib.name} className="w-full h-full object-contain" />
                      </div>
                    ) : (
                      <div
                        className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${
                          lib.color
                        } flex items-center justify-center text-white shadow-md ${
                          isActive ? "scale-110" : "group-hover:scale-110"
                        } transition-transform`}
                      >
                        <Package className="w-4 h-4" />
                      </div>
                    )}
                    <div className="text-left">
                      <span className={`block text-sm font-bold tracking-tight ${isActive ? 'text-gray-900' : 'text-gray-700'}`}>
                        {lib.name}
                      </span>
                      <span className="block text-[10px] text-gray-400 font-medium">
                        {lib.category}
                      </span>
                    </div>
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.5)]"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-gray-200 bg-white/50">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-2xl border border-indigo-100">
          <p className="text-[10px] text-indigo-600 font-black uppercase mb-1">
            Pro Tip
          </p>
          <p className="text-xs text-indigo-900 font-medium leading-relaxed">
            Mix shadcn with Tailwind UI for the best of both worlds.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LibrarySidebar;
