
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { SightingData } from "./SightingForm";
import { Bird } from "lucide-react";

interface SightingsListProps {
  sightings: SightingData[];
  onDelete: (id: string) => void;
}

export function SightingsList({ sightings, onDelete }: SightingsListProps) {
  const [selectedSighting, setSelectedSighting] = useState<SightingData | null>(null);

  if (sightings.length === 0) {
    return (
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-center">No Sightings Yet</CardTitle>
          <CardDescription className="text-center">
            Your bird sightings will appear here once you add them.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <Bird className="h-16 w-16 text-muted-foreground opacity-30" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sightings.map((sighting) => (
        <Card key={sighting.id} className="card-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{sighting.birdInfo.name}</CardTitle>
            <CardDescription className="italic">
              {sighting.birdInfo.scientificName}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">
                {format(sighting.date, "MMM d, yyyy")}
              </span>
              <span className="font-medium">{sighting.location}</span>
            </div>
            {sighting.birdInfo.imageUrl && (
              <img
                src={sighting.birdInfo.imageUrl}
                alt={sighting.birdInfo.name}
                className="w-full h-32 object-cover rounded-md mb-2"
              />
            )}
            <p className="text-sm truncate text-muted-foreground">
              {sighting.notes || "No notes added"}
            </p>
          </CardContent>
          <CardFooter className="flex justify-between pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedSighting(sighting)}
            >
              View Details
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(sighting.id)}
            >
              Remove
            </Button>
          </CardFooter>
        </Card>
      ))}

      <Dialog open={!!selectedSighting} onOpenChange={() => setSelectedSighting(null)}>
        {selectedSighting && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedSighting.birdInfo.name}</DialogTitle>
              <DialogDescription className="italic">
                {selectedSighting.birdInfo.scientificName}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {selectedSighting.birdInfo.imageUrl && (
                <img
                  src={selectedSighting.birdInfo.imageUrl}
                  alt={selectedSighting.birdInfo.name}
                  className="w-full h-48 object-cover rounded-md"
                />
              )}
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="font-semibold">Date</p>
                  <p>{format(selectedSighting.date, "PPP")}</p>
                </div>
                <div>
                  <p className="font-semibold">Location</p>
                  <p>{selectedSighting.location}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-sm">Notes</p>
                <p className="text-sm whitespace-pre-line">
                  {selectedSighting.notes || "No notes added"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-sm">About this bird</p>
                <p className="text-sm">{selectedSighting.birdInfo.description}</p>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
