import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BadgeDefinition } from '@/types/badges';
import { getBadgeIcon } from './BadgeIcon';
import { Lock } from 'lucide-react';

interface BadgeCardProps {
  badge: BadgeDefinition;
  isEarned: boolean;
  onTap: (badge: BadgeDefinition) => void;
}

export const BadgeCard: React.FC<BadgeCardProps> = ({ badge, isEarned, onTap }) => {
  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
        isEarned ? 'bg-background border-primary/20' : 'bg-muted/50 border-muted'
      }`}
      onClick={() => onTap(badge)}
    >
      <CardContent className="p-4 text-center space-y-3">
        <div className={`mx-auto w-12 h-12 flex items-center justify-center rounded-full ${
          isEarned ? 'bg-primary/10' : 'bg-muted'
        }`}>
          {isEarned ? (
            getBadgeIcon(badge.iconName, `h-6 w-6 ${isEarned ? 'text-primary' : 'text-muted-foreground'}`)
          ) : badge.isSecret ? (
            <Lock className="h-6 w-6 text-muted-foreground" />
          ) : (
            getBadgeIcon(badge.iconName, 'h-6 w-6 text-muted-foreground')
          )}
        </div>
        
        <div className="space-y-1">
          <h3 className={`font-medium text-sm ${
            isEarned ? 'text-foreground' : 'text-muted-foreground'
          }`}>
            {badge.isSecret && !isEarned ? '???' : badge.title}
          </h3>
          
          {isEarned && (
            <Badge variant="secondary" className="text-xs">
              Earned
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};