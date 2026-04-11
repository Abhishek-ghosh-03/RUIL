export const UI_LIBRARIES = [
  {
    id: "shadcn",
    name: "shadcn/ui",
    category: "Headless / Components",
    icon: "Layers",
    color: "from-zinc-500 to-zinc-800",
    installCommands: ["npx shadcn-ui@latest init", "npx shadcn-ui@latest add button"],
    prerequisites: ["Tailwind CSS configured", "Lucide React icons"],
    importExample: `import { Button } from "@/components/ui/button"`,
    notes: "You own the code. Highly customizable.",
    warning: "Components are added locally to your project.",
    updates: [
      { version: "v2.1.0", date: "April 2024", text: "New Sidebar component and improved breadcrumbs." },
      { version: "v2.0.4", date: "Feb 2024", text: "Added block clones and better CLI performance." }
    ]
  },
  {
    id: "mui",
    name: "Material UI (MUI)",
    category: "Component Library",
    icon: "LayoutDashboard",
    color: "from-blue-500 to-blue-700",
    installCommands: ["npm install @mui/material @emotion/react @emotion/styled"],
    prerequisites: ["React 17+", "Roboto Font"],
    importExample: `import { Button } from "@mui/material"`,
    notes: "Robust and industry-standard.",
    warning: "Heavy bundle size if not tree-shaken.",
    updates: [
      { version: "v6.0.0", date: "Mar 2024", text: "Full support for Pigment CSS (Zero-runtime CSS-in-JS)." },
      { version: "v5.15.0", date: "Dec 2023", text: "Enhanced accessibility for DataGrid components." }
    ]
  },
  {
    id: "chakra",
    name: "Chakra UI",
    category: "Component Library",
    icon: "Zap",
    color: "from-teal-400 to-teal-600",
    installCommands: ["npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion"],
    prerequisites: ["ChakraProvider wrap"],
    importExample: `import { Button } from "@chakra-ui/react"`,
    notes: "Excellent developer experience.",
    warning: "JS-in-CSS performance overhead.",
    updates: [
      { version: "v3.0 (Alpha)", date: "Jan 2024", text: "Next-gen architecture with better Tailwind integration." },
      { version: "v2.8.2", date: "Nov 2023", text: "Bug fixes for popover and modal focus traps." }
    ]
  },
  {
    id: "nextui",
    name: "NextUI",
    category: "Modern UI",
    icon: "Sparkles",
    color: "from-pink-500 to-purple-600",
    installCommands: ["npm install @nextui-org/react framer-motion"],
    prerequisites: ["Tailwind CSS", "NextUIProvider wrap"],
    importExample: `import { Button } from "@nextui-org/react"`,
    notes: "Built on top of Tailwind CSS and React Aria.",
    warning: "Requires Tailwind CSS configuration.",
    updates: [
      { version: "v2.2.5", date: "Feb 2024", text: "Added new Calendar and RangePicker components." },
      { version: "v2.1.0", date: "Oct 2023", text: "Improved server-side rendering support for Next.js 14." }
    ]
  },
  {
    id: "radix",
    name: "Radix UI",
    category: "Headless UI",
    icon: "Target",
    color: "from-indigo-400 to-indigo-600",
    installCommands: ["npm install @radix-ui/react-primitive"],
    prerequisites: ["Custom styling layer (CSS/Tailwind)"],
    importExample: `import * as Dialog from "@radix-ui/react-dialog"`,
    notes: "Unstyled, accessible primitives.",
    warning: "You must provide all the styling yourself.",
    updates: [
      { version: "v3.0", date: "Dec 2023", text: "Stable release for Radix Themes and better color palette." },
      { version: "v2.1", date: "Sep 2023", text: "Added Form primitive for easier validation handling." }
    ]
  },
  {
    id: "mantine",
    name: "Mantine UI",
    category: "Component Library",
    icon: "Gem",
    color: "from-blue-400 to-indigo-500",
    installCommands: ["npm install @mantine/core @mantine/hooks"],
    prerequisites: ["MantineProvider wrap"],
    importExample: `import { Button } from "@mantine/core"`,
    notes: "100+ components and 50+ hooks.",
    warning: "Uses Emotion for styling.",
    updates: [
      { version: "v7.5", date: "Feb 2024", text: "Native support for PostCSS and CSS variables without runtime." },
      { version: "v7.0", date: "Sep 2023", text: "Massive rework to become framework-agnostic." }
    ]
  },
  {
    id: "daisyui",
    name: "daisyUI",
    category: "Tailwind Plugin",
    icon: "Wind",
    color: "from-green-400 to-teal-500",
    installCommands: ["npm install -D daisyui"],
    prerequisites: ["Tailwind CSS installed", "daisyui in tailwind.config.js"],
    importExample: `<button className="btn btn-primary">Button</button>`,
    notes: "Pure CSS components for Tailwind.",
    warning: "Component logic (state) must be handled manually.",
    updates: [
      { version: "v4.6", date: "Jan 2024", text: "Added new themes (Nord, Sunset, Dim) and data-theme logic." },
      { version: "v4.0", date: "Nov 2023", text: "Major performance overhaul and smaller CSS footprint." }
    ]
  },
  {
    id: "heroui",
    name: "HeroUI",
    category: "Modern UI",
    icon: "ShieldCheck",
    color: "from-orange-500 to-red-600",
    installCommands: ["npm install @heroui/react"],
    prerequisites: ["Tailwind CSS"],
    importExample: `import { HeroButton } from "@heroui/react"`,
    notes: "A new standard for high-performance React UI.",
    warning: "Newer ecosystem, monitor for updates.",
    updates: [
      { version: "v1.2", date: "Mar 2024", text: "Added Data Table with server-side sorting/filtering." },
      { version: "v1.0", date: "Jan 2024", text: "First stable release with 40+ atomic components." }
    ]
  },
  {
    id: "baseui",
    name: "Base UI",
    category: "Headless UI",
    icon: "Cpu",
    color: "from-gray-600 to-gray-900",
    installCommands: ["npm install @base-ui/react"],
    prerequisites: ["React 18+"],
    importExample: `import { Button } from "@base-ui/react"`,
    notes: "MUI's unstyled component library.",
    warning: "Currently in early stages of development.",
    updates: [
      { version: "v0.1-Alpha", date: "Feb 2024", text: "Initial release of unstyled Select and Menu primitives." }
    ]
  },
  {
    id: "reactaria",
    name: "React Aria",
    category: "Design System",
    icon: "Activity",
    color: "from-indigo-600 to-blue-800",
    installCommands: ["npm install react-aria-components"],
    prerequisites: ["Accessibility knowledge"],
    importExample: `import { Button } from "react-aria-components"`,
    notes: "Adobe's library for building accessible UIs.",
    warning: "Steeper learning curve but best-in-class accessibility.",
    updates: [
      { version: "v1.1", date: "Mar 2024", text: "Better support for Formik and React Hook Form integration." },
      { version: "v1.0", date: "Dec 2023", text: "Stable release of React Aria Components (RAC)." }
    ]
  },
  {
    id: "reshaped",
    name: "Reshaped",
    category: "Design System",
    icon: "Shapes",
    color: "from-violet-500 to-purple-800",
    installCommands: ["npm install reshaped"],
    prerequisites: ["ReshapedProvider"],
    importExample: `import { Button } from "reshaped"`,
    notes: "Professional design system for React.",
    warning: "Requires licensing for commercial scale.",
    updates: [
      { version: "v2.4", date: "Feb 2024", text: "Added Dark Mode auto-detection and better tokens." }
    ]
  },
  {
    id: "alignui",
    name: "AlignUI",
    category: "Modern UI",
    icon: "Square",
    color: "from-amber-400 to-orange-600",
    installCommands: ["npm install @alignui/react"],
    prerequisites: ["Tailwind CSS"],
    importExample: `import { Button } from "@alignui/react"`,
    notes: "Crafted for speed and clean aesthetics.",
    warning: "Beta version, check docs for breaking changes.",
    updates: [
      { version: "Beta 0.8", date: "Mar 2024", text: "Reworked the spacing system to use Tailwind 4+ patterns." }
    ]
  },
  {
    id: "tailark",
    name: "Tailark",
    category: "Tailwind UI",
    icon: "Database",
    color: "from-sky-400 to-blue-600",
    installCommands: ["npm install tailark"],
    prerequisites: ["Tailwind CSS"],
    importExample: `import { Navbar } from "tailark"`,
    notes: "Modular UI components for rapid development.",
    warning: "Requires Tailark plugin in Tailwind config.",
    updates: [
      { version: "v1.5", date: "Dec 2023", text: "Added 15 new Dashboard layout templates for React." }
    ]
  },
  {
    id: "kibo",
    name: "Kibo UI",
    category: "Component Library",
    icon: "Box",
    color: "from-emerald-400 to-green-600",
    installCommands: ["npm install @kiboui/react"],
    prerequisites: ["React 18"],
    importExample: `import { Card } from "@kiboui/react"`,
    notes: "Minimalist design language for modern apps.",
    warning: "Focuses on light-weight implementation.",
    updates: [
      { version: "v0.9", date: "Jan 2024", text: "Initial Beta release with core layout primitives." }
    ]
  },
  {
    id: "untitled",
    name: "Untitled UI React",
    category: "Premium Library",
    icon: "CreditCard",
    color: "from-gray-400 to-gray-600",
    installCommands: ["npm install @untitled-ui/react"],
    prerequisites: ["Tailwind CSS"],
    importExample: `import { Button } from "@untitled-ui/react"`,
    notes: "The world's largest Figma UI kit, now in React.",
    warning: "Highly opinionated styling.",
    updates: [
      { version: "v2.0", date: "Feb 2024", text: "Major library re-architecture for better tree shaking." }
    ]
  },
  {
    id: "tailwindplus",
    name: "Tailwind Plus",
    category: "Utility UI",
    icon: "PlusCircle",
    color: "from-cyan-500 to-blue-500",
    installCommands: ["npm install @tailwindplus/react"],
    prerequisites: ["Tailwind CSS v3"],
    importExample: `import { Layout } from "@tailwindplus/react"`,
    notes: "Extended utility components for Tailwind users.",
    warning: "Ensure no class name collisions with base Tailwind.",
    updates: [
      { version: "v1.2", date: "Feb 2024", text: "Added support for Tailwind CSS container queries." }
    ]
  },
  {
    id: "antd",
    name: "Ant Design",
    category: "Enterprise UI",
    icon: "Terminal",
    color: "from-red-500 to-red-700",
    installCommands: ["npm install antd"],
    prerequisites: ["ConfigProvider"],
    importExample: `import { Button } from 'antd';`,
    notes: "Ideal for massive enterprise apps.",
    warning: "Large bundle size, heavy styling defaults.",
    updates: [
      { version: "v5.14.0", date: "Feb 2024", text: "New ColorPicker component and theme editor improvements." },
      { version: "v5.0.0", date: "Nov 2022", text: "Switched to Design Token system for CSS-in-JS." }
    ]
  }
];
