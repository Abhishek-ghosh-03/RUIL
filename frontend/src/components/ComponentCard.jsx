import { motion } from "framer-motion";
import { Terminal, Box, ChevronRight, Plus, Check, Sparkles } from "lucide-react";

const LIB_COLORS = {
  "shadcn": "bg-black text-white border-black",
  "shadcn/ui": "bg-black text-white border-black",
  "mui": "bg-blue-600 text-white border-blue-700",
  "material ui": "bg-blue-600 text-white border-blue-700",
  "chakra": "bg-teal-500 text-white border-teal-600",
  "chakra ui": "bg-teal-500 text-white border-teal-600",
  "mantine": "bg-blue-500 text-white border-blue-600",
  "ant": "bg-red-500 text-white border-red-600",
  "ant design": "bg-red-500 text-white border-red-600",
  "nextui": "bg-zinc-900 text-white border-zinc-800",
  "radix": "bg-violet-600 text-white border-violet-700",
};

const getDefaultColor = (name) => {
  const normalized = name?.toLowerCase();
  for (const [key, color] of Object.entries(LIB_COLORS)) {
    if (normalized?.includes(key)) return color;
  }
  return "bg-gray-900 text-white border-gray-900"; // Default secondary
};

const ComponentCard = ({ component, onClick, onAdd, isAdded }) => {
  const libColor = getDefaultColor(component.library);

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className="group relative bg-white border border-gray-100 rounded-[2rem] p-6 cursor-pointer hover:border-indigo-100 transition-all duration-300 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 overflow-hidden"
      onClick={() => onClick(component)}
    >
      {/* Subtle Glow Background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 -mr-10 -mt-10" />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-5">
          <div className="flex-1 pr-4">
            <h2 className="font-black text-xl text-gray-900 group-hover:text-indigo-600 transition-colors tracking-tight leading-tight mb-1">
              {component.name}
            </h2>
            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
               <Sparkles size={10} className="text-indigo-400" />
               <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400">Ready to build</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Action Icon */}
            <div className="bg-gray-50/50 p-2.5 rounded-2xl group-hover:bg-indigo-50 transition-colors border border-gray-100 group-hover:border-indigo-100">
              {component.type === "cli" ? (
                <Terminal className="text-gray-400 group-hover:text-indigo-600 w-4 h-4" />
              ) : (
                <Box className="text-gray-400 group-hover:text-indigo-600 w-4 h-4" />
              )}
            </div>

            {/* Add to Bundle Toggle */}
            <button 
              className={`p-2.5 rounded-2xl transition-all border ${
                isAdded 
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' 
                : 'bg-white border-gray-100 text-gray-400 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50/30'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onAdd(component);
              }}
            >
              {isAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-8 font-medium line-clamp-2 min-h-[44px] leading-relaxed group-hover:text-gray-600 transition-colors">
          {component.description || "A beautifully crafted component for your next project."}
        </p>

        <div className="flex items-center justify-between pt-5 border-t border-gray-50">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 text-[9px] font-black rounded-full border shadow-sm uppercase tracking-wider ${libColor}`}>
              {component.library}
            </span>
            <span className="px-3 py-1 bg-gray-50 text-gray-400 text-[9px] font-black rounded-full border border-gray-100 uppercase tracking-wider">
              {component.category}
            </span>
          </div>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-gray-200 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-all transform group-hover:translate-x-1">
            <ChevronRight size={18} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ComponentCard;