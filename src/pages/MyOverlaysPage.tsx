import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { 
  Download, 
  Share2, 
  Trash2, 
  BookOpen, 
  Calendar,
  Image,
  Loader2
} from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface SavedOverlay {
  id: string;
  title: string | null;
  edited_image_url: string | null;
  original_image_url: string;
  custom_verse_text: string | null;
  created_at: string;
  updated_at: string;
  verse_id: string | null;
  bible_verses?: {
    book: string;
    chapter: number;
    verse: number;
    text: string;
    version: string;
  } | null;
}

export function MyOverlaysPage() {
  const [overlays, setOverlays] = useState<SavedOverlay[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [overlayToDelete, setOverlayToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadOverlays();
  }, []);

  const loadOverlays = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to view your overlays.",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('scripture_overlays')
        .select(`
          id,
          title,
          edited_image_url,
          original_image_url,
          custom_verse_text,
          created_at,
          updated_at,
          verse_id,
          bible_verses:verse_id (
            book,
            chapter,
            verse,
            text,
            version
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading overlays:', error);
        throw error;
      }

      setOverlays(data || []);
    } catch (error) {
      console.error('Error loading overlays:', error);
      toast({
        title: "Error loading overlays",
        description: "Could not load your saved overlays. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (overlay: SavedOverlay) => {
    if (!overlay.edited_image_url) return;

    const link = document.createElement('a');
    link.download = `${overlay.title || 'scripture-overlay'}-${format(new Date(overlay.created_at), 'yyyy-MM-dd')}.jpg`;
    link.href = overlay.edited_image_url;
    link.click();
  };

  const handleShare = async (overlay: SavedOverlay) => {
    if (!overlay.edited_image_url) return;

    try {
      // Fetch the image as a blob
      const response = await fetch(overlay.edited_image_url);
      const blob = await response.blob();

      const verseText = overlay.bible_verses 
        ? overlay.bible_verses.text 
        : overlay.custom_verse_text || '';

      if (navigator.share && navigator.canShare?.({ files: [new File([blob], 'scripture-overlay.jpg', { type: 'image/jpeg' })] })) {
        await navigator.share({
          title: overlay.title || 'Scripture Overlay',
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
    } catch (error) {
      console.error('Error sharing:', error);
      toast({
        title: "Error sharing",
        description: "Could not share the image. Try downloading instead.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!overlayToDelete) return;

    setDeletingId(overlayToDelete);
    try {
      const { error } = await supabase
        .from('scripture_overlays')
        .delete()
        .eq('id', overlayToDelete);

      if (error) throw error;

      setOverlays(prev => prev.filter(overlay => overlay.id !== overlayToDelete));
      toast({
        title: "Overlay deleted",
        description: "The scripture overlay has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting overlay:', error);
      toast({
        title: "Error deleting overlay",
        description: "Could not delete the overlay. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
      setOverlayToDelete(null);
    }
  };

  if (loading) {
    return (
      <PageContainer title="My Scripture Overlays">
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PageContainer>
    );
  }

  if (overlays.length === 0) {
    return (
      <PageContainer title="My Scripture Overlays">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">No Overlays Yet</CardTitle>
          </CardHeader>
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground mb-6">
              You haven't created any scripture overlays yet. Start by creating your first one!
            </p>
            <Button asChild>
              <a href="/scripture">Create Scripture Overlay</a>
            </Button>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="My Scripture Overlays">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            {overlays.length} saved overlay{overlays.length !== 1 ? 's' : ''}
          </p>
          <Button asChild variant="outline">
            <a href="/scripture">Create New Overlay</a>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {overlays.map((overlay) => (
            <Card key={overlay.id} className="overflow-hidden">
              {overlay.edited_image_url && (
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={overlay.edited_image_url}
                    alt={overlay.title || 'Scripture Overlay'}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-sm line-clamp-1">
                    {overlay.title || 'Untitled Overlay'}
                  </CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    <Calendar className="h-3 w-3 mr-1" />
                    {format(new Date(overlay.created_at), 'MMM d')}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {overlay.bible_verses ? (
                    <div className="text-sm">
                      <p className="font-medium text-xs text-muted-foreground mb-1">
                        {overlay.bible_verses.book} {overlay.bible_verses.chapter}:{overlay.bible_verses.verse}
                      </p>
                      <p className="line-clamp-2 text-xs leading-relaxed">
                        {overlay.bible_verses.text}
                      </p>
                    </div>
                  ) : overlay.custom_verse_text ? (
                    <div className="text-sm">
                      <p className="font-medium text-xs text-muted-foreground mb-1">Custom Verse</p>
                      <p className="line-clamp-2 text-xs leading-relaxed">
                        {overlay.custom_verse_text}
                      </p>
                    </div>
                  ) : null}
                  
                  <div className="flex items-center gap-1 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownload(overlay)}
                      className="flex-1 h-8 text-xs"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleShare(overlay)}
                      className="flex-1 h-8 text-xs"
                    >
                      <Share2 className="h-3 w-3 mr-1" />
                      Share
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setOverlayToDelete(overlay.id)}
                      disabled={deletingId === overlay.id}
                      className="h-8 px-2"
                    >
                      {deletingId === overlay.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Trash2 className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <AlertDialog open={!!overlayToDelete} onOpenChange={() => setOverlayToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Scripture Overlay</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this scripture overlay? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageContainer>
  );
}