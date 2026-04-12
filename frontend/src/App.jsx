import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Home from "./pages/Home";
import Registry from "./pages/Registry";
import Documentation from "./pages/Documentation";
import LibraryUpdates from "./pages/LibraryUpdates";
import SplashScreen from "./components/SplashScreen";

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <Router>
      <AnimatePresence mode="wait">
        {showSplash ? (
          <SplashScreen key="splash" onFinish={() => setShowSplash(false)} />
        ) : (
          <Routes key="routes">
            <Route path="/" element={<Home />} />
            <Route path="/registry" element={<Registry />} />
            <Route path="/documentation" element={<Documentation />} />
            <Route path="/library/:id" element={<LibraryUpdates />} />
          </Routes>
        )}
      </AnimatePresence>
    </Router>
  );
}

export default App;