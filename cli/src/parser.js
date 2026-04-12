// ═══════════════════════════════════════════════════════════════════
// RUIL CLI — Direct Mode Parser
// Parses inputs like `shadcn/button mui/card chakra/Modal`
// and groups them by library for batch installation.
// ═══════════════════════════════════════════════════════════════════

import chalk from "chalk";
import { LIBRARIES, resolveLibrary } from "./registry.js";

/**
 * Parse an array of `library/component` arguments into grouped install tasks.
 * @param {string[]} args - e.g. ["shadcn/button", "shadcn/card", "mui/TextField"]
 * @returns {{ tasks: Array<{ libKey, lib, components }>, errors: string[] }}
 */
export function parseDirectArgs(args) {
  const grouped = {};   // libKey -> Set<componentName>
  const errors = [];

  for (const arg of args) {
    // Support both `shadcn/button` and `shadcn:button` and `shadcn button`
    const parts = arg.split(/[\/\:]/);
    if (parts.length !== 2) {
      errors.push(`Invalid format "${arg}". Use library/component (e.g. shadcn/button).`);
      continue;
    }

    const [libInput, compInput] = parts;
    const libKey = resolveLibrary(libInput);

    if (!libKey) {
      errors.push(`Unknown library "${libInput}". Available: ${Object.keys(LIBRARIES).join(", ")}`);
      continue;
    }

    const lib = LIBRARIES[libKey];
    const comp = lib.components.find(
      (c) => c.name.toLowerCase() === compInput.toLowerCase()
    );

    if (!comp) {
      errors.push(
        `Component "${compInput}" not found in ${lib.name}. ` +
        `Run ${chalk.cyan("ruil list " + libKey)} to see available components.`
      );
      continue;
    }

    if (!grouped[libKey]) grouped[libKey] = new Set();
    grouped[libKey].add(comp.name);
  }

  const tasks = Object.entries(grouped).map(([libKey, compSet]) => ({
    libKey,
    lib: LIBRARIES[libKey],
    components: [...compSet],
  }));

  return { tasks, errors };
}
