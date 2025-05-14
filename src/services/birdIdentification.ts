
import { BirdInfo } from "@/components/bird-identification/BirdResult";
import { birdDatabase } from "./mockData";

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
export const identifyBird = async (imageData: string) => {
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
