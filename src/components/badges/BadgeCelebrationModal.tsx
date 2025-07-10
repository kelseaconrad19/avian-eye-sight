import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BadgeDefinition } from '@/types/badges';
import { Share, Trophy } from 'lucide-react';
import { getBadgeIcon } from '@/components/badges/BadgeIcon';

interface BadgeCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  badges: BadgeDefinition[];
}

export const BadgeCelebrationModal: React.FC<BadgeCelebrationModalProps> = ({
  isOpen,
  onClose,
  badges
}) => {
  if (badges.length === 0) return null;

  const handleShare = async (badge: BadgeDefinition) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `🎉 I earned the "${badge.title}" badge!`,
          text: `${badge.description} Check out my bird watching achievements!`,
          url: window.location.origin
        });
      } else {
        // Fallback to clipboard
        const text = `🎉 I earned the "${badge.title}" badge! ${badge.description}`;
        await navigator.clipboard.writeText(text);
        alert('Badge shared to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing badge:', error);
    }
  };

  const currentBadge = badges[0]; // Show first badge, could cycle through multiple

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-md mx-auto text-center">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary flex items-center justify-center gap-2">
            <Trophy className="h-6 w-6" />
            Badge Earned!
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-6 space-y-4">
          {/* Confetti effect - using CSS animation */}
          <div className="relative">
            <div className="confetti-animation absolute inset-0 pointer-events-none">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="confetti-particle"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b'][Math.floor(Math.random() * 5)]
                  }}
                />
              ))}
            </div>
            
            {/* Badge display */}
            <div className="relative z-10 flex flex-col items-center space-y-4">
              <div className="p-6 bg-primary/10 rounded-full">
                {getBadgeIcon(currentBadge.iconName, 'h-16 w-16 text-primary')}
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">{currentBadge.title}</h3>
                <p className="text-muted-foreground">{currentBadge.description}</p>
                
                {badges.length > 1 && (
                  <Badge variant="secondary">
                    +{badges.length - 1} more badge{badges.length > 2 ? 's' : ''}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3 justify-center">
          <Button
            variant="outline"
            onClick={() => handleShare(currentBadge)}
            className="flex items-center gap-2"
          >
            <Share className="h-4 w-4" />
            Share
          </Button>
          <Button onClick={onClose}>
            Got it!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};