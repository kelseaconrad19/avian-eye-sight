
import { useEffect, useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { SightingsList } from "@/components/sightings/SightingsList";
import { SightingData } from "@/components/sightings/SightingForm";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BirdInfo } from "@/components/bird-identification/BirdResult";

export function SightingsPage() {
  const [sightings, setSightings] = useState<SightingData[]>([]);
  const [sightingToDelete, setSightingToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    async function loadSightings() {
      setLoading(true);
      try {
        // Fetch sightings from Supabase
        const { data: supabaseSightings, error } = await supabase
          .from('user_sightings')
          .select(`
            id, 
            location, 
            notes, 
            sighting_date,
            image_url,
            bird_species:bird_species_id (
              id, 
              name, 
              scientific_name, 
              description, 
              image_url, 
              confidence
            )
          `)
          .order('sighting_date', { ascending: false });
          
        if (error) {
          console.error("Error fetching sightings:", error);
          throw error;
        }
        
        // Transform the data to match our SightingData type
        const formattedSightings = supabaseSightings.map(item => {
          const birdInfo: BirdInfo = {
            name: item.bird_species.name,
            scientificName: item.bird_species.scientific_name,
            description: item.bird_species.description,
            imageUrl: item.bird_species.image_url || item.image_url,
            confidence: item.bird_species.confidence,
          };
          
          return {
            id: item.id,
            birdInfo,
            date: new Date(item.sighting_date),
            location: item.location,
            notes: item.notes
          };
        });
        
        // Also load from localStorage for backward compatibility
        const storedSightings = JSON.parse(localStorage.getItem("birdSightings") || "[]");
        
        // Combine both sources, prioritizing Supabase data
        const allSightings = [...formattedSightings, ...storedSightings];
        setSightings(allSightings);
        
      } catch (error) {
        console.error("Error loading sightings:", error);
        // Fallback to localStorage if Supabase fails
        const storedSightings = JSON.parse(localStorage.getItem("birdSightings") || "[]");
        setSightings(storedSightings);
        
        toast({
          title: "Error loading sightings",
          description: "Could not load all sightings from the database. Some data may be missing.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    
    loadSightings();
  }, [toast]);
  
  const handleDelete = (id: string) => {
    setSightingToDelete(id);
  };
  
  const confirmDelete = async () => {
    if (sightingToDelete) {
      try {
        // Try to delete from Supabase first
        const { error } = await supabase
          .from('user_sightings')
          .delete()
          .eq('id', sightingToDelete);
          
        if (error) {
          console.error("Error deleting from Supabase:", error);
          // If not found in Supabase, it might be in localStorage
        }
        
        // Also update localStorage for backward compatibility
        const storedSightings = JSON.parse(localStorage.getItem("birdSightings") || "[]");
        const updatedStoredSightings = storedSightings.filter((s: SightingData) => s.id !== sightingToDelete);
        localStorage.setItem("birdSightings", JSON.stringify(updatedStoredSightings));
        
        // Update UI
        const updatedSightings = sightings.filter(s => s.id !== sightingToDelete);
        setSightings(updatedSightings);
        
        toast({
          title: "Sighting removed",
          description: "The sighting has been removed from your list.",
        });
      } catch (error) {
        console.error("Error deleting sighting:", error);
        toast({
          title: "Error removing sighting",
          description: "There was a problem removing this sighting. Please try again.",
          variant: "destructive",
        });
      } finally {
        setSightingToDelete(null);
      }
    }
  };
  
  return (
    <PageContainer title="My Sightings">
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-pulse space-y-4 w-full max-w-3xl">
            <div className="h-12 bg-muted rounded w-3/4"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      ) : sightings.length === 0 ? (
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
