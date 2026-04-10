import { remark } from "remark";
import html from "remark-html";

/**
 * Converts markdown content string to HTML.
 * @param content The markdown content string.
 * @returns A promise that resolves to the HTML string.
 */
export async function markdownToHtml(content: string): Promise<string> {
  const result = await remark().use(html).process(content);
  let htmlContent = result.toString();
  
  // Prefix absolute paths for images and links if on GitHub Pages
  const basePath = '/my-blog';
  htmlContent = htmlContent.replace(/(src|href)="(\/images\/|\/blogs\/)/g, `$1="${basePath}$2`);
  
  return htmlContent;
}