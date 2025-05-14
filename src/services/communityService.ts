
import { birdDatabase, mockUsers } from "./mockData";

export const getMockCommunityData = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Generate fake community data
  const communitySightings = [];
  
  for (let i = 0; i < 6; i++) {
    const randomBirdIndex = Math.floor(Math.random() * birdDatabase.length);
    const randomUserIndex = Math.floor(Math.random() * mockUsers.length);
    
    const bird = birdDatabase[randomBirdIndex];
    const user = mockUsers[randomUserIndex];
    
    // Random date within the last week
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 7));
    
    // Random location
    const locations = [
      "Central Park, New York",
      "Golden Gate Park, San Francisco",
      "Lincoln Park, Chicago",
      "Griffith Park, Los Angeles",
      "Rock Creek Park, Washington DC",
      "Everglades National Park, Florida"
    ];
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];
    
    // Random notes
    const noteOptions = [
      `Spotted during my morning walk. Beautiful!`,
      `Saw this ${bird.name} near the lake. First time seeing one!`,
      `Observed for about 15 minutes while it was feeding.`,
      `Heard its distinctive call first, then saw it perched on a branch.`,
      `Saw a few of these together in a small group.`,
      ``  // Empty notes option
    ];
    const randomNote = noteOptions[Math.floor(Math.random() * noteOptions.length)];
    
    communitySightings.push({
      id: `community-${i}`,
      birdInfo: bird,
      date: date,
      location: randomLocation,
      notes: randomNote,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      likes: Math.floor(Math.random() * 50),
      comments: Math.floor(Math.random() * 10),
      timestamp: date,
      userLiked: Math.random() > 0.7  // 30% chance the user has already liked it
    });
  }
  
  // Sort by date (newest first)
  communitySightings.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  
  return communitySightings;
};
