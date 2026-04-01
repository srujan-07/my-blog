import Link from "next/link";

export const Navbar = () => {
  return (
    <nav className="py-12 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-white/10 mb-12">
      <div className="flex items-center gap-2 text-xl font-bold">
        <span className="text-accent">srujan@blog:</span>
        <span className="text-white">~</span>
        <span className="text-accent underline underline-offset-4 decoration-2">$</span>
        <span className="cursor" />
      </div>
      
      <div className="flex items-center gap-8 text-sm uppercase tracking-widest font-bold">
        <Link 
          href="/" 
          className="hover:text-accent transition-colors relative group"
        >
          [ Home ]
        </Link>
        <Link 
          href="/blog" 
          className="hover:text-accent transition-colors relative group"
        >
          [ Blog ]
        </Link>
      </div>
    </nav>
  );
};
