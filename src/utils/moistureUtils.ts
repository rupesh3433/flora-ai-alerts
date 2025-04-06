
import { DropletIcon, AlertCircle, CloudRain, SunIcon } from 'lucide-react';

/**
 * Returns the appropriate action based on moisture status
 */
export const getMoistureAction = (moistureStatus: string) => {
  switch(moistureStatus.toLowerCase()) {
    case 'dry':
      return {
        icon: DropletIcon,
        text: 'Water immediately',
        variant: 'destructive'
      };
    case 'slightly moist':
      return {
        icon: DropletIcon,
        text: 'Water soon',
        variant: 'default'
      };
    case 'moist':
      return {
        icon: SunIcon,
        text: 'No action needed',
        variant: 'default'
      };
    case 'wet':
      return {
        icon: SunIcon,
        text: 'Allow to dry',
        variant: 'default'
      };
    default:
      return {
        icon: DropletIcon,
        text: 'Check plant',
        variant: 'default'
      };
  }
};

/**
 * Returns the appropriate icon for recommendation based on moisture status
 */
export const getRecommendationIcon = (moistureStatus: string) => {
  switch(moistureStatus.toLowerCase()) {
    case 'dry':
      return AlertCircle;
    case 'slightly moist':
      return DropletIcon;
    case 'moist':
      return SunIcon;
    case 'wet':
      return CloudRain;
    default:
      return AlertCircle;
  }
};

/**
 * Formats timestamps for notifications
 */
export const formatTimeForReminder = (time: Date) => {
  return time.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
};
