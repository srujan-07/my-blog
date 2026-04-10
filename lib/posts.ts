import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "blogs");

export interface Post {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  description: string;
  content: string;
}

function walkDir(dir: string): string[] {
  let files: string[] = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    if (item.isDirectory()) {
      files = files.concat(walkDir(path.join(dir, item.name)));
    } else {
      files.push(path.join(dir, item.name));
    }
  }
  return files;
}

export function getAllPosts(): Post[] {
  // Ensure the directory exists
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const allFiles = walkDir(postsDirectory);

  const posts = allFiles
    .filter((fullPath) => fullPath.endsWith(".md"))
    .map((fullPath) => {
      // Create a URL-friendly slug with forward slashes regardless of OS
      const relativePath = path.relative(postsDirectory, fullPath).replace(/\\/g, '/');
      const slug = relativePath.replace(/\.md$/, "");
      const fileContents = fs.readFileSync(fullPath, "utf8");

      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title || "Untitled",
        date: data.date || "",
        tags: data.tags || [],
        description: data.description || "",
        content,
      } as Post;
    });

  // Sort posts by date (latest first)
  return posts.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllSlugs(): string[][] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  function getPaths(dir: string): string[][] {
    let slugs: string[][] = [];
    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      const relativePath = path.relative(postsDirectory, fullPath).replace(/\\/g, '/');
      const slugParts = relativePath.split('/');

      if (item.isDirectory()) {
        slugs.push(slugParts);
        slugs = slugs.concat(getPaths(fullPath));
      } else if (item.name.endsWith('.md')) {
        // Remove .md from the last part of the slug
        const fileSlug = [...slugParts];
        fileSlug[fileSlug.length - 1] = fileSlug[fileSlug.length - 1].replace(/\.md$/, '');
        slugs.push(fileSlug);
      }
    }
    return slugs;
  }

  return getPaths(postsDirectory);
}

export function getPostBySlug(slug: string): Post | null {
  try {
    // Reconstruct the secure path cross-platform compatible
    const decodedSlug = decodeURIComponent(slug);
    const fullPath = path.join(postsDirectory, `${decodedSlug}.md`);
    
    // Safety check for path traversal
    const normalizedFullPath = path.normalize(fullPath);
    if (!normalizedFullPath.startsWith(path.normalize(postsDirectory))) {
      return null;
    }

    if (!fs.existsSync(normalizedFullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(normalizedFullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug: decodedSlug,
      title: data.title || "Untitled",
      date: data.date || "",
      tags: data.tags || [],
      description: data.description || "",
      content,
    } as Post;
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
}

export interface DirectoryContent {
  directories: string[];
  posts: Post[];
}

export function isDirectory(slug: string): boolean {
  try {
    const decodedSlug = decodeURIComponent(slug);
    const fullPath = path.join(postsDirectory, decodedSlug);
    const normalizedFullPath = path.normalize(fullPath);
    if (!normalizedFullPath.startsWith(path.normalize(postsDirectory))) {
      return false;
    }
    return fs.existsSync(normalizedFullPath) && fs.statSync(normalizedFullPath).isDirectory();
  } catch (error) {
    return false;
  }
}

export function getDirectoryContent(subPath: string = ""): DirectoryContent | null {
  try {
    const decodedSlug = decodeURIComponent(subPath);
    const fullPath = path.join(postsDirectory, decodedSlug);
    
    const normalizedFullPath = path.normalize(fullPath);
    if (!normalizedFullPath.startsWith(path.normalize(postsDirectory))) {
      return null;
    }

    if (!fs.existsSync(normalizedFullPath) || !fs.statSync(normalizedFullPath).isDirectory()) {
      return null;
    }

    const items = fs.readdirSync(normalizedFullPath, { withFileTypes: true });
    
    const directories: string[] = [];
    const posts: Post[] = [];

    for (const item of items) {
      if (item.name.startsWith('.')) continue;

      if (item.isDirectory()) {
        directories.push(item.name);
      } else if (item.name.endsWith('.md')) {
        const filePath = path.join(normalizedFullPath, item.name);
        const fileContents = fs.readFileSync(filePath, "utf8");
        const { data, content } = matter(fileContents);
        
        const relativePath = path.relative(postsDirectory, filePath).replace(/\\/g, '/');
        const slug = relativePath.replace(/\.md$/, "");

        posts.push({
          slug,
          title: data.title || "Untitled",
          date: data.date || "",
          tags: data.tags || [],
          description: data.description || "",
          content,
        } as Post);
      }
    }

    posts.sort((a, b) => {
      if (a.date < b.date) return 1;
      return -1;
    });

    directories.sort();

    return { directories, posts };
  } catch (error) {
    console.error(`Error reading directory ${subPath}:`, error);
    return null;
  }
}