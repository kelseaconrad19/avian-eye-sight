import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { BibleVerse } from '@/types/scripture';
import { Search, BookOpen, Edit3, Check } from 'lucide-react';

interface VerseSelectorProps {
  onVerseSelected: (verse: BibleVerse | null, customVerse?: string) => void;
  selectedVerse: BibleVerse | null;
  customVerse: string;
}

export const VerseSelector: React.FC<VerseSelectorProps> = ({ 
  onVerseSelected, 
  selectedVerse, 
  customVerse 
}) => {
  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [customText, setCustomText] = useState(customVerse);
  const [activeTab, setActiveTab] = useState<'browse' | 'custom'>('browse');
  const { toast } = useToast();

  useEffect(() => {
    loadVerses();
  }, []);

  const loadVerses = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bible_verses')
        .select('*')
        .order('book', { ascending: true })
        .order('chapter', { ascending: true })
        .order('verse', { ascending: true });

      if (error) {
        console.error('Error loading verses:', error);
        throw error;
      }

      setVerses(data || []);
    } catch (error) {
      console.error('Error loading verses:', error);
      toast({
        title: "Error loading verses",
        description: "Could not load Bible verses. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredVerses = verses.filter(verse =>
    verse.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    verse.book.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${verse.book} ${verse.chapter}:${verse.verse}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleVerseSelect = (verse: BibleVerse) => {
    onVerseSelected(verse);
  };

  const handleCustomVerseSubmit = () => {
    if (customText.trim()) {
      onVerseSelected(null, customText.trim());
    } else {
      toast({
        title: "Please enter a verse",
        description: "Enter some text to create your custom overlay.",
        variant: "destructive",
      });
    }
  };

  const formatVerseReference = (verse: BibleVerse) => {
    return `${verse.book} ${verse.chapter}:${verse.verse}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Choose Your Scripture
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'browse' | 'custom')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="browse">Browse Verses</TabsTrigger>
            <TabsTrigger value="custom">Custom Text</TabsTrigger>
          </TabsList>
          
          <TabsContent value="browse" className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search verses or references..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Badge variant="secondary">{filteredVerses.length} verses</Badge>
            </div>

            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="p-4 bg-muted rounded-lg animate-pulse">
                    <div className="h-4 bg-muted-foreground/20 rounded w-1/4 mb-2"></div>
                    <div className="h-6 bg-muted-foreground/20 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredVerses.map((verse) => (
                  <div
                    key={verse.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all hover:bg-accent ${
                      selectedVerse?.id === verse.id ? 'ring-2 ring-primary bg-accent' : ''
                    }`}
                    onClick={() => handleVerseSelect(verse)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {formatVerseReference(verse)}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {verse.version}
                          </Badge>
                        </div>
                        <p className="text-sm leading-relaxed">{verse.text}</p>
                      </div>
                      {selectedVerse?.id === verse.id && (
                        <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedVerse && (
              <div className="pt-4 border-t">
                <Button onClick={() => onVerseSelected(selectedVerse)} className="w-full">
                  Continue with Selected Verse
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="custom" className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Enter Your Custom Text</label>
                <Textarea
                  placeholder="Enter any text you'd like to overlay on your photo..."
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>
              
              <Button 
                onClick={handleCustomVerseSubmit}
                disabled={!customText.trim()}
                className="w-full"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Continue with Custom Text
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};