import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useBadgeEngine } from './useBadgeEngine';
import { BadgeDefinition, UserProfile, SightingData } from '@/types/badges';
import { useToast } from '@/hooks/use-toast';

export const useSightingWithBadges = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newBadges, setNewBadges] = useState<BadgeDefinition[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const { checkAndAwardBadges } = useBadgeEngine();
  const { toast } = useToast();

  const createSighting = useCallback(async (sightingData: SightingData): Promise<boolean> => {
    setIsSubmitting(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to save sightings.",
          variant: "destructive",
        });
        return false;
      }

      // First, create or get the bird species
      const { data: existingSpecies, error: speciesError } = await supabase
        .from('bird_species')
        .select('id')
        .eq('scientific_name', sightingData.birdInfo.scientificName)
        .maybeSingle();

      let speciesId;
      
      if (existingSpecies) {
        speciesId = existingSpecies.id;
      } else {
        // Create new species
        const { data: newSpecies, error: createSpeciesError } = await supabase
          .from('bird_species')
          .insert({
            name: sightingData.birdInfo.name,
            scientific_name: sightingData.birdInfo.scientificName,
            description: sightingData.birdInfo.description,
            image_url: sightingData.birdInfo.imageUrl,
            confidence: sightingData.birdInfo.confidence
          })
          .select('id')
          .single();

        if (createSpeciesError) {
          console.error('Error creating species:', createSpeciesError);
          throw createSpeciesError;
        }
        
        speciesId = newSpecies.id;
      }

      // Create the sighting
      const { data: newSighting, error: sightingError } = await supabase
        .from('user_sightings')
        .insert({
          user_id: user.id,
          bird_species_id: speciesId,
          sighting_date: sightingData.date.toISOString(),
          location: sightingData.location,
          notes: sightingData.notes,
          image_url: sightingData.uploadedImage || sightingData.birdInfo.imageUrl // Use uploaded image if available
        })
        .select()
        .single();

      if (sightingError) {
        console.error('Error creating sighting:', sightingError);
        throw sightingError;
      }

      // Get user profile for badge checking
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        // Don't fail the sighting creation if badge checking fails
      } else if (profile) {
        // Check for new badges
        const earnedBadges = await checkAndAwardBadges(profile, sightingData);
        
        if (earnedBadges.length > 0) {
          setNewBadges(earnedBadges);
          setShowCelebration(true);
        }
      }

      toast({
        title: "Sighting saved!",
        description: "Your bird sighting has been added to your collection.",
      });

      return true;
    } catch (error) {
      console.error('Error creating sighting:', error);
      toast({
        title: "Error saving sighting",
        description: "There was a problem saving your sighting. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [checkAndAwardBadges, toast]);

  const closeCelebration = useCallback(() => {
    setShowCelebration(false);
    setNewBadges([]);
  }, []);

  return {
    createSighting,
    isSubmitting,
    newBadges,
    showCelebration,
    closeCelebration
  };
};