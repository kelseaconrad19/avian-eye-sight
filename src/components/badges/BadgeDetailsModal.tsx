import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { BadgeDefinition } from '@/types/badges';
import { getBadgeIcon } from './BadgeIcon';
import { Lock } from 'lucide-react';

interface BadgeDetailsModalProps {
  badge: BadgeDefinition | null;
  isEarned: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export const BadgeDetailsModal: React.FC<BadgeDetailsModalProps> = ({
  badge,
  isEarned,
  isOpen,
  onClose
}) => {
  if (!badge) return null;

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-md mx-auto text-center">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {badge.isSecret && !isEarned ? 'Secret Badge' : badge.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-6 space-y-4">
          <div className={`mx-auto w-20 h-20 flex items-center justify-center rounded-full ${
            isEarned ? 'bg-primary/10' : 'bg-muted'
          }`}>
            {isEarned ? (
              getBadgeIcon(badge.iconName, 'h-10 w-10 text-primary')
            ) : badge.isSecret ? (
              <Lock className="h-10 w-10 text-muted-foreground" />
            ) : (
              getBadgeIcon(badge.iconName, 'h-10 w-10 text-muted-foreground')
            )}
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">
              {badge.isSecret && !isEarned ? '???' : badge.title}
            </h3>
            
            <p className="text-muted-foreground">
              {badge.isSecret && !isEarned 
                ? 'This is a secret badge. Keep exploring to unlock it!'
                : badge.description
              }
            </p>
            
            <div className="flex justify-center">
              <Badge variant={isEarned ? "default" : "secondary"}>
                {isEarned ? "Earned" : "Not Earned"}
              </Badge>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};