import { supabase } from "@/integrations/supabase/client";
import { BirdInfo } from "@/components/bird-identification/BirdResult";
import { birdDatabase } from "./mockData";

// Function to call our Supabase Edge Function for bird identification
export const identifyBird = async (imageData: string): Promise<BirdInfo> => {
  try {
    // Strip the data:image prefix if present
    const base64Image = imageData.includes('base64,') 
      ? imageData.split('base64,')[1] 
      : imageData;
    
    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('identify-bird', {
      body: { image: base64Image },
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
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Randomly select a bird from our mock database
  const randomIndex = Math.floor(Math.random() * birdDatabase.length);
  const bird = birdDatabase[randomIndex];
  
  // Simulate varying confidence levels
  const confidence = 0.7 + (Math.random() * 0.3); // Between 0.7 and 1.0
  
  return {
    ...bird,
    confidence,
    // In a real app, we might use the actual uploaded image,
    // but for demo purposes we're using the stock image
  };
};

// This would be the real API call in a production app
export const identifyBirdOld = async (imageData: string) => {
  try {
    // Example API call
    // const response = await fetch('https://api.birdidentification.com/identify', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ image: imageData }),
    // });
    // 
    // if (!response.ok) {
    //   throw new Error('Bird identification failed');
    // }
    // 
    // const data = await response.json();
    // return data;
    
    // For now, we'll use our mock implementation
    return mockIdentifyBird(imageData);
  } catch (error) {
    console.error('Error identifying bird:', error);
    throw error;
  }
};
