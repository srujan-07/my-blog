import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export const metadata = {
  title: "Logs | Terminal Blog",
  description: "A directory of blog posts and articles.",
};

export default function Blog() {
  const posts = getAllPosts();

  return (
    <div className="flex flex-col gap-10">
      <header className="space-y-2">
        <div className="flex items-center gap-2 text-xl font-bold">
          <span className="text-accent underline decoration-2 underline-offset-4">$ ls</span>
          <span className="text-white">./blogs</span>
          <span className="cursor" />
        </div>
        <p className="text-gray-500 text-sm font-bold uppercase tracking-widest italic pt-2">
          {posts.length} entries located in filesystem
        </p>
      </header>

      <section className="space-y-4">
        {posts.length > 0 ? (
          <div className="grid gap-2 outline-none">
            {posts.map((post) => (
              <Link 
                key={post.slug} 
                href={`/blog/${post.slug}`}
                className="group flex flex-col sm:flex-row sm:items-baseline sm:gap-6 py-2 px-4 border-l-2 border-transparent hover:border-accent hover:bg-accent/5 transition-all outline-none"
              >
                <span className="text-gray-500 text-xs font-mono shrink-0">
                  [{post.date && !isNaN(Date.parse(post.date)) ? new Date(post.date).toISOString().split('T')[0] : 'UNKNOWN-DATE'}]
                </span>
                <span className="text-lg font-bold group-hover:text-accent transition-colors">
                  {post.slug}.md
                </span>
                <span className="hidden sm:block flex-1 border-b border-white/5 border-dashed" />
                <span className="text-xs text-gray-500 uppercase tracking-tighter">
                  {post.tags.join(' ')}
                </span>
              </Link>
            ))
            }
          </div>
        ) : (
          <div className="p-10 border border-dashed border-white/10 text-center text-gray-500">
            [ ERROR: NO_DATA_FOUND ]
          </div>
        )}
      </section>

      <footer className="pt-10 flex items-center justify-between text-[10px] text-gray-600 font-bold uppercase tracking-[0.3em] font-mono">
        <div>
          <Link href="/" className="hover:text-accent transition-colors">
            ← RET_HOME
          </Link>
        </div>
        <div className="hidden sm:block">
          END_OF_LISTING_V1.0
        </div>
      </footer>
    </div>
  );
}