
import { useState, useRef } from "react";
import { Camera, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface ImageUploaderProps {
  onImageSelected: (imageData: string) => void;
}

export function ImageUploader({ onImageSelected }: ImageUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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
    setPreviewUrl(null);
    onImageSelected("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const videoEl = document.createElement("video");
      const canvasEl = document.createElement("canvas");
      
      videoEl.srcObject = stream;
      videoEl.play();
      
      setTimeout(() => {
        canvasEl.width = videoEl.videoWidth;
        canvasEl.height = videoEl.videoHeight;
        const ctx = canvasEl.getContext("2d");
        ctx?.drawImage(videoEl, 0, 0);
        
        const imageData = canvasEl.toDataURL("image/jpeg");
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

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {previewUrl ? (
          <div className="relative">
            <img
              src={previewUrl}
              alt="Uploaded bird"
              className="w-full h-auto rounded-t-md"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 rounded-full"
              onClick={handleClear}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div
            className="bg-muted h-60 flex flex-col items-center justify-center p-6 cursor-pointer"
            onClick={handleClick}
          >
            <Upload className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-muted-foreground text-center mb-1">
              Drag and drop an image or click to browse
            </p>
            <p className="text-xs text-muted-foreground text-center">
              Supports JPG, PNG, GIF
            </p>
          </div>
        )}

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
            className="flex-1"
            onClick={handleClick}
          >
            <Upload className="h-4 w-4 mr-2" />
            Choose File
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleCapture}
          >
            <Camera className="h-4 w-4 mr-2" />
            Use Camera
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
