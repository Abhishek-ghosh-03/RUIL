// ═══════════════════════════════════════════════════════════════════
// RUIL CLI — Interactive Prompts
// Guided wizard for selecting libraries and components.
// ═══════════════════════════════════════════════════════════════════

import inquirer from "inquirer";
import chalk from "chalk";
import { LIBRARIES } from "./registry.js";

/**
 * Prompt user to select a library.
 */
export async function promptLibrary() {
  const choices = Object.entries(LIBRARIES).map(([key, lib]) => ({
    name: `${lib.name}  ${chalk.dim(`(${lib.components.length} components)`)}`,
    value: key,
  }));

  const { library } = await inquirer.prompt([
    {
      type: "list",
      name: "library",
      message: chalk.bold("Select a UI library:"),
      choices,
      pageSize: 10,
    },
  ]);

  return library;
}

/**
 * Prompt user to select components from a library.
 */
export async function promptComponents(libKey) {
  const lib = LIBRARIES[libKey];
  if (!lib) return [];

  const choices = lib.components.map((comp) => ({
    name: `${comp.name}  ${chalk.dim(`— ${comp.description}`)}`,
    value: comp.name,
    short: comp.name,
  }));

  const { components } = await inquirer.prompt([
    {
      type: "checkbox",
      name: "components",
      message: chalk.bold(`Select ${lib.name} components to install:`),
      choices,
      pageSize: 15,
      validate: (answer) => {
        if (answer.length === 0) return "Select at least one component.";
        return true;
      },
    },
  ]);

  return components;
}

/**
 * Confirm before executing installation.
 */
export async function promptConfirm(libName, components) {
  console.log();
  console.log(chalk.bold.white(`  📋 Install Plan`));
  console.log(chalk.dim(`  ─────────────────────────────────`));
  console.log(chalk.bold(`  Library: ${chalk.cyan(libName)}`));
  console.log(chalk.bold(`  Components (${components.length}):`));
  for (const c of components) {
    console.log(chalk.dim(`    • ${c}`));
  }
  console.log();

  const { confirmed } = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirmed",
      message: "Proceed with installation?",
      default: true,
    },
  ]);

  return confirmed;
}
