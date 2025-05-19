
import { IdentifyPage } from "./IdentifyPage";
import { PageContainer } from "@/components/layout/PageContainer";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="relative min-h-screen">
      {/* Full-width hero image with overlay */}
      <div className="absolute inset-0 -z-10 h-[100vh] w-full">
        <div className="absolute inset-0 bg-black/60 dark:bg-black/70" />
        <img 
          src="/lovable-uploads/194305c3-aa61-40f2-9b28-0020aee6931e.png" 
          alt="Bird on branch" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <PageContainer className="max-w-5xl z-10">
        <div className="mb-10 text-center pt-16">
          <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-4 animate-fadeIn">
            Welcome to BirdWatch
          </h1>
          <p className="text-xl text-white/90 font-light animate-fadeIn">
            Identify beautiful birds and track your sightings
          </p>
        </div>
        
        {/* Position the theme toggle in the top right */}
        <div className={`absolute ${isMobile ? 'top-20' : 'top-5'} right-5`}>
          <ThemeToggle />
        </div>
        
        <IdentifyPage />
      </PageContainer>
    </div>
  );
};

export default Index;
