
import { IdentifyPage } from "./IdentifyPage";
import { PageContainer } from "@/components/layout/PageContainer";
import { Bird } from "lucide-react";

const Index = () => {
  return (
    <>
      <div className="relative overflow-hidden bg-gradient-to-br from-nature-50 to-nature-100 dark:from-earth-800 dark:to-earth-900 py-16 mb-8">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center mb-4">
              <Bird className="w-10 h-10 text-maroon-600 dark:text-maroon-400 animate-bird-flap" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-4 animate-fade-in font-playfair">
              Welcome to BirdWatch
            </h1>
            <p className="text-xl text-maroon-600 dark:text-maroon-300 mb-6 animate-fade-in" style={{animationDelay: "0.2s"}}>
              Identify beautiful birds and track your sightings with our passionate community
            </p>
            <div className="h-1 w-32 mx-auto bg-gradient-to-r from-maroon-600 to-nature-600 rounded-full animate-fade-in" style={{animationDelay: "0.4s"}}></div>
          </div>
        </div>
        
        {/* Background decoration elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <svg className="absolute right-0 top-20 text-nature-300 dark:text-nature-900 opacity-20 w-64 h-64 transform translate-x-1/3" fill="currentColor" viewBox="0 0 200 200">
            <path d="M42.7,-73.4C55.9,-67.1,67.7,-56.5,74.9,-43.5C82.1,-30.5,84.6,-15.2,83.1,-0.9C81.6,13.5,76,27,68.2,39.1C60.5,51.2,50.6,62,38.5,70.5C26.5,79,13.2,85.3,-0.8,86.5C-14.8,87.8,-29.6,84.1,-41.6,76C-53.6,67.9,-62.9,55.4,-71,41.9C-79,28.3,-85.8,14.2,-85.1,0.4C-84.5,-13.4,-76.5,-26.7,-68,-39.2C-59.4,-51.7,-50.4,-63.3,-38.8,-70.5C-27.2,-77.7,-13.6,-80.5,0.5,-81.4C14.6,-82.2,29.5,-79.7,42.7,-73.4Z" transform="translate(100 100)" />
          </svg>
          
          <svg className="absolute left-0 bottom-0 text-maroon-300 dark:text-maroon-900 opacity-20 w-72 h-72 transform -translate-x-1/3" fill="currentColor" viewBox="0 0 200 200">
            <path d="M42.8,-76.1C53.8,-69.3,60.3,-53.9,67.4,-39.7C74.6,-25.4,82.3,-12.7,83.9,1.5C85.5,15.8,80.9,31.5,73.3,46.1C65.6,60.7,55,74.2,41.2,80.8C27.5,87.4,10.7,87.2,-3.9,83.1C-18.5,79,-37.1,71.1,-51.7,60.7C-66.3,50.4,-76.9,37.5,-83,22.6C-89.1,7.7,-90.6,-9.2,-84.9,-23.2C-79.1,-37.1,-66.1,-48.2,-52.4,-55.4C-38.7,-62.5,-24.3,-65.9,-9.3,-71.7C5.6,-77.5,19.8,-85.8,31.8,-82.9C43.9,-80,50.9,-65.9,42.8,-76.1Z" transform="translate(100 100)" />
          </svg>
        </div>
      </div>
      
      <PageContainer className="max-w-5xl">
        <IdentifyPage />
      </PageContainer>
    </>
  );
};

export default Index;
