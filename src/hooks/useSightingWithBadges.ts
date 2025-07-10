import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useBadgeEngine } from './useBadgeEngine';
import { BadgeDefinition, UserProfile, SightingData } from '@/types/badges';

export const useSightingWithBadges = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newBadges, setNewBadges] = useState<BadgeDefinition[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { checkAndAwardBadges } = useBadgeEngine();

  const createSighting = useCallback(async (sightingData: SightingData): Promise<boolean> => {
    setIsSubmitting(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Handle auth error - could show a different modal if needed
        console.error('Authentication required');
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

      // Haptic feedback for mobile
      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate([100, 50, 100]); // Success pattern
      }

      // Show success modal
      setShowSuccess(true);

      return true;
    } catch (error) {
      console.error('Error creating sighting:', error);
      // Handle error - could show error modal if needed
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [checkAndAwardBadges]);

  const closeCelebration = useCallback(() => {
    setShowCelebration(false);
    setNewBadges([]);
  }, []);

  const closeSuccess = useCallback(() => {
    setShowSuccess(false);
  }, []);

  return {
    createSighting,
    isSubmitting,
    newBadges,
    showCelebration,
    closeCelebration,
    showSuccess,
    closeSuccess
  };
};