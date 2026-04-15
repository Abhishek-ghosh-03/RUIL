import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, ExternalLink, Sparkles, PackagePlus } from 'lucide-react';

const STATUS_OPTIONS = [
    { value: "open-source", label: "Open Source", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    { value: "in-production", label: "In Production", color: "bg-blue-100 text-blue-700 border-blue-200" },
    { value: "beta", label: "Beta / Preview", color: "bg-amber-100 text-amber-700 border-amber-200" },
    { value: "planned", label: "Planned", color: "bg-purple-100 text-purple-700 border-purple-200" },
];

const DEFAULT_TRACKED = [
    { id: 1, name: "Park UI", url: "https://park-ui.com", status: "open-source", category: "Headless UI", notes: "Built on Ark UI primitives. Clean, accessible.", date: "2024-04-10" },
    { id: 2, name: "Tremor", url: "https://tremor.so", status: "open-source", category: "Dashboard UI", notes: "React components for building dashboards and data-heavy interfaces.", date: "2024-03-22" },
    { id: 3, name: "Wedges", url: "https://www.lemonsqueezy.com/wedges", status: "beta", category: "Modern UI", notes: "By Lemon Squeezy. Tailwind-based, extending Radix primitives.", date: "2024-03-15" },
];

const Documentation = () => {
    const [trackedLibs, setTrackedLibs] = useState(() => {
        const saved = localStorage.getItem("ruil_tracked_libs");
        return saved ? JSON.parse(saved) : DEFAULT_TRACKED;
    });
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ name: "", url: "", status: "open-source", category: "", notes: "" });

    useEffect(() => {
        localStorage.setItem("ruil_tracked_libs", JSON.stringify(trackedLibs));
    }, [trackedLibs]);

    const handleAdd = () => {
        if (!form.name.trim()) return;
        const newEntry = { ...form, id: Date.now(), date: new Date().toISOString().split("T")[0] };
        setTrackedLibs(prev => [newEntry, ...prev]);
        setForm({ name: "", url: "", status: "open-source", category: "", notes: "" });
        setShowForm(false);
    };

    const handleDelete = (id) => {
        setTrackedLibs(prev => prev.filter(l => l.id !== id));
    };

    const getStatusBadge = (status) => {
        return STATUS_OPTIONS.find(s => s.value === status) || STATUS_OPTIONS[0];
    };

    return (
        <div className="h-screen bg-white flex flex-col overflow-hidden">
            <main className="flex-1 overflow-y-auto pt-20 custom-scrollbar">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                >
                    <article className="max-w-4xl mx-auto py-8 md:py-10 px-4 md:px-10 prose prose-indigo">
                        <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-6 md:mb-8 border-b-2 border-black pb-4 md:pb-6 tracking-tight">
                            RUIL — Platform Registry &amp; Documentation
                        </h1>

                        <section className="mb-10">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">1. Overview</h2>
                            <p className="text-gray-600 leading-relaxed">
                                RUIL is a unified platform where developers can discover, preview, compare, and integrate UI components from multiple libraries such as shadcn/ui and Material UI (MUI). It eliminates the need to browse multiple documentation sites by centralizing component discovery and usage in one place.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">2. How It Works</h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                The application follows a simple workflow: Search → Filter → Preview → Install → Use.
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-gray-600">
                                <li><strong>Search:</strong> Find components using keywords (e.g., "button", "login form").</li>
                                <li><strong>Filter:</strong> Narrow results by category, framework, or library.</li>
                                <li><strong>Preview:</strong> View components safely in an isolated preview.</li>
                                <li><strong>Install:</strong> Get the correct installation commands.</li>
                                <li><strong>Use:</strong> Copy usage/import snippets into your project.</li>
                            </ul>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">3. Installation Guide</h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Installation varies by library. For <strong>shadcn/ui</strong> (CLI-based), you can add components directly using the command:
                            </p>
                            <pre className="bg-gray-50 p-4 rounded-lg border text-sm font-mono text-black mb-4">
                                npx shadcn-ui add button
                            </pre>
                            <p className="text-sm text-gray-500 italic mb-6">Note: Requires Tailwind CSS setup.</p>

                            <p className="text-gray-600 leading-relaxed mb-4">
                                For <strong>Material UI</strong> (Package-based), install the required dependencies first:
                            </p>
                            <pre className="bg-gray-50 p-4 rounded-lg border text-sm font-mono text-black mb-4">
                                npm install @mui/material @emotion/react @emotion/styled
                            </pre>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Then import the component in your project:
                            </p>
                            <pre className="bg-gray-50 p-4 rounded-lg border text-sm font-mono text-black">
                                import Button from '@mui/material/Button';
                            </pre>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">4. Supported Libraries</h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                RUIL currently supports a wide range of popular React UI libraries and frameworks:
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-gray-600">
                                <ul className="list-disc list-inside space-y-1">
                                    <li><strong>shadcn/ui</strong> — High-quality, customizable components.</li>
                                    <li><strong>Material UI (MUI)</strong> — Google's Material Design system.</li>
                                    <li><strong>Chakra UI</strong> — Modular and accessible component library.</li>
                                    <li><strong>NextUI</strong> — Modern, fast UI library for React.</li>
                                    <li><strong>Radix UI</strong> — Unstyled, accessible UI primitives.</li>
                                    <li><strong>Mantine UI</strong> — Full-featured React component library.</li>
                                    <li><strong>daisyUI</strong> — Popular Tailwind CSS component plugin.</li>
                                    <li><strong>HeroUI</strong> — High-performance React UI components.</li>
                                    <li><strong>Ant Design</strong> — Enterprise-level UI design system.</li>
                                </ul>
                                <ul className="list-disc list-inside space-y-1">
                                    <li><strong>React Aria</strong> — Accessibility-first library from Adobe.</li>
                                    <li><strong>Base UI</strong> — MUI's unstyled headless library.</li>
                                    <li><strong>Reshaped</strong> — Professional system for React apps.</li>
                                    <li><strong>AlignUI</strong> — Speed-focused aesthetic components.</li>
                                    <li><strong>Tailark</strong> — Modular components for rapid development.</li>
                                    <li><strong>Kibo UI</strong> — Minimalist design language elements.</li>
                                    <li><strong>Untitled UI</strong> — Premium React component kit.</li>
                                    <li><strong>Tailwind Plus</strong> — Extended utility-first components.</li>
                                </ul>
                            </div>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">5. Features</h2>
                            <ul className="list-disc list-inside space-y-2 text-gray-600">
                                <li>Component search with keyword support</li>
                                <li>Multi-library support</li>
                                <li>Live component preview (sandboxed)</li>
                                <li>Installation command generation</li>
                                <li>Import/usage snippets</li>
                                <li>Sidebar navigation with library guides</li>
                                <li>Smart command builder (grouped commands)</li>
                            </ul>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">6. Usage Examples</h2>
                            <p className="text-gray-600 leading-relaxed">
                                A typical workflow involves searching for a component like "button", selecting the desired variant, copying the generated installation command, and pasting it into your project terminal. Finally, you can use the provided import snippet to include the component in your code.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">7. Limitations</h2>
                            <ul className="list-disc list-inside space-y-2 text-gray-600">
                                <li>Components cannot be installed directly from the browser due to security restrictions.</li>
                                <li>Some libraries require additional setup (e.g., Tailwind CSS for shadcn).</li>
                                <li>Mixing libraries may lead to styling inconsistencies.</li>
                            </ul>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">8. Future Scope</h2>
                            <p className="text-gray-600 leading-relaxed">
                                Our roadmap includes AI-based UI suggestions, a component comparison system, a dedicated CLI tool for direct installation, and the ability for users to save collections of components.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">9. Developer Notes</h2>
                            <p className="text-gray-600 leading-relaxed">
                                The backend is powered by Node.js, Express, and MongoDB, while the frontend uses React and Tailwind CSS. The architecture is modular and API-driven. For component previews, we utilize an iframe sandbox to ensure secure rendering.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">10. FAQ</h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                <strong>Q: Why can't components be installed directly from the website?</strong><br />
                                A: Browsers cannot execute system-level commands or access local file systems for security reasons.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                <strong>Q: Which library should I choose?</strong><br />
                                A: Use shadcn for flexibility and customization, or MUI for ready-made, production components.
                            </p>
                        </section>

                        {/* ═══════════════════════════════════════════════════════ */}
                        {/* RUIL CLI — Command-Line Tool Documentation             */}
                        {/* ═══════════════════════════════════════════════════════ */}
                        <section className="mb-10">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">11. RUIL CLI Tool(Globally not available)</h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                RUIL includes a dedicated CLI tool for installing UI components from multiple libraries directly from your terminal. It supports both <strong>interactive</strong> and <strong>direct</strong> command modes.
                            </p>

                            <h3 className="text-lg font-bold text-gray-700 mb-3 mt-6">Setup</h3>
                            <p className="text-gray-600 leading-relaxed mb-3">
                                Install the RUIL CLI globally using npm to use it across any React project:
                            </p>
                            <pre className="bg-gray-900 text-indigo-200 p-4 rounded-xl text-sm font-mono mb-6 overflow-x-auto">
                                {`npm install -g ruil-cli`}
                            </pre>

                            <h3 className="text-lg font-bold text-gray-700 mb-3">Available Commands</h3>

                            {/* Command Table */}
                            <div className="overflow-x-auto mb-6">
                                <table className="w-full text-sm border border-gray-200 rounded-xl overflow-hidden">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="text-left px-4 py-2.5 font-bold text-gray-700 border-b border-gray-200">Command</th>
                                            <th className="text-left px-4 py-2.5 font-bold text-gray-700 border-b border-gray-200">Description</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-600">
                                        <tr className="border-b border-gray-100">
                                            <td className="px-4 py-2.5 font-mono text-xs text-indigo-700 whitespace-nowrap">ruil add</td>
                                            <td className="px-4 py-2.5">Interactive wizard — select library, pick components, confirm & install</td>
                                        </tr>
                                        <tr className="border-b border-gray-100">
                                            <td className="px-4 py-2.5 font-mono text-xs text-indigo-700 whitespace-nowrap">ruil add shadcn/button mui/Card</td>
                                            <td className="px-4 py-2.5">Direct mode — parses input, groups by library, batch-installs</td>
                                        </tr>
                                        <tr className="border-b border-gray-100">
                                            <td className="px-4 py-2.5 font-mono text-xs text-indigo-700 whitespace-nowrap">ruil list</td>
                                            <td className="px-4 py-2.5">Show all supported libraries with component counts</td>
                                        </tr>
                                        <tr className="border-b border-gray-100">
                                            <td className="px-4 py-2.5 font-mono text-xs text-indigo-700 whitespace-nowrap">ruil list shadcn</td>
                                            <td className="px-4 py-2.5">List all components in a specific library</td>
                                        </tr>
                                        <tr className="border-b border-gray-100">
                                            <td className="px-4 py-2.5 font-mono text-xs text-indigo-700 whitespace-nowrap">ruil search button</td>
                                            <td className="px-4 py-2.5">Search for a component across all libraries</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2.5 font-mono text-xs text-indigo-700 whitespace-nowrap">ruil info chakra</td>
                                            <td className="px-4 py-2.5">Show detailed info about a library (packages, strategy, docs)</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <h3 className="text-lg font-bold text-gray-700 mb-3">Step-by-Step: Interactive Mode</h3>
                            <ol className="list-decimal list-inside space-y-2 text-gray-600 mb-6">
                                <li>Run <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm text-indigo-700">ruil</code> or <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm text-indigo-700">ruil add</code> from your project root.</li>
                                <li>Select a <strong>UI library</strong> from the list (e.g. shadcn/ui, Material UI).</li>
                                <li>Use the <strong>checkbox interface</strong> to pick one or more components (space to select, enter to confirm).</li>
                                <li>Review the <strong>install plan</strong> and confirm.</li>
                                <li>The CLI <strong>executes the optimized command</strong> — shadcn components are batched into a single command.</li>
                                <li><strong>Import snippets</strong> are printed automatically so you can paste them into your code.</li>
                                <li>Optionally, choose to <strong>add components from another library</strong> in the same session.</li>
                            </ol>

                            <h3 className="text-lg font-bold text-gray-700 mb-3">Step-by-Step: Direct Mode</h3>
                            <ol className="list-decimal list-inside space-y-2 text-gray-600 mb-4">
                                <li>Run a single command with components in <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm text-indigo-700">library/component</code> format:</li>
                            </ol>
                            <pre className="bg-gray-900 text-indigo-200 p-4 rounded-xl text-sm font-mono mb-2 overflow-x-auto">
                                {`ruil add shadcn/button shadcn/card mui/TextField chakra/Modal`}
                            </pre>
                            <ol className="list-decimal list-inside space-y-2 text-gray-600 mb-6" start={2}>
                                <li>The CLI <strong>groups components by library</strong> automatically.</li>
                                <li>shadcn components are <strong>batched</strong> for efficiency.</li>
                                <li>npm-based libraries install their <strong>required packages</strong> (e.g. @mui/material, @emotion/react).</li>
                                <li>A <strong>summary with import snippets</strong> is printed at the end.</li>
                            </ol>

                            <h3 className="text-lg font-bold text-gray-700 mb-3">Flags</h3>
                            <div className="overflow-x-auto mb-6">
                                <table className="w-full text-sm border border-gray-200 rounded-xl overflow-hidden">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="text-left px-4 py-2.5 font-bold text-gray-700 border-b border-gray-200">Flag</th>
                                            <th className="text-left px-4 py-2.5 font-bold text-gray-700 border-b border-gray-200">Description</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-600">
                                        <tr className="border-b border-gray-100">
                                            <td className="px-4 py-2.5 font-mono text-xs text-indigo-700">--dry-run</td>
                                            <td className="px-4 py-2.5">Preview install commands without executing them</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2.5 font-mono text-xs text-indigo-700">-y, --yes</td>
                                            <td className="px-4 py-2.5">Skip confirmation prompts (auto-approve)</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <h3 className="text-lg font-bold text-gray-700 mb-3">Supported Libraries</h3>
                            <div className="overflow-x-auto mb-6">
                                <table className="w-full text-sm border border-gray-200 rounded-xl overflow-hidden">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="text-left px-4 py-2.5 font-bold text-gray-700 border-b border-gray-200">Library</th>
                                            <th className="text-left px-4 py-2.5 font-bold text-gray-700 border-b border-gray-200">Alias(es)</th>
                                            <th className="text-left px-4 py-2.5 font-bold text-gray-700 border-b border-gray-200">Components</th>
                                            <th className="text-left px-4 py-2.5 font-bold text-gray-700 border-b border-gray-200">Strategy</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-600">
                                        <tr className="border-b border-gray-100">
                                            <td className="px-4 py-2.5 font-bold">shadcn/ui</td>
                                            <td className="px-4 py-2.5 font-mono text-xs">shadcn, shadcn-ui</td>
                                            <td className="px-4 py-2.5">39</td>
                                            <td className="px-4 py-2.5">CLI <span className="text-gray-400">(batched)</span></td>
                                        </tr>
                                        <tr className="border-b border-gray-100">
                                            <td className="px-4 py-2.5 font-bold">Material UI</td>
                                            <td className="px-4 py-2.5 font-mono text-xs">mui, material</td>
                                            <td className="px-4 py-2.5">38</td>
                                            <td className="px-4 py-2.5">npm package</td>
                                        </tr>
                                        <tr className="border-b border-gray-100">
                                            <td className="px-4 py-2.5 font-bold">Chakra UI</td>
                                            <td className="px-4 py-2.5 font-mono text-xs">chakra, chakraui</td>
                                            <td className="px-4 py-2.5">32</td>
                                            <td className="px-4 py-2.5">npm package</td>
                                        </tr>
                                        <tr className="border-b border-gray-100">
                                            <td className="px-4 py-2.5 font-mono text-xs">antd, antdesign</td>
                                            <td className="px-4 py-2.5">28</td>
                                            <td className="px-4 py-2.5">npm package</td>
                                        </tr>
                                        <tr className="border-b border-gray-100">
                                            <td className="px-4 py-2.5 font-bold">Mantine UI</td>
                                            <td className="px-4 py-2.5 font-mono text-xs">mantine, mantineui</td>
                                            <td className="px-4 py-2.5">27</td>
                                            <td className="px-4 py-2.5">npm package</td>
                                        </tr>
                                        <tr className="border-b border-gray-100">
                                            <td className="px-4 py-2.5 font-bold">NextUI</td>
                                            <td className="px-4 py-2.5 font-mono text-xs">nextui</td>
                                            <td className="px-4 py-2.5">24</td>
                                            <td className="px-4 py-2.5">npm package</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2.5 font-bold">daisyUI</td>
                                            <td className="px-4 py-2.5 font-mono text-xs">daisyui, daisy</td>
                                            <td className="px-4 py-2.5">21</td>
                                            <td className="px-4 py-2.5">Tailwind plugin</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-sm text-gray-500 italic">Total: 209 components across 7 libraries.</p>

                            <h3 className="text-lg font-bold text-gray-700 mb-3 mt-6">Example: Dry-Run Output</h3>
                            <pre className="bg-gray-900 text-indigo-200 p-4 rounded-xl text-xs font-mono mb-4 overflow-x-auto leading-relaxed">
                                {`$ node bin/ruil.js add shadcn/button shadcn/card mui/TextField --dry-run -y

    📦 shadcn/ui
    ─────────────────────────────────
    [dry-run] npx shadcn-ui@latest add button card

    📋 Usage Snippets
    ─────────────────────────────────
    import { Button } from "@/components/ui/button";
    import { Card } from "@/components/ui/card";

    📦 Material UI (MUI)
    ─────────────────────────────────
    [dry-run] npm install @mui/material @emotion/react @emotion/styled

    📋 Usage Snippets
    ─────────────────────────────────
    import { TextField } from "@mui/material";`}
                            </pre>

                            <h3 className="text-lg font-bold text-gray-700 mb-3 mt-6">Global vs Local Usage</h3>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Once installed globally, you can manage your UI components from anywhere.
                            </p>

                            <h4 className="text-base font-bold text-gray-700 mb-2">Standard Commands</h4>
                            <pre className="bg-gray-900 text-indigo-200 p-4 rounded-xl text-sm font-mono mb-6 overflow-x-auto leading-relaxed">
                                {`# Search for components
    ruil search modal

    # List all supported libraries
    ruil list

    # Browse components in a specific library
    ruil list nextui

    # Dry-run install (preview only)
    ruil add mui/Button chakra/Card --dry-run

    # Interactive wizard mode
    ruil add`}
                            </pre>

                            <h4 className="text-base font-bold text-gray-700 mb-2">Integration via <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm text-indigo-700">npx</code></h4>
                            <p className="text-gray-600 leading-relaxed mb-3">
                                You can also run RUIL without a global installation using <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm text-indigo-700">npx</code>:
                            </p>
                            <pre className="bg-gray-900 text-indigo-200 p-4 rounded-xl text-sm font-mono mb-6 overflow-x-auto leading-relaxed">
                                {`npx ruil-cli add shadcn/button`}
                            </pre>

                            <h4 className="text-base font-bold text-gray-700 mb-2">Quick Reference</h4>
                            <div className="overflow-x-auto mb-4">
                                <table className="w-full text-sm border border-gray-200 rounded-xl overflow-hidden">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="text-left px-4 py-2.5 font-bold text-gray-700 border-b border-gray-200">What to do</th>
                                            <th className="text-left px-4 py-2.5 font-bold text-gray-700 border-b border-gray-200">Command</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-600">
                                        <tr className="border-b border-gray-100">
                                            <td className="px-4 py-2.5">Global Install</td>
                                            <td className="px-4 py-2.5 font-mono text-xs text-indigo-700">npm install -g ruil-cli</td>
                                        </tr>
                                        <tr className="border-b border-gray-100">
                                            <td className="px-4 py-2.5">Interactive flow</td>
                                            <td className="px-4 py-2.5 font-mono text-xs text-indigo-700">ruil</td>
                                        </tr>
                                        <tr className="border-b border-gray-100">
                                            <td className="px-4 py-2.5">Search comps</td>
                                            <td className="px-4 py-2.5 font-mono text-xs text-indigo-700">ruil search button</td>
                                        </tr>
                                        <tr className="border-b border-gray-100">
                                            <td className="px-4 py-2.5">Safe preview</td>
                                            <td className="px-4 py-2.5 font-mono text-xs text-indigo-700">ruil add shadcn/button --dry-run</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2.5">Direct install</td>
                                            <td className="px-4 py-2.5 font-mono text-xs text-indigo-700">ruil add shadcn/button</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-sm text-gray-500 italic">
                                Tip: Always use <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm text-indigo-700">--dry-run</code> first to preview what will be executed before running a real install.
                            </p>
                        </section>

                        {/* ═══════════════════════════════════════════════════════ */}
                        {/* LIBRARY TRACKER — New UI Libraries Pipeline            */}
                        {/* ═══════════════════════════════════════════════════════ */}
                        <section className="mb-10 not-prose">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                        <PackagePlus className="w-5 h-5 text-indigo-500" />
                                        12. Library Tracker
                                    </h2>
                                    <p className="text-sm text-gray-500 mt-1">Track new UI libraries for future integration into the RUIL registry.</p>
                                </div>
                                <button
                                    onClick={() => setShowForm(!showForm)}
                                    className="flex items-center gap-2 px-4 py-2 bg-black text-white text-xs font-bold rounded-xl hover:bg-gray-800 shadow-lg shadow-black/10 transition-all self-start"
                                >
                                    <Plus size={14} />
                                    {showForm ? "Cancel" : "Add Library"}
                                </button>
                            </div>

                            {/* Add Form */}
                            {showForm && (
                                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 md:p-6 mb-6 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Library Name *</label>
                                            <input
                                                type="text"
                                                value={form.name}
                                                onChange={e => setForm({ ...form, name: e.target.value })}
                                                placeholder="e.g. Park UI"
                                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Website URL</label>
                                            <input
                                                type="url"
                                                value={form.url}
                                                onChange={e => setForm({ ...form, url: e.target.value })}
                                                placeholder="https://example.com"
                                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Status</label>
                                            <select
                                                value={form.status}
                                                onChange={e => setForm({ ...form, status: e.target.value })}
                                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                            >
                                                {STATUS_OPTIONS.map(opt => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Category</label>
                                            <input
                                                type="text"
                                                value={form.category}
                                                onChange={e => setForm({ ...form, category: e.target.value })}
                                                placeholder="e.g. Headless UI, Dashboard"
                                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Notes</label>
                                        <textarea
                                            value={form.notes}
                                            onChange={e => setForm({ ...form, notes: e.target.value })}
                                            placeholder="Why should this library be added? Key features, ecosystem fit..."
                                            rows={2}
                                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                                        />
                                    </div>
                                    <button
                                        onClick={handleAdd}
                                        disabled={!form.name.trim()}
                                        className="px-5 py-2 bg-black text-white text-xs font-bold rounded-xl hover:bg-gray-800 shadow-lg shadow-black/10 transition-all disabled:opacity-40 disabled:shadow-none flex items-center gap-2"
                                    >
                                        <Sparkles size={12} /> Add to Tracker
                                    </button>
                                </div>
                            )}

                            {/* Tracked Libraries List */}
                            <div className="space-y-3">
                                {trackedLibs.length === 0 ? (
                                    <div className="py-12 text-center border-2 border-dashed border-gray-100 rounded-xl">
                                        <PackagePlus className="w-8 h-8 text-gray-200 mx-auto mb-3" />
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">No libraries tracked yet</p>
                                        <p className="text-[10px] text-gray-300 mt-1">Click "Add Library" to start tracking.</p>
                                    </div>
                                ) : (
                                    trackedLibs.map(lib => {
                                        const badge = getStatusBadge(lib.status);
                                        return (
                                            <div key={lib.id} className="bg-white border border-gray-100 rounded-xl p-4 md:p-5 hover:border-indigo-100 hover:shadow-md transition-all group">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
                                                            <h4 className="text-sm font-bold text-gray-900">{lib.name}</h4>
                                                            <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-full border ${badge.color}`}>
                                                                {badge.label}
                                                            </span>
                                                            {lib.category && (
                                                                <span className="px-2 py-0.5 bg-gray-50 border border-gray-100 text-gray-400 text-[9px] font-bold uppercase tracking-wider rounded-full">
                                                                    {lib.category}
                                                                </span>
                                                            )}
                                                        </div>
                                                        {lib.notes && (
                                                            <p className="text-xs text-gray-500 leading-relaxed mb-2">{lib.notes}</p>
                                                        )}
                                                        <div className="flex items-center gap-3 text-[10px] text-gray-400 font-medium">
                                                            <span>Added {lib.date}</span>
                                                            {lib.url && (
                                                                <>
                                                                    <span>•</span>
                                                                    <a href={lib.url} target="_blank" rel="noopener noreferrer" className="text-black hover:underline flex items-center gap-1 transition-colors">
                                                                        Visit site <ExternalLink size={9} />
                                                                    </a>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleDelete(lib.id)}
                                                        className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                        title="Remove"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            <p className="text-[10px] text-gray-300 mt-4 text-center font-medium">
                                Tracked libraries are saved locally. Add promising ecosystems here before integrating them into the registry.
                            </p>
                        </section>
                    </article>
                </motion.div>
            </main>
        </div>
    );
};

export default Documentation;
