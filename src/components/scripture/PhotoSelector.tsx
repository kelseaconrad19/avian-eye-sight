import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PhotoItem } from '@/types/scripture';
import { Search, Image, Upload } from 'lucide-react';

interface PhotoSelectorProps {
  onPhotoSelected: (photo: PhotoItem) => void;
}

export const PhotoSelector: React.FC<PhotoSelectorProps> = ({ onPhotoSelected }) => {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to access your photos.",
          variant: "destructive",
        });
        return;
      }

      // Try to load from both 'photos' and 'user-uploads' buckets
      const buckets = ['photos', 'user-uploads'];
      let allPhotos: PhotoItem[] = [];

      for (const bucketName of buckets) {
        const { data: files, error } = await supabase.storage
          .from(bucketName)
          .list(user.id, {
            limit: 100,
            sortBy: { column: 'created_at', order: 'desc' }
          });

        if (!error && files) {
          const bucketPhotos = await Promise.all(
            files
              .filter(file => file.name.match(/\.(jpg|jpeg|png|webp)$/i))
              .map(async (file) => {
                const { data } = supabase.storage
                  .from(bucketName)
                  .getPublicUrl(`${user.id}/${file.name}`);
                
                return {
                  name: file.name,
                  url: data.publicUrl,
                  created_at: file.created_at || new Date().toISOString()
                };
              })
          );
          allPhotos = [...allPhotos, ...bucketPhotos];
        }
      }

      // Sort by created_at descending
      allPhotos.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setPhotos(allPhotos);

    } catch (error) {
      console.error('Error loading photos:', error);
      toast({
        title: "Error loading photos",
        description: "Could not load your photos. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredPhotos = photos.filter(photo =>
    photo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Select Your Photo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="h-5 w-5" />
          Select Your Bird Photo
        </CardTitle>
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search photos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Badge variant="secondary">{filteredPhotos.length} photos</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {filteredPhotos.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">No photos found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'Try a different search term or ' : ''}
                Upload some bird photos first to create scripture overlays.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredPhotos.map((photo, index) => (
              <div
                key={index}
                className="group cursor-pointer relative aspect-square rounded-lg overflow-hidden bg-muted hover:ring-2 hover:ring-primary transition-all"
                onClick={() => onPhotoSelected(photo)}
              >
                <img
                  src={photo.url}
                  alt={photo.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-end p-2">
                  <p className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity truncate">
                    {photo.name.replace(/\.[^/.]+$/, "")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};