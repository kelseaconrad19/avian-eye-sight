
import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { ImageUploader } from "@/components/bird-identification/ImageUploader";
import { BirdResult, BirdInfo } from "@/components/bird-identification/BirdResult";
import { SightingForm, SightingData } from "@/components/sightings/SightingForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { mockIdentifyBird } from "@/services/birdIdentification";

export function IdentifyPage() {
  const [selectedImage, setSelectedImage] = useState("");
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [identifiedBird, setIdentifiedBird] = useState<BirdInfo | null>(null);
  const [showSightingForm, setShowSightingForm] = useState(false);
  const { toast } = useToast();

  const handleImageSelected = async (imageData: string) => {
    setSelectedImage(imageData);
    setIdentifiedBird(null);
    
    if (imageData) {
      setIsIdentifying(true);
      try {
        // In a real implementation, this would be an API call
        const result = await mockIdentifyBird(imageData);
        setIdentifiedBird(result);
      } catch (error) {
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

  const handleSaveSighting = (data: SightingData) => {
    // In a real app, this would save to a database
    const currentSightings = JSON.parse(localStorage.getItem("birdSightings") || "[]");
    const updatedSightings = [...currentSightings, data];
    localStorage.setItem("birdSightings", JSON.stringify(updatedSightings));
    
    setShowSightingForm(false);
    toast({
      title: "Sighting saved",
      description: `${identifiedBird?.name} has been added to your sightings!`,
    });
  };

  return (
    <PageContainer title="Identify Birds">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Upload an Image</h2>
          <ImageUploader onImageSelected={handleImageSelected} />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Identification Results</h2>
          <BirdResult 
            birdInfo={identifiedBird}
            isLoading={isIdentifying}
            onAddToSightings={handleAddToSightings}
          />
        </div>
      </div>

      {/* Sighting Form Dialog */}
      <Dialog open={showSightingForm} onOpenChange={setShowSightingForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to My Sightings</DialogTitle>
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
    </PageContainer>
  );
}
