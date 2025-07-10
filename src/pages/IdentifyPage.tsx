
import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { ImageUploader } from "@/components/bird-identification/ImageUploader";
import { BirdResult, BirdInfo } from "@/components/bird-identification/BirdResult";
import { SightingForm } from "@/components/sightings/SightingForm";
import { SightingData } from "@/types/badges";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BadgeCelebrationModal } from "@/components/badges/BadgeCelebrationModal";
import { SuccessModal } from "@/components/ui/success-modal";
import { useToast } from "@/hooks/use-toast";
import { useSightingWithBadges } from "@/hooks/useSightingWithBadges";
import { identifyBird } from "@/services/birdIdentification";

export function IdentifyPage() {
  const [selectedImage, setSelectedImage] = useState("");
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [identifiedBird, setIdentifiedBird] = useState<BirdInfo | null>(null);
  const [showSightingForm, setShowSightingForm] = useState(false);
  const { toast } = useToast();
  const { 
    createSighting, 
    isSubmitting, 
    newBadges, 
    showCelebration, 
    closeCelebration,
    showSuccess,
    closeSuccess
  } = useSightingWithBadges();

  const handleImageSelected = async (imageData: string) => {
    setSelectedImage(imageData);
    setIdentifiedBird(null);
    
    if (imageData) {
      setIsIdentifying(true);
      try {
        // Call our new bird identification service
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
    const success = await createSighting({
      ...data,
      birdInfo: identifiedBird!,
      uploadedImage: selectedImage // Include the uploaded image
    });
    
    if (success) {
      setShowSightingForm(false);
      // The badge celebration will show automatically if badges were earned
    }
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

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccess}
        onClose={closeSuccess}
        title="🎉 Sighting Saved Successfully!"
        description="Your bird sighting has been added to your collection and is now part of your birding journey. Keep exploring and discovering new species!"
      />

      {/* Badge Celebration Modal */}
      <BadgeCelebrationModal
        isOpen={showCelebration}
        onClose={closeCelebration}
        badges={newBadges}
      />
    </PageContainer>
  );
}
