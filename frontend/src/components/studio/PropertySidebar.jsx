import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Settings2, MousePointer2 } from 'lucide-react';

const PropertySidebar = ({ selectedId, setSelectedId, components, updateComponentProp, rightSidebarOpen, setRightSidebarOpen, isMobile }) => {
  const comp = components.find(c => c.id === selectedId);

  return (
    <motion.aside 
      initial={false}
      animate={{ 
        width: rightSidebarOpen ? (isMobile ? '100%' : 300) : 0,
        x: rightSidebarOpen ? 0 : (isMobile ? 100 : 0)
      }}
      className={`${isMobile ? 'fixed inset-y-20 right-0 z-[120]' : 'relative'} bg-white border-l border-gray-200 flex flex-col overflow-hidden shrink-0`}
    >
      <div className={`${isMobile ? 'w-screen' : 'w-[300px]'} h-full flex flex-col p-6 gap-8 overflow-y-auto custom-scrollbar`}>
        {isMobile && (
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Properties</span>
            <button onClick={() => setRightSidebarOpen(false)} className="p-2 bg-gray-100 rounded-lg text-gray-500 hover:text-gray-900"><Plus className="w-4 h-4 rotate-45" /></button>
          </div>
        )}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-widest text-indigo-600/60">Attributes</h3>
            <Settings2 className="w-4 h-4 text-indigo-600" />
          </div>
          
          {selectedId ? (
            <div className="space-y-6">
              {[
                { label: 'Text Content', key: 'text', type: 'text' },
                { label: 'Theme Shift', key: 'theme', type: 'slider' },
                { label: 'Border Radius', key: 'radius', type: 'slider', max: 50 },
                { label: 'Elevation', key: 'elevation', type: 'slider' }
              ].map(attr => {
                const value = comp?.props[attr.key] ?? (attr.type === 'slider' ? 50 : '');
                
                return (
                  <div key={attr.key} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="text-[10px] text-indigo-600/80 font-bold uppercase tracking-tighter">{attr.label}</p>
                      {attr.type === 'slider' && <span className="text-[10px] font-mono text-indigo-600/40">{value}{attr.key === 'radius' ? 'px' : '%'}</span>}
                    </div>
                    {attr.type === 'text' ? (
                      <input 
                        type="text" 
                        value={value}
                        onChange={(e) => updateComponentProp(selectedId, attr.key, e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/10 transition-all font-semibold"
                        placeholder="Type here..."
                      />
                    ) : (
                      <div className="relative flex items-center h-6 group">
                        <input 
                          type="range"
                          min="0"
                          max={attr.max || 100}
                          value={value}
                          onChange={(e) => updateComponentProp(selectedId, attr.key, parseInt(e.target.value))}
                          className="w-full h-1 bg-gray-100 rounded-full appearance-none accent-indigo-600 cursor-pointer hover:bg-gray-200 transition-all"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
              <div className="pt-4 flex gap-2">
                <button 
                  onClick={() => {
                    if(comp) updateComponentProp(selectedId, 'text', comp.name);
                    updateComponentProp(selectedId, 'theme', 50);
                    updateComponentProp(selectedId, 'radius', 24);
                    updateComponentProp(selectedId, 'elevation', 10);
                  }}
                  className="flex-1 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[10px] font-bold hover:bg-gray-100 transition-colors uppercase tracking-widest text-gray-600"
                >
                  Reset
                </button>
                <button 
                  onClick={() => setSelectedId(null)}
                  className="flex-1 py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-bold shadow-lg shadow-indigo-100 uppercase tracking-widest hover:bg-indigo-700 transition-colors"
                >
                  Deselect
                </button>
              </div>
            </div>
          ) : (
             <div className="p-8 border border-gray-100 rounded-2xl text-center space-y-3 bg-gray-50/50">
               <MousePointer2 className="w-8 h-8 text-gray-200 mx-auto" />
               <p className="text-[10px] text-gray-400 font-medium tracking-tight">Select a component to edit properties</p>
            </div>
          )}
        </div>

        <div className="space-y-4 border-t border-gray-100 pt-8">
           <h3 className="text-xs font-black uppercase tracking-widest text-indigo-600/60">Live Code History</h3>
           <div className="space-y-2">
              {[
                { title: 'Added Navbar', time: '2m ago' },
                { title: 'Update Text Prop', time: '5m ago' },
                { title: 'Changed Layout', time: '12m ago' }
              ].map(log => (
                <div key={log.title} className="flex justify-between items-center text-[10px] p-2 hover:bg-indigo-50 rounded-lg transition-colors cursor-default group">
                   <span className="text-indigo-600/80 font-medium group-hover:text-indigo-600">{log.title}</span>
                   <span className="text-indigo-600/30 font-mono group-hover:text-indigo-600/50">{log.time}</span>
                </div>
              ))}
           </div>
        </div>
      </div>
    </motion.aside>
  );
};

export default PropertySidebar;
