import Link from "next/link";
import { getPostBySlug } from "@/lib/posts";
import { markdownToHtml } from "@/lib/markdown";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const decodedSlug = slug.map(decodeURIComponent).join('/');
  const post = getPostBySlug(decodedSlug);
  
  if (!post) return { title: "Post Not Found" };

  return {
    title: `${post.title} | Terminal Blog`,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const decodedSlug = slug.map(decodeURIComponent).join('/');
  const post = getPostBySlug(decodedSlug);

  if (!post) {
    notFound();
  }

  const contentHtml = await markdownToHtml(post.content);

  return (
    <div className="flex flex-col gap-10">
      <header className="space-y-6 pb-12 border-b border-white/5">
        <Link 
          href="/blog" 
          className="text-gray-500 hover:text-accent font-bold text-[10px] uppercase tracking-[0.4em] transition-colors"
        >
          [ GOTO_PARENT_DIR ]
        </Link>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 font-mono text-sm uppercase tracking-widest">[ ARTICLE_LDR ]</span>
            <span className="cursor" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
            {post.title}
          </h1>
        </div>

        <div className="grid gap-2 text-xs font-mono uppercase tracking-widest text-gray-500">
          <div className="flex items-center gap-4">
            <span className="w-12 text-gray-600">DATE:</span>
            <span>{post.date && !isNaN(Date.parse(post.date)) ? new Date(post.date).toISOString().split('T')[0] : 'UNKNOWN-DATE'}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="w-12 text-gray-600">TAGS:</span>
            <span className="text-accent">{post.tags.join(' ')}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="w-12 text-gray-600">PATH:</span>
            <span>~/blogs/{post.slug}.md</span>
          </div>
        </div>
      </header>

      <article 
        className="blog-content leading-relaxed text-[#bbb] text-lg selection:bg-accent/30 selection:text-white"
        dangerouslySetInnerHTML={{ __html: contentHtml }} 
      />

      <footer className="mt-20 pt-12 border-t border-white/5">
        <div className="p-8 border border-white/5 bg-[#111]/30 space-y-6">
          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-accent">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span>SUBSCRIBE_INPUT_MODULE</span>
          </div>
          <p className="text-gray-500 text-sm max-w-lg leading-relaxed">
            Interested in more system logs and security findings? 
            Initialize subscription via email.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md">
            <div className="flex-1 flex items-center border border-white/10 bg-black/50 px-4 py-3 group focus-within:border-accent transition-colors">
              <span className="text-accent font-bold mr-2">{">"}</span>
              <input 
                type="email" 
                placeholder="USER@HOST.COM" 
                className="bg-transparent border-none outline-none text-white w-full uppercase tracking-widest text-xs font-bold"
                disabled
              />
            </div>
            <button className="bg-accent text-black font-black px-8 py-3 uppercase tracking-tighter text-sm hover:translate-y-[-2px] active:translate-y-[0px] shadow-[0_4px_0_0_#00c277] active:shadow-none transition-all">
              INITIALIZE
            </button>
          </div>
          <div className="pt-4 text-[10px] text-gray-700 font-bold uppercase tracking-[0.4em]">
            SYSTEM_STATUS: IDLE_WAITING_FOR_USER
          </div>
        </div>
      </footer>
    </div>
  );
}