
import { MouseEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Bird, Plus } from "lucide-react";

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
      <Card className="w-full animate-pulse">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="h-24 bg-muted rounded mb-4"></div>
          <div className="h-4 bg-muted rounded w-full mb-2"></div>
          <div className="h-4 bg-muted rounded w-5/6"></div>
        </CardContent>
      </Card>
    );
  }

  if (!birdInfo) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bird className="mr-2 h-5 w-5" />
            Bird Identification
          </CardTitle>
          <CardDescription>
            Upload an image to identify a bird species
          </CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          <p>Results will appear here after you upload and analyze an image.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full animate-zoom-in">
      <CardHeader>
        <CardTitle className="flex items-center">
          {birdInfo.name}
        </CardTitle>
        <CardDescription className="italic">
          {birdInfo.scientificName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {birdInfo.imageUrl && (
          <img 
            src={birdInfo.imageUrl} 
            alt={birdInfo.name} 
            className="w-full h-48 object-cover rounded-md mb-4"
          />
        )}
        <div className="mb-4">
          <div className="bg-muted rounded-full h-2 mb-1">
            <div 
              className="bg-primary rounded-full h-2" 
              style={{ width: `${birdInfo.confidence * 100}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Confidence: {Math.round(birdInfo.confidence * 100)}%
          </p>
        </div>
        <p className="text-sm">{birdInfo.description}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={handleAddToSightings} className="w-full">
          <Plus className="mr-2 h-4 w-4" /> Add to My Sightings
        </Button>
      </CardFooter>
    </Card>
  );
}
