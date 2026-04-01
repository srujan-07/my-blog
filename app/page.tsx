import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-10 py-10">
      <section className="space-y-6">
        <div className="inline-block px-3 py-1 bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-widest rounded">
          SYSTEM: ONLINE
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Welcome to <span className="text-accent underline underline-offset-8">Srujan's Dev Terminal</span>.
        </h1>
        
        <p className="text-lg text-gray-400 max-w-2xl leading-relaxed">
          This is a minimalist space dedicated to documenting security research, 
          code analysis, and technical explorations. 
          Expect low signal-to-noise ratio and high-density technical logs.
        </p>
      </section>

      <section className="space-y-4">
        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Available Modules:</p>
        <div className="grid gap-4 max-w-md">
          <Link 
            href="/blog" 
            className="group flex items-center justify-between p-4 border border-white/5 bg-white/2 hover:border-accent/50 transition-all"
          >
            <span className="group-hover:text-accent transition-colors">{" >> "}Access Blog Logs</span>
            <span className="text-gray-600 group-hover:text-accent font-bold">DIR</span>
          </Link>
          <a 
            href="https://github.com" 
            className="group flex items-center justify-between p-4 border border-white/5 bg-white/2 hover:border-accent/50 transition-all"
          >
            <span className="group-hover:text-accent transition-colors">{" >> "}Source Repositories</span>
            <span className="text-gray-600 group-hover:text-accent font-bold">EXT</span>
          </a>
        </div>
      </section>

      <section className="pt-10 space-y-4 text-xs text-gray-600 font-bold uppercase tracking-[0.2em]">
        <div className="flex items-center gap-4">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span>Status: Secure Connection established</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <span>Protocol: Next.js SSR / Tailwind v4</span>
        </div>
      </section>
    </div>
  );
}
