import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, Sparkles, LayoutGrid, Search, X, ChevronRight, ArrowRight, Zap, Globe, Cpu, Package, Code, Terminal, Box, Database, MousePointer2, ChevronDown } from "lucide-react";
import SearchBar from "../components/SearchBar";
import ComponentCard from "../components/ComponentCard";
import PreviewModal from "../components/PreviewModal";
import Filters from "../components/Filters";
import BundleBuilder from "../components/BundleBuilder";
import { searchComponents } from "../services/api";

const Home = () => {
  const [components, setComponents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [bundle, setBundle] = useState([]);
  const [isBundleOpen, setIsBundleOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    q: "",
    category: "",
    framework: "",
    library: ""
  });

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await searchComponents(filters);
      setComponents(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setFilters({ ...filters, q: query, category: "" });
  };

  const toggleBundleItem = (comp) => {
    setBundle(prev => {
      const exists = prev.find(c => c._id === comp._id);
      if (exists) return prev.filter(c => c._id !== comp._id);
      return [...prev, comp];
    });
  };

  const clearFilters = () => {
    setFilters({ q: "", category: "", framework: "", library: "" });
  };

  const groupedComponents = useMemo(() => {
    const groups = {};
    components.forEach(comp => {
      const cat = comp.category || "General";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(comp);
    });
    return groups;
  }, [components]);

  const isSearching = filters.q || filters.category || filters.library;

  const LIBRARIES = ['SHADCN UI', 'MATERIAL UI', 'CHAKRA UI', 'NEXT UI', 'MANTINE UI', 'ANT DESIGN', 'RADIX UI', 'HEADLESS UI'];

  // User requested mapping: Forms -> Inputs, Overlays -> Modals
  // Backend Registry tags matching: input, form, modal, navigation, feedback, data display
  const CATEGORY_MAP = {
    'Featured': '',
    'Inputs': 'input',
    'Navigation': 'navigation',
    'Data Display': 'data display',
    'Feedback': 'feedback',
    'Modals': 'modal'
  };

  const CATEGORIES = Object.keys(CATEGORY_MAP);

  return (
    <div className="h-screen text-gray-900 flex flex-col overflow-hidden font-sans selection:bg-black selection:text-white">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsBundleOpen(true)}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 bg-black text-white p-4 rounded-full shadow-2xl shadow-black/20 z-50 flex items-center gap-3 border border-white/10"
      >
        <Layers className="w-6 h-6" />
        {bundle.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white">
            {bundle.length}
          </span>
        )}
      </motion.button>

      <div className="flex flex-1 pt-16 md:pt-20 overflow-hidden">
        <aside className="w-72 border-r border-gray-100 bg-white flex flex-col hidden xl:flex">
          <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
            <Filters filters={filters} setFilters={setFilters} />
          </div>
        </aside>

        <main className="flex-1 flex flex-col overflow-hidden relative bg-transparent">
          <header className="relative px-4 md:px-6 py-4 md:py-6 border-b border-gray-100 bg-white/60 backdrop-blur-xl z-[40]">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 mb-6 md:mb-8">
                <div className="flex-1 w-full">
                  <SearchBar onSearch={handleSearch} />
                </div>
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-[9px] text-emerald-600 font-black uppercase tracking-widest mb-1">● System Active</span>
                  <span className="text-sm font-black text-gray-900 leading-none">{components.length} Assets Available</span>
                </div>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                {CATEGORIES.map((cat) => {
                  const targetTag = CATEGORY_MAP[cat];
                  const isActive = (cat === 'Featured' && filters.category === "") ||
                    (filters.category.toLowerCase() === targetTag.toLowerCase());

                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        setFilters({ ...filters, category: targetTag, q: "" });
                      }}
                      className={`whitespace-nowrap px-5 md:px-6 py-2 md:py-2.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all border ${isActive
                        ? "bg-black text-white border-black shadow-lg shadow-black/5"
                        : "bg-white/80 text-gray-400 border-gray-100 hover:border-black hover:text-black"
                        }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto custom-scrollbar scroll-smooth relative z-10">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">

              <div className="relative w-full py-12 md:py-16 mb-8 md:mb-10 flex items-center justify-center overflow-hidden min-h-[300px] md:min-h-[420px]">

                {/* Calligraphy Background Text Layer */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.04] flex flex-col justify-around scale-110 overflow-hidden">
                  <div className="flex flex-col gap-10 md:gap-12">
                    {LIBRARIES.map((name, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          x: i % 2 === 0 ? ["-150%", "150%"] : ["150%", "-150%"]
                        }}
                        transition={{
                          duration: 20 + i * 5,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                        className="whitespace-nowrap text-3xl md:text-5xl font-black tracking-tight text-indigo-950 uppercase"
                      >
                        {name} • {name} • {name} • {name} • {name} • {name} • {name} • {name}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Geometric Mesh Layer */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(120deg, #6b7280 1px, transparent 1px), linear-gradient(210deg, #6b7280 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-around w-full max-w-6xl px-6 md:px-12 gap-8 md:gap-14">

                  {/* Floating Text Features */}
                  <div className="flex-1 flex flex-col items-center md:items-end text-center md:text-right gap-8 md:gap-12 w-full">
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="w-full"
                    >
                      <h3 className="text-xs md:text-sm font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-black mb-1 md:mb-2 flex items-center justify-center md:justify-end gap-3">
                        <Database size={14} className="text-gray-300" /> 14+ Libraries
                      </h3>
                      <p className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest">Unified UI Component Architecture</p>
                    </motion.div>
                    <motion.div
                      animate={{ y: [0, 8, 0] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                      className="w-full"
                    >
                      <h3 className="text-xs md:text-sm font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-black mb-1 md:mb-2 flex items-center justify-center md:justify-end gap-3">
                        <Cpu size={14} className="text-gray-300" /> AI Composer
                      </h3>
                      <p className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest">Automated Page Structure Engine</p>
                    </motion.div>
                  </div>

                  {/* Logo - Pulsing Motion */}
                  <div className="flex-shrink-0 relative group py-4 md:py-0">
                    <div className="absolute inset-x-0 bottom-0 top-0 bg-white/40 blur-[30px] md:blur-[50px] opacity-100 z-0" />
                      <motion.img 
                        animate={{ scale: [1, 1.05, 1], rotate: [0, 2, 0, -2, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        src="/ruil-logo.png" alt="RUIL" 
                        className="w-24 h-24 md:w-32 md:h-32 object-contain relative z-10 rounded-full" 
                      />
                  </div>

                  {/* Floating Text Features */}
                  <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left gap-8 w-full">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                      className="w-full"
                    >
                      <h3 className="text-xs md:text-sm font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-black mb-1 md:mb-2 flex items-center justify-center md:justify-start gap-3">
                        <Zap size={14} className="text-gray-300" /> Live Preview
                      </h3>
                      <p className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest">Instant Framed Component View</p>
                    </motion.div>
                    <motion.div
                      animate={{ y: [0, 10, 0] }}
                      transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                      className="w-full"
                    >
                      <h3 className="text-xs md:text-sm font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-black mb-1 md:mb-2 flex items-center justify-center md:justify-start gap-3">
                        <Terminal size={14} className="text-gray-300" /> RUIL CLI
                      </h3>
                      <p className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest">Unified Installer Package</p>
                    </motion.div>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="flex py-20 md:py-40 justify-center">
                  <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <div className="space-y-12 md:space-y-16 pb-24">
                  {isSearching ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                      {components.map((comp) => (
                        <ComponentCard key={comp._id} component={comp} onClick={setSelected} onAdd={toggleBundleItem} isAdded={!!bundle.find(c => c._id === comp._id)} />
                      ))}
                    </div>
                  ) : (
                    Object.entries(groupedComponents).map(([category, items]) => (
                      <section key={category}>
                        <div className="flex items-center justify-between mb-6 md:mb-8">
                          <h2 className="text-lg md:text-2xl font-black text-gray-900 tracking-tight">{category}</h2>
                          <button
                            onClick={() => {
                              setFilters({ ...filters, category: category.toLowerCase(), q: "" });
                            }}
                            className="text-[10px] md:text-xs font-black text-indigo-600 flex items-center gap-1"
                          >
                            View All <ChevronRight size={14} />
                          </button>
                        </div>
                        <div className="flex gap-4 md:gap-6 overflow-x-auto no-scrollbar pb-4">
                          {items.map((comp) => (
                            <div key={comp._id} className="min-w-[280px] md:min-w-[320px] flex-shrink-0">
                              <ComponentCard component={comp} onClick={setSelected} onAdd={toggleBundleItem} isAdded={!!bundle.find(c => c._id === comp._id)} />
                            </div>
                          ))}
                        </div>
                      </section>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <AnimatePresence>
        {selected && <PreviewModal component={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>

      <AnimatePresence>
        {isBundleOpen && <BundleBuilder bundle={bundle} onClose={() => setIsBundleOpen(false)} onRemove={(id) => setBundle(bundle.filter(c => c._id !== id))} />}
      </AnimatePresence>
    </div>
  );
};

export default Home;