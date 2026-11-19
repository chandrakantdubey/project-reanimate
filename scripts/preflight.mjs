import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, relative } from 'node:path';
const root = resolve(import.meta.dirname, '..');
const required = [
  'README.md', 'LICENSE', 'docs/PRD.md', 'docs/ARCHITECTURE.md', 'docs/ROADMAP.md',
  'docs/SECURITY.md', 'docs/ACCEPTANCE.md', '.gitignore', '.kiro/steering/product.md',
  '.kiro/steering/engineering.md', '.kiro/hooks/quality-on-save.json',
  '.kiro/specs/incident-detection/requirements.md',
  '.kiro/specs/incident-detection/design.md',
  '.kiro/specs/incident-detection/tasks.md', 'package.json', 'pnpm-workspace.yaml'
];
let errors = 0;
for (const file of required) {
  if (!existsSync(resolve(root, file))) { console.error(`MISSING ${file}`); errors++; }
}
function visit(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git', '.next', '.local', 'dist', '.turbo'].includes(entry.name)) continue;
    const path = resolve(dir, entry.name);
    if (entry.isDirectory()) visit(path);
    else if (entry.name.endsWith('.json')) {
      try { JSON.parse(readFileSync(path, 'utf8')); }
      catch (err) { console.error(`INVALID JSON ${relative(root, path)}: ${err.message}`); errors++; }
    }
  }
}
visit(root);
const ignored = readFileSync(resolve(root, '.gitignore'), 'utf8');
if (ignored.includes('.kiro/')) { console.error('.kiro must be tracked for the hackathon'); errors++; }
if (errors) process.exit(1);
console.log('Preflight passed: required files present, JSON valid, .kiro tracked.');
