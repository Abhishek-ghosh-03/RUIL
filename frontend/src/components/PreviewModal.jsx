import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Copy, Code2, Terminal, Sun, Moon, Sparkles } from "lucide-react";

const PreviewModal = ({ component, onClose }) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedInstall, setCopiedInstall] = useState(false);
  const [theme, setTheme] = useState("light"); 
  const [settings, setSettings] = useState({ commandDisplay: 'both' });

  useEffect(() => {
    const savedSettings = localStorage.getItem('hub-ui-settings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(parsed);
      if (parsed.theme) setTheme(parsed.theme);
    }

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

  const getFilteredInstallCommand = () => {
    if (!component.installCommand) return null;
    if (settings.commandDisplay === 'both') return component.installCommand;
    
    // Simple detection: CLI commands usually start with npx or have 'add'
    const isCLI = component.installCommand.includes('npx') || component.installCommand.includes('add');
    
    if (settings.commandDisplay === 'cli' && isCLI) return component.installCommand;
    if (settings.commandDisplay === 'npm' && !isCLI) return component.installCommand;
    
    return settings.commandDisplay === 'cli' ? "// CLI command not available for this component" : "// NPM package not available for this component";
  };

  const filteredCommand = getFilteredInstallCommand();

  return (
    <div className="fixed inset-0 flex justify-center items-end sm:items-center z-[100] p-0 sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-[2px]"
        onClick={onClose}
      />
      
      <motion.div
        initial={{ opacity: 0, y: "100%" }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white border-t sm:border border-gray-200 w-full max-w-5xl rounded-t-[2.5rem] sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[92vh] sm:max-h-[90vh] relative z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Handle */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex justify-between items-center p-5 sm:p-6 border-b border-gray-100 bg-white sm:bg-gray-50/50">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-2.5 bg-indigo-600 rounded-xl sm:rounded-2xl shadow-lg shadow-indigo-100 shrink-0">
              <Code2 className="text-white w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-2xl font-black text-gray-900 tracking-tight truncate">{component.name}</h2>
              <p className="text-[10px] sm:text-sm text-gray-400 font-bold uppercase tracking-widest mt-0.5 truncate">{component.library} • {component.category}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme} 
              className="flex items-center gap-2 p-2 sm:px-4 sm:py-2 text-xs font-bold bg-white border border-gray-200 rounded-xl text-gray-600 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm"
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              <span className="hidden sm:inline">{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
            </button>
            
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto lg:overflow-hidden lg:grid lg:grid-cols-2">
          {/* Left: Preview */}
          <div className="p-4 sm:p-8 bg-gray-50 flex flex-col border-b lg:border-b-0 lg:border-r border-gray-100">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 sm:mb-6 flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-indigo-500" /> Live Interaction
            </h3>
            <div className="h-[300px] sm:h-auto sm:flex-grow rounded-2xl border border-gray-200 bg-white overflow-hidden relative shadow-inner">
              <iframe
                sandbox="allow-scripts"
                srcDoc={htmlContent}
                key={theme} 
                className="w-full h-full"
              />
            </div>
          </div>

          {/* Right: Usage */}
          <div className="p-4 sm:p-8 overflow-y-auto bg-white custom-scrollbar">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 sm:mb-6 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-indigo-600" /> Implementation Details
            </h3>

            <div className="space-y-6 sm:space-y-8">
              {/* Install Command */}
              {filteredCommand && (
                <div>
                  <label className="text-[10px] text-gray-400 block mb-3 font-black uppercase tracking-widest">Install Command</label>
                  <div className="relative group">
                    <pre className={`bg-gray-900 border ${filteredCommand.startsWith('//') ? 'border-red-900/50' : 'border-gray-800'} text-indigo-200 p-4 sm:p-5 rounded-2xl overflow-x-auto font-mono text-xs sm:text-sm shadow-xl selection:bg-indigo-500/30`}>
                      <code className={filteredCommand.startsWith('//') ? 'text-red-400 opacity-70' : ''}>{filteredCommand}</code>
                    </pre>
                    {!filteredCommand.startsWith('//') && (
                      <button
                        onClick={() => copyToClipboard(filteredCommand, 'install')}
                        className="absolute right-3 top-3 p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl sm:opacity-0 sm:group-hover:opacity-100 transition-all shadow-lg"
                      >
                        {copiedInstall ? <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" /> : <Copy className="w-3 h-3 sm:w-4 sm:h-4" />}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Import/Usage Code */}
              {component.importCode && (
                <div>
                  <label className="text-[10px] text-gray-400 block mb-3 font-black uppercase tracking-widest">Usage Blueprint</label>
                  <div className="relative group">
                    <pre className="bg-gray-900 text-indigo-300 p-4 sm:p-5 rounded-2xl overflow-x-auto font-mono text-xs sm:text-sm shadow-xl selection:bg-indigo-500/30 whitespace-pre-wrap leading-relaxed">
                      <code>{component.importCode}</code>
                    </pre>
                    <button
                      onClick={() => copyToClipboard(component.importCode, 'code')}
                      className="absolute right-3 top-3 p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl sm:opacity-0 sm:group-hover:opacity-100 transition-all shadow-lg"
                    >
                      {copiedCode ? <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" /> : <Copy className="w-3 h-3 sm:w-4 sm:h-4" />}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Tips */}
            <div className="mt-8 sm:mt-12 p-4 sm:p-5 bg-indigo-50 border border-indigo-100 rounded-2xl">
              <h4 className="text-[10px] sm:text-xs font-black text-indigo-700 uppercase tracking-widest mb-1">Architecture Tip</h4>
              <p className="text-xs sm:text-sm text-indigo-900/60 leading-relaxed font-medium">
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