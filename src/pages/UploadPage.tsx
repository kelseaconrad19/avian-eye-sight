
import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUploader } from "@/components/bird-identification/ImageUploader";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function UploadPage() {
  const [selectedImage, setSelectedImage] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  
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
  
  return (
    <PageContainer title="Upload Bird Image">
      <Card className="max-w-xl mx-auto">
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
              onClick={handleContinue}
              disabled={!selectedImage}
              className="px-6"
            >
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
