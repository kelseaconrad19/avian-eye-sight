import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bird, Menu, Search, Upload, User, X, Trophy, BookOpen, Image, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";

export function Navbar() {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);
  const toggleMenu = () => {
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50); // Haptic feedback
    }
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50); // Haptic feedback
    }
    await signOut();
    setIsMenuOpen(false);
  };

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);
  return <nav className="sticky top-0 z-50 bg-brand-50/90 backdrop-blur-md border-b border-brand-200 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Bird className="h-7 w-7 text-primary" />
            <span className="font-display font-bold text-xl hidden sm:inline">MamaBird Watch</span>
          </Link>

          {isMobile ? <>
              <Button variant="ghost" size="icon" onClick={toggleMenu} className="sm:hidden h-10 w-10">
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              
              {isMenuOpen && <div className="fixed inset-0 top-14 bg-background z-40 p-4 animate-fade-in">
                  <div className="flex flex-col space-y-4 bg-background">
                    <Link to="/" className="flex items-center p-4 rounded-md hover:bg-muted" onClick={() => setIsMenuOpen(false)}>
                      <Search className="h-5 w-5 mr-3" />
                      Identify
                    </Link>
                    <Link to="/sightings" className="flex items-center p-4 rounded-md hover:bg-muted" onClick={() => setIsMenuOpen(false)}>
                      <Bird className="h-5 w-5 mr-3" />
                      My Sightings
                    </Link>
                    <Link to="/badges" className="flex items-center p-4 rounded-md hover:bg-muted" onClick={() => setIsMenuOpen(false)}>
                      <Trophy className="h-5 w-5 mr-3" />
                      My Badges
                    </Link>
                    <Link to="/my-overlays" className="flex items-center p-4 rounded-md hover:bg-muted" onClick={() => setIsMenuOpen(false)}>
                      <Image className="h-5 w-5 mr-3" />
                      My Overlays
                    </Link>
                    <Link to="/upload" className="flex items-center p-4 rounded-md hover:bg-muted" onClick={() => setIsMenuOpen(false)}>
                      <Upload className="h-5 w-5 mr-3" />
                      Upload
                    </Link>
                    {user && (
                      <Button 
                        variant="ghost" 
                        className="flex items-center p-4 rounded-md hover:bg-muted w-full justify-start text-destructive hover:text-destructive" 
                        onClick={handleLogout}
                      >
                        <LogOut className="h-5 w-5 mr-3" />
                        Logout
                      </Button>
                    )}
                  </div>
                </div>}
            </> : <div className="hidden sm:flex items-center space-x-2">
              <Link to="/">
                <Button variant="ghost" className="text-foreground">
                  <Search className="h-4 w-4 mr-1" />
                  Identify
                </Button>
              </Link>
              <Link to="/sightings">
                <Button variant="ghost" className="text-foreground">
                  <Bird className="h-4 w-4 mr-1" />
                  My Sightings
                </Button>
              </Link>
              <Link to="/badges">
                <Button variant="ghost" className="text-foreground">
                  <Trophy className="h-4 w-4 mr-1" />
                  My Badges
                </Button>
              </Link>
              <Link to="/my-overlays">
                <Button variant="ghost" className="text-foreground">
                  <Image className="h-4 w-4 mr-1" />
                  My Overlays
                </Button>
              </Link>
              <Link to="/upload">
                <Button className="bg-brand-500 text-white hover:bg-brand-600 transition-all duration-200 shadow-card">
                  <Upload className="h-4 w-4 mr-1" />
                  Upload
                </Button>
              </Link>
              {user && (
                <Button 
                  variant="ghost" 
                  className="text-destructive hover:text-destructive" 
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </Button>
              )}
            </div>}
        </div>
      </div>
    </nav>;
}