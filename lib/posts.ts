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