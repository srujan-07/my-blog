# Srujan's Terminal Blog + Obsidian Sync

This project is a minimalist, terminal-themed Next.js markdown blog powered by an automated Git-sync pipeline directly connected to an Obsidian vault.

## 🚀 System Architecture
- **Frontend**: Next.js App Router, Tailwind CSS (Terminal hacker aesthetics)
- **Content Engine**: Local Obsidian Vault 
- **CI/CD Integration**: Node.js automated synchronization pushing to GitHub -> Vercel.

---

## 🛠️ Obsidian Setup Guide

To ensure your Obsidian vault interacts seamlessly with the blog, follow these steps:

### 1. Create or Open the Vault
Ensure you have an Obsidian vault created at the path specified in your `sync.config.json`.
- Default Location: `C:/Users/sruja/ObsidianVault/blogs`

1. Open Obsidian.
2. Click **"Open folder as vault"**.
3. Point it to `C:/Users/sruja/ObsidianVault/blogs` (Create the folders if they don't exist).

### 2. Folder Structure
The sync script mirrors your Obsidian folder structure into the blog. You can organize your posts logically:
```text
C:/Users/sruja/ObsidianVault/blogs/
├── cves/
│   └── cve-2024-test.md
├── reversing/
│   └── malware-analysis.md
└── ctf-writeup.md
```
*Note: Any files running outside of `.md` format, hidden files, or the `.obsidian` configurations directory will be safely ignored.*

### 3. Writing Posts (Frontmatter is Required)
Every markdown file must begin with YAML frontmatter so the blog can render its metadata natively.

Use this exact template at the top of every new `.md` file in Obsidian:

```yaml
---
title: "Your Post Title Here"
date: "2026-04-02"
tags: ["ctf", "security", "linux"]
description: "A brief summary of what the post is about."
---

# Your Content Here
Your markdown content begins below the dashes...
```

### 4. Running the Sync

Whenever you finish writing or updating a post in Obsidian, open a terminal in the root of this Next.js project and run:

```bash
npm run sync
```

**What happens underneath:**
1. The script (`scripts/sync-posts.js`) scans `C:/Users/sruja/ObsidianVault/blogs`.
2. It copies updated or new `.md` files to the blog's `./posts` directory.
3. It stages the changes (`git add .`).
4. It creates a commit (`git commit -m "sync: update blog posts from obsidian"`).
5. It pushes the updates to your repository (`git push`), which automatically triggers a live deployment on Vercel.

---

## ⚙️ Configuration
You can change the vault path or git behavior at any time without touching code by editing `sync.config.json`:

```json
{
  "sourcePath": "C:/Users/sruja/ObsidianVault/blogs",
  "targetPath": "posts",
  "git": {
    "autoCommit": true,
    "commitMessage": "sync: update blog posts from obsidian",
    "autoPush": true
  }
}
```

## 🎨 Local Development
To run the terminal blog locally for design testing:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) (or whichever port is assigned) in your browser.
