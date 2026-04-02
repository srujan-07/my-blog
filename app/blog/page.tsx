import { getDirectoryContent } from "@/lib/posts";
import DirectoryListing from "@/components/DirectoryListing";

export const metadata = {
  title: "Logs | Terminal Blog",
  description: "A directory of blog posts and articles.",
};

export default function Blog() {
  const content = getDirectoryContent("");
  
  if (!content) {
    return (
      <div className="p-10 border border-dashed border-white/10 text-center text-gray-500">
        [ ERROR: NO_DATA_FOUND ]
      </div>
    );
  }

  return <DirectoryListing currentPath="" content={content} />;
}