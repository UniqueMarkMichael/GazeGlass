import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const stylesPath = resolve(here, "../observation-mode/src/styles/shared.ts");
const styles = readFileSync(stylesPath, "utf8");

const requiredTokens = [
  "om-entry-bg",
  "om-entry-page-bg",
  "om-entry-text",
  "om-entry-subtext",
  "om-entry-border",
  "om-entry-focus",
];

function token(name) {
  const match = styles.match(new RegExp(`--${name}:\\\\s*(#[0-9a-fA-F]{6})`));
  if (!match) throw new Error(`Missing --${name} hex token in ${stylesPath}`);
  return match[1];
}

function hexToRgb(hex) {
  const value = hex.slice(1);
  return [0, 2, 4].map((index) => Number.parseInt(value.slice(index, index + 2), 16) / 255);
}

function linearize(channel) {
  return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map(linearize);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(foreground, background) {
  const lighter = Math.max(luminance(foreground), luminance(background));
  const darker = Math.min(luminance(foreground), luminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}

const colors = Object.fromEntries(requiredTokens.map((name) => [name, token(name)]));
const checks = [
  ["entry label", colors["om-entry-text"], colors["om-entry-bg"], 4.5],
  ["entry sublabel", colors["om-entry-subtext"], colors["om-entry-bg"], 4.5],
  ["entry border on button field", colors["om-entry-border"], colors["om-entry-bg"], 3],
  ["entry border on page field", colors["om-entry-border"], colors["om-entry-page-bg"], 3],
  ["entry focus ring", colors["om-entry-focus"], colors["om-entry-page-bg"], 3],
];

let failed = false;
for (const [name, foreground, background, minimum] of checks) {
  const ratio = contrast(foreground, background);
  const pass = ratio >= minimum;
  console.log(`${pass ? "PASS" : "FAIL"} ${name}: ${ratio.toFixed(2)}:1 >= ${minimum}:1`);
  if (!pass) failed = true;
}

if (failed) process.exit(1);
