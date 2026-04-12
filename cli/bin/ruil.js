#!/usr/bin/env node

// ═══════════════════════════════════════════════════════════════════
// ██████╗  ██╗   ██╗ ██╗ ██╗
// ██╔══██╗ ██║   ██║ ██║ ██║
// ██████╔╝ ██║   ██║ ██║ ██║
// ██╔══██╗ ██║   ██║ ██║ ██║
// ██║  ██║ ╚██████╔╝ ██║ ███████╗
// ╚═╝  ╚═╝  ╚═════╝  ╚═╝ ╚══════╝
//
// RUIL CLI — Unified UI Component Installer
// Install components from shadcn/ui, MUI, Chakra, and more
// from a single command line.
// ═══════════════════════════════════════════════════════════════════

import { Command } from "commander";
import chalk from "chalk";
import { LIBRARIES, resolveLibrary } from "../src/registry.js";
import { installComponents, printSummary } from "../src/installer.js";
import { promptLibrary, promptComponents, promptConfirm } from "../src/prompts.js";
import { parseDirectArgs } from "../src/parser.js";

const VERSION = "1.0.0";

// ── Banner ─────────────────────────────────────────────────────────
function printBanner() {
  console.log();
  console.log(chalk.bold.hex("#6366f1")("  ╔══════════════════════════════════════╗"));
  console.log(chalk.bold.hex("#6366f1")("  ║") + chalk.bold.white("   RUIL — UI Component Installer     ") + chalk.bold.hex("#6366f1")("║"));
  console.log(chalk.bold.hex("#6366f1")("  ║") + chalk.dim("   Install from 7+ React libraries    ") + chalk.bold.hex("#6366f1")("║"));
  console.log(chalk.bold.hex("#6366f1")("  ╚══════════════════════════════════════╝"));
  console.log();
}

// ── Program Setup ──────────────────────────────────────────────────
const program = new Command();

program
  .name("ruil")
  .description("Unified CLI for installing UI components across React libraries")
  .version(VERSION);

// ── ADD Command ────────────────────────────────────────────────────
program
  .command("add [components...]")
  .description("Install UI components. Interactive or direct mode.")
  .option("--dry-run", "Preview commands without executing")
  .option("-y, --yes", "Skip confirmation prompt")
  .action(async (components, options) => {
    printBanner();

    // ── Direct Mode: `ruil add shadcn/button mui/card` ──────────
    if (components && components.length > 0) {
      const { tasks, errors } = parseDirectArgs(components);

      // Print errors
      for (const err of errors) {
        console.log(chalk.red(`  ✗ ${err}`));
      }
      if (errors.length > 0) console.log();

      if (tasks.length === 0) {
        console.log(chalk.yellow("  No valid components to install."));
        process.exit(1);
      }

      const allResults = [];

      // Confirm & Install
      if (!options.yes) {
        for (const task of tasks) {
          const confirmed = await promptConfirm(task.lib.name, task.components);
          if (!confirmed) {
            console.log(chalk.dim("  Skipped."));
            continue;
          }
          const result = installComponents(task.lib, task.components, { dryRun: options.dryRun });
          allResults.push({
            libName: task.lib.name,
            components: task.components,
            success: result.success,
          });
        }
      } else {
        for (const task of tasks) {
          const result = installComponents(task.lib, task.components, { dryRun: options.dryRun });
          allResults.push({
            libName: task.lib.name,
            components: task.components,
            success: result.success,
          });
        }
      }

      // Summary
      if (allResults.length > 0) {
        printSummary(allResults);
      }
    }

    // ── Interactive Mode: `ruil add` ────────────────────────────
    else {
      let addMore = true;
      const allResults = [];

      while (addMore) {
        const libKey = await promptLibrary();
        const selectedComponents = await promptComponents(libKey);
        const lib = LIBRARIES[libKey];

        const confirmed = await promptConfirm(lib.name, selectedComponents);
        if (confirmed) {
          const result = installComponents(lib, selectedComponents, { dryRun: options.dryRun });
          allResults.push({
            libName: lib.name,
            components: selectedComponents,
            success: result.success,
          });
        }

        const { another } = await (await import("inquirer")).default.prompt([
          {
            type: "confirm",
            name: "another",
            message: "Add components from another library?",
            default: false,
          },
        ]);
        addMore = another;
      }

      if (allResults.length > 0) {
        printSummary(allResults);
      }
    }
  });

// ── LIST Command ───────────────────────────────────────────────────
program
  .command("list [library]")
  .description("List available libraries or components in a library")
  .action((library) => {
    printBanner();

    if (!library) {
      // List all libraries
      console.log(chalk.bold.white("  Available Libraries:\n"));
      for (const [key, lib] of Object.entries(LIBRARIES)) {
        const count = chalk.dim(`(${lib.components.length} components)`);
        const strategy = chalk.dim.italic(
          lib.strategy === "cli" ? "CLI-based" :
          lib.strategy === "npm-plugin" ? "Plugin" : "npm package"
        );
        console.log(`  ${chalk.cyan.bold(key.padEnd(12))} ${lib.name.padEnd(22)} ${count}  ${strategy}`);
      }
      console.log();
      console.log(chalk.dim(`  Usage: ${chalk.white("ruil list <library>")} to see components.\n`));
      return;
    }

    const libKey = resolveLibrary(library);
    if (!libKey) {
      console.log(chalk.red(`  Unknown library "${library}".`));
      console.log(chalk.dim(`  Available: ${Object.keys(LIBRARIES).join(", ")}\n`));
      return;
    }

    const lib = LIBRARIES[libKey];
    console.log(chalk.bold.white(`  ${lib.name} — ${lib.components.length} Components\n`));

    const maxName = Math.max(...lib.components.map((c) => c.name.length));
    for (const comp of lib.components) {
      console.log(
        `  ${chalk.cyan(comp.name.padEnd(maxName + 2))} ${chalk.dim(comp.description)}`
      );
    }

    console.log();
    console.log(chalk.dim(`  Install: ${chalk.white(`ruil add ${libKey}/${lib.components[0].name}`)}\n`));
  });

// ── INFO Command ───────────────────────────────────────────────────
program
  .command("info <library>")
  .description("Show detailed info about a library")
  .action((library) => {
    printBanner();

    const libKey = resolveLibrary(library);
    if (!libKey) {
      console.log(chalk.red(`  Unknown library "${library}".\n`));
      return;
    }

    const lib = LIBRARIES[libKey];
    console.log(chalk.bold.white(`  ${lib.name}`));
    console.log(chalk.dim(`  ─────────────────────────────────`));
    console.log(`  Strategy:    ${chalk.cyan(lib.strategy)}`);
    console.log(`  Components:  ${chalk.cyan(lib.components.length)}`);
    if (lib.packages) {
      console.log(`  Packages:    ${chalk.cyan(lib.packages.join(", "))}`);
    }
    if (lib.baseCommand) {
      console.log(`  Base Cmd:    ${chalk.cyan(lib.baseCommand)}`);
    }
    if (lib.importPrefix) {
      console.log(`  Import:      ${chalk.cyan(lib.importPrefix)}`);
    }
    console.log(`  Docs:        ${chalk.underline.cyan(lib.docsURL)}`);
    if (lib.setupNote) {
      console.log(`  Setup:       ${chalk.yellow(lib.setupNote)}`);
    }
    console.log();
  });

// ── SEARCH Command ─────────────────────────────────────────────────
program
  .command("search <query>")
  .description("Search for a component across all libraries")
  .action((query) => {
    printBanner();
    const q = query.toLowerCase();
    const results = [];

    for (const [libKey, lib] of Object.entries(LIBRARIES)) {
      for (const comp of lib.components) {
        if (
          comp.name.toLowerCase().includes(q) ||
          comp.description.toLowerCase().includes(q)
        ) {
          results.push({ libKey, libName: lib.name, ...comp });
        }
      }
    }

    if (results.length === 0) {
      console.log(chalk.yellow(`  No components matching "${query}".\n`));
      return;
    }

    console.log(chalk.bold.white(`  Found ${results.length} component(s) matching "${query}":\n`));

    for (const r of results) {
      console.log(
        `  ${chalk.cyan(r.libKey.padEnd(10))} ${chalk.bold(r.name.padEnd(20))} ${chalk.dim(r.description)}`
      );
    }

    console.log();
    console.log(chalk.dim(`  Install: ${chalk.white(`ruil add <library>/<component>`)}\n`));
  });

// ── Parse ──────────────────────────────────────────────────────────
program.parse();
