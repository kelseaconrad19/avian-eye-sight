
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Get initial theme preference
  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    if (window.navigator && window.navigator.vibrate && isMobile) {
      window.navigator.vibrate(50); // Haptic feedback on mobile
    }

    const newIsDark = !isDark;
    setIsDark(newIsDark);
    
    if (newIsDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      toast({
        title: "Dark mode enabled",
        description: "Easier on your eyes at night",
        duration: 1500,
      });
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      toast({
        title: "Light mode enabled",
        description: "Better visibility in daylight",
        duration: 1500,
      });
    }
  };

  return (
    <div className="relative">
      <Toggle
        pressed={isDark}
        onPressedChange={toggleTheme}
        aria-label="Toggle theme"
        className="w-10 h-10 rounded-full bg-background/30 backdrop-blur-sm hover:bg-background/50 text-white border border-white/20"
      >
        {isDark ? (
          <Moon className="h-5 w-5" />
        ) : (
          <Sun className="h-5 w-5" />
        )}
      </Toggle>
    </div>
  );
}
