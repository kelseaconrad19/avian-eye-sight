
import { useToast as useHookToast, toast as hookToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

// Custom hook that adjusts toast position based on device
export function useToast() {
  const hookResult = useHookToast();
  const isMobile = useIsMobile();
  
  // Return the standard toast implementation with position adjustments for mobile
  return {
    ...hookResult,
    toast: (props: any) => {
      // For mobile devices, ensure toasts appear at the top
      if (isMobile && !props.position) {
        return hookToast({
          ...props,
          position: "top-center",
        });
      }
      
      return hookToast(props);
    }
  };
}

// Export the original toast function with default export
export const toast = (props: any) => {
  // Check if we're on a mobile device by screen width
  const isMobileView = typeof window !== "undefined" && window.innerWidth < 768;
  
  // For mobile devices, ensure toasts appear at the top
  if (isMobileView && !props.position) {
    return hookToast({
      ...props,
      position: "top-center",
    });
  }
  
  return hookToast(props);
};
