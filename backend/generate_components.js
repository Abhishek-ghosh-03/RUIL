import fs from 'fs';

const libraries = [
  { id: 'untitled-ui', name: 'Untitled UI React', type: 'package', command: 'npm install @untitled-ui/react', style: 'border:1px solid #d0d5dd;border-radius:8px;box-shadow:0 1px 2px rgba(16,24,40,0.05);color:#344054;background:#fff;padding:10px 16px;font-family:Inter;' },
  { id: 'shadcn', name: 'shadcn/ui', type: 'cli', command: 'npx shadcn-ui@latest add', style: 'border:1px solid #1f2937;border-radius:6px;background:#030712;color:#f9fafb;padding:8px 16px;font-weight:500;font-family:system-ui;' },
  { id: 'tailwind-plus', name: 'Tailwind Plus', type: 'package', command: 'npm install tailwind-plus', style: 'border-radius:12px;background:linear-gradient(to right, #ec4899, #8b5cf6);color:#fff;padding:12px 24px;border:none;box-shadow:0 4px 6px rgba(0,0,0,0.1);' },
  { id: 'kibo-ui', name: 'Kibo UI', type: 'package', command: 'npm install kibo-ui', style: 'border-radius:0;border:2px solid black;background:white;color:black;padding:10px 20px;font-weight:bold;text-transform:uppercase;' },
  { id: 'react-aria', name: 'React Aria Components', type: 'package', command: 'npm install react-aria-components', style: 'border:none;background:#e5e7eb;color:#111827;padding:8px 16px;border-radius:4px;outline:2px solid transparent;transition:all 0.2s;' },
  { id: 'mui', name: 'Material UI (MUI)', type: 'package', command: 'npm install @mui/material', style: 'border:none;background:#1976d2;color:#fff;padding:6px 16px;border-radius:4px;box-shadow:0 3px 1px -2px rgba(0,0,0,0.2),0 2px 2px 0 rgba(0,0,0,0.14);text-transform:uppercase;font-family:Roboto;' },
  { id: 'reshaped', name: 'Reshaped', type: 'package', command: 'npm install reshaped', style: 'border-radius:24px;padding:12px 24px;background:#0052cc;color:white;border:none;font-weight:bold;' },
  { id: 'align-ui', name: 'AlignUI', type: 'package', command: 'npm install align-ui', style: 'border:1px solid #000;background:#000;color:#fff;border-radius:999px;padding:8px 24px;' },
  { id: 'base-ui', name: 'Base UI', type: 'package', command: 'npm install @mui/base', style: 'border:none;background:transparent;color:#007fff;text-decoration:underline;padding:8px;' },
  { id: 'tailark', name: 'Tailark', type: 'package', command: 'npm install tailark', style: 'border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.05);backdrop-filter:blur(10px);color:black;padding:12px 20px;border-radius:16px;' },
  { id: 'heroui', name: 'HeroUI (NextUI)', type: 'package', command: 'npm install @nextui-org/react', style: 'border:none;border-radius:14px;background:linear-gradient(45deg, #006fee, #004493);color:white;box-shadow:0 4px 14px 0 rgba(0,111,238,0.39);padding:10px 20px;' },
  { id: 'mantine', name: 'Mantine UI', type: 'package', command: 'npm install @mantine/core', style: 'border:none;background:#228be6;color:#fff;border-radius:4px;padding:8px 18px;font-family:sans-serif;font-weight:600;' },
  { id: 'daisyui', name: 'daisyUI', type: 'package', command: 'npm i -D daisyui@latest', style: 'border:none;background:#570df8;color:#fff;border-radius:0.5rem;padding:0.75rem 1.5rem;text-transform:uppercase;font-weight:600;' },
  { id: 'ant-design', name: 'Ant Design', type: 'package', command: 'npm install antd', style: 'border:1px solid #1677ff;background:#1677ff;color:#fff;border-radius:6px;padding:4px 15px;box-shadow:0 2px 0 rgba(5,145,255,0.1);' },
  { id: 'radix', name: 'Radix UI', type: 'package', command: 'npm install @radix-ui/react-dialog', style: 'border:1px solid #3f3f46;background:#18181b;color:#fafafa;border-radius:6px;padding:8px 16px;font-family:sans-serif;' },
  { id: 'chakra', name: 'Chakra UI', type: 'package', command: 'npm i @chakra-ui/react', style: 'border:none;background:#319795;color:white;border-radius:0.375rem;padding:0.5rem 1rem;font-weight:600;' }
];

const categoriesData = [
  { cat: 'button', tag: 'button', genHtml: (lib) => `<button style="${lib.style}">${lib.name} Button</button>` },
  { cat: 'input', tag: 'input', genHtml: (lib) => `<input type="text" placeholder="${lib.name} Input" style="${lib.style.replace('background:', 'bg-none:').replace('color:#fff', 'color:gray')}; background:transparent;" />` },
  { cat: 'form', tag: 'form', genHtml: (lib) => `<form style="${lib.style}; display:flex; flex-direction:column; gap:10px;"><input placeholder="Email" style="padding:5px;"/><button type="button" style="padding:5px;">Submit Form</button></form>` },
  { cat: 'card', tag: 'card', genHtml: (lib) => `<div style="${lib.style}; min-width: 250px; text-transform:none;"><h3>${lib.name} Card</h3><p style="font-size:12px; opacity:0.8; margin-top:8px;">This card demonstrates the visual aesthetic of the ${lib.id} component library.</p></div>` },
  { cat: 'modal', tag: 'modal', genHtml: (lib) => `<div style="position:fixed; inset:0; background:rgba(0,0,0,0.5); display:flex; justify-content:center; align-items:center;"> <div style="${lib.style}; padding:30px; text-transform:none; min-width:300px;"><h2 style="margin:0 0 10px 0">${lib.name} Modal</h2><button style="margin-top:15px; padding:5px 10px;">Close Window</button></div></div>` },
  { cat: 'feedback', tag: 'feedback', genHtml: (lib) => `<div style="${lib.style}; border-left: 4px solid #10b981; display:flex; gap:10px; align-items:center;"><span style="background:#10b981; border-radius:50%; width:16px; height:16px; display:inline-block;"></span>${lib.name} Success Toast</div>` },
  { cat: 'data display', tag: 'data', genHtml: (lib) => `<table style="${lib.style}; width: 100%; border-collapse: collapse;"><tr style="border-bottom:1px solid currentColor"><th>Name</th><th>Status</th></tr><tr><td>Example</td><td>Active</td></tr></table>` },
  { cat: 'navigation', tag: 'nav', genHtml: (lib) => `<nav style="${lib.style}; display:flex; gap:20px; align-items:center;"><span style="font-weight:900">${lib.id.toUpperCase()}</span><a href="#">Home</a><a href="#">Pricing</a><a href="#">Docs</a></nav>` }
];

let existing = [];
try {
  existing = JSON.parse(fs.readFileSync('components.json', 'utf8')).slice(0, 15); // keep 15 original varied items
} catch(e){}

const newComponents = [];

libraries.forEach(lib => {
  categoriesData.forEach(c => {
    let commandStr = lib.command;
    if (lib.type === 'cli') {
      commandStr = lib.command + ' ' + c.cat.replace(' data display', 'table');
    }

    newComponents.push({
      name: lib.name + ' ' + c.cat.charAt(0).toUpperCase() + c.cat.slice(1),
      description: "A " + c.cat + " component built with " + lib.name + " design principles.",
      category: c.cat,
      framework: "react",
      library: lib.id,
      type: lib.type,
      tags: [lib.id, c.tag, c.cat],
      previewHtml: c.genHtml(lib),
      installCommand: commandStr,
      importCode: "import { " + (c.cat.charAt(0).toUpperCase() + c.cat.slice(1)).replace(' ', '') + " } from '" + lib.id + "';\n\n// Usage rendering"
    });
  });
});

fs.writeFileSync('components.json', JSON.stringify([...existing, ...newComponents], null, 2));

console.log('Added ' + newComponents.length + ' distinct stylized components. Overwrote old ones.');
