
import { MouseEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Bird, Feather, Plus } from "lucide-react";

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
      <Card className="w-full animate-pulse border-2 border-muted overflow-hidden rounded-xl card-shadow">
        <CardHeader>
          <div className="flex items-center justify-center">
            <Feather className="h-6 w-6 text-muted-foreground animate-bird-flap" />
          </div>
          <div className="h-6 bg-muted rounded w-3/4 mx-auto mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="h-36 bg-muted rounded-md mb-4"></div>
          <div className="h-4 bg-muted rounded w-full mb-2"></div>
          <div className="h-4 bg-muted rounded w-5/6"></div>
          <div className="h-4 bg-muted rounded w-4/6"></div>
        </CardContent>
      </Card>
    );
  }

  if (!birdInfo) {
    return (
      <Card className="w-full border-2 border-muted overflow-hidden rounded-xl card-hover">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center">
            <Bird className="mr-2 h-6 w-6 text-maroon-600 dark:text-maroon-400" />
            Bird Identification
          </CardTitle>
          <CardDescription>
            Upload an image to identify a bird species
          </CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground text-center px-4 py-8">
          <Feather className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4 animate-float" />
          <p>Results will appear here after you upload and analyze an image.</p>
          <div className="mt-4 text-xs text-muted-foreground/70">
            <p>Our AI can identify over 10,000 bird species with high accuracy</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full animate-zoom-in border-2 border-earth-200 dark:border-earth-700 overflow-hidden rounded-xl card-hover">
      <CardHeader className="pb-3 bg-gradient-to-br from-earth-50 to-transparent dark:from-earth-800/50 dark:to-transparent">
        <CardTitle className="flex items-center justify-center text-2xl">
          {birdInfo.name}
        </CardTitle>
        <CardDescription className="italic text-center">
          {birdInfo.scientificName}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        {birdInfo.imageUrl && (
          <div className="overflow-hidden rounded-md mb-4">
            <img 
              src={birdInfo.imageUrl} 
              alt={birdInfo.name} 
              className="w-full h-56 object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        )}
        <div className="mb-4">
          <div className="bg-muted rounded-full h-2 mb-1 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-maroon-600 to-nature-500 dark:from-maroon-500 dark:to-nature-400 rounded-full h-2 transition-all duration-1000" 
              style={{ width: `${birdInfo.confidence * 100}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground text-right">
            Confidence: {Math.round(birdInfo.confidence * 100)}%
          </p>
        </div>
        <div className="rounded-lg bg-muted/40 p-4 dark:bg-muted/10">
          <p className="text-sm leading-relaxed">{birdInfo.description}</p>
        </div>
      </CardContent>
      <CardFooter className="bg-gradient-to-br from-transparent to-earth-50/50 dark:from-transparent dark:to-earth-800/30">
        <Button 
          onClick={handleAddToSightings} 
          className="w-full bg-gradient-to-r from-maroon-600 to-maroon-700 hover:from-maroon-700 hover:to-maroon-800 dark:from-maroon-600 dark:to-maroon-500 hover:shadow-lg transition-all duration-300"
        >
          <Plus className="mr-2 h-4 w-4" /> Add to My Sightings
        </Button>
      </CardFooter>
    </Card>
  );
}
