import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Home from "./pages/Home";
import Registry from "./pages/Registry";
import Documentation from "./pages/Documentation";
import LibraryUpdates from "./pages/LibraryUpdates";
import Studio from "./pages/Studio";
import SplashScreen from "./components/SplashScreen";
import PageWrapper from "./components/PageWrapper";
import Navbar from "./components/Navbar";

const AnimatedRoutes = () => {
  const location = useLocation();
  
  // Only apply animated transitions for Home <-> Studio flow
  const isAnimatedPage = location.pathname === "/" || location.pathname === "/studio";
  const isStudio = location.pathname === "/studio";
  
  return (
    <>
      {/* Persistent Navbar mounted once for all non-studio pages */}
      {!isStudio && <Navbar />}
      
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
          <Route path="/studio" element={<PageWrapper><Studio /></PageWrapper>} />
          
          {/* Registry, Documentation, and others load instantly without PageWrapper */}
          <Route path="/registry" element={<Registry />} />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/library/:id" element={<LibraryUpdates />} />
        </Routes>
      </AnimatePresence>
    </>
  );
};

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <Router>
      <AnimatePresence mode="wait">
        {showSplash ? (
          <SplashScreen key="splash" onFinish={() => setShowSplash(false)} />
        ) : (
          <AnimatedRoutes />
        )}
      </AnimatePresence>
    </Router>
  );
}

export default App;