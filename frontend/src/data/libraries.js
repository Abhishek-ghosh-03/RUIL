export const UI_LIBRARIES = [
  {
    id: "shadcn",
    name: "shadcn/ui",
    category: "Headless UI",
    logoURL: "https://avatars.githubusercontent.com/u/139895814?s=200&v=4",
    docsURL: "https://ui.shadcn.com",
    githubRepo: "shadcn-ui/ui",
    color: "from-zinc-500 to-zinc-800",
    installCommands: ["npx shadcn-ui@latest init", "npx shadcn-ui@latest add button"],
    prerequisites: ["Tailwind CSS configured", "Lucide React icons"],
    importExample: `import { Button } from "@/components/ui/button"`,
    notes: "You own the code. Highly customizable.",
    warning: "Components are added locally to your project.",
    updates: [
      { version: "v2.1.0", date: "April 2024", text: "New Sidebar component and improved breadcrumbs." },
    ]
  },
  {
    id: "mui",
    name: "Material UI (MUI)",
    category: "Design System",
    logoURL: "https://avatars.githubusercontent.com/u/3366335?s=200&v=4",
    docsURL: "https://mui.com/material-ui/getting-started/",
    githubRepo: "mui/material-ui",
    color: "from-blue-500 to-blue-700",
    installCommands: ["npm install @mui/material @emotion/react @emotion/styled"],
    prerequisites: ["React 17+", "Roboto Font"],
    importExample: `import { Button } from "@mui/material"`,
    notes: "Robust and industry-standard.",
    warning: "Heavy bundle size if not tree-shaken.",
    updates: [
      { version: "v6.0.0", date: "Mar 2024", text: "Full support for Pigment CSS." },
    ]
  },
  {
    id: "chakra",
    name: "Chakra UI",
    category: "Modern UI",
    logoURL: "https://avatars.githubusercontent.com/u/54212428?s=200&v=4",
    docsURL: "https://chakra-ui.com/docs/get-started/installation",
    githubRepo: "chakra-ui/chakra-ui",
    color: "from-teal-400 to-teal-600",
    installCommands: ["npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion"],
    prerequisites: ["ChakraProvider wrap"],
    importExample: `import { Button } from "@chakra-ui/react"`,
    notes: "Excellent developer experience.",
    warning: "JS-in-CSS performance overhead.",
    updates: [
      { version: "v3.0", date: "Jan 2024", text: "Next-gen architecture." }
    ]
  },
  {
    id: "nextui",
    name: "NextUI",
    category: "Modern UI",
    logoURL: "https://avatars.githubusercontent.com/u/86160567?s=200&v=4",
    docsURL: "https://nextui.org/docs/guide/introduction",
    githubRepo: "nextui-org/nextui",
    color: "from-pink-500 to-purple-600",
    installCommands: ["npm install @nextui-org/react framer-motion"],
    prerequisites: ["Tailwind CSS", "NextUIProvider wrap"],
    importExample: `import { Button } from "@nextui-org/react"`,
    notes: "Built on top of Tailwind CSS.",
    warning: "Requires Tailwind CSS configuration.",
    updates: [
      { version: "v2.2.5", date: "Feb 2024", text: "New Calendar components." }
    ]
  },
  {
    id: "radix",
    name: "Radix UI",
    category: "Headless UI",
    logoURL: "https://avatars.githubusercontent.com/u/75042455?s=200&v=4",
    docsURL: "https://www.radix-ui.com/primitives/docs",
    githubRepo: "radix-ui/primitives",
    color: "from-indigo-400 to-indigo-600",
    installCommands: ["npm install @radix-ui/react-primitive"],
    prerequisites: ["Custom styling layer"],
    importExample: `import * as Dialog from "@radix-ui/react-dialog"`,
    notes: "Unstyled, accessible primitives.",
    warning: "You must provide all the styling yourself.",
    updates: [
      { version: "v3.0", date: "Dec 2023", text: "Stable release for Radix Themes." }
    ]
  },
  {
    id: "mantine",
    name: "Mantine UI",
    category: "Component Library",
    logoURL: "",
    docsURL: "https://mantine.dev/getting-started/",
    githubRepo: "mantinedev/mantine",
    color: "from-blue-400 to-indigo-500",
    installCommands: ["npm install @mantine/core @mantine/hooks"],
    prerequisites: ["MantineProvider wrap"],
    importExample: `import { Button } from "@mantine/core"`,
    notes: "100+ components and 50+ hooks.",
    warning: "Uses Emotion for styling.",
    updates: [
      { version: "v7.5", date: "Feb 2024", text: "Native support for PostCSS." }
    ]
  },
  {
    id: "daisyui",
    name: "daisyUI",
    category: "Tailwind Plugin",
    logoURL: "https://daisyui.com/images/daisyui-logo/favicon-192.png",
    docsURL: "https://daisyui.com/docs/install/",
    githubRepo: "saadeghi/daisyui",
    color: "from-green-400 to-teal-500",
    installCommands: ["npm install -D daisyui"],
    prerequisites: ["Tailwind CSS installed"],
    importExample: `<button className="btn btn-primary">Button</button>`,
    notes: "Pure CSS components for Tailwind.",
    warning: "Component logic must be handled manually.",
    updates: [
      { version: "v4.6", date: "Jan 2024", text: "Added new themes." }
    ]
  },
  {
    id: "heroui",
    name: "HeroUI",
    category: "Modern UI",
    logoURL: "https://www.heroui.com/apple-touch-icon.png",
    docsURL: "https://heroui.com/docs/react/getting-started",
    githubRepo: "heroui-inc/heroui",
    color: "from-orange-500 to-red-600",
    installCommands: ["npm install @heroui/react"],
    prerequisites: ["Tailwind CSS"],
    importExample: `import { HeroButton } from "@heroui/react"`,
    notes: "High-performance React UI.",
    warning: "Newer ecosystem.",
    updates: [
      { version: "v1.2", date: "Mar 2024", text: "Added Data Table." }
    ]
  },
  {
    id: "antd",
    name: "Ant Design",
    category: "Enterprise UI",
    logoURL: "https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg",
    docsURL: "https://ant.design/docs/react/introduce",
    githubRepo: "ant-design/ant-design",
    color: "from-red-500 to-red-700",
    installCommands: ["npm install antd"],
    prerequisites: ["ConfigProvider"],
    importExample: `import { Button } from 'antd';`,
    updates: [
      { version: "v5.14.0", date: "Feb 2024", text: "New theme improvements." }
    ]
  },
  {
    id: "reactaria",
    name: "React Aria",
    category: "Headless UI",
    logoURL: "https://avatars.githubusercontent.com/u/1206132?s=200&v=4",
    docsURL: "https://react-spectrum.adobe.com/react-aria/",
    githubRepo: "adobe/react-spectrum",
    color: "from-indigo-600 to-blue-800",
    installCommands: ["npm install react-aria-components"],
    prerequisites: ["React 18"],
    importExample: `import { Button } from "react-aria-components"`,
    updates: [
      { version: "v1.1", date: "Mar 2024", text: "Better form support." }
    ]
  },
  {
    id: "reshaped",
    name: "Reshaped",
    category: "Design System",
    logoURL: "https://avatars.githubusercontent.com/u/74204557?s=200&v=4",
    docsURL: "https://reshaped.so/docs/getting-started/introduction",
    githubRepo: "formaat-design/reshaped",
    color: "from-violet-500 to-purple-800",
    installCommands: ["npm install reshaped"],
    prerequisites: ["ReshapedProvider"],
    updates: [
      { version: "v2.4", date: "Feb 2024", text: "Dark Mode auto-detection." }
    ]
  },
  {
    id: "alignui",
    name: "AlignUI",
    category: "Modern UI",
    logoURL: "https://alignui.com/favicon.ico",
    docsURL: "https://alignui.com/docs/getting-started",
    githubRepo: "alignui/alignui",
    color: "from-amber-400 to-orange-600",
    installCommands: ["npm install @alignui/react"],
    prerequisites: ["Tailwind CSS", "React 18+"],
    importExample: `import { Button } from "@alignui/react"`,
    notes: "Crafted for speed and clean aesthetics.",
    warning: "Beta version, check docs for updates.",
    updates: [
      { version: "Beta 0.8", date: "Mar 2024", text: "New spacing system." }
    ]
  },
  {
    id: "tailark",
    name: "Tailark",
    category: "Tailwind UI",
    logoURL: "https://tailark.com/favicon.ico",
    docsURL: "https://tailark.com/docs",
    githubRepo: "tailark/tailark",
    color: "from-sky-400 to-blue-600",
    installCommands: ["npm install tailark"],
    prerequisites: ["Tailwind CSS", "Tailark Plugin"],
    importExample: `import { Navbar } from "tailark"`,
    notes: "Modular UI components for rapid development.",
    warning: "Check tailwind.config.js for plugin setup.",
    updates: [
      { version: "v1.5", date: "Dec 2023", text: "15 new templates." }
    ]
  },
  {
    id: "untitled",
    name: "Untitled UI",
    category: "Premium UI",
    logoURL: "https://avatars.githubusercontent.com/u/78918239?s=200&v=4",
    docsURL: "https://www.untitledui.com/",
    githubRepo: "untitledui/untitledui",
    color: "from-gray-400 to-gray-600",
    installCommands: ["npm install @untitled-ui/react"],
    prerequisites: ["Tailwind CSS", "Premium access for Figma assets"],
    importExample: `import { Button } from "@untitled-ui/react"`,
    notes: "Modern design system library.",
    warning: "Opinionated design, ensures consistency.",
    updates: [
      { version: "v2.0", date: "Feb 2024", text: "Refactored tree shaking support." }
    ]
  }
];
