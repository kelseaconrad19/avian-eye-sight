import React from 'react';
import { 
  Award, 
  Target, 
  Sunrise, 
  Calendar, 
  Eye, 
  Moon,
  Trophy,
  Star,
  Crown,
  Shield
} from 'lucide-react';

const iconMap = {
  Award: Award,
  Target: Target,
  Sunrise: Sunrise,
  Calendar: Calendar,
  Eye: Eye,
  Moon: Moon,
  Trophy: Trophy,
  Star: Star,
  Crown: Crown,
  Shield: Shield
};

export const getBadgeIcon = (iconName: string, className?: string) => {
  const IconComponent = iconMap[iconName as keyof typeof iconMap] || Award;
  return <IconComponent className={className} />;
};