
import { useEffect, useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { SightingsList } from "@/components/sightings/SightingsList";
import { SightingData } from "@/components/sightings/SightingForm";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export function SightingsPage() {
  const [sightings, setSightings] = useState<SightingData[]>([]);
  const [sightingToDelete, setSightingToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    // Load sightings from localStorage
    const storedSightings = JSON.parse(localStorage.getItem("birdSightings") || "[]");
    setSightings(storedSightings);
  }, []);
  
  const handleDelete = (id: string) => {
    setSightingToDelete(id);
  };
  
  const confirmDelete = () => {
    if (sightingToDelete) {
      const updatedSightings = sightings.filter(s => s.id !== sightingToDelete);
      localStorage.setItem("birdSightings", JSON.stringify(updatedSightings));
      setSightings(updatedSightings);
      
      toast({
        title: "Sighting removed",
        description: "The sighting has been removed from your list.",
      });
      
      setSightingToDelete(null);
    }
  };
  
  return (
    <PageContainer title="My Sightings">
      {sightings.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">No sightings yet</h2>
          <p className="text-muted-foreground mb-6">
            Start by identifying a bird and adding it to your sightings
          </p>
          <Link to="/">
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Identify a Bird
            </Button>
          </Link>
        </div>
      ) : (
        <SightingsList sightings={sightings} onDelete={handleDelete} />
      )}
      
      <AlertDialog open={!!sightingToDelete} onOpenChange={() => setSightingToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Sighting</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this sighting? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageContainer>
  );
}
