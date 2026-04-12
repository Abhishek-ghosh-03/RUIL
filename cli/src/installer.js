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
import ora from "ora";

// ── Package Manager Detection ──────────────────────────────────────

/**
 * Detects whether the project uses npm, yarn, or pnpm by checking
 * for lockfiles first (most reliable), then falling back to CLI.
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
 * Validates that the current directory is a valid project before
 * attempting any installation.
 * @returns {{ ok: boolean, errors: string[] }}
 */
function checkPrerequisites(lib) {
  const errors = [];
  const cwd = process.cwd();

  // Check 1: package.json must exist
  if (!existsSync(resolve(cwd, "package.json"))) {
    errors.push(
      "No package.json found in the current directory.\n" +
      "     Run " + chalk.cyan("npm init -y") + " first, or navigate to your project root."
    );
  }

  // Check 2: For shadcn CLI strategy, check if shadcn is initialized
  if (lib.strategy === "cli" && lib.baseCommand?.includes("shadcn")) {
    const hasComponentsJson = existsSync(resolve(cwd, "components.json"));
    if (!hasComponentsJson) {
      errors.push(
        "shadcn/ui is not initialized in this project.\n" +
        "     Run " + chalk.cyan("npx shadcn-ui@latest init") + " first to set up your project."
      );
    }
  }

  // Check 3: For Tailwind-dependent libraries, check for tailwind config
  if (lib.strategy === "npm-plugin" && lib.setupNote?.includes("tailwind")) {
    const hasTailwindConfig =
      existsSync(resolve(cwd, "tailwind.config.js")) ||
      existsSync(resolve(cwd, "tailwind.config.ts")) ||
      existsSync(resolve(cwd, "tailwind.config.mjs")) ||
      existsSync(resolve(cwd, "tailwind.config.cjs"));
    if (!hasTailwindConfig) {
      errors.push(
        "No tailwind.config found. " + lib.name + " requires Tailwind CSS.\n" +
        "     Run " + chalk.cyan("npx tailwindcss init") + " to create a config file."
      );
    }
  }

  return { ok: errors.length === 0, errors };
}

// ── Command Execution ──────────────────────────────────────────────

/**
 * Executes a shell command with real-time terminal output.
 * Uses stdio: "inherit" so users see npm/shadcn output live.
 * Falls back to "pipe" for spinner mode on simple commands.
 *
 * @param {string}  cmd     - Shell command to run
 * @param {string}  label   - Human-friendly description
 * @param {object}  opts    - { verbose: boolean }
 * @returns {{ success: boolean, error?: string }}
 */
function runCommand(cmd, label, opts = {}) {
  console.log();
  console.log(chalk.bold.white(`  ▸ ${label}`));
  console.log(chalk.dim(`    $ ${cmd}`));
  console.log();

  try {
    // Use stdio: "inherit" so all npm/shadcn output is visible in real-time
    execSync(cmd, {
      stdio: "inherit",
      timeout: 300000,    // 5 minute timeout for large installs
      cwd: process.cwd(),
      env: { ...process.env, FORCE_COLOR: "1" },  // preserve colors
    });

    console.log();
    console.log(chalk.green.bold(`  ✔ ${label} — Success`));
    return { success: true };
  } catch (err) {
    console.log();
    console.log(chalk.red.bold(`  ✗ ${label} — Failed`));

    // Extract meaningful error message
    const errMsg = err.stderr?.toString()?.trim() || err.message || "Unknown error";
    if (errMsg) {
      console.log(chalk.dim(`    Error: ${errMsg.split("\n")[0]}`));
    }

    // Common fix suggestions
    if (errMsg.includes("EACCES") || errMsg.includes("permission")) {
      console.log(chalk.yellow(`    Fix: Try running with elevated permissions or use a Node version manager.`));
    }
    if (errMsg.includes("ENOENT")) {
      console.log(chalk.yellow(`    Fix: The command "${cmd.split(" ")[0]}" was not found. Is it installed?`));
    }
    if (errMsg.includes("ERR_SOCKET_TIMEOUT") || errMsg.includes("network")) {
      console.log(chalk.yellow(`    Fix: Check your internet connection and try again.`));
    }

    return { success: false, error: errMsg.split("\n")[0] };
  }
}

// ── Main Install Function ──────────────────────────────────────────

/**
 * Install components for a given library.
 * @param {object}   lib       - Library object from registry
 * @param {string[]} selected  - Array of selected component names
 * @param {object}   options   - { dryRun: boolean }
 * @returns {{ success: boolean, commands: Array<{cmd, label, success}> }}
 */
export function installComponents(lib, selected, options = {}) {
  const pm = detectPackageManager();
  const installCmd = pm === "npm" ? "npm install" : pm === "yarn" ? "yarn add" : "pnpm add";
  const devFlag = pm === "npm" ? "--save-dev" : "-D";
  const executedCommands = [];

  console.log();
  console.log(chalk.bold.hex("#6366f1")(`  ┌──────────────────────────────────────┐`));
  console.log(chalk.bold.hex("#6366f1")(`  │`) + chalk.bold.white(` 📦 ${lib.name}`.padEnd(37)) + chalk.bold.hex("#6366f1")(`│`));
  console.log(chalk.bold.hex("#6366f1")(`  │`) + chalk.dim(`  ${selected.length} component(s) selected`.padEnd(37)) + chalk.bold.hex("#6366f1")(`│`));
  console.log(chalk.bold.hex("#6366f1")(`  │`) + chalk.dim(`  Package manager: ${pm}`.padEnd(37)) + chalk.bold.hex("#6366f1")(`│`));
  console.log(chalk.bold.hex("#6366f1")(`  └──────────────────────────────────────┘`));

  // ── Prerequisite Check ──────────────────────────────────────────
  if (!options.dryRun) {
    const prereq = checkPrerequisites(lib);
    if (!prereq.ok) {
      console.log();
      console.log(chalk.red.bold(`  ⚠  Prerequisites not met:`));
      for (const err of prereq.errors) {
        console.log(chalk.red(`  ✗  ${err}`));
      }
      console.log();
      console.log(chalk.yellow(`  Skipping ${lib.name} installation. Fix the above and retry.\n`));
      return { success: false, commands: [] };
    }
    console.log(chalk.green.dim(`\n  ✔ Prerequisites check passed`));
  }

  // ── Strategy: CLI-based (shadcn) ────────────────────────────────
  if (lib.strategy === "cli") {
    if (lib.batchable) {
      const componentList = selected.join(" ");
      const cmd = `${lib.baseCommand} ${componentList}`;
      const label = `Adding ${selected.length} ${lib.name} component(s): ${selected.join(", ")}`;

      if (options.dryRun) {
        console.log(chalk.yellow(`\n  [dry-run] ${cmd}`));
        executedCommands.push({ cmd, label, success: true, dryRun: true });
      } else {
        const result = runCommand(cmd, label);
        executedCommands.push({ cmd, label, ...result });
      }
    } else {
      for (const comp of selected) {
        const cmd = `${lib.baseCommand} ${comp}`;
        const label = `Adding ${comp}`;
        if (options.dryRun) {
          console.log(chalk.yellow(`  [dry-run] ${cmd}`));
          executedCommands.push({ cmd, label, success: true, dryRun: true });
        } else {
          const result = runCommand(cmd, label);
          executedCommands.push({ cmd, label, ...result });
        }
      }
    }
  }

  // ── Strategy: npm packages ──────────────────────────────────────
  if (lib.strategy === "npm") {
    const pkgs = lib.packages.join(" ");
    const cmd = `${installCmd} ${pkgs}`;
    const label = `Installing ${lib.name} packages: ${lib.packages.join(", ")}`;

    if (options.dryRun) {
      console.log(chalk.yellow(`\n  [dry-run] ${cmd}`));
      executedCommands.push({ cmd, label, success: true, dryRun: true });
    } else {
      const result = runCommand(cmd, label);
      executedCommands.push({ cmd, label, ...result });
    }
  }

  // ── Strategy: npm plugin (daisyUI) ─────────────────────────────
  if (lib.strategy === "npm-plugin") {
    const pkgs = lib.packages.join(" ");
    const flag = lib.devDep ? ` ${devFlag}` : "";
    const cmd = `${installCmd}${flag} ${pkgs}`;
    const label = `Installing ${lib.name} plugin`;

    if (options.dryRun) {
      console.log(chalk.yellow(`\n  [dry-run] ${cmd}`));
      executedCommands.push({ cmd, label, success: true, dryRun: true });
    } else {
      const result = runCommand(cmd, label);
      executedCommands.push({ cmd, label, ...result });
    }

    if (lib.setupNote) {
      console.log();
      console.log(chalk.yellow.bold(`  ⚠  Post-install setup required:`));
      console.log(chalk.white(`     ${lib.setupNote}`));
    }
  }

  // ── Execution Report ────────────────────────────────────────────
  const allSucceeded = executedCommands.every(c => c.success);
  const failedCount = executedCommands.filter(c => !c.success).length;

  if (!options.dryRun && failedCount > 0) {
    console.log();
    console.log(chalk.red.bold(`  ⚠  ${failedCount} command(s) failed for ${lib.name}.`));
    console.log(chalk.yellow(`     Review the errors above and try running the commands manually.`));
  }

  // ── Print usage snippets (only if at least one command succeeded) ──
  if (allSucceeded || options.dryRun) {
    console.log();
    console.log(chalk.bold.white(`  📋 Usage Snippets — Copy into your project:`));
    console.log(chalk.dim(`  ─────────────────────────────────────────`));

    if (lib.strategy === "cli") {
      // shadcn: import from local component path
      for (const comp of selected) {
        const pascal = comp
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join("");
        console.log(chalk.cyan(`  import { ${pascal} } from "${lib.importPrefix}/${comp}";`));
      }
    } else if (lib.importPrefix) {
      // npm-based: import from package
      for (const compName of selected) {
        const compDef = lib.components.find((c) => c.name === compName);
        const importName = compDef?.import || compName;
        console.log(chalk.cyan(`  import { ${importName} } from "${lib.importPrefix}";`));
      }
    } else {
      // Class-based (daisyUI)
      console.log(chalk.dim(`  daisyUI uses Tailwind CSS classes — no imports needed:`));
      for (const compName of selected) {
        const compDef = lib.components.find((c) => c.name === compName);
        if (compDef?.className) {
          console.log(chalk.cyan(`  <div className="${compDef.className}">...</div>`));
        }
      }
    }
    console.log();
  }

  return { success: allSucceeded, commands: executedCommands };
}

// ── Summary ────────────────────────────────────────────────────────

/**
 * Print a final summary table of all installations.
 */
export function printSummary(results) {
  const totalComponents = results.reduce((sum, r) => sum + r.components.length, 0);
  const allSuccess = results.every(r => r.success !== false);

  console.log();
  console.log(chalk.bold.white("  ╔══════════════════════════════════════════════╗"));
  if (allSuccess) {
    console.log(chalk.bold.white("  ║") + chalk.bold.green(`    ✅  Installation Complete                 `) + chalk.bold.white("║"));
  } else {
    console.log(chalk.bold.white("  ║") + chalk.bold.yellow(`    ⚠️  Installation Partial (some failed)     `) + chalk.bold.white("║"));
  }
  console.log(chalk.bold.white("  ╠══════════════════════════════════════════════╣"));
  console.log(chalk.bold.white("  ║") + chalk.dim(`  ${results.length} library(s), ${totalComponents} component(s)`.padEnd(45)) + chalk.bold.white("║"));
  console.log(chalk.bold.white("  ╚══════════════════════════════════════════════╝\n"));

  for (const { libName, components, success } of results) {
    const icon = success !== false ? chalk.green("✔") : chalk.red("✗");
    console.log(chalk.bold(`  ${icon} ${libName}`));
    for (const c of components) {
      console.log(chalk.dim(`    • ${c}`));
    }
    console.log();
  }

  console.log(chalk.dim("  Next steps:"));
  console.log(chalk.dim("    1. Import the components in your React files (see snippets above)"));
  console.log(chalk.dim("    2. Run your dev server: ") + chalk.white("npm run dev"));
  console.log(chalk.dim(`    3. RUIL docs: ${chalk.underline("https://ruil.dev")}\n`));
}
