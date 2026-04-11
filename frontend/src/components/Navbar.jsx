import { useState } from 'react';
import { LayoutTemplate, Settings, Code2, BookOpen, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { title: 'Components', path: '/', icon: LayoutTemplate },
    { title: 'Registry', path: '/registry', icon: BookOpen },
    { title: 'Documentation', path: '#', icon: Code2 },
  ];

  return (
    <nav className="fixed top-0 w-full bg-white border-b border-gray-200 z-[70] px-4 md:px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <LayoutTemplate size={18} className="text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-gray-900">
            Hub<span className="text-indigo-600">UI</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.title}
                  to={link.path}
                  className={`text-sm font-medium transition-colors flex items-center gap-2 ${isActive ? 'text-indigo-600 font-bold' : 'text-gray-600 hover:text-indigo-600'
                    }`}
                >
                  {isActive && <div className="w-1 h-1 bg-indigo-600 rounded-full" />}
                  {link.title}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            <button title="Settings" className="text-gray-500 hover:text-gray-900 transition-colors p-2 hover:bg-gray-100 rounded-lg">
              <Settings size={20} />
            </button>
            <div className="h-6 w-px bg-gray-200 mx-2"></div>
            <button className="flex items-center gap-2 text-xs font-bold text-white px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 shadow-md transition-all active:scale-95">
              v2.1.0 Stable
            </button>
          </div>
        </div>

        {/* Mobile Actions */}
        <div className="flex md:hidden items-center gap-2">
          <button className="text-xs font-bold text-indigo-600 px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-100 uppercase">
            v2.1
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
                const isActive = location.pathname === link.path;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.title}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-4 p-4 rounded-xl transition-all ${isActive ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-50 text-gray-600'
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
                <Settings size={18} className="text-gray-400" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
