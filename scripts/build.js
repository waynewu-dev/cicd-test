import { rm, mkdir, copyFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { buildTag } from '../src/index.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await copyFile(join(root, 'public', 'index.html'), join(dist, 'index.html'));

const tag = buildTag('1.0.0', process.env.GITHUB_RUN_NUMBER ?? 'local');
await writeFile(join(dist, 'build.json'), JSON.stringify({ tag }, null, 2));

console.log(`构建完成: dist/ (${tag})`);
