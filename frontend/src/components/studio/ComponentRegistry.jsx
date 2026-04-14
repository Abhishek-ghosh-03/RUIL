import React from 'react';
import { Search, Layout } from 'lucide-react';

const ComponentRegistry = ({ addComponent }) => {
  return (
    <div className="flex flex-col h-full gap-6">
      <div className="space-y-2">
        <div className="relative group">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
          <input 
            type="text" 
            placeholder="Search component registry..." 
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-xs focus:outline-none focus:border-indigo-600 transition-all text-gray-900 font-semibold"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-8 pr-2">
        {[
          { label: 'Layout & Navigation', items: ['Navbar', 'Sidebar', 'Bento Grid', 'Sticky Header'] },
          { label: 'Hero & Visuals', items: ['Hero Section', 'Background Gradients', 'Animated Stripes', 'Parallax'] },
          { label: 'Content & data', items: ['Feature Card', 'Price Table', 'User Profile', 'Stats Card'] }
        ].map(category => (
          <div key={category.label} className="space-y-3">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600/60 px-1">{category.label}</h4>
            <div className="grid grid-cols-1 gap-2">
              {category.items.map(item => (
                <div 
                  key={item} 
                  onClick={() => addComponent(item)}
                  className="p-3 bg-gray-50 border border-gray-100 rounded-xl flex items-center gap-3 hover:border-indigo-600 hover:bg-white cursor-pointer group transition-all shadow-sm"
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 border border-gray-200 transition-all">
                    <Layout className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-medium text-gray-600 group-hover:text-indigo-600">{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComponentRegistry;
