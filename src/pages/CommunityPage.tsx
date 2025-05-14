
import { useEffect, useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { CommunityFeed } from "@/components/community/CommunityFeed";
import { getMockCommunityData } from "@/services/communityService";

export function CommunityPage() {
  const [communitySightings, setCommunitySightings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMockCommunityData();
        setCommunitySightings(data);
      } catch (error) {
        console.error("Failed to fetch community data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  return (
    <PageContainer title="Community Sightings">
      {isLoading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="rounded-lg bg-card p-6 animate-pulse">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-muted"></div>
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-muted rounded"></div>
                  <div className="h-3 w-32 bg-muted rounded"></div>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="h-5 w-3/4 bg-muted rounded"></div>
                <div className="h-4 w-1/2 bg-muted rounded"></div>
              </div>
              <div className="h-48 bg-muted rounded mb-4"></div>
              <div className="h-4 bg-muted rounded w-full mb-4"></div>
              <div className="flex justify-between">
                <div className="h-8 w-16 bg-muted rounded"></div>
                <div className="h-8 w-16 bg-muted rounded"></div>
                <div className="h-8 w-16 bg-muted rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <CommunityFeed sightings={communitySightings} />
      )}
    </PageContainer>
  );
}
