// Build the sibling game checkout and copy its self-contained web edition.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = resolve(process.argv[2] || resolve(root, '../Velvet-Cruise'));
const target = resolve(root, 'games/more-projects/velvet-cruise');
assert.equal(JSON.parse(readFileSync(resolve(source, 'package.json'))).scripts['build:web'], 'vite build --mode standalone', 'Use a game checkout with the self-hosted web build');
execFileSync('npm', ['run', 'check'], { cwd: source, stdio: 'inherit' });
execFileSync('npm', ['run', 'qa:local-services'], { cwd: source, stdio: 'inherit' });
execFileSync('npm', ['run', 'build:web'], { cwd: source, stdio: 'inherit' });
const built = resolve(source, 'dist');
const html = readFileSync(resolve(built, 'index.html'), 'utf8');
assert.ok(!html.includes('data-tesana-bootstrap') && !html.includes('unpkg.com'), 'The game must not load the Tesana SDK');
const chunk = html.match(/src="\.\/(_app\/[^"/]+\.js)"/)?.[1];
assert.ok(chunk && existsSync(resolve(built, chunk)), 'The built entry must exist');
mkdirSync(target, { recursive: true });
// Retain previous hashed chunks so open sessions can finish loading an older build.
cpSync(built, target, { recursive: true });
const commit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: source, encoding: 'utf8' }).trim();
const modified = execFileSync('git', ['status', '--porcelain'], { cwd: source, encoding: 'utf8' }).trim() !== '';
writeFileSync(resolve(target, 'build-info.json'), JSON.stringify({ source: 'michaelingokahler-mordor/Velvet-Cruise', commit, modified, edition: 'standalone', entry: chunk }, null, 2) + '\n');
console.log(`Updated ${target} (${readdirSync(resolve(target, 'assets/bg')).length} background assets).`);
