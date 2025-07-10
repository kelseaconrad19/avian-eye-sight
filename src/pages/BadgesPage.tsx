import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { BadgeCard } from '@/components/badges/BadgeCard';
import { BadgeDetailsModal } from '@/components/badges/BadgeDetailsModal';
import { BADGE_DEFINITIONS } from '@/constants/badges';
import { BadgeDefinition, UserProfile } from '@/types/badges';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Trophy } from 'lucide-react';

export const BadgesPage: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [selectedBadge, setSelectedBadge] = useState<BadgeDefinition | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function loadUserProfile() {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          toast({
            title: "Authentication required",
            description: "Please sign in to view your badges.",
            variant: "destructive",
          });
          return;
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching profile:', error);
          toast({
            title: "Error loading profile",
            description: "Could not load your badge progress.",
            variant: "destructive",
          });
          return;
        }

        if (!profile) {
          // Create profile if it doesn't exist
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              user_id: user.id,
              display_name: user.email,
              badges: []
            })
            .select()
            .single();

          if (createError) {
            console.error('Error creating profile:', createError);
            return;
          }

          setUserProfile(newProfile);
        } else {
          setUserProfile(profile);
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
        toast({
          title: "Error",
          description: "There was a problem loading your profile.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    loadUserProfile();
  }, [toast]);

  const handleBadgeTap = (badge: BadgeDefinition) => {
    setSelectedBadge(badge);
    setIsDetailsModalOpen(true);
  };

  const earnedBadges = userProfile?.badges || [];
  const earnedCount = earnedBadges.length;
  const totalCount = BADGE_DEFINITIONS.length;

  if (loading) {
    return (
      <PageContainer title="My Badges">
        <div className="flex justify-center py-12">
          <div className="animate-pulse space-y-4 w-full max-w-4xl">
            <div className="h-20 bg-muted rounded w-3/4 mx-auto"></div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="My Badges">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Stats */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Trophy className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold">Badge Collection</h2>
          </div>
          <p className="text-muted-foreground">
            You've earned {earnedCount} out of {totalCount} badges
          </p>
          <div className="w-full bg-muted rounded-full h-3 max-w-md mx-auto">
            <div 
              className="bg-primary h-3 rounded-full transition-all duration-500"
              style={{ width: `${(earnedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>

        {/* Badge Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {BADGE_DEFINITIONS.map((badge) => (
            <BadgeCard
              key={badge.id}
              badge={badge}
              isEarned={earnedBadges.includes(badge.id)}
              onTap={handleBadgeTap}
            />
          ))}
        </div>

        {/* Empty state for no badges */}
        {earnedCount === 0 && (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
              <Trophy className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">No badges yet</h3>
              <p className="text-muted-foreground">
                Start recording bird sightings to earn your first badge!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Badge Details Modal */}
      <BadgeDetailsModal
        badge={selectedBadge}
        isEarned={selectedBadge ? earnedBadges.includes(selectedBadge.id) : false}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />
    </PageContainer>
  );
};