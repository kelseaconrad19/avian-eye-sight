
import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { ImageUploader } from "@/components/bird-identification/ImageUploader";
import { BirdResult, BirdInfo } from "@/components/bird-identification/BirdResult";
import { SightingForm, SightingData } from "@/components/sightings/SightingForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { identifyBird } from "@/services/birdIdentification";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { Upload, Bird } from "lucide-react";

export function IdentifyPage() {
  const [selectedImage, setSelectedImage] = useState("");
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [identifiedBird, setIdentifiedBird] = useState<BirdInfo | null>(null);
  const [showSightingForm, setShowSightingForm] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleImageSelected = async (imageData: string) => {
    setSelectedImage(imageData);
    setIdentifiedBird(null);
    
    if (imageData) {
      setIsIdentifying(true);
      try {
        // Call our bird identification service
        const result = await identifyBird(imageData);
        setIdentifiedBird(result);
      } catch (error) {
        console.error("Identification error:", error);
        toast({
          title: "Identification failed",
          description: "Could not identify the bird. Please try with a different image.",
          variant: "destructive",
        });
      } finally {
        setIsIdentifying(false);
      }
    }
  };

  const handleAddToSightings = (bird: BirdInfo) => {
    setShowSightingForm(true);
  };

  const handleSaveSighting = async (data: SightingData) => {
    try {
      // Only save to Supabase if we have bird data
      if (identifiedBird) {
        // First ensure the bird species exists in the database
        const { data: birdSpecies, error: birdError } = await supabase
          .from('bird_species')
          .select('id')
          .eq('name', identifiedBird.name)
          .single();

        if (birdError && birdError.code !== 'PGRST116') {
          console.error("Error fetching bird species:", birdError);
          throw birdError;
        }

        let birdSpeciesId = birdSpecies?.id;
        
        // If bird not found, insert it
        if (!birdSpeciesId) {
          const { data: newBird, error: insertError } = await supabase
            .from('bird_species')
            .insert({
              name: identifiedBird.name,
              scientific_name: identifiedBird.scientificName,
              description: identifiedBird.description,
              image_url: identifiedBird.imageUrl,
              confidence: identifiedBird.confidence
            })
            .select('id')
            .single();

          if (insertError) {
            console.error("Error inserting bird species:", insertError);
            throw insertError;
          }

          birdSpeciesId = newBird.id;
        }

        // Save the user sighting to Supabase
        const { error: sightingError } = await supabase
          .from('user_sightings')
          .insert({
            bird_species_id: birdSpeciesId,
            location: data.location,
            notes: data.notes,
            sighting_date: data.date.toISOString(),
            image_url: selectedImage
          });

        if (sightingError) {
          console.error("Error saving sighting:", sightingError);
          throw sightingError;
        }
      } else {
        // No bird data, save to localStorage as fallback
        const currentSightings = JSON.parse(localStorage.getItem("birdSightings") || "[]");
        const updatedSightings = [...currentSightings, data];
        localStorage.setItem("birdSightings", JSON.stringify(updatedSightings));
      }
      
      setShowSightingForm(false);
      toast({
        title: "Sighting saved",
        description: `${identifiedBird?.name} has been added to your sightings!`,
      });
    } catch (error) {
      console.error("Error saving sighting:", error);
      toast({
        title: "Error saving sighting",
        description: "There was a problem saving your sighting. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-4 backdrop-blur-sm bg-black/30 rounded-xl border border-white/20 shadow-xl">
          <h2 className="text-xl font-semibold mb-4 text-white flex items-center">
            <Upload className="mr-2 h-5 w-5" /> 
            Identify Birds
          </h2>
          <ImageUploader onImageSelected={handleImageSelected} />
        </div>
        
        <div>
          <BirdResult 
            birdInfo={identifiedBird}
            isLoading={isIdentifying}
            onAddToSightings={handleAddToSightings}
          />
        </div>
      </div>

      {/* Sighting Form Dialog */}
      <Dialog open={showSightingForm} onOpenChange={setShowSightingForm}>
        <DialogContent className={isMobile ? "w-[95%] rounded-xl" : "rounded-xl"}>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Bird className="mr-2 h-5 w-5" /> Add to My Sightings
            </DialogTitle>
          </DialogHeader>
          {identifiedBird && (
            <SightingForm
              birdInfo={identifiedBird}
              onSubmit={handleSaveSighting}
              onCancel={() => setShowSightingForm(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
