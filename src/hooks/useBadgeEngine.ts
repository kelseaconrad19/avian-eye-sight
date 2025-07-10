import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BADGE_DEFINITIONS, getBadgeById } from '@/constants/badges';
import { BadgeDefinition, UserProfile, SightingData } from '@/types/badges';
import { useToast } from '@/hooks/use-toast';

export const useBadgeEngine = () => {
  const [isChecking, setIsChecking] = useState(false);
  const { toast } = useToast();

  const checkAndAwardBadges = useCallback(async (
    userProfile: UserProfile,
    newSighting: SightingData
  ): Promise<BadgeDefinition[]> => {
    setIsChecking(true);
    
    try {
      // Fetch all user's sightings including the new one
      const { data: sightings, error } = await supabase
        .from('user_sightings')
        .select(`
          id, 
          location, 
          notes, 
          sighting_date,
          image_url,
          bird_species:bird_species_id (
            id, 
            name, 
            scientific_name, 
            description, 
            image_url, 
            confidence
          )
        `)
        .eq('user_id', userProfile.user_id)
        .order('sighting_date', { ascending: false });

      if (error) {
        console.error('Error fetching sightings:', error);
        return [];
      }

      // Transform sightings data
      const transformedSightings: SightingData[] = sightings.map(item => ({
        id: item.id,
        birdInfo: {
          name: item.bird_species?.name || 'Unknown',
          scientificName: item.bird_species?.scientific_name || 'Unknown',
          description: item.bird_species?.description || '',
          imageUrl: item.bird_species?.image_url || item.image_url,
          confidence: item.bird_species?.confidence,
        },
        date: new Date(item.sighting_date || new Date()),
        location: item.location || '',
        notes: item.notes || '',
        user_id: userProfile.user_id
      }));

      // Check which badges are newly earned
      const currentBadges = new Set(userProfile.badges);
      const newlyEarnedBadges: BadgeDefinition[] = [];

      for (const badgeDefinition of BADGE_DEFINITIONS) {
        // Skip if user already has this badge
        if (currentBadges.has(badgeDefinition.id)) {
          continue;
        }

        // Check if the badge should be awarded
        if (badgeDefinition.predicate(userProfile, transformedSightings, newSighting)) {
          newlyEarnedBadges.push(badgeDefinition);
        }
      }

      // Update user profile with new badges
      if (newlyEarnedBadges.length > 0) {
        const updatedBadges = [...userProfile.badges, ...newlyEarnedBadges.map(b => b.id)];
        
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ badges: updatedBadges })
          .eq('user_id', userProfile.user_id);

        if (updateError) {
          console.error('Error updating badges:', updateError);
          toast({
            title: "Error updating badges",
            description: "There was a problem saving your new badges.",
            variant: "destructive",
          });
          return [];
        }
      }

      return newlyEarnedBadges;
    } catch (error) {
      console.error('Error in badge engine:', error);
      return [];
    } finally {
      setIsChecking(false);
    }
  }, [toast]);

  return {
    checkAndAwardBadges,
    isChecking
  };
};