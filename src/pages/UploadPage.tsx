
import { useState, useEffect } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUploader } from "@/components/bird-identification/ImageUploader";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

export function UploadPage() {
  const [selectedImage, setSelectedImage] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Check for pending image in session storage on component mount
  useEffect(() => {
    const pendingImage = sessionStorage.getItem("pendingBirdImage");
    if (pendingImage) {
      setSelectedImage(pendingImage);
    }
  }, []);
  
  const handleImageSelected = (imageData: string) => {
    setSelectedImage(imageData);
  };
  
  const handleContinue = () => {
    if (!selectedImage) {
      toast({
        title: "No image selected",
        description: "Please upload an image to continue",
        variant: "destructive",
      });
      return;
    }
    
    // Store the image in session storage so it can be accessed on the identify page
    sessionStorage.setItem("pendingBirdImage", selectedImage);
    
    // Navigate to the identify page
    navigate("/");
    
    toast({
      title: "Image uploaded",
      description: "Your image is ready for identification",
    });
  };
  
  // Add haptic feedback for mobile
  const triggerHapticFeedback = () => {
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50); // Vibrate for 50ms for button press
    }
  };
  
  return (
    <PageContainer title="Upload Bird Image">
      <Card className={`mx-auto ${isMobile ? 'w-full' : 'max-w-xl'}`}>
        <CardHeader>
          <CardTitle>Upload Image for Identification</CardTitle>
          <CardDescription>
            Upload a clear photo of a bird for the best identification results.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ImageUploader onImageSelected={handleImageSelected} />
          
          <div className="flex justify-end">
            <Button 
              onClick={() => {
                triggerHapticFeedback();
                handleContinue();
              }}
              disabled={!selectedImage}
              className="px-6 h-12"
              size={isMobile ? "lg" : "default"}
            >
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
