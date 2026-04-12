import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, GitCommit, Tag, Wrench, Sparkles, FileText, RefreshCw,
  Clock, ExternalLink, Package, AlertCircle, Zap, ChevronDown
} from "lucide-react";
import Navbar from "../components/Navbar";
import { UI_LIBRARIES } from "../data/libraries";
import { fetchLibraryUpdates } from "../services/api";

// ── Badge config ───────────────────────────────────────────────────
const BADGE_MAP = {
  release: { label: "Release",  color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: Tag },
  feature: { label: "New",      color: "bg-indigo-100 text-indigo-700 border-indigo-200",    icon: Sparkles },
  fix:     { label: "Fix",      color: "bg-amber-100 text-amber-700 border-amber-200",       icon: Wrench },
  docs:    { label: "Docs",     color: "bg-sky-100 text-sky-700 border-sky-200",              icon: FileText },
  chore:   { label: "Chore",    color: "bg-gray-100 text-gray-600 border-gray-200",           icon: RefreshCw },
  update:  { label: "Update",   color: "bg-purple-100 text-purple-700 border-purple-200",     icon: GitCommit },
};

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

// ── Filter pill ────────────────────────────────────────────────────
const FilterPill = ({ active, label, onClick, count }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider border transition-all ${
      active
        ? "bg-indigo-600 text-white border-indigo-700 shadow-md shadow-indigo-200"
        : "bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700"
    }`}
  >
    {label}
    {count > 0 && (
      <span className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-black ${
        active ? "bg-white/20 text-white" : "bg-gray-100 text-gray-400"
      }`}>
        {count}
      </span>
    )}
  </button>
);

// ── Single update card ─────────────────────────────────────────────
const UpdateCard = ({ item, index }) => {
  const badge = BADGE_MAP[item.type] || BADGE_MAP.update;
  const BadgeIcon = badge.icon;
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.5) }}
      className="group relative bg-white border border-gray-100 rounded-xl md:rounded-2xl p-3.5 md:p-5 hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-50/50 transition-all duration-300"
    >
      {/* Left accent line */}
      <div className={`absolute left-0 top-4 bottom-4 w-1 rounded-full transition-all duration-300 ${
        item.type === "release" ? "bg-emerald-500" :
        item.type === "feature" ? "bg-indigo-500" :
        item.type === "fix" ? "bg-amber-500" : "bg-gray-200 group-hover:bg-indigo-300"
      }`} />

      <div className="pl-4 flex flex-col gap-3">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${badge.color}`}>
                <BadgeIcon size={10} />
                {badge.label}
              </span>
              {item.tag && (
                <span className="px-2 py-0.5 bg-gray-50 border border-gray-100 rounded-md text-[10px] font-bold text-gray-500 font-mono">
                  {item.tag}
                </span>
              )}
              {item.sha && (
                <span className="px-2 py-0.5 bg-gray-50 border border-gray-100 rounded-md text-[10px] font-mono text-gray-400">
                  {item.sha}
                </span>
              )}
            </div>
            <h3 className="text-xs md:text-sm font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-indigo-700 transition-colors">
              {item.title}
            </h3>
          </div>

          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 p-2 text-gray-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
            title="View on GitHub"
          >
            <ExternalLink size={14} />
          </a>
        </div>

        {/* Body preview for releases */}
        {item.body && (
          <>
            <p className={`text-xs text-gray-500 leading-relaxed font-medium ${expanded ? "" : "line-clamp-2"}`}>
              {item.body}
            </p>
            {item.body.length > 120 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-[10px] text-indigo-500 hover:text-indigo-700 font-bold flex items-center gap-1 transition-colors"
              >
                {expanded ? "Show less" : "Read more"}
                <ChevronDown size={10} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
              </button>
            )}
          </>
        )}

        {/* Footer */}
        <div className="flex items-center gap-2 md:gap-3 text-[9px] md:text-[10px] text-gray-400 font-medium flex-wrap">
          {item.avatarURL && (
            <img src={item.avatarURL} alt={item.author} className="w-4 h-4 rounded-full" />
          )}
          <span className="font-bold text-gray-500">{item.author}</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock size={9} />
            {timeAgo(item.timestamp)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// ── Skeleton loader ────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white border border-gray-100 rounded-2xl p-5 animate-pulse">
    <div className="pl-4 space-y-3">
      <div className="flex gap-2">
        <div className="w-16 h-5 bg-gray-100 rounded-md" />
        <div className="w-12 h-5 bg-gray-100 rounded-md" />
      </div>
      <div className="w-3/4 h-4 bg-gray-100 rounded" />
      <div className="w-1/2 h-4 bg-gray-100 rounded" />
      <div className="flex gap-2 items-center">
        <div className="w-4 h-4 bg-gray-100 rounded-full" />
        <div className="w-20 h-3 bg-gray-100 rounded" />
        <div className="w-16 h-3 bg-gray-100 rounded" />
      </div>
    </div>
  </div>
);

// ══════════════════════════════════════════════════════════════════
// ██  MAIN PAGE COMPONENT
// ══════════════════════════════════════════════════════════════════
const LibraryUpdates = () => {
  const { id } = useParams();
  const lib = UI_LIBRARIES.find((l) => l.id === id);

  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetched, setLastFetched] = useState(null);
  const [filter, setFilter] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadUpdates = useCallback(async (showLoader = true) => {
    if (!id) return;
    if (showLoader) setLoading(true);
    else setIsRefreshing(true);
    setError(null);

    try {
      const res = await fetchLibraryUpdates(id);
      setUpdates(res.data.updates || []);
      setLastFetched(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Failed to fetch updates:", err);
      setError("Could not reach GitHub. Updates will retry shortly.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [id]);

  // Initial load
  useEffect(() => {
    loadUpdates(true);
  }, [loadUpdates]);

  // Polling every 60s
  useEffect(() => {
    const interval = setInterval(() => loadUpdates(false), 60000);
    return () => clearInterval(interval);
  }, [loadUpdates]);

  // Filtered updates
  const filtered = filter === "all" ? updates : updates.filter((u) => u.type === filter);

  // Count per type
  const counts = updates.reduce((acc, u) => {
    acc[u.type] = (acc[u.type] || 0) + 1;
    return acc;
  }, {});

  if (!lib) {
    return (
      <div className="h-screen bg-white flex flex-col overflow-hidden">
        <Navbar />
        <div className="flex-1 flex items-center justify-center pt-20">
          <div className="text-center">
            <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Library not found</h2>
            <p className="text-sm text-gray-500 mb-6">The library "{id}" doesn't exist in our registry.</p>
            <Link to="/registry" className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all text-sm">
              Back to Registry
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#F9FAFB] flex flex-col overflow-hidden">
      <Navbar />

      <main className="flex-1 overflow-y-auto pt-20 custom-scrollbar">
        <div className="max-w-4xl mx-auto px-4 md:px-10 py-6 md:py-10">

          {/* ── Back link ─────────────────────────────────── */}
          <Link
            to="/registry"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-indigo-600 transition-colors mb-8 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to Registry
          </Link>

          {/* ── Hero header ───────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-5 mb-8 md:mb-10 pb-6 md:pb-8 border-b border-gray-100"
          >
            <div className="flex items-center gap-4">
              {lib.logoURL ? (
                <div className="w-12 h-12 md:w-16 md:h-16 bg-white border border-gray-100 rounded-xl md:rounded-2xl shadow-sm flex items-center justify-center p-2 md:p-2.5 flex-shrink-0">
                  <img src={lib.logoURL} alt={lib.name} className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className={`w-12 h-12 md:w-16 md:h-16 bg-gradient-to-tr ${lib.color} rounded-xl md:rounded-2xl shadow-lg flex items-center justify-center text-white flex-shrink-0`}>
                  <Package size={22} />
                </div>
              )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 md:gap-3 mb-0.5 flex-wrap">
                <h1 className="text-xl md:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">{lib.name}</h1>
                <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1">
                  <Zap size={8} />
                  Live
                </span>
              </div>
              <p className="text-xs md:text-sm text-gray-500 font-medium truncate">
                Real-time updates from <span className="text-gray-700 font-bold">{lib.githubRepo}</span>
                {lastFetched && (
                  <span className="text-gray-400 hidden md:inline"> • Last checked {lastFetched}</span>
                )}
              </p>
            </div>
            </div>

            <button
              onClick={() => loadUpdates(false)}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 bg-white text-gray-600 font-bold rounded-xl border border-gray-200 hover:border-indigo-200 hover:text-indigo-600 transition-all text-[10px] md:text-xs disabled:opacity-50 shadow-sm self-start"
            >
              <RefreshCw size={12} className={isRefreshing ? "animate-spin" : ""} />
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </button>
          </motion.div>

          {/* ── Filter bar ────────────────────────────────── */}
          {!loading && updates.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex gap-2 mb-6 md:mb-8 overflow-x-auto pb-2 -mx-1 px-1 custom-scrollbar"
            >
              <FilterPill active={filter === "all"} label="All" onClick={() => setFilter("all")} count={updates.length} />
              {Object.entries(BADGE_MAP).map(([key, val]) =>
                (counts[key] || 0) > 0 ? (
                  <FilterPill key={key} active={filter === key} label={val.label} onClick={() => setFilter(key)} count={counts[key]} />
                ) : null
              )}
            </motion.div>
          )}

          {/* ── Error banner ──────────────────────────────── */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-3 p-4 mb-8 bg-amber-50 border border-amber-200 rounded-2xl"
              >
                <AlertCircle size={18} className="text-amber-600 flex-shrink-0" />
                <p className="text-sm text-amber-800 font-medium">{error}</p>
                <button
                  onClick={() => loadUpdates(true)}
                  className="ml-auto text-xs font-bold text-amber-700 hover:text-amber-900 underline"
                >
                  Retry now
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Content ───────────────────────────────────── */}
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center">
              <GitCommit className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {filter !== "all" ? `No ${BADGE_MAP[filter]?.label} updates` : "No updates available"}
              </h3>
              <p className="text-sm text-gray-500 font-medium">
                {filter !== "all"
                  ? "Try selecting a different filter."
                  : "Check back later for new commits and releases."}
              </p>
            </div>
          ) : (
            <motion.div layout className="space-y-3 pb-20">
              {filtered.map((item, idx) => (
                <UpdateCard key={item.id} item={item} index={idx} />
              ))}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default LibraryUpdates;
