import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Copy, Package, Terminal, Layers, Code, LayoutDashboard, Sparkles, Send, ChevronDown } from "lucide-react";
import { useState } from "react";
import { generateLayoutAI } from "../services/api";

const BundleBuilder = ({ bundle, onClose, onRemove }) => {
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState("preview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [layoutConfig, setLayoutConfig] = useState({
    theme: 'light',
    background: '#ffffff',
    layoutType: 'flex-col',
    align: 'items-center',
    padding: '3rem 2rem'
  });
  const [aiReactCode, setAiReactCode] = useState("");
  const [aiHtmlPreview, setAiHtmlPreview] = useState("");

  const generateCommands = () => {
    let commands = [];
    const cliComps = bundle.filter(c => c.type === 'cli');
    if (cliComps.length > 0) {
      const shadcnComps = cliComps.filter(c => c.library === 'shadcn').map(c => c.category);
      if (shadcnComps.length > 0) {
        commands.push(`npx shadcn-ui@latest add ${shadcnComps.join(' ')}`);
      }
      cliComps.filter(c => c.library !== 'shadcn').forEach(c => {
         if(!commands.includes(c.installCommand)) commands.push(c.installCommand);
      });
    }

    const pkgComps = bundle.filter(c => c.type === 'package');
    if (pkgComps.length > 0) {
      let packagesToInstall = new Set();
      pkgComps.forEach(c => {
        if(c.installCommand) {
          const parts = c.installCommand.split(' ');
          parts.forEach(p => {
             if (p !== 'npm' && p !== 'install' && p !== 'i' && p !== '-D' && p !== 'yarn' && p !== 'add') {
               packagesToInstall.add(p);
             }
          });
        }
      });
      if (packagesToInstall.size > 0) {
        commands.push(`npm install ${Array.from(packagesToInstall).join(' ')}`);
      }
    }
    return commands.length > 0 ? commands.join('\n') : "No components selected.";
  };

  const generateReactCode = () => {
    const componentTags = bundle.map(comp => {
      let tagName = 'Component';
      if (comp.importCode) {
        const namedMatch = [...comp.importCode.matchAll(/import \s*{\s*([a-zA-Z0-9_\s,]+)\s*}\s* from/g)];
        if (namedMatch.length > 0) {
           tagName = namedMatch[0][1].split(',')[0].trim();
        } else {
           const defMatch = [...comp.importCode.matchAll(/import \s*([a-zA-Z0-9_]+)\s* from/g)];
           if (defMatch.length > 0) {
             tagName = defMatch[0][1].trim();
           }
        }
      } else {
        tagName = comp.name.replace(/\s/g, ''); 
      }
      return tagName;
    });

    const imports = bundle.map(c => c.importCode ? c.importCode.split('\n')[0] : `// Could not parse import for ${c.name}`).join('\n');
    
    let navbars = [];
    let bodies = [];
    let modals = [];
    
    bundle.forEach((comp, idx) => {
      const tag = `<${componentTags[idx]} />`;
      if (comp.category === 'navigation') navbars.push(tag);
      else if (comp.category === 'modal' || comp.category === 'feedback') modals.push(tag);
      else bodies.push(tag);
    });

    const bgClass = layoutConfig.theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900';
    const mainClass = layoutConfig.layoutType === 'grid' 
        ? 'grid grid-cols-1 md:grid-cols-2 gap-6 p-8' 
        : `flex flex-col gap-6 p-8 ${layoutConfig.align}`;

    return `import React from 'react';
${imports}

export default function UIComposer() {
  return (
    <div className="min-h-screen flex flex-col ${bgClass}" style={{ background: '${layoutConfig.background === '#ffffff' ? '' : layoutConfig.background}' }}>
      ${navbars.length > 0 ? `<header className="w-full shadow-sm bg-white sticky top-0 z-10">
        ${navbars.join('\n        ')}
      </header>` : ''}

${bodies.length > 0 ? `{/* Main Content */}
      <main className="flex-grow w-full max-w-6xl mx-auto ${mainClass}">
        ${bodies.join('\n        ')}
      </main>` : ''}

      ${modals.length > 0 ? `{/* Floating / Hidden Elements */}
      ${modals.join('\n      ')}` : ''}
    </div>
  );
}
`;
  };

  const generateRawHtml = () => {
    let navbars = [];
    let bodies = [];
    let modals = [];
    
    bundle.forEach((comp) => {
      if (comp.category === 'navigation') navbars.push(comp.previewHtml);
      else if (comp.category === 'modal' || comp.category === 'feedback') modals.push(comp.previewHtml);
      else bodies.push(comp.previewHtml);
    });

    const isDark = layoutConfig.theme === 'dark';
    const mainStyle = layoutConfig.layoutType === 'grid' 
         ? 'display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem;' 
         : `display: flex; flex-direction: column; gap: 2rem; align-items: ${layoutConfig.align.replace('items-','')};`;

    return `
      <html>
        <head>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
             body { 
               margin: 0; min-height: 100vh; display: flex; flex-direction: column; 
               background: ${layoutConfig.background}; 
               color: ${isDark ? '#f9fafb' : '#111827'};
               font-family: ui-sans-serif, system-ui; 
               transition: all 0.5s ease;
             }
             header { 
               background: ${isDark ? 'rgba(17,24,39,0.8)' : 'rgba(255,255,255,0.8)'}; 
               padding: 1rem; border-bottom: 1px solid ${isDark ? '#374151' : '#e5e7eb'}; 
               width: 100%; display: flex; align-items:center; 
               position: sticky; top:0; z-index: 10;
             }
             main { 
               padding: ${layoutConfig.padding}; max-width: 1200px; margin: 0 auto; width: 100%; box-sizing: border-box;
               ${mainStyle}
             }
             .modals-wrapper { position: fixed; bottom: 1rem; right: 1rem; display: flex; flex-direction: column; gap: 1rem; }
          </style>
        </head>
        <body>
          ${navbars.length > 0 ? `<header>${navbars.join('')}</header>` : ''}
          <main>
            ${bodies.join('')}
          </main>
          <div class="modals-wrapper">
             ${modals.join('')}
          </div>
        </body>
      </html>
    `;
  };

  const copyCode = (text, setter) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  const handleAIPrompt = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    try {
      const response = await generateLayoutAI({
        prompt: aiPrompt,
        bundle: bundle,
        currentConfig: layoutConfig
      });
      if (response.data && response.data.config) {
        setLayoutConfig(response.data.config);
        if (response.data.reactCode) setAiReactCode(response.data.reactCode);
        if (response.data.htmlPreview) setAiHtmlPreview(response.data.htmlPreview);
      }
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setIsGenerating(false);
      setAiPrompt("");
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-[100] p-0 md:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-gray-900/60"
        onClick={onClose}
      />
      
      <motion.div
        initial={{ scale: 0.95, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 30, opacity: 0 }}
        transition={{ 
          type: "spring", 
          damping: 25, 
          stiffness: 300,
          exit: { duration: 0.2 } 
        }}
        className="bg-white border-t md:border border-gray-200 w-full max-w-6xl h-full md:h-[90vh] flex flex-col shadow-2xl md:rounded-3xl overflow-hidden relative z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 md:p-6 border-b border-gray-100 bg-gray-50/50">
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-100">
               <Sparkles className="text-white w-4 h-4 md:w-5 md:h-5 font-bold" />
             </div>
             <div>
               <h2 className="text-base md:text-xl font-black text-gray-900 tracking-tight leading-none mb-0.5">Composer Engine</h2>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest hidden md:block">Powered by Gemini AI</p>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest md:hidden">AI Powered</p>
             </div>
           </div>
           
           <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all">
             <X className="w-6 h-6" />
           </button>
        </div>

        <div className="flex flex-col md:flex-row flex-grow overflow-hidden min-h-0">
          
          {/* Sidebar / Top Cart Bar (Mobile Toggle) */}
          <div className={`
             ${isSidebarOpen ? 'h-[40vh]' : 'h-14'} md:h-full 
             w-full md:w-1/4 border-b md:border-b-0 md:border-r border-gray-100 
             bg-gray-50/50 flex flex-col transition-all duration-300 overflow-hidden
          `}>
             <button 
               onClick={() => setIsSidebarOpen(!isSidebarOpen)}
               className="md:hidden w-full flex items-center justify-between p-4 bg-white border-b border-gray-100"
             >
                <div className="flex items-center gap-2">
                   <Package className="w-4 h-4 text-indigo-600" />
                   <span className="text-xs font-black uppercase tracking-widest text-gray-900">Assets ({bundle.length})</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isSidebarOpen ? 'rotate-180' : ''}`} />
             </button>

             <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
               {bundle.length === 0 ? (
                 <div className="text-center text-gray-300 py-6">
                   <Package className="w-8 h-8 mx-auto mb-2 opacity-20" />
                   <p className="text-[10px] font-bold uppercase">Empty</p>
                 </div>
               ) : (
                 bundle.map(comp => (
                   <div key={comp._id} className="p-3 bg-white border border-gray-100 rounded-xl flex justify-between items-center group shadow-sm">
                     <div className="max-w-[75%]">
                       <h4 className="text-xs font-bold text-gray-900 truncate tracking-tight">{comp.name}</h4>
                       <p className="text-[9px] text-gray-400 uppercase font-black">{comp.library}</p>
                     </div>
                     <button onClick={() => onRemove(comp._id)} className="text-red-400 p-1.5 hover:bg-red-50 rounded-lg">
                       <X className="w-3 h-3" />
                     </button>
                   </div>
                 ))
               )}
             </div>
          </div>

          {/* Main Space */}
          <div className="w-full md:w-3/4 bg-white flex flex-col h-full overflow-hidden relative min-h-0">
            {/* Tabs Navigation (Scrollable on Mobile) */}
            <div className="flex overflow-x-auto no-scrollbar border-b border-gray-100 bg-white sticky top-0 z-10">
               {[
                 { id: 'preview', icon: LayoutDashboard, label: 'Visual' },
                 { id: 'code', icon: Code, label: 'Blueprint' },
                 { id: 'install', icon: Terminal, label: 'Fetch' }
               ].map(tab => (
                 <button 
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id)}
                   className={`flex-1 md:flex-none flex px-4 md:px-6 py-4 text-[10px] md:text-xs font-black uppercase tracking-widest transition-all border-b-2 items-center justify-center gap-2 whitespace-nowrap ${activeTab === tab.id ? 'border-indigo-600 text-indigo-700 bg-indigo-50/20' : 'border-transparent text-gray-400'}`}
                 >
                   <tab.icon size={14} /> {tab.label}
                 </button>
               ))}
            </div>

            {/* Tab Content */}
            <div className="flex-grow p-4 md:p-8 overflow-y-auto flex flex-col min-h-0 custom-scrollbar">
               {bundle.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-gray-300 flex-col gap-4">
                     <Layers className="w-12 h-12 opacity-10" />
                     <p className="text-[10px] font-black tracking-widest uppercase">Select assets to begin</p>
                  </div>
               ) : (
                 <>
                   {activeTab === 'preview' && (
                     <div className="flex flex-col h-full gap-4 md:gap-6 relative min-h-0">
                        <div className="flex items-center gap-3 md:gap-4 bg-gray-50 border border-gray-200 p-2 md:p-2.5 pl-4 md:pl-5 rounded-xl md:rounded-2xl shadow-sm focus-within:ring-4 focus-within:ring-indigo-100 focus-within:border-indigo-400 transition-all">
                           <Sparkles className="text-indigo-600 w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                           <input 
                             type="text"
                             disabled={isGenerating}
                             value={aiPrompt}
                             onChange={(e) => setAiPrompt(e.target.value)}
                             onKeyDown={(e) => e.key === 'Enter' && handleAIPrompt()}
                             placeholder="AI: 'center it, blue bg...'"
                             className="bg-transparent border-none outline-none text-gray-900 w-full text-xs md:text-sm font-bold placeholder-gray-400"
                           />
                           <button
                             onClick={handleAIPrompt}
                             disabled={isGenerating || !aiPrompt.trim()}
                             className="bg-indigo-600 text-white p-2 md:px-5 md:py-2.5 rounded-lg md:rounded-xl transition-all flex items-center justify-center font-bold"
                           >
                             {isGenerating ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Send className="w-4 h-4" />}
                           </button>
                        </div>

                        <div className="flex-grow border border-gray-200 rounded-xl md:rounded-3xl overflow-hidden bg-white shadow-inner min-h-[300px]">
                          {isGenerating && (
                             <div className="absolute inset-0 bg-white/80 z-20 flex flex-col items-center justify-center text-indigo-600">
                                <Sparkles className="w-10 h-10 animate-pulse mb-4" />
                                <p className="font-black text-[10px] uppercase tracking-[0.2em]">Designing...</p>
                             </div>
                          )}
                          <iframe
                             sandbox="allow-scripts"
                             srcDoc={aiHtmlPreview || generateRawHtml()}   
                             className="w-full h-full border-none"
                          />
                        </div>
                     </div>
                   )}

                   {activeTab === 'code' && (
                     <div className="relative h-full flex flex-col min-h-0">
                       <pre className="bg-gray-900 h-full border border-gray-800 text-indigo-200 p-4 md:p-8 rounded-xl md:rounded-3xl overflow-auto font-mono text-[10px] md:text-sm leading-relaxed custom-scrollbar selection:bg-indigo-500/30">
                         <code>{aiReactCode || generateReactCode()}</code>
                       </pre>
                       <button onClick={() => copyCode(aiReactCode || generateReactCode(), setCopiedCode)} className="absolute right-3 bottom-3 md:right-4 md:bottom-4 p-2 md:p-3 bg-white text-gray-900 rounded-xl shadow-xl transition-all active:scale-95 flex items-center gap-2 text-[10px] font-bold">
                         {copiedCode ? <Check className="w-3 h-3 md:w-4 md:h-4 text-green-600" /> : <Copy className="w-3 h-3 md:w-4 md:h-4" />}
                         {copiedCode ? "Copied" : "Copy"}
                       </button>
                     </div>
                   )}

                   {activeTab === 'install' && (
                     <div className="space-y-4">
                       <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-start gap-3">
                         <Terminal className="text-indigo-600 w-5 h-5 flex-shrink-0 mt-0.5" />
                         <p className="text-[10px] font-bold text-indigo-900 italic">Run in project root to link all assets.</p>
                       </div>
                       <div className="relative group">
                         <pre className="bg-gray-900 border border-gray-800 text-indigo-300 p-4 md:p-8 rounded-xl md:rounded-3xl overflow-x-auto font-mono text-[10px] md:text-sm leading-relaxed">
                           <code>{generateCommands()}</code>
                         </pre>
                         <button onClick={() => copyCode(generateCommands(), setCopiedScript)} className="absolute right-3 top-3 md:right-4 md:top-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all border border-white/10">
                           {copiedScript ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                         </button>
                       </div>
                     </div>
                   )}
                 </>
               )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BundleBuilder;
