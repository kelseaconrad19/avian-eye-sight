
import { useState, useRef, useEffect } from "react";
import { Camera, Upload, X, Feather } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

interface ImageUploaderProps {
  onImageSelected: (imageData: string) => void;
}

export function ImageUploader({ onImageSelected }: ImageUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
      // Request camera with specific constraints for mobile
      const constraints = {
        video: {
          facingMode: "environment", // Use back camera on mobile
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      const videoEl = document.createElement("video");
      const canvasEl = document.createElement("canvas");
      
      videoEl.srcObject = stream;
      videoEl.play();
      
      setTimeout(() => {
        canvasEl.width = videoEl.videoWidth;
        canvasEl.height = videoEl.videoHeight;
        const ctx = canvasEl.getContext("2d");
        ctx?.drawImage(videoEl, 0, 0);
        
        const imageData = canvasEl.toDataURL("image/jpeg", 0.95);
        setPreviewUrl(imageData);
        onImageSelected(imageData);
        
        stream.getTracks().forEach(track => track.stop());
      }, 300);
    } catch (error) {
      toast({
        title: "Camera access denied",
        description: "Please allow camera access to use this feature.",
        variant: "destructive",
      });
    }
  };

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
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

  return (
    <Card className="overflow-hidden border-2 border-earth-200 dark:border-earth-700 rounded-xl card-hover">
      <CardContent className="p-0">
        {previewUrl ? (
          <div className="relative">
            <img
              src={previewUrl}
              alt="Uploaded bird"
              className="w-full h-auto object-cover rounded-t-lg"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 rounded-full w-10 h-10 bg-white/80 text-maroon-600 hover:bg-white hover:text-maroon-700 dark:bg-black/50 dark:text-white dark:hover:bg-black/70"
              onClick={handleClear}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        ) : (
          <div
            className={`bg-gradient-to-br from-earth-50 to-earth-100 dark:from-earth-900 dark:to-earth-800 h-60 flex flex-col items-center justify-center p-6 cursor-pointer transition-colors duration-300 ${isDragging ? 'border-2 border-dashed border-primary' : ''}`}
            onClick={handleClick}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <Feather className="h-16 w-16 text-earth-400 dark:text-earth-500 mb-3 animate-float" />
            <p className="text-earth-700 dark:text-earth-300 text-center mb-1 font-medium">
              {isMobile ? "Tap to upload an image" : "Drag and drop an image or click to browse"}
            </p>
            <p className="text-xs text-earth-500 dark:text-earth-400 text-center">
              Supports JPG, PNG, GIF
            </p>
          </div>
        )}

        <div className="p-4 flex space-x-2 bg-gradient-to-b from-transparent to-earth-50/70 dark:to-earth-800/50">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
          <Button
            variant="outline"
            className="flex-1 h-12 border-earth-300 dark:border-earth-700 hover:bg-earth-100 dark:hover:bg-earth-800/70 transition-all duration-300"
            onClick={handleClick}
          >
            <Upload className="h-4 w-4 mr-2 text-earth-600 dark:text-earth-400" />
            {isMobile ? "Gallery" : "Choose File"}
          </Button>
          <Button
            variant="outline"
            className="flex-1 h-12 border-earth-300 dark:border-earth-700 hover:bg-earth-100 dark:hover:bg-earth-800/70 transition-all duration-300"
            onClick={handleCapture}
          >
            <Camera className="h-4 w-4 mr-2 text-earth-600 dark:text-earth-400" />
            {isMobile ? "Camera" : "Use Camera"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
