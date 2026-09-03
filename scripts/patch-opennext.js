const fs = require('fs');
const path = require('path');

const targetPath = path.join(
  __dirname,
  '..',
  'node_modules',
  '@opennextjs',
  'cloudflare',
  'dist',
  'cli',
  'build',
  'open-next',
  'compile-env-files.js'
);

try {
  if (fs.existsSync(targetPath)) {
    let content = fs.readFileSync(targetPath, 'utf8');
    // Ensure next-env.mjs is deleted if it already exists before appending
    if (!content.includes('fs.existsSync(envFile)')) {
      content = content.replace(
        'fs.mkdirSync(envDir, { recursive: true });',
        `fs.mkdirSync(envDir, { recursive: true });\n    const envFile = path.join(envDir, "next-env.mjs");\n    if (fs.existsSync(envFile)) { try { fs.unlinkSync(envFile); } catch {} }`
      );
      content = content.replace(
        'path.join(envDir, `next-env.mjs`)',
        'envFile'
      );
      fs.writeFileSync(targetPath, content, 'utf8');
      console.log('Successfully patched @opennextjs/cloudflare compile-env-files.js to prevent duplicate exports.');
    }
  }
} catch (err) {
  console.warn('patch-opennext notice:', err.message);
}
