
import { Navbar } from "./Navbar";
import { Bird, Heart } from "lucide-react";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-slate-900 transition-colors duration-300">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-muted dark:bg-slate-800/50 py-6 border-t border-border transition-colors duration-300 mt-auto relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col items-center justify-center">
            <Bird className="h-6 w-6 text-primary mb-2" />
            <p className="font-display text-muted-foreground text-sm">
              © 2025 BirdWatch. All rights reserved.
            </p>
            <p className="mt-1 text-muted-foreground text-sm flex items-center">
              Built with <Heart className="mx-1 h-3 w-3 text-red-500 animate-float" /> for bird enthusiasts everywhere
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
