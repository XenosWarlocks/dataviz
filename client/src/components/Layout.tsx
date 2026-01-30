import { Link } from "wouter";
import { BarChart3, Github } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col font-body">
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-tr from-primary to-accent p-2 rounded-lg shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-200">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-foreground">
              DataViz<span className="text-primary">.io</span>
            </span>
          </Link>
          
          <nav className="flex items-center gap-6">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
          </nav>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="border-t border-border/50 py-8 bg-card/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} DataViz.io. Visualize your text data instantly.</p>
        </div>
      </footer>
    </div>
  );
}
