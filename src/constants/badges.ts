import { BadgeDefinition, UserProfile, SightingData } from '@/types/badges';

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: 'first_sighting',
    title: 'First Flight',
    description: 'Recorded your very first bird sighting!',
    iconName: 'Award',
    isSecret: false,
    predicate: (profile: UserProfile, sightings: SightingData[], newSighting: SightingData) => {
      return sightings.length === 1;
    }
  },
  {
    id: 'ten_species',
    title: 'Species Explorer',
    description: 'Discovered 10 different bird species!',
    iconName: 'Target',
    isSecret: false,
    predicate: (profile: UserProfile, sightings: SightingData[], newSighting: SightingData) => {
      const uniqueSpecies = new Set(sightings.map(s => s.birdInfo.scientificName));
      return uniqueSpecies.size >= 10;
    }
  },
  {
    id: 'early_bird',
    title: 'Early Bird',
    description: 'Caught a bird between 5 AM and 8 AM!',
    iconName: 'Sunrise',
    isSecret: false,
    predicate: (profile: UserProfile, sightings: SightingData[], newSighting: SightingData) => {
      const hour = newSighting.date.getHours();
      return hour >= 5 && hour < 8;
    }
  },
  {
    id: 'weekend_warrior',
    title: 'Weekend Warrior',
    description: 'Recorded 5 sightings on weekends!',
    iconName: 'Calendar',
    isSecret: false,
    predicate: (profile: UserProfile, sightings: SightingData[], newSighting: SightingData) => {
      const weekendSightings = sightings.filter(s => {
        const day = s.date.getDay();
        return day === 0 || day === 6; // Sunday or Saturday
      });
      return weekendSightings.length >= 5;
    }
  },
  {
    id: 'dedicated_observer',
    title: 'Dedicated Observer',
    description: 'Recorded sightings for 7 consecutive days!',
    iconName: 'Eye',
    isSecret: false,
    predicate: (profile: UserProfile, sightings: SightingData[], newSighting: SightingData) => {
      if (sightings.length < 7) return false;
      
      const sortedDates = sightings
        .map(s => s.date.toDateString())
        .sort()
        .filter((date, index, arr) => arr.indexOf(date) === index); // Remove duplicates
      
      let consecutiveDays = 1;
      let maxConsecutive = 1;
      
      for (let i = 1; i < sortedDates.length; i++) {
        const currentDate = new Date(sortedDates[i]);
        const previousDate = new Date(sortedDates[i - 1]);
        const dayDiff = Math.floor((currentDate.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (dayDiff === 1) {
          consecutiveDays++;
          maxConsecutive = Math.max(maxConsecutive, consecutiveDays);
        } else {
          consecutiveDays = 1;
        }
      }
      
      return maxConsecutive >= 7;
    }
  },
  {
    id: 'night_owl',
    title: 'Night Owl',
    description: 'Spotted a bird after 9 PM - impressive dedication!',
    iconName: 'Moon',
    isSecret: true,
    predicate: (profile: UserProfile, sightings: SightingData[], newSighting: SightingData) => {
      const hour = newSighting.date.getHours();
      return hour >= 21; // 9 PM or later
    }
  }
];

// Cache for badge definitions
export const getBadgeDefinitions = (): BadgeDefinition[] => {
  return BADGE_DEFINITIONS;
};

export const getBadgeById = (id: string): BadgeDefinition | undefined => {
  return BADGE_DEFINITIONS.find(badge => badge.id === id);
};