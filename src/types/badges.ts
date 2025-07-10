export interface BadgeDefinition {
  id: string;
  title: string;
  description: string;
  iconName: string;
  isSecret: boolean;
  predicate: (profile: UserProfile, sightings: SightingData[], newSighting: SightingData) => boolean;
}

export interface UserProfile {
  id: string;
  user_id: string;
  display_name?: string;
  badges: string[];
  created_at: string;
  updated_at: string;
}

export interface SightingData {
  id: string;
  birdInfo: {
    name: string;
    scientificName: string;
    description: string;
    imageUrl?: string;
    confidence?: number;
  };
  date: Date;
  location: string;
  notes?: string;
  user_id?: string;
  uploadedImage?: string; // Add uploaded image field
}