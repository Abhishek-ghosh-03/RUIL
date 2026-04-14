import { motion } from "framer-motion";
import { UI_LIBRARIES } from "../data/libraries";
import { Terminal, Check, Copy, AlertTriangle, Lightbulb, PackageOpen, ArrowRight, Sparkles, Zap, ExternalLink, Tag, RefreshCw } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { fetchLibraryUpdates } from "../services/api";

// ── Relative time helper ───────────────────────────────────────────
function timeAgo(ts) {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)   return "Just now";
  if (mins < 60)  return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)   return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30)  return `${days}d ago`;
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const LibraryGuide = ({ selectedId }) => {
  const [copied, setCopied] = useState("");
  const [liveReleases, setLiveReleases] = useState([]);
  const [releasesLoading, setReleasesLoading] = useState(false);
  const scrollContainerRef = useRef(null);
  const lib = UI_LIBRARIES.find((l) => l.id === selectedId) || UI_LIBRARIES[0];

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [selectedId]);

  // Fetch live releases from GitHub
  useEffect(() => {
    const loadReleases = async () => {
      setReleasesLoading(true);
      try {
        const res = await fetchLibraryUpdates(selectedId);
        const releases = (res.data.updates || []).filter(u => u.type === "release").slice(0, 5);
        setLiveReleases(releases);
      } catch {
        setLiveReleases([]);
      } finally {
        setReleasesLoading(false);
      }
    };
    loadReleases();
  }, [selectedId]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(""), 2000);
  };

  return (
    <div 
      ref={scrollContainerRef}
      className="flex-grow overflow-y-auto bg-white p-3 md:p-8 lg:p-12 h-full custom-scrollbar"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col gap-4 md:gap-6 mb-8 md:mb-12 border-b border-gray-100 pb-6 md:pb-12">
          <div>
            <div className="flex items-center gap-4 md:gap-6 mb-6">
              {lib.logoURL ? (
                <div className="w-14 h-14 md:w-20 md:h-20 bg-white border border-gray-100 rounded-xl md:rounded-2xl shadow-sm flex items-center justify-center p-2 md:p-3 flex-shrink-0">
                  <img src={lib.logoURL} alt={lib.name} className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className={`w-14 h-14 md:w-20 md:h-20 bg-gradient-to-tr ${lib.color} border border-gray-100/20 rounded-xl md:rounded-2xl shadow-lg flex items-center justify-center text-white flex-shrink-0`}>
                  <PackageOpen size={24} />
                </div>
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-2 md:gap-4 mb-1 flex-wrap">
                  <span className="px-2 md:px-3 py-0.5 md:py-1 bg-indigo-50 border border-indigo-100 text-indigo-600 text-[8px] md:text-[10px] font-black uppercase tracking-widest rounded-full">
                    Installation Guide
                  </span>
                </div>
                <h1 className="text-2xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-none">
                  {lib.name}
                </h1>
              </div>
            </div>
            <p className="text-sm md:text-lg text-gray-500 leading-relaxed font-medium">
              Everything you need to integrate <span className="text-gray-900 font-bold">{lib.name}</span> into your React ecosystem.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 md:gap-3">
             <a 
               href={lib.docsURL}
               target="_blank"
               rel="noopener noreferrer"
               className="px-3 md:px-5 py-2 md:py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all text-xs md:text-sm flex items-center gap-1.5 md:gap-2"
             >
               Docs <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
             </a>
             <Link
               to={`/library/${lib.id}`}
               className="px-3 md:px-5 py-2 md:py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all text-xs md:text-sm flex items-center gap-1.5 md:gap-2"
             >
               <Zap className="w-3.5 h-3.5 md:w-4 md:h-4" /> Live
             </Link>
             <a
               href={`https://github.com/${lib.githubRepo}`}
               target="_blank"
               rel="noopener noreferrer"
               className="px-3 md:px-5 py-2 md:py-2.5 bg-white text-gray-600 font-bold rounded-xl border border-gray-200 hover:text-gray-900 hover:border-gray-400 transition-all text-xs md:text-sm"
             >
               GitHub
             </a>
          </div>
        </div>

        {/* Updates Section — Live from GitHub */}
        <section className="mb-8 md:mb-12">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h3 className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm font-bold text-gray-400 uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-purple-500" /> Recent Releases
              {liveReleases.length > 0 && (
                <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-100 text-emerald-600 text-[9px] font-black uppercase tracking-wider rounded-full flex items-center gap-1 ml-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  Live
                </span>
              )}
            </h3>
            <Link 
              to={`/library/${lib.id}`}
              className="text-[10px] font-bold text-indigo-500 hover:text-indigo-700 uppercase tracking-widest flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight size={10} />
            </Link>
          </div>

          {releasesLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-gray-50 border border-gray-200 rounded-xl md:rounded-2xl p-4 md:p-6 animate-pulse">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                    <div className="w-20 h-5 bg-gray-200 rounded" />
                    <div className="w-16 h-4 bg-gray-100 rounded" />
                  </div>
                  <div className="w-3/4 h-4 bg-gray-100 rounded ml-6" />
                </div>
              ))}
            </div>
          ) : liveReleases.length > 0 ? (
            <div className="space-y-4">
              {liveReleases.map((release, idx) => (
                <div key={release.id} className="bg-gray-50 border border-gray-200 rounded-xl md:rounded-2xl p-4 md:p-6 relative overflow-hidden group hover:border-indigo-100 transition-all">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4 relative z-10">
                    <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                      <div className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full flex-shrink-0 ${idx === 0 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-gray-300'}`} />
                      <Tag size={12} className={`flex-shrink-0 ${idx === 0 ? "text-emerald-600" : "text-gray-400"}`} />
                      <span className="text-sm md:text-lg font-black text-gray-900 tracking-tight">{release.tag || release.title}</span>
                      <span className="px-1.5 md:px-2 py-0.5 bg-white border border-gray-200 text-gray-500 text-[9px] md:text-[10px] font-bold rounded uppercase">
                        {timeAgo(release.timestamp)}
                      </span>
                    </div>
                    <a 
                      href={release.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-indigo-600 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <ExternalLink size={14} />
                    </a>
                  </div>
                  {release.title && release.tag && release.title !== release.tag && (
                    <p className="text-xs md:text-sm text-gray-600 font-medium mt-2 md:mt-3 ml-4 md:ml-6 leading-relaxed line-clamp-2">
                      {release.title}
                    </p>
                  )}
                  {release.body && (
                    <p className="text-[10px] md:text-xs text-gray-400 font-medium mt-1.5 md:mt-2 ml-4 md:ml-6 leading-relaxed line-clamp-2">
                      {release.body}
                    </p>
                  )}
                  {idx === 0 && (
                    <div className="absolute top-0 right-0 px-2 md:px-3 py-0.5 md:py-1 bg-emerald-600 text-white text-[8px] md:text-[10px] font-black uppercase tracking-tighter rounded-bl-xl shadow-md">
                      Latest Release
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : lib.updates?.length > 0 ? (
            /* Fallback to static data */
            <div className="space-y-3 md:space-y-4">
              {lib.updates.map((update, idx) => (
                <div key={update.version} className="bg-gray-50 border border-gray-200 rounded-xl md:rounded-2xl p-4 md:p-6 relative overflow-hidden group">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4 relative z-10">
                    <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                       <div className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full flex-shrink-0 ${idx === 0 ? 'bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.5)]' : 'bg-gray-300'}`}></div>
                       <span className="text-sm md:text-lg font-black text-gray-900 tracking-tight">{update.version}</span>
                       <span className="px-1.5 md:px-2 py-0.5 bg-white border border-gray-200 text-gray-500 text-[9px] md:text-[10px] font-bold rounded uppercase">
                         {update.date}
                       </span>
                    </div>
                    <p className="text-sm text-gray-600 font-medium flex-grow md:ml-8 leading-relaxed">
                      {update.text}
                    </p>
                  </div>
                  {idx === 0 && (
                    <div className="absolute top-0 right-0 px-2 md:px-3 py-0.5 md:py-1 bg-indigo-600 text-white text-[8px] md:text-[10px] font-black uppercase tracking-tighter rounded-bl-xl shadow-md">
                      Latest Release
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center border-2 border-dashed border-gray-100 rounded-2xl">
              <Tag className="w-6 h-6 mx-auto text-gray-200 mb-2" />
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">No releases available</p>
            </div>
          )}
        </section>

        {/* Installation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-12">
          {/* Main Commands */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h3 className="flex items-center gap-2 text-xs md:text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 md:mb-4">
                <Terminal className="w-3.5 h-3.5 md:w-4 md:h-4 text-indigo-500" /> CLI Commands
              </h3>
              <div className="space-y-3">
                {lib.installCommands?.map((cmd) => (
                  <div key={cmd} className="group relative bg-gray-50 border border-gray-200 rounded-xl p-3 md:p-4 font-mono text-[10px] md:text-sm text-gray-900 overflow-hidden">
                    <div className="flex justify-between items-center relative z-10 font-bold gap-2">
                      <span className="flex items-center gap-2 overflow-x-auto whitespace-nowrap custom-scrollbar">
                         <span className="text-gray-400">$</span> {cmd}
                      </span>
                      <button 
                         onClick={() => handleCopy(cmd)}
                         className="p-1.5 hover:bg-white rounded-lg text-gray-400 hover:text-indigo-600 transition-all opacity-0 group-hover:opacity-100 shadow-sm border border-transparent hover:border-gray-200"
                      >
                         {copied === cmd ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="absolute inset-y-0 left-0 w-1 bg-indigo-600 transform -translate-x-full group-hover:translate-x-0 transition-transform"></div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="flex items-center gap-2 text-xs md:text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 md:mb-4">
                <PackageOpen className="w-3.5 h-3.5 md:w-4 md:h-4 text-indigo-500" /> Usage Example
              </h3>
              <div className="bg-gray-900 rounded-xl md:rounded-2xl overflow-hidden shadow-xl">
                <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                   <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Main.jsx</span>
                   <button 
                     onClick={() => handleCopy(lib.importExample)}
                     className="text-[10px] text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
                   >
                     {copied === lib.importExample ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} Copy Code
                   </button>
                </div>
                <pre className="p-4 md:p-6 text-[10px] md:text-sm text-indigo-200 font-mono leading-relaxed overflow-x-auto custom-scrollbar">
                  {lib.importExample}
                </pre>
              </div>
            </section>
          </div>

          {/* Sidebar Specs */}
          <div className="space-y-4 md:space-y-6">
            <div className="bg-gray-50 border border-gray-200 rounded-xl md:rounded-2xl p-4 md:p-6">
              <h4 className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-gray-900 uppercase tracking-widest mb-4 md:mb-6">
                <Lightbulb className="w-4 h-4 text-yellow-600" /> Prerequisites
              </h4>
              <ul className="space-y-4">
                {lib.prerequisites?.map(step => (
                  <li key={step} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-50 border border-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-sm text-gray-600 font-medium">{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-orange-50 border border-orange-100 rounded-xl md:rounded-2xl p-4 md:p-6 font-medium">
              <h4 className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-orange-700 uppercase tracking-widest mb-2 md:mb-3">
                <AlertTriangle className="w-4 h-4" /> Important Note
              </h4>
              <p className="text-sm text-orange-900/70 leading-relaxed">
                {lib.warning}
              </p>
            </div>

            <div className="p-1 px-6">
              <p className="text-[11px] text-gray-500 italic font-medium">
                {lib.notes}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryGuide;
