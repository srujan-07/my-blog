import { remark } from "remark";
import html from "remark-html";

/**
 * Converts markdown content string to HTML.
 * @param content The markdown content string.
 * @returns A promise that resolves to the HTML string.
 */
export async function markdownToHtml(content: string): Promise<string> {
  const result = await remark().use(html).process(content);
  return result.toString();
}