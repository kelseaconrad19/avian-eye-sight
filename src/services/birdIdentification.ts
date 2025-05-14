
import { supabase } from "@/integrations/supabase/client";
import { BirdInfo } from "@/components/bird-identification/BirdResult";

// Function to call our Supabase Edge Function for bird identification
export const identifyBird = async (imageData: string): Promise<BirdInfo> => {
  try {
    // Strip the data:image prefix if present
    const base64Image = imageData.includes('base64,') 
      ? imageData.split('base64,')[1] 
      : imageData;
    
    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('identify-bird', {
      body: { image: imageData },
    });

    if (error) {
      console.error('Error identifying bird:', error);
      throw new Error('Failed to identify bird');
    }

    // Store the identified bird in our database for future reference
    if (data) {
      await storeBirdSpecies(data);
    }

    return {
      name: data.name,
      scientificName: data.scientific_name,
      description: data.description,
      confidence: data.confidence,
      imageUrl: data.image_url,
    };
  } catch (error) {
    console.error('Error identifying bird:', error);
    throw error;
  }
};

// Store the identified bird species in our database
async function storeBirdSpecies(birdData: any) {
  try {
    const { error } = await supabase
      .from('bird_species')
      .upsert(
        {
          name: birdData.name,
          scientific_name: birdData.scientific_name,
          description: birdData.description,
          image_url: birdData.image_url,
          confidence: birdData.confidence
        },
        { onConflict: 'name' }
      );

    if (error) {
      console.error('Error storing bird species:', error);
    }
  } catch (error) {
    console.error('Error storing bird species:', error);
  }
}

// Mock function to simulate bird identification API
export const mockIdentifyBird = async (imageData: string): Promise<BirdInfo> => {
  // This function is kept for backward compatibility but now delegates to the real API
  return identifyBird(imageData);
};

// This would be the real API call in a production app - kept for reference
export const identifyBirdOld = async (imageData: string) => {
  // This function is deprecated and kept for reference
  return identifyBird(imageData);
};
