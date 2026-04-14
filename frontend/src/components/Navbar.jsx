import { useState } from 'react';
import { LayoutTemplate, Settings, Code2, BookOpen, Menu, X, Sparkles } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AIConsultant from './AIConsultant';
import SettingsPanel from './SettingsPanel';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { title: 'Components', path: '/', icon: LayoutTemplate },
    { title: 'Registry', path: '/registry', icon: BookOpen },
    { title: 'Documentation', path: '/documentation', icon: Code2 },
    { title: 'Studio', path: '/studio', icon: Sparkles },
  ];

  const getIsActive = (path) => {
    // Exact match for most pages
    if (location.pathname === path) return true;
    
    // Treat library update subpages as part of the Registry ecosystem
    if (path === '/registry' && location.pathname.startsWith('/library/')) return true;
    
    return false;
  };

  return (
    <>
      <nav className="fixed top-0 w-full bg-white border-b border-gray-200 z-[70] px-4 md:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 md:gap-3">
            <img src="/ruil-logo.png" alt="RUIL" className="w-8 h-8 md:w-9 md:h-9 rounded-lg object-cover" />
            <span className="font-bold text-xl tracking-tight text-gray-900">
              RUIL
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {navLinks.map((link) => {
                const isActive = getIsActive(link.path);
                return (
                  <Link
                    key={link.title}
                    to={link.path}
                    className={`text-sm font-medium transition-colors flex items-center gap-2 ${isActive ? 'text-indigo-600 font-bold' : 'text-gray-600 hover:text-indigo-600'
                      }`}
                  >
                    {isActive && <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full shadow-[0_0_8px_rgba(79,70,229,0.5)]" />}
                    {link.title}
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSettingsOpen(true)}
                title="Settings"
                className="text-gray-500 hover:text-gray-900 transition-colors p-2 hover:bg-gray-100 rounded-lg"
              >
                <Settings size={20} />
              </button>
              <div className="h-6 w-px bg-gray-200 mx-2"></div>
              <button
                onClick={() => setIsAIOpen(true)}
                className="flex items-center gap-2 text-xs font-bold text-white px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95 group"
              >
                <Sparkles size={14} className="group-hover:animate-pulse" />
                AI Consultant
              </button>
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsAIOpen(true)}
              className="p-2 text-black hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
            >
              <Sparkles size={20} />
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMenuOpen(false)}
                className="fixed inset-0 z-[65] md:hidden"
              />
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed top-20 left-0 w-full bg-white border-b border-gray-200 shadow-2xl md:hidden py-6 px-4 flex flex-col gap-4 z-[150] pointer-events-auto"
              >
                {navLinks.map((link) => {
                  const isActive = getIsActive(link.path);
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.title}
                      to={link.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-4 p-4 rounded-xl transition-all ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-gray-50 text-gray-600'
                        }`}
                    >
                      <Icon size={20} />
                      <span className="font-bold text-base">{link.title}</span>
                      {isActive && <div className="ml-auto w-2 h-2 bg-white rounded-full" />}
                    </Link>
                  );
                })}

                <div className="h-px bg-gray-100 my-2"></div>

                <div className="flex justify-between items-center px-2">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Global Settings</span>
                  <button onClick={() => { setIsSettingsOpen(true); setIsMenuOpen(false); }}>
                    <Settings size={18} className="text-gray-400" />
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>

      <AIConsultant isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
      <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
};

export default Navbar;
