
import { useState, useRef, useEffect } from "react";
import { Camera, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

interface ImageUploaderProps {
  onImageSelected: (imageData: string) => void;
}

export function ImageUploader({ onImageSelected }: ImageUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    // Check if there's a pending image in session storage
    const pendingImage = sessionStorage.getItem("pendingBirdImage");
    if (pendingImage) {
      setPreviewUrl(pendingImage);
      onImageSelected(pendingImage);
    }
  }, [onImageSelected]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) return;
    
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive",
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreviewUrl(result);
      onImageSelected(result);
    };
    reader.readAsDataURL(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleClear = () => {
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50); // Haptic feedback
    }
    
    setPreviewUrl(null);
    onImageSelected("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    
    // Clear from session storage too
    sessionStorage.removeItem("pendingBirdImage");
  };

  const handleCapture = async () => {
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50); // Haptic feedback
    }
    
    try {
      // Enhanced camera constraints for better mobile compatibility
      const constraints = {
        video: {
          facingMode: { ideal: "environment" }, // Prefer back camera but allow front as fallback
          width: { ideal: 1920, max: 1920 },
          height: { ideal: 1080, max: 1080 },
          aspectRatio: { ideal: 16/9 }
        }
      };
      
      console.log("Requesting camera access...");
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log("Camera access granted");
      
      setStream(mediaStream);
      setShowCamera(true);
      
      // Wait for video element to be available
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.setAttribute('playsinline', 'true'); // Critical for iOS
          videoRef.current.setAttribute('muted', 'true');
          videoRef.current.play().catch(console.error);
        }
      }, 100);
      
    } catch (error) {
      console.error("Camera error:", error);
      
      let errorMessage = "Could not access camera.";
      if (error.name === "NotAllowedError") {
        errorMessage = "Please allow camera access in your browser settings.";
      } else if (error.name === "NotFoundError") {
        errorMessage = "No camera found on this device.";
      } else if (error.name === "NotSupportedError") {
        errorMessage = "Camera is not supported in this browser.";
      } else if (error.name === "NotReadableError") {
        errorMessage = "Camera is being used by another application.";
      }
      
      toast({
        title: "Camera Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const takePicture = () => {
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50); // Haptic feedback
    }
    
    if (!videoRef.current || !stream) return;
    
    const videoEl = videoRef.current;
    const canvasEl = document.createElement("canvas");
    
    const displayWidth = videoEl.videoWidth;
    const displayHeight = videoEl.videoHeight;
    
    if (displayWidth === 0 || displayHeight === 0) {
      console.error("Video dimensions are zero");
      return;
    }
    
    canvasEl.width = displayWidth;
    canvasEl.height = displayHeight;
    const ctx = canvasEl.getContext("2d");
    
    if (!ctx) {
      console.error("Could not get canvas context");
      return;
    }
    
    ctx.drawImage(videoEl, 0, 0, displayWidth, displayHeight);
    
    const imageData = canvasEl.toDataURL("image/jpeg", 0.95);
    console.log("Image captured successfully");
    
    setPreviewUrl(imageData);
    onImageSelected(imageData);
    
    // Clean up camera
    closeCamera();
  };

  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setShowCamera(false);
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {showCamera ? (
          <div className="relative">
            <video
              ref={videoRef}
              className="w-full h-auto rounded-t-md"
              autoPlay
              playsInline
              muted
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full w-12 h-12 bg-white/90 hover:bg-white"
                onClick={closeCamera}
                title="Close camera"
              >
                <X className="h-6 w-6" />
              </Button>
              <Button
                size="icon"
                className="rounded-full w-16 h-16 bg-white hover:bg-white/90 text-black border-4 border-white"
                onClick={takePicture}
                title="Take photo"
              >
                <Camera className="h-8 w-8" />
              </Button>
            </div>
          </div>
        ) : previewUrl ? (
          <div className="relative">
            <img
              src={previewUrl}
              alt="Uploaded bird"
              className="w-full h-auto rounded-t-md"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 rounded-full w-10 h-10" // Larger touch target for mobile
              onClick={handleClear}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        ) : (
          <div
            className="bg-muted h-60 flex flex-col items-center justify-center p-6 cursor-pointer"
            onClick={handleClick}
          >
            <Upload className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-muted-foreground text-center mb-1">
              {isMobile ? "Tap to upload an image" : "Drag and drop an image or click to browse"}
            </p>
            <p className="text-xs text-muted-foreground text-center">
              Supports JPG, PNG, GIF
            </p>
          </div>
        )}

        {!showCamera && (
          <div className="p-4 flex space-x-2">
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
            <Button
              variant="outline"
              className="flex-1 h-12" // Taller button for better touch target
              onClick={handleClick}
            >
              <Upload className="h-4 w-4 mr-2" />
              {isMobile ? "Gallery" : "Choose File"}
            </Button>
            <Button
              variant="outline"
              className="flex-1 h-12" // Taller button for better touch target
              onClick={handleCapture}
            >
              <Camera className="h-4 w-4 mr-2" />
              {isMobile ? "Camera" : "Use Camera"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
