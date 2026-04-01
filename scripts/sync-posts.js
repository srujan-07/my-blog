const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Load configuration
let config;
try {
  config = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'sync.config.json'), 'utf8'));
} catch (error) {
  console.error('[ERROR] Failed to load sync.config.json. Ensure it exists at project root.');
  process.exit(1);
}

const sourceDir = path.isAbsolute(config.sourcePath) ? config.sourcePath : path.join(process.cwd(), config.sourcePath);
const targetDir = path.join(process.cwd(), config.targetPath);

/**
 * Recursively copy markdown files from source to target.
 */
function syncFiles(src, dest) {
  if (!fs.existsSync(src)) {
    console.warn(`[WARN] Source directory not found: ${src}`);
    return;
  }

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    // Skip hidden files and obsidian folder
    if (entry.name.startsWith('.') || entry.name === '.obsidian') continue;

    if (entry.isDirectory()) {
      syncFiles(srcPath, destPath);
    } else if (entry.name.endsWith('.md')) {
      const fileModified = !fs.existsSync(destPath) || 
                           fs.statSync(srcPath).mtime > fs.statSync(destPath).mtime;

      if (fileModified) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`[SYNC] ${fs.existsSync(destPath) ? 'Updated' : 'Copied'}: ${path.relative(sourceDir, srcPath)}`);
      }
    }
  }
}

/**
 * Automate Git commands.
 */
function handleGit() {
  try {
    const status = execSync('git status --porcelain').toString();
    if (!status) {
      console.log('[GIT] No changes to sync.');
      return;
    }

    console.log('[GIT] Changes detected. Committing and pushing...');
    execSync('git add .');
    execSync(`git commit -m "${config.git.commitMessage}"`);
    
    if (config.git.autoPush) {
      execSync('git push');
      console.log('[GIT] Changes pushed to GitHub successfully.');
    }
  } catch (error) {
    console.error('[ERROR] Git automation failed:', error.message);
  }
}

// Main Execution
console.log('--- BLOG SYNC INITIALIZED ---');
console.log(`[PATH] Source: ${sourceDir}`);
console.log(`[PATH] Target: ${targetDir}`);

syncFiles(sourceDir, targetDir);

if (config.git.autoCommit) {
  handleGit();
}

console.log('--- SYNC PROCESS COMPLETED ---');
