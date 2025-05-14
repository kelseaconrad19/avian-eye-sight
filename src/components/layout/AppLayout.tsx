
import { Navbar } from "./Navbar";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-muted py-6 border-t border-border">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>© 2025 BirdWatch. All rights reserved.</p>
          <p className="mt-1">Built with 💚 for bird enthusiasts everywhere</p>
        </div>
      </footer>
      <Toaster />
      <Sonner />
    </div>
  );
}
