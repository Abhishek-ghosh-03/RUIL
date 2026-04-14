import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PanelLeft, PanelRight, ChevronRight, LayoutTemplate } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

// Studio Components
import StudioHeader from '../components/studio/StudioHeader';
import VisualEditor from '../components/studio/VisualEditor';
import CodeEditorView from '../components/studio/CodeEditorView';
import AIContextSidebar from '../components/studio/AIContextSidebar';
import ComponentRegistry from '../components/studio/ComponentRegistry';
import PropertySidebar from '../components/studio/PropertySidebar';
import MobileDock from '../components/studio/MobileDock';

const Studio = () => {
  const [activeTab, setActiveTab] = useState('visual');
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [viewportSize, setViewportSize] = useState('desktop');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [selectedId, setSelectedId] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [components, setComponents] = useState([]);
  const [jsxCode, setJsxCode] = useState(`
<section className="p-12 bg-white rounded-3xl border border-gray-100 shadow-xl">
  <h2 className="text-3xl font-black text-indigo-600 mb-4">Hello Studio</h2>
  <p className="text-gray-500 leading-relaxed">Customize your component properties on the right →</p>
</section>`);

  const viewportWidths = {
    mobile: '375px',
    tablet: '768px',
    desktop: '100%'
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: () => {
      setIsAnalyzing(true);
      setAnalysisProgress(0);
      const interval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsAnalyzing(false);
            return 100;
          }
          return prev + 5;
        });
      }, 100);
    },
    noClick: false,
    noKeyboard: true
  });

  const addComponent = (name) => {
    const newComp = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      props: { theme: 50, radius: 24, elevation: 10, text: name }
    };
    setComponents([...components, newComp]);
  };

  const updateComponentProp = (id, key, value) => {
    setComponents(prev => prev.map(c => 
      c.id === id ? { ...c, props: { ...c.props, [key]: value } } : c
    ));
  };

  const suggestedComponents = [
    { id: '1', name: 'Navbar', library: 'Shadcn UI', icon: <LayoutTemplate className="w-5 h-5" /> },
    { id: '2', name: 'Hero Section', library: 'Aceternity UI', icon: <LayoutTemplate className="w-5 h-5" /> },
    { id: '3', name: 'Price Card', library: 'Magic UI', icon: <LayoutTemplate className="w-5 h-5" /> },
  ];

  return (
    <div className="h-screen w-full bg-[#F9FAFB] text-gray-900 flex flex-col font-sans overflow-hidden pt-0 selection:bg-indigo-100 selection:text-indigo-900">
      <StudioHeader 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        viewportSize={viewportSize} 
        setViewportSize={setViewportSize} 
        isMobile={isMobile} 
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <motion.aside 
          initial={false}
          animate={{ 
            width: leftSidebarOpen ? (isMobile ? '100%' : 300) : 0,
            x: leftSidebarOpen ? 0 : (isMobile ? -100 : 0)
          }}
          className={`${isMobile ? 'fixed inset-y-20 left-0 z-[120]' : 'relative'} bg-white border-r border-gray-200 flex flex-col overflow-hidden shrink-0`}
        >
          <div className={`${isMobile ? 'w-screen' : 'w-[300px]'} h-full flex flex-col p-6 gap-8 overflow-y-auto custom-scrollbar`}>
            {activeTab === 'context' ? (
              <AIContextSidebar 
                isAnalyzing={isAnalyzing}
                analysisProgress={analysisProgress}
                getRootProps={getRootProps}
                getInputProps={getInputProps}
                isDragActive={isDragActive}
                suggestedComponents={suggestedComponents}
                addComponent={addComponent}
                setActiveTab={setActiveTab}
              />
            ) : (
              <ComponentRegistry addComponent={addComponent} />
            )}
          </div>
        </motion.aside>

        {!isMobile && (
          <button 
            onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
            className={`absolute top-1/2 -translate-y-1/2 w-6 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-indigo-600 z-[110] shadow-xl transition-all ${leftSidebarOpen ? 'left-[288px]' : 'left-[-12px]'}`}
          >
            {leftSidebarOpen ? <PanelLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </button>
        )}

        {/* Center Canvas */}
        <main className={`flex-1 bg-gray-100 overflow-hidden flex flex-col items-center relative ${isMobile ? 'p-4 pt-10' : 'p-10'}`}>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
          
          {activeTab === 'visual' ? (
            <VisualEditor 
              components={components}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              setComponents={setComponents}
              viewportWidths={viewportWidths}
              viewportSize={viewportSize}
              isMobile={isMobile}
            />
          ) : activeTab === 'code' ? (
            <CodeEditorView 
              jsxCode={jsxCode}
              setJsxCode={setJsxCode}
              isMobile={isMobile}
              viewportWidths={viewportWidths}
              viewportSize={viewportSize}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 font-medium italic">
              AI Context Mode Active - Visualizing suggestions in the sidebar
            </div>
          )}
        </main>

        {/* Right Sidebar */}
        <PropertySidebar 
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          components={components}
          updateComponentProp={updateComponentProp}
          rightSidebarOpen={rightSidebarOpen}
          setRightSidebarOpen={setRightSidebarOpen}
          isMobile={isMobile}
        />
        {!isMobile && (
          <button 
            onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
            className={`absolute top-1/2 -translate-y-1/2 w-6 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-indigo-600 z-[110] shadow-xl transition-all ${rightSidebarOpen ? 'right-[288px]' : 'right-[-12px]'}`}
          >
            {rightSidebarOpen ? <PanelRight className="w-3 h-3" /> : <ChevronRight className="w-3 h-3 rotate-180" />}
          </button>
        )}

        {/* Mobile Navigation Dock */}
        {isMobile && (
          <MobileDock 
            leftSidebarOpen={leftSidebarOpen}
            setLeftSidebarOpen={setLeftSidebarOpen}
            rightSidebarOpen={rightSidebarOpen}
            setRightSidebarOpen={setRightSidebarOpen}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }
      `}} />
    </div>
  );
};

export default Studio;
