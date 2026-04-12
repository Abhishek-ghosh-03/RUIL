import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Terminal, Package, Layers, Zap, Trash2, Check, Settings as SettingsIcon, Sparkles, Search, Pencil } from 'lucide-react';

const SettingsPanel = ({ isOpen, onClose }) => {
    const [settings, setSettings] = useState({
        commandDisplay: 'both',
        smartGrouping: true,
        recommendations: true,
    });
    const [collections, setCollections] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [editingKitId, setEditingKitId] = useState(null);
    const [tempName, setTempName] = useState("");

    useEffect(() => {
        const savedSettings = localStorage.getItem('hub-ui-settings');
        if (savedSettings) setSettings(JSON.parse(savedSettings));
        loadData();
    }, [isOpen]);

    const loadData = () => {
        const savedKits = localStorage.getItem('hub-ui-collections');
        if (savedKits) setCollections(JSON.parse(savedKits));
    };

    const updateSetting = (key, value) => {
        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);
        localStorage.setItem('hub-ui-settings', JSON.stringify(newSettings));
    };

    const renameKit = (id) => {
        if (!tempName.trim()) { setEditingKitId(null); return; }
        const updatedKits = collections.map(k => k.id === id ? { ...k, name: tempName } : k);
        setCollections(updatedKits);
        localStorage.setItem('hub-ui-collections', JSON.stringify(updatedKits));
        setEditingKitId(null);
    };

    const loadKit = (kit) => {
        localStorage.setItem('hub-ui-bundle', JSON.stringify(kit.components));
        window.dispatchEvent(new Event('storage'));
    };

    const deleteKit = (id) => {
        const updatedKits = collections.filter(k => k.id !== id);
        setCollections(updatedKits);
        localStorage.setItem('hub-ui-collections', JSON.stringify(updatedKits));
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                    <motion.div initial={{ opacity: 0, scale: 0.95, x: 20 }} animate={{ opacity: 1, scale: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95, x: 20 }} className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden" >
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-100 rounded-xl"><SettingsIcon size={20} className="text-gray-600" /></div>
                                <h3 className="font-bold text-gray-900">Control Panel</h3>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-full transition-colors"><X size={20} className="text-gray-400" /></button>
                        </div>

                        <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <section className="space-y-4">
                                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Install Display</h4>
                                <div className="space-y-2">
                                    {[
                                        { id: 'cli', label: 'CLI Commands', icon: <Terminal size={14} /> },
                                        { id: 'npm', label: 'NPM Packages', icon: <Package size={14} /> },
                                        { id: 'both', label: 'Unified View', icon: <Layers size={14} /> }
                                    ].map((opt) => (
                                        <button key={opt.id} onClick={() => updateSetting('commandDisplay', opt.id)} className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${settings.commandDisplay === opt.id ? 'border-indigo-600 bg-indigo-50 shadow-sm' : 'border-gray-100 bg-white hover:border-gray-200'}`} >
                                            <div className="flex items-center gap-3"><div className={`p-2 rounded-lg ${settings.commandDisplay === opt.id ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'}`}>{opt.icon}</div><p className={`text-sm font-bold ${settings.commandDisplay === opt.id ? 'text-indigo-900' : 'text-gray-700'}`}>{opt.label}</p></div>
                                            {settings.commandDisplay === opt.id && <Check size={16} className="text-indigo-600" />}
                                        </button>
                                    ))}
                                </div>
                            </section>

                            <section className="space-y-4">
                                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Workflow Preferences</h4>
                                <div className="space-y-3">
                                    { [ { k: 'smartGrouping', l: 'Smart Grouping', i: <Zap size={14} /> }, { k: 'recommendations', l: 'AI Recommendations', i: <Sparkles size={14} /> } ].map(pref => (
                                        <div key={pref.k} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                                            <div className="flex items-center gap-3"><div className="p-2 bg-white rounded-lg text-indigo-600 shadow-sm">{pref.i}</div><p className="text-sm font-bold text-gray-700">{pref.l}</p></div>
                                            <button onClick={() => updateSetting(pref.k, !settings[pref.k])} className={`w-10 h-6 rounded-full transition-colors relative ${settings[pref.k] ? 'bg-indigo-600' : 'bg-gray-200'}`}><div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings[pref.k] ? 'left-5' : 'left-1'}`} /></button>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Saved UI Kits</h4>
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100">
                                        <Search size={12} className="text-gray-400" />
                                        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..." className="bg-transparent border-none outline-none text-[10px] font-bold text-gray-700 w-16 placeholder-gray-400" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    {collections.length === 0 ? (
                                        <div className="py-8 text-center border-2 border-dashed border-gray-100 rounded-2xl"><Package className="w-8 h-8 mx-auto text-gray-200 mb-2" /><p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">No saved kits</p></div>
                                    ) : (
                                        collections.filter(k => k.name.toLowerCase().includes(searchQuery.toLowerCase())).map(kit => (
                                            <div key={kit.id} className="p-3 bg-white border border-gray-100 rounded-2xl flex items-center justify-between hover:border-indigo-100 transition-colors group">
                                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-black text-xs flex-shrink-0">{kit.components.length}</div>
                                                    <div className="flex-1 min-w-0 pr-2">
                                                        {editingKitId === kit.id ? (
                                                            <input autoFocus type="text" value={tempName} onChange={(e) => setTempName(e.target.value)} onBlur={() => renameKit(kit.id)} onKeyDown={(e) => e.key === 'Enter' && renameKit(kit.id)} className="w-full bg-indigo-50 border border-indigo-200 rounded-lg px-2 py-0.5 text-sm font-bold text-indigo-900 outline-none" />
                                                        ) : (
                                                            <div className="flex items-center gap-2 group/title">
                                                                <p className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors truncate">{kit.name}</p>
                                                                <button onClick={() => { setEditingKitId(kit.id); setTempName(kit.name); }} className="opacity-0 group-hover/title:opacity-100 p-1 text-gray-300 hover:text-indigo-400 transition-all" ><Pencil size={10} /></button>
                                                            </div>
                                                        )}
                                                        <p className="text-[10px] text-gray-400 font-medium italic">{kit.timestamp}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => loadKit(kit)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Load Kit"><Zap size={14} /></button>
                                                    <button onClick={() => deleteKit(kit.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors" title="Delete Kit"><Trash2 size={14} /></button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </section>
                        </div>
                        <div className="p-4 bg-gray-50 text-[10px] text-gray-400 text-center font-medium border-t border-gray-100">Settings are saved automatically to your browser.</div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default SettingsPanel;
