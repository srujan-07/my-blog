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
const imageTargetDir = path.join(process.cwd(), 'public', 'images');

const vaultDir = path.dirname(sourceDir);

/**
 * Recursively scan a directory for images and copy them.
 */
function syncImages(src) {
  if (!fs.existsSync(src)) return;

  if (!fs.existsSync(imageTargetDir)) {
    fs.mkdirSync(imageTargetDir, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name.startsWith('.') || entry.name === '.obsidian') continue;
    
    const srcPath = path.join(src, entry.name);
    
    if (entry.isDirectory()) {
      syncImages(srcPath);
    } else if (entry.name.match(/\.(png|jpe?g|gif|webp|svg)$/i)) {
      const imageDestPath = path.join(imageTargetDir, entry.name);
      
      let fileModified = true;
      if (fs.existsSync(imageDestPath)) {
        fileModified = fs.statSync(srcPath).mtime > fs.statSync(imageDestPath).mtime;
      }

      if (fileModified) {
        fs.copyFileSync(srcPath, imageDestPath);
        console.log(`[SYNC] Copied image: ${entry.name}`);
      }
    }
  }
}

/**
 * Recursively copy markdown files from source to target.
 */
function syncMarkdown(src, dest) {
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

    if (entry.name.startsWith('.') || entry.name === '.obsidian') continue;

    if (entry.isDirectory()) {
      syncMarkdown(srcPath, destPath);
    } else if (entry.name.endsWith('.md')) {
      const isExisting = fs.existsSync(destPath);
      const fileModified = !isExisting || fs.statSync(srcPath).mtime > fs.statSync(destPath).mtime;

      if (fileModified) {
        let content = fs.readFileSync(srcPath, 'utf8');
        let transformed = false;

        // 1. Replace Obsidian image syntax: ![[image.png]]
        const obsidianImageRegex = /!\[\[([^\]]+)\]\]/g;
        if (obsidianImageRegex.test(content)) {
          content = content.replace(obsidianImageRegex, '![image](/images/$1)');
          transformed = true;
        }

        // 2. Handle relative paths: ![alt](../images/image.png)
        const relativeImageRegex = /!\[(.*?)\]\((?!http|\/)[^\)]*?([^\/\\]+\.(?:png|jpe?g|gif|webp|svg))\)/gi;
        if (relativeImageRegex.test(content)) {
          content = content.replace(relativeImageRegex, '![$1](/images/$2)');
          transformed = true;
        }

        fs.writeFileSync(destPath, content);
        
        console.log(`[SYNC] ${isExisting ? 'Updated' : 'Copied'} markdown: ${entry.name}`);
        if (transformed) {
          console.log(`[SYNC] Rewrote image links in: ${entry.name}`);
        }
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
console.log(`[PATH] Images: ${imageTargetDir}`);

syncImages(vaultDir);
syncMarkdown(sourceDir, targetDir);

if (config.git.autoCommit) {
  handleGit();
}

console.log('--- SYNC PROCESS COMPLETED ---');
