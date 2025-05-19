
import { MouseEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Bird, Plus, Feather } from "lucide-react";

export interface BirdInfo {
  name: string;
  scientificName: string;
  confidence: number;
  description: string;
  imageUrl?: string;
}

interface BirdResultProps {
  birdInfo: BirdInfo | null;
  isLoading: boolean;
  onAddToSightings: (bird: BirdInfo) => void;
}

export function BirdResult({ birdInfo, isLoading, onAddToSightings }: BirdResultProps) {
  const handleAddToSightings = (e: MouseEvent) => {
    e.preventDefault();
    if (birdInfo) {
      onAddToSightings(birdInfo);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full animate-pulse bg-black/40 backdrop-blur-lg border border-white/20 shadow-xl">
        <CardHeader>
          <div className="h-6 bg-white/10 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-white/10 rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="h-24 bg-white/10 rounded mb-4"></div>
          <div className="h-4 bg-white/10 rounded w-full mb-2"></div>
          <div className="h-4 bg-white/10 rounded w-5/6"></div>
        </CardContent>
      </Card>
    );
  }

  if (!birdInfo) {
    return (
      <Card className="w-full bg-black/40 backdrop-blur-lg border border-white/20 shadow-xl card-shadow transition-all duration-300 hover:translate-y-[-2px]">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Feather className="mr-2 h-5 w-5" />
            Identification Results
          </CardTitle>
          <CardDescription className="text-white/80">
            Upload an image to identify a bird species
          </CardDescription>
        </CardHeader>
        <CardContent className="text-white/70">
          <p>Results will appear here after you upload and analyze an image.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-black/40 backdrop-blur-lg border border-white/20 shadow-xl animate-zoom-in card-shadow transition-all duration-300 hover:translate-y-[-2px]">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          {birdInfo.name}
        </CardTitle>
        <CardDescription className="italic text-white/80">
          {birdInfo.scientificName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {birdInfo.imageUrl && (
          <img 
            src={birdInfo.imageUrl} 
            alt={birdInfo.name} 
            className="w-full h-56 object-cover rounded-md mb-4 shadow-md"
          />
        )}
        <div className="mb-4">
          <div className="bg-white/20 rounded-full h-2 mb-1">
            <div 
              className="bg-gradient-to-r from-blue-400 to-purple-500 rounded-full h-2" 
              style={{ width: `${birdInfo.confidence * 100}%` }}
            />
          </div>
          <p className="text-sm text-white/80">
            Confidence: {Math.round(birdInfo.confidence * 100)}%
          </p>
        </div>
        <p className="text-sm text-white/90">{birdInfo.description}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={handleAddToSightings} className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg transition-all duration-300">
          <Plus className="mr-2 h-4 w-4" /> Add to My Sightings
        </Button>
      </CardFooter>
    </Card>
  );
}
