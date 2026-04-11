import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Copy, Code2, Terminal, Sun, Moon, Sparkles } from "lucide-react";

const PreviewModal = ({ component, onClose }) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedInstall, setCopiedInstall] = useState(false);
  const [theme, setTheme] = useState("light"); // Default light for consistency

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!component) return null;

  const htmlContent = `
    <html class="${theme}">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <script>
          tailwind.config = {
            darkMode: 'class',
          }
        </script>
        <style>
          body { 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            min-height: 100vh; 
            margin: 0; 
            transition: background 0.3s, color 0.3s;
          }
          html.dark body { background: #000; color: #fff; }
          html.light body { background: #ffffff; color: #111827; }
        </style>
      </head>
      <body>
        ${component.previewHtml}
      </body>
    </html>
  `;

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'code') {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else {
      setCopiedInstall(true);
      setTimeout(() => setCopiedInstall(false), 2000);
    }
  };

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 p-4 sm:p-6 sm:pb-20">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-gray-900/60"
        onClick={onClose}
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white border border-gray-200 w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] relative z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100">
              <Code2 className="text-white w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">{component.name}</h2>
              <p className="text-sm text-gray-400 font-bold uppercase tracking-wider mt-0.5">{component.library} • {component.category}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme} 
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-white border border-gray-200 rounded-xl text-gray-600 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {theme === "dark" ? "Light Mode Preview" : "Dark Mode Preview"}
            </button>
            
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 flex-grow overflow-hidden">
          {/* Left: Preview */}
          <div className="p-8 bg-gray-50 flex flex-col border-r border-gray-100">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-indigo-500" /> Live Interaction
            </h3>
            <div className="flex-grow rounded-2xl border border-gray-200 bg-white overflow-hidden relative shadow-inner">
              <iframe
                sandbox="allow-scripts"
                srcDoc={htmlContent}
                key={theme} 
                className="w-full h-full min-h-[400px]"
              />
            </div>
          </div>

          {/* Right: Usage */}
          <div className="p-8 overflow-y-auto bg-white custom-scrollbar">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-indigo-600" /> Implementation Details
            </h3>

            <div className="space-y-8">
              {/* Install Command */}
              {component.installCommand && (
                <div>
                  <label className="text-[10px] text-gray-400 block mb-3 font-black uppercase tracking-widest">Install Command</label>
                  <div className="relative group">
                    <pre className="bg-gray-900 text-indigo-200 p-5 rounded-2xl overflow-x-auto font-mono text-sm shadow-xl selection:bg-indigo-500/30">
                      <code>{component.installCommand}</code>
                    </pre>
                    <button
                      onClick={() => copyToClipboard(component.installCommand, 'install')}
                      className="absolute right-4 top-4 p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                    >
                      {copiedInstall ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Import/Usage Code */}
              {component.importCode && (
                <div>
                  <label className="text-[10px] text-gray-400 block mb-3 font-black uppercase tracking-widest">Usage Blueprint</label>
                  <div className="relative group">
                    <pre className="bg-gray-900 text-indigo-300 p-5 rounded-2xl overflow-x-auto font-mono text-sm shadow-xl selection:bg-indigo-500/30 whitespace-pre-wrap leading-relaxed">
                      <code>{component.importCode}</code>
                    </pre>
                    <button
                      onClick={() => copyToClipboard(component.importCode, 'code')}
                      className="absolute right-4 top-4 p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                    >
                      {copiedCode ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Tips */}
            <div className="mt-12 p-5 bg-indigo-50 border border-indigo-100 rounded-2xl">
              <h4 className="text-xs font-black text-indigo-700 uppercase tracking-widest mb-1">Architecture Tip</h4>
              <p className="text-sm text-indigo-900/60 leading-relaxed font-medium">
                Make sure you have your environment configured for {component.library} before running the install command.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PreviewModal;