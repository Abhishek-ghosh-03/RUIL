import { motion } from "framer-motion";
import { Terminal, Box, ChevronRight, Plus, Check } from "lucide-react";

const ComponentCard = ({ component, onClick, onAdd, isAdded }) => {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group relative bg-white border border-gray-100 rounded-2xl p-6 cursor-pointer hover:border-black transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-black/10 overflow-hidden"
      onClick={() => onClick(component)}
    >
      <div className="flex justify-between items-start mb-4">
        <h2 className="font-bold text-xl text-gray-900 group-hover:text-black transition-colors tracking-tight">
          {component.name}
        </h2>
        <div className="flex items-center gap-2">
          {/* Add to Bundle Button */}
          <button 
            className={`p-2 rounded-xl transition-all border ${isAdded ? 'bg-black border-black text-white shadow-md' : 'bg-gray-50 border-gray-100 text-gray-400 hover:text-gray-900 hover:border-gray-300'}`}
            onClick={(e) => {
              e.stopPropagation();
              onAdd(component);
            }}
          >
            {isAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4 shadow-sm" />}
          </button>
          
          <div className="bg-gray-50 p-2 rounded-xl group-hover:bg-gray-100 transition-colors border border-gray-100">
            {component.type === "cli" ? (
              <Terminal className="text-gray-400 group-hover:text-black w-4 h-4" />
            ) : (
              <Box className="text-gray-400 group-hover:text-black w-4 h-4" />
            )}
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-6 font-medium line-clamp-2 min-h-[40px] leading-relaxed">
        {component.description || "A beautifully crafted component for your next project."}
      </p>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-gray-100 text-black text-[10px] font-black rounded-lg border border-gray-200 uppercase tracking-tight">
            {component.library}
          </span>
          <span className="px-2.5 py-1 bg-gray-50 text-gray-500 text-[10px] font-black rounded-lg border border-gray-100 uppercase tracking-tight">
            {component.category}
          </span>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-black transition-colors transform group-hover:translate-x-1" />
      </div>
    </motion.div>
  );
};

export default ComponentCard;