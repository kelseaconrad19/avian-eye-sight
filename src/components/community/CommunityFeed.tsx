
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Bird, Heart, MessageCircle, Share } from "lucide-react";
import { cn } from "@/lib/utils";
import { SightingData } from "../sightings/SightingForm";

interface CommunitySighting extends SightingData {
  userId: string;
  userName: string;
  userAvatar?: string;
  likes: number;
  comments: number;
  timestamp: Date;
  userLiked?: boolean;
}

interface CommunityFeedProps {
  sightings: CommunitySighting[];
}

export function CommunityFeed({ sightings }: CommunityFeedProps) {
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  const handleLike = (id: string) => {
    setLikedPosts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (sightings.length === 0) {
    return (
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-center">Community Feed</CardTitle>
          <CardDescription className="text-center">
            No community sightings available yet. Be the first to share your sighting!
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <Bird className="h-16 w-16 text-muted-foreground opacity-30" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {sightings.map((sighting) => {
        const isLiked = likedPosts[sighting.id] || sighting.userLiked || false;
        return (
          <Card key={sighting.id} className="card-shadow overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={sighting.userAvatar} />
                  <AvatarFallback>
                    {sighting.userName.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base font-medium">
                    {sighting.userName}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {format(sighting.timestamp, "MMM d, yyyy • h:mm a")}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-3 space-y-3">
              <div className="space-y-1">
                <p className="font-medium text-base">
                  Spotted a {sighting.birdInfo.name} at {sighting.location}
                </p>
                <p className="text-sm italic text-muted-foreground">
                  {sighting.birdInfo.scientificName}
                </p>
              </div>

              {sighting.birdInfo.imageUrl && (
                <img
                  src={sighting.birdInfo.imageUrl}
                  alt={sighting.birdInfo.name}
                  className="w-full h-64 object-cover rounded-md"
                />
              )}

              {sighting.notes && (
                <p className="text-sm">{sighting.notes}</p>
              )}

              <div className="flex justify-between items-center pt-2 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "space-x-1 font-normal",
                    isLiked && "text-primary"
                  )}
                  onClick={() => handleLike(sighting.id)}
                >
                  <Heart
                    className={cn("h-4 w-4", isLiked && "fill-primary")}
                  />
                  <span>{sighting.likes + (isLiked && !sighting.userLiked ? 1 : 0)}</span>
                </Button>
                <Button variant="ghost" size="sm" className="space-x-1 font-normal">
                  <MessageCircle className="h-4 w-4" />
                  <span>{sighting.comments}</span>
                </Button>
                <Button variant="ghost" size="sm" className="space-x-1 font-normal">
                  <Share className="h-4 w-4" />
                  <span>Share</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
