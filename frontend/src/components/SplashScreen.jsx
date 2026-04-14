import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutTemplate, Sparkles, Box, Terminal, Zap, Cpu } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI UI COMPOSER",
    desc: "Generate professional layouts with simple prompts",
    color: "text-purple-500",
    bg: "bg-purple-500/10"
  },
  {
    icon: Box,
    title: "17+ UI LIBRARIES",
    desc: "The largest registry of React component ecosystems",
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    icon: Terminal,
    title: "SMART BUNDLING",
    desc: "Export production-ready code & install scripts",
    color: "text-indigo-500",
    bg: "bg-indigo-500/10"
  },
  {
    icon: Cpu,
    title: "DEVELOPER FIRST",
    desc: "Pure React, Zero fluff, Maximum performance",
    color: "text-pink-500",
    bg: "bg-pink-500/10"
  }
];

const SplashScreen = ({ onFinish }) => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [phase, setPhase] = useState("opening"); // 'opening', 'features', 'closing'

  useEffect(() => {
    // Opening Phase: 1.5s
    const openingTimer = setTimeout(() => setPhase("features"), 1500);

    // Features Phase: Cycle through 4 features (1s each)
    const featureInterval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 1200);

    // Closing Phase: After all features (approx 5.5s total)
    const closingTimer = setTimeout(() => setPhase("closing"), 6500);

    // Final Finish
    const finishTimer = setTimeout(onFinish, 7500);

    return () => {
      clearTimeout(openingTimer);
      clearInterval(featureInterval);
      clearTimeout(closingTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-[100] bg-white overflow-hidden"
    >
      {/* Anime Background Calligraphy (Horizontal) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] flex flex-col justify-around scale-110">
        <div className="flex flex-col gap-16">
          {['SHADCN UI', 'MATERIAL UI', 'CHAKRA UI', 'NEXT UI', 'MANTINE UI', 'ANT DESIGN'].map((name, i) => (
            <motion.div
              key={name}
              initial={{ x: i % 2 === 0 ? "-100%" : "100%" }}
              animate={{ x: i % 2 === 0 ? "100%" : "-100%" }}
              transition={{
                duration: 12 + i * 2,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.2
              }}
              className="whitespace-nowrap text-8xl font-sans tracking-tighter text-indigo-900"
            >
              <span className="font-black">{name}</span> • <span className="font-light">{name.toLowerCase()}</span> • <span className="font-black">{name}</span> • <span className="font-light">{name.toLowerCase()}</span> • <span className="font-black">{name}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Rotating Orbital Logo (Anime Style) — Fixed position */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2"
        style={{ top: "32%" }}
        animate={{
          y: [0, -15, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{
          y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[-40px] border-2 border-dashed border-indigo-100 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[-80px] border border-indigo-50/50 rounded-full"
        />

        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{
            scale: 1,
            rotate: 0,
            transition: { type: "spring", damping: 12, stiffness: 100 }
          }}
          className="w-32 h-32 rounded-[2.5rem] bg-white flex items-center justify-center shadow-[0_20px_60px_-15px_rgba(79,70,229,0.3)] z-10 relative overflow-hidden border border-gray-100"
        >
          <img src="/ruil-logo.png" alt="RUIL" className="w-24 h-24 object-contain" />

          {/* Speed Sparkles */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="absolute inset-0 rounded-[2.5rem] ring-8 ring-indigo-500/10"
          />
        </motion.div>
      </motion.div>

      {/* Text content — Responsive position below logo */}
      <div className="absolute left-0 right-0 flex items-center justify-center p-4 md:top-[62%] top-[52%]">
        <AnimatePresence mode="wait">
          {phase === "opening" && (
            <motion.div
              key="opening-text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.2 }}
              className="text-center w-full"
            >
              <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter mb-2 md:mb-4">
                RUIL
              </h1>
              <p className="text-[9px] md:text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] md:tracking-[0.5em] flex items-center gap-2 md:gap-4 justify-center">
                <span className="h-px w-4 md:w-8 bg-gray-200"></span>
                The Vision of Registry
                <span className="h-px w-4 md:w-8 bg-gray-200"></span>
              </p>
            </motion.div>
          )}

          {phase === "features" && (() => {
            const FeatureIcon = features[currentFeature].icon;
            return (
              <motion.div
                key={currentFeature}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5, ease: "circOut" }}
                className="flex flex-col items-center text-center max-w-sm px-6"
              >
                <div className={`p-4 rounded-3xl ${features[currentFeature].bg} mb-6 shadow-sm border border-white/50`}>
                  <FeatureIcon className={`w-8 h-8 ${features[currentFeature].color}`} />
                </div>
                <h2 className={`text-2xl font-black tracking-tight mb-2 ${features[currentFeature].color}`}>
                  {features[currentFeature].title}
                </h2>
                <p className="text-sm text-gray-500 font-bold leading-relaxed">
                  {features[currentFeature].desc}
                </p>
              </motion.div>
            );
          })()}

          {phase === "closing" && (
            <motion.div
              key="closing-text"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <h2 className="text-4xl font-black text-indigo-600 tracking-tighter animate-pulse">
                INITIALIZING ENGINE
              </h2>
              <div className="flex gap-1 justify-center mt-4">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ scaleY: [1, 2, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                    className="w-1.5 h-4 bg-indigo-200 rounded-full"
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress Line */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-64 h-1 bg-gray-100 rounded-full overflow-hidden shadow-inner">
        <motion.div
          animate={{ width: ["0%", "100%"] }}
          transition={{ duration: 7.5, ease: "linear" }}
          className="h-full bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.5)]"
        />
      </div>
    </motion.div>
  );
};

export default SplashScreen;
