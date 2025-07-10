import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { BibleVerse, PhotoItem, OverlaySettings } from '@/types/scripture';
import { 
  Download, 
  Save, 
  Share, 
  RotateCcw, 
  Type, 
  Palette, 
  Settings,
  Loader2
} from 'lucide-react';

interface OverlayEditorProps {
  photo: PhotoItem;
  verse: BibleVerse | null;
  customVerse: string;
  onStartOver: () => void;
}

const DEFAULT_OVERLAY_SETTINGS: OverlaySettings = {
  textX: 50,
  textY: 80,
  fontSize: 24,
  fontFamily: 'Arial',
  fontWeight: 'normal',
  textColor: '#ffffff',
  backgroundColor: '#000000',
  backgroundOpacity: 0.7,
  textAlign: 'center',
  maxWidth: 80,
  padding: 20,
  borderRadius: 10,
};

export const OverlayEditor: React.FC<OverlayEditorProps> = ({
  photo,
  verse,
  customVerse,
  onStartOver
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [settings, setSettings] = useState<OverlaySettings>(DEFAULT_OVERLAY_SETTINGS);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const verseText = verse ? verse.text : customVerse;
  const verseReference = verse ? `${verse.book} ${verse.chapter}:${verse.verse}` : '';

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw image
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    // Calculate text position and dimensions
    const x = (settings.textX / 100) * canvas.width;
    const y = (settings.textY / 100) * canvas.height;
    const maxWidth = (settings.maxWidth / 100) * canvas.width;

    // Set font
    ctx.font = `${settings.fontWeight} ${settings.fontSize}px ${settings.fontFamily}`;
    ctx.textAlign = settings.textAlign;

    // Wrap text
    const words = verseText.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);

    // Add reference if it exists
    if (verseReference) {
      lines.push('');
      lines.push(`— ${verseReference}`);
    }

    // Calculate background dimensions
    const lineHeight = settings.fontSize * 1.2;
    const totalHeight = lines.length * lineHeight + (settings.padding * 2);
    const backgroundWidth = maxWidth + (settings.padding * 2);

    // Draw background
    if (settings.backgroundOpacity > 0) {
      ctx.fillStyle = `${settings.backgroundColor}${Math.round(settings.backgroundOpacity * 255).toString(16).padStart(2, '0')}`;
      
      const bgX = settings.textAlign === 'center' ? x - backgroundWidth / 2 :
                  settings.textAlign === 'right' ? x - backgroundWidth : x;
      const bgY = y - settings.padding;

      if (settings.borderRadius > 0) {
        // Rounded rectangle
        ctx.beginPath();
        ctx.roundRect(bgX, bgY, backgroundWidth, totalHeight, settings.borderRadius);
        ctx.fill();
      } else {
        ctx.fillRect(bgX, bgY, backgroundWidth, totalHeight);
      }
    }

    // Draw text
    ctx.fillStyle = settings.textColor;
    lines.forEach((line, index) => {
      const lineY = y + (index * lineHeight) + settings.fontSize;
      ctx.fillText(line, x, lineY);
    });
  }, [settings, verseText, verseReference]);

  useEffect(() => {
    const image = imageRef.current;
    if (image && image.complete) {
      drawCanvas();
    }
  }, [drawCanvas]);

  const handleImageLoad = () => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) return;

    // Set canvas size to match image aspect ratio
    const maxWidth = 800;
    const maxHeight = 600;
    
    let { width, height } = image;
    
    if (width > maxWidth || height > maxHeight) {
      const ratio = Math.min(maxWidth / width, maxHeight / height);
      width *= ratio;
      height *= ratio;
    }

    canvas.width = width;
    canvas.height = height;
    
    drawCanvas();
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setIsDragging(true);
    setDragOffset({ x: x - settings.textX, y: y - settings.textY });
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setSettings(prev => ({
      ...prev,
      textX: Math.max(0, Math.min(100, x - dragOffset.x)),
      textY: Math.max(0, Math.min(100, y - dragOffset.y))
    }));
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
  };

  const updateSetting = <K extends keyof OverlaySettings>(
    key: K,
    value: OverlaySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to save your overlay.",
          variant: "destructive",
        });
        return;
      }

      // Convert canvas to blob
      const canvas = canvasRef.current;
      if (!canvas) return;

      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
        }, 'image/jpeg', 0.9);
      });

      // Upload to storage
      const fileName = `${Date.now()}-scripture-overlay.jpg`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('scripture-overlays')
        .upload(filePath, blob);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      // Get public URL
      const { data } = supabase.storage
        .from('scripture-overlays')
        .getPublicUrl(filePath);

      // Save overlay record
      const { error: dbError } = await supabase
        .from('scripture_overlays')
        .insert({
          user_id: user.id,
          original_image_url: photo.url,
          edited_image_url: data.publicUrl,
          verse_id: verse?.id || null,
          custom_verse_text: customVerse || null,
          overlay_settings: settings as any,
          title: verse ? `${verse.book} ${verse.chapter}:${verse.verse}` : 'Custom Scripture Overlay'
        });

      if (dbError) {
        console.error('Database error:', dbError);
        throw dbError;
      }

      toast({
        title: "Overlay saved!",
        description: "Your scripture overlay has been saved successfully.",
      });

    } catch (error) {
      console.error('Error saving overlay:', error);
      toast({
        title: "Error saving overlay",
        description: "There was a problem saving your overlay. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `scripture-overlay-${Date.now()}.jpg`;
    link.href = canvas.toDataURL('image/jpeg', 0.9);
    link.click();
  };

  const handleShare = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;

        if (navigator.share && navigator.canShare?.({ files: [new File([blob], 'scripture-overlay.jpg', { type: 'image/jpeg' })] })) {
          await navigator.share({
            title: 'Scripture Overlay',
            text: verseText,
            files: [new File([blob], 'scripture-overlay.jpg', { type: 'image/jpeg' })]
          });
        } else {
          // Fallback: copy image to clipboard
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/jpeg': blob })
          ]);
          toast({
            title: "Image copied to clipboard",
            description: "You can now paste it in other apps.",
          });
        }
      }, 'image/jpeg', 0.9);
    } catch (error) {
      console.error('Error sharing:', error);
      toast({
        title: "Error sharing",
        description: "Could not share the image. Try downloading instead.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Canvas Area */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Scripture Overlay Editor</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={onStartOver}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Start Over
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  className="max-w-full border rounded-lg cursor-move"
                  onMouseDown={handleCanvasMouseDown}
                  onMouseMove={handleCanvasMouseMove}
                  onMouseUp={handleCanvasMouseUp}
                  onMouseLeave={handleCanvasMouseUp}
                />
                <img
                  ref={imageRef}
                  src={photo.url}
                  alt="Source"
                  className="hidden"
                  onLoad={handleImageLoad}
                  crossOrigin="anonymous"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                  Save Overlay
                </Button>
                <Button variant="outline" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" onClick={handleShare}>
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls Panel */}
      <div className="space-y-4">
        {/* Text Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Type className="h-4 w-4" />
              Text Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Font Size: {settings.fontSize}px</Label>
              <Slider
                value={[settings.fontSize]}
                onValueChange={([value]) => updateSetting('fontSize', value)}
                min={12}
                max={72}
                step={1}
              />
            </div>

            <div className="space-y-2">
              <Label>Font Family</Label>
              <Select value={settings.fontFamily} onValueChange={(value) => updateSetting('fontFamily', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Arial">Arial</SelectItem>
                  <SelectItem value="Georgia">Georgia</SelectItem>
                  <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                  <SelectItem value="Helvetica">Helvetica</SelectItem>
                  <SelectItem value="Trebuchet MS">Trebuchet MS</SelectItem>
                  <SelectItem value="Playfair Display">Playfair Display</SelectItem>
                  <SelectItem value="Merriweather">Merriweather</SelectItem>
                  <SelectItem value="Open Sans">Open Sans</SelectItem>
                  <SelectItem value="Lato">Lato</SelectItem>
                  <SelectItem value="Montserrat">Montserrat</SelectItem>
                  <SelectItem value="Roboto">Roboto</SelectItem>
                  <SelectItem value="Poppins">Poppins</SelectItem>
                  <SelectItem value="Dancing Script">Dancing Script</SelectItem>
                  <SelectItem value="Great Vibes">Great Vibes</SelectItem>
                  <SelectItem value="Cinzel">Cinzel</SelectItem>
                  <SelectItem value="Cormorant Garamond">Cormorant Garamond</SelectItem>
                  <SelectItem value="EB Garamond">EB Garamond</SelectItem>
                  <SelectItem value="Crimson Text">Crimson Text</SelectItem>
                  <SelectItem value="Source Sans Pro">Source Sans Pro</SelectItem>
                  <SelectItem value="Nunito">Nunito</SelectItem>
                  <SelectItem value="Inter">Inter</SelectItem>
                  <SelectItem value="Raleway">Raleway</SelectItem>
                  <SelectItem value="Oswald">Oswald</SelectItem>
                  <SelectItem value="Abril Fatface">Abril Fatface</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Font Weight</Label>
              <Select value={settings.fontWeight} onValueChange={(value: 'normal' | 'bold') => updateSetting('fontWeight', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="bold">Bold</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Text Alignment</Label>
              <Select value={settings.textAlign} onValueChange={(value: 'left' | 'center' | 'right') => updateSetting('textAlign', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Max Width: {settings.maxWidth}%</Label>
              <Slider
                value={[settings.maxWidth]}
                onValueChange={([value]) => updateSetting('maxWidth', value)}
                min={20}
                max={100}
                step={5}
              />
            </div>
          </CardContent>
        </Card>

        {/* Color Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Palette className="h-4 w-4" />
              Colors & Background
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Text Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="color"
                  value={settings.textColor}
                  onChange={(e) => updateSetting('textColor', e.target.value)}
                  className="w-16 h-10 p-1 border rounded"
                />
                <Input
                  value={settings.textColor}
                  onChange={(e) => updateSetting('textColor', e.target.value)}
                  placeholder="#ffffff"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Background Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(e) => updateSetting('backgroundColor', e.target.value)}
                  className="w-16 h-10 p-1 border rounded"
                />
                <Input
                  value={settings.backgroundColor}
                  onChange={(e) => updateSetting('backgroundColor', e.target.value)}
                  placeholder="#000000"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Background Opacity: {Math.round(settings.backgroundOpacity * 100)}%</Label>
              <Slider
                value={[settings.backgroundOpacity]}
                onValueChange={([value]) => updateSetting('backgroundOpacity', value)}
                min={0}
                max={1}
                step={0.1}
              />
            </div>
          </CardContent>
        </Card>

        {/* Layout Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Settings className="h-4 w-4" />
              Layout
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Padding: {settings.padding}px</Label>
              <Slider
                value={[settings.padding]}
                onValueChange={([value]) => updateSetting('padding', value)}
                min={0}
                max={50}
                step={5}
              />
            </div>

            <div className="space-y-2">
              <Label>Border Radius: {settings.borderRadius}px</Label>
              <Slider
                value={[settings.borderRadius]}
                onValueChange={([value]) => updateSetting('borderRadius', value)}
                min={0}
                max={30}
                step={1}
              />
            </div>

            <Separator />
            
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Drag the text on the image to reposition it</Label>
              <div className="text-xs text-muted-foreground">
                Position: {settings.textX.toFixed(0)}%, {settings.textY.toFixed(0)}%
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preview Info */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <Badge variant="outline" className="w-full justify-center">
                {verse ? `${verse.book} ${verse.chapter}:${verse.verse}` : 'Custom Text'}
              </Badge>
              <p className="text-xs text-muted-foreground line-clamp-3">
                {verseText}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};