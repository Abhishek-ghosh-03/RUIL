// ═══════════════════════════════════════════════════════════════════
// RUIL CLI — Installer Engine
// Handles the actual installation logic for each library strategy.
// Now fully executes commands with visible output, prerequisite
// checks, and robust error handling.
// ═══════════════════════════════════════════════════════════════════

import { execSync } from "child_process";
import { existsSync } from "fs";
import { resolve } from "path";
import chalk from "chalk";

// ── Package Manager Detection ──────────────────────────────────────

/**
 * Detects whether the project uses npm, yarn, or pnpm.
 */
function detectPackageManager() {
  const cwd = process.cwd();
  if (existsSync(resolve(cwd, "pnpm-lock.yaml"))) return "pnpm";
  if (existsSync(resolve(cwd, "yarn.lock")))      return "yarn";
  if (existsSync(resolve(cwd, "package-lock.json"))) return "npm";

  // Fallback: check if CLI is available
  try { execSync("pnpm --version", { stdio: "ignore" }); return "pnpm"; } catch { /* noop */ }
  try { execSync("yarn --version", { stdio: "ignore" }); return "yarn"; } catch { /* noop */ }
  return "npm";
}

// ── Prerequisite Checks ────────────────────────────────────────────

/**
 * Validates project state before installation.
 */
function checkPrerequisites(lib) {
  const errors = [];
  const cwd = process.cwd();

  if (!existsSync(resolve(cwd, "package.json"))) {
    errors.push(
      `No ${chalk.bold("package.json")} found. Run ${chalk.cyan("npm init")} FIRST.`
    );
  }

  if (lib.strategy === "cli" && lib.baseCommand?.includes("shadcn")) {
    if (!existsSync(resolve(cwd, "components.json"))) {
      errors.push(
        `${chalk.bold("shadcn/ui")} is not initialized. Run ${chalk.cyan("npx shadcn-ui@latest init")} FIRST.`
      );
    }
  }

  if (lib.strategy === "npm-plugin" && lib.setupNote?.includes("tailwind")) {
    const hasTailwind = [
      "tailwind.config.js", "tailwind.config.ts", "tailwind.config.mjs", "tailwind.config.cjs"
    ].some(f => existsSync(resolve(cwd, f)));
    
    if (!hasTailwind) {
      errors.push(
        `${lib.name} requires ${chalk.bold("Tailwind CSS")}. Run ${chalk.cyan("npx tailwindcss init")} FIRST.`
      );
    }
  }

  return { ok: errors.length === 0, errors };
}

// ── Command Execution ──────────────────────────────────────────────

/**
 * Executes a shell command with live output.
 */
function runCommand(cmd, label) {
  console.log();
  console.log(chalk.bold.white(`  ▸ ${label}`));
  console.log(chalk.dim(`    $ ${cmd}`));
  console.log();

  try {
    execSync(cmd, {
      stdio: "inherit",
      timeout: 600000, // 10 minutes
      cwd: process.cwd(),
      env: { ...process.env, FORCE_COLOR: "1" },
    });

    console.log();
    console.log(chalk.green.bold(`  ✔ Success: ${label}`));
    return { success: true };
  } catch (err) {
    console.log();
    console.log(chalk.red.bold(`  ✗ Failed: ${label}`));
    const errMsg = err.message || "Unknown error";
    return { success: false, error: errMsg };
  }
}

// ── Main Install Function ──────────────────────────────────────────

export function installComponents(lib, selected, options = {}) {
  const pm = detectPackageManager();
  const installCmd = pm === "npm" ? "npm install" : pm === "yarn" ? "yarn add" : "pnpm add";
  const devFlag = pm === "npm" ? "--save-dev" : "-D";
  const executedCommands = [];

  console.log();
  console.log(chalk.bold.hex("#6366f1")(`  ┌──────────────────────────────────────────┐`));
  console.log(chalk.bold.hex("#6366f1")(`  │`) + chalk.bold.white(` 📦 Installing for ${lib.name}`.padEnd(42)) + chalk.bold.hex("#6366f1")(`│`));
  console.log(chalk.bold.hex("#6366f1")(`  └──────────────────────────────────────────┘`));

  // ── Prerequisite Check ──────────────────────────────────────────
  if (!options.dryRun) {
    const prereq = checkPrerequisites(lib);
    if (!prereq.ok) {
      console.log();
      console.log(chalk.red.bold(`  ⚠  Prerequisites missing:`));
      for (const err of prereq.errors) {
        console.log(chalk.red(`     ✗ ${err}`));
      }
      return { success: false, commands: [] };
    }
  }

  // ── Strategy: CLI-based (shadcn) ────────────────────────────────
  if (lib.strategy === "cli") {
    const componentList = selected.join(" ");
    const cmd = `${lib.baseCommand} ${componentList}`;
    const label = `Adding complexity: ${selected.join(", ")}`;

    if (options.dryRun) {
      console.log(chalk.yellow(`\n  [dry-run] ${cmd}`));
      executedCommands.push({ cmd, label, success: true });
    } else {
      const result = runCommand(cmd, `shadcn: adding ${selected.length} component(s)`);
      executedCommands.push({ cmd, label, ...result });
    }
  }

  // ── Strategy: npm packages (MUI, Chakra, etc.) ──────────────────
  else if (lib.strategy === "npm") {
    const pkgs = lib.packages.join(" ");
    const cmd = `${installCmd} ${pkgs}`;
    const label = `Installing ${lib.name} core packages`;

    if (options.dryRun) {
      console.log(chalk.yellow(`\n  [dry-run] ${cmd}`));
      executedCommands.push({ cmd, label, success: true });
    } else {
      const result = runCommand(cmd, label);
      executedCommands.push({ cmd, label, ...result });
    }
  }

  // ── Strategy: Tailwind plugin (daisyUI) ─────────────────────────
  else if (lib.strategy === "npm-plugin") {
    const pkgs = lib.packages.join(" ");
    const cmd = `${installCmd} ${lib.devDep ? devFlag : ""} ${pkgs}`;
    const label = `Installing ${lib.name} plugin`;

    if (options.dryRun) {
      console.log(chalk.yellow(`\n  [dry-run] ${cmd}`));
      executedCommands.push({ cmd, label, success: true });
    } else {
      const result = runCommand(cmd, label);
      executedCommands.push({ cmd, label, ...result });
    }
  }

  // ── Usage Snippets ──────────────────────────────────────────────
  const allSucceeded = executedCommands.every(c => c.success);
  if (allSucceeded || options.dryRun) {
    printUsageSnippets(lib, selected);
  }

  return { success: allSucceeded, commands: executedCommands };
}

function printUsageSnippets(lib, selected) {
  console.log();
  console.log(chalk.bold.white(`  📋 Import Snippets`));
  console.log(chalk.dim(`  ──────────────────────────────────────────`));

  if (lib.strategy === "cli") {
    for (const comp of selected) {
      const pascal = comp.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join("");
      console.log(chalk.cyan(`  import { ${pascal} } from "${lib.importPrefix}/${comp}";`));
    }
  } else if (lib.importPrefix) {
    const imports = selected.map(name => lib.components.find(c => c.name === name)?.import || name);
    console.log(chalk.cyan(`  import { ${imports.join(", ")} } from "${lib.importPrefix}";`));
  } else if (lib.strategy === "npm-plugin") {
    selected.forEach(name => {
      const comp = lib.components.find(c => c.name === name);
      if (comp?.className) {
        console.log(chalk.cyan(`  <div className="${comp.className}">...</div>`));
      }
    });
  }
  
  if (lib.setupNote) {
    console.log();
    console.log(chalk.yellow(`  ℹ  Note: ${lib.setupNote}`));
  }
  console.log();
}

/**
 * Print a final summary of the operation.
 */
export function printSummary(results) {
  const total = results.reduce((sum, r) => sum + r.components.length, 0);
  const success = results.every(r => r.success);

  console.log();
  console.log(chalk.bold.white(`  ${success ? "✅" : "⚠️"}  Installed ${total} component(s) across ${results.length} library(ies).`));
  
  for (const res of results) {
    const color = res.success ? chalk.green : chalk.red;
    console.log(color(`     ${res.success ? "✔" : "✗"} ${res.libName}: ${res.components.join(", ")}`));
  }
  console.log();
  console.log(chalk.dim(`  Docs: https://ruil.dev | Happy coding!\n`));
}
