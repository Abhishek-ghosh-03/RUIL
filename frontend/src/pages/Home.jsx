import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, Sparkles, LayoutGrid, Search, X } from "lucide-react";
import SearchBar from "../components/SearchBar";
import ComponentCard from "../components/ComponentCard";
import PreviewModal from "../components/PreviewModal";
import Filters from "../components/Filters";
import Navbar from "../components/Navbar";
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
    setFilters({ ...filters, q: query });
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

  return (
    <div className="h-screen bg-[#F9FAFB] text-gray-900 flex flex-col overflow-hidden">
      <Navbar />

      {/* Floating Bundle Cart Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsBundleOpen(true)}
        className="fixed bottom-8 right-8 bg-indigo-600 text-white p-4 rounded-full shadow-2xl shadow-indigo-200 z-50 flex items-center gap-3 border border-indigo-400"
      >
        <Layers className="w-6 h-6" />
        {bundle.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white">
            {bundle.length}
          </span>
        )}
      </motion.button>

      <div className="flex flex-1 pt-20 overflow-hidden">
        {/* Left Sidebar: Filters */}
        <aside className="w-80 border-r border-gray-200 bg-white flex flex-col hidden lg:flex shadow-sm">
          <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
            <Filters filters={filters} setFilters={setFilters} />
          </div>

          <div className="p-4 border-t border-gray-100 bg-gray-50/50">
            <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider">AI Insight</span>
              </div>
              <p className="text-[11px] text-indigo-700 leading-relaxed font-medium">
                You are currently browsing <span className="text-indigo-900 font-black">{components.length}</span> components optimized for modern React apps.
              </p>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {/* Header & Quick Action Bar */}
          <header className="p-6 border-b border-gray-200 bg-white z-20">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1 max-w-2xl">
                <SearchBar onSearch={handleSearch} />
              </div>

              <div className="flex items-center gap-4">
                {(filters.q || filters.category || filters.library) && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 font-semibold transition-colors"
                  >
                    <X className="w-3 h-3" /> Clear All Filters
                  </button>
                )}
                <div className="h-4 w-px bg-gray-200 hidden md:block"></div>
                <div className="flex items-center gap-2 text-xs text-gray-500 font-bold uppercase tracking-tight">
                  <LayoutGrid className="w-4 h-4 text-indigo-500" />
                  {components.length} Assets
                </div>
              </div>
            </div>

            {/* Dynamic Category Scroller (Mobile / Tablet) */}
            <div className="flex overflow-x-auto mt-6 pb-2 gap-2 no-scrollbar lg:hidden">
              {[
                { label: 'All', value: '' },
                { label: 'Buttons', value: 'button' },
                { label: 'Inputs', value: 'input' },
                { label: 'Forms', value: 'form' },
                { label: 'Cards', value: 'card' },
                { label: 'Modals', value: 'modal' },
                { label: 'Data Display', value: 'data display' }
              ].map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setFilters({ ...filters, category: cat.value })}
                  className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold border transition-all ${filters.category === cat.value
                    ? "bg-indigo-600 border-indigo-700 text-white shadow-lg"
                    : "bg-white border-gray-200 text-gray-600 hover:border-gray-400"
                    }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </header>

          {/* Scrollable Results Area */}
          <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
            <div className="max-w-6xl mx-auto">
              {/* Visual Break/Header */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                  {filters.category ? (
                    <span className="capitalize">{filters.category} Components</span>
                  ) : filters.q ? (
                    <span>Search results for "{filters.q}"</span>
                  ) : (
                    <span>Discover Components</span>
                  )}
                  {!loading && components.length > 0 && (
                    <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded-md font-bold uppercase tracking-tighter">
                      Result
                    </span>
                  )}
                </h2>
                <p className="text-sm text-gray-500 mt-1 font-medium">
                  {filters.library ? `Filtered by ${filters.library} library` : "A curated selection of production-ready React UI elements."}
                </p>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-40 text-indigo-400">
                  <div className="relative">
                    <Layers className="w-12 h-12 animate-spin-slow text-indigo-600" />
                  </div>
                  <p className="mt-6 text-xs tracking-widest uppercase font-black text-indigo-600">Indexing components...</p>
                </div>
              ) : components.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 text-gray-500 text-center border-2 border-dashed border-gray-200 rounded-3xl bg-white/50">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 border border-gray-200">
                    <Search className="w-8 h-8 text-gray-300" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No assets match your search</h3>
                  <p className="text-sm max-w-sm px-6 font-medium">
                    We couldn't find any components matching <span className="text-indigo-600 font-bold">"{filters.q || filters.category}"</span>.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="mt-8 px-6 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 transition-all shadow-sm"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  layout
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-20"
                >
                  {components.map((comp, idx) => (
                    <motion.div
                      key={comp._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(idx * 0.05, 0.5) }}
                    >
                      <ComponentCard
                        component={comp}
                        onClick={setSelected}
                        onAdd={toggleBundleItem}
                        isAdded={!!bundle.find(c => c._id === comp._id)}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {selected && (
          <PreviewModal
            component={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isBundleOpen && (
          <BundleBuilder
            bundle={bundle}
            onClose={() => setIsBundleOpen(false)}
            onRemove={(id) => setBundle(bundle.filter(c => c._id !== id))}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;