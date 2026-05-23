#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const schema = JSON.parse(readFileSync(join(ROOT, "schema.json"), "utf8"));

const ALLOWED_TOP = new Set([
  "README.md", "schema.json", "package.json", "package-lock.json",
  "scripts", ".github", ".git", ".gitignore",
]);

const errors = [];
const warnings = [];

function pathForKey(key, entry) {
  const segments = key.split(".");
  const folder = segments[0];
  const filename = segments.slice(1).join(".");
  const ext = entry.type === "markdown" ? "md" : "txt";
  return join(folder, filename + "." + ext);
}

// 1. Schema-key coverage.
for (const [key, entry] of Object.entries(schema)) {
  const rel = pathForKey(key, entry);
  if (!existsSync(join(ROOT, rel))) {
    errors.push("Missing file for key " + key + ": expected " + rel);
  }
}

// 2 + 3. Per-file checks: extension consistency, maxLength, markdown sanitiser.
for (const [key, entry] of Object.entries(schema)) {
  const rel = pathForKey(key, entry);
  const full = join(ROOT, rel);
  if (!existsSync(full)) continue;
  const text = readFileSync(full, "utf8").replace(/\s+$/u, "");
  if (text.length > entry.maxLength) {
    errors.push(rel + ": length " + text.length + " exceeds maxLength " + entry.maxLength);
  }
  if (entry.type === "markdown") {
    if (/<script\b/i.test(text)) errors.push(rel + ": contains <script>");
    if (/\son[a-z]+\s*=/i.test(text)) errors.push(rel + ": contains inline event handler");
  }
}

// 4. Unknown files.
const knownPaths = new Set(Object.entries(schema).map(([k, e]) => pathForKey(k, e)));
function walk(dir, prefix = "") {
  for (const name of readdirSync(dir)) {
    if (prefix === "" && ALLOWED_TOP.has(name)) continue;
    const full = join(dir, name);
    const rel = prefix === "" ? name : prefix + "/" + name;
    if (statSync(full).isDirectory()) {
      walk(full, rel);
    } else if (!knownPaths.has(rel)) {
      warnings.push("Unknown file (not in schema): " + rel);
    }
  }
}
walk(ROOT);

for (const w of warnings) console.warn("WARN " + w);
for (const e of errors) console.error("ERROR " + e);

if (errors.length > 0) process.exit(1);
console.log("OK — " + Object.keys(schema).length + " keys validated");
