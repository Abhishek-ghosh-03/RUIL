# RUIL CLI

> **Unified CLI for installing UI components across React libraries**

Install components from **shadcn/ui, Material UI, Chakra UI, NextUI, daisyUI, Ant Design,** and **Mantine** — all from one command.

---

## Quick Start

```bash
# From the cli/ directory
npm install
node bin/ruil.js add       # Interactive mode
```

---

## Commands

### `ruil add` — Install Components

**Interactive mode** (guided wizard):
```bash
node bin/ruil.js add
```
- Select a library from a list
- Pick components via checkbox interface
- Confirm and install

**Direct mode** (one-shot):
```bash
node bin/ruil.js add shadcn/button shadcn/card mui/TextField
```
- Components are grouped by library for batch efficiency
- shadcn components are combined: `npx shadcn-ui add button card`
- MUI/Chakra/etc install their packages automatically

**Flags:**
| Flag | Description |
|------|-------------|
| `--dry-run` | Preview commands without executing |
| `-y, --yes` | Skip confirmation |

---

### `ruil list [library]` — Browse Libraries

```bash
node bin/ruil.js list            # Show all libraries
node bin/ruil.js list shadcn     # Show shadcn components
node bin/ruil.js list mui        # Show MUI components
```

---

### `ruil search <query>` — Cross-Library Search

```bash
node bin/ruil.js search button   # Find "button" across all libraries
node bin/ruil.js search modal    # Find "modal" across all libraries
```

---

### `ruil info <library>` — Library Details

```bash
node bin/ruil.js info chakra     # Show Chakra UI details
```

---

## Supported Libraries

| Library | Components | Strategy |
|---------|-----------|----------|
| shadcn/ui | 39 | CLI (`npx shadcn-ui add`) |
| Material UI | 38 | npm packages |
| Chakra UI | 32 | npm packages |
| Ant Design | 28 | npm packages |
| Mantine UI | 27 | npm packages |
| NextUI | 24 | npm packages |
| daisyUI | 21 | Tailwind plugin |

**Total: 209 components across 7 libraries.**

---

## Library Aliases

You can use any of these names in commands:

- `shadcn`, `shadcnui`, `shadcn-ui`
- `mui`, `material`, `materialui`
- `chakra`, `chakraui`
- `nextui`
- `daisyui`, `daisy`
- `antd`, `antdesign`
- `mantine`, `mantineui`

---

## Architecture

```
cli/
├── bin/
│   └── ruil.js          # Entry point & command definitions
├── src/
│   ├── registry.js      # Component metadata for all libraries
│   ├── installer.js     # Execution engine (npm/cli strategies)
│   ├── parser.js        # Direct-mode argument parser
│   └── prompts.js       # Interactive inquirer prompts
├── package.json
└── README.md
```
