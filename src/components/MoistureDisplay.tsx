
import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { DropletIcon } from 'lucide-react';

interface MoistureDisplayProps {
  moistureScore: number;
  moistureStatus: string;
}

const MoistureDisplay: React.FC<MoistureDisplayProps> = ({ 
  moistureScore, 
  moistureStatus 
}) => {
  // Convert the moisture score to a percentage (assuming scale of 0-10)
  const normalizedScore = Math.min(Math.max(moistureScore, 0), 10);
  const moisturePercentage = (normalizedScore / 10) * 100;
  
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    // Animate the progress
    const timer = setTimeout(() => {
      setProgress(moisturePercentage);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [moisturePercentage]);
  
  // Determine color based on moisture status
  const getStatusColor = () => {
    switch(moistureStatus.toLowerCase()) {
      case 'dry':
        return 'text-red-500';
      case 'slightly moist':
        return 'text-yellow-500';
      case 'moist':
        return 'text-green-500';
      case 'wet':
        return 'text-blue-500';
      default:
        return 'text-primary';
    }
  };
  
  // Determine icon size based on moisture status
  const getDropletSize = () => {
    switch(moistureStatus.toLowerCase()) {
      case 'dry':
        return [16, 16, 16, 16, 16];
      case 'slightly moist':
        return [16, 16, 16, 24, 24];
      case 'moist':
        return [16, 24, 24, 24, 32];
      case 'wet':
        return [24, 24, 32, 32, 32];
      default:
        return [16, 16, 24, 24, 32];
    }
  };
  
  const dropletSizes = getDropletSize();
  
  return (
    <div className="moisture-gauge">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium">Soil Moisture Level</h3>
        <span className={`font-semibold ${getStatusColor()}`}>{moistureStatus}</span>
      </div>
      
      <div className="relative mb-8">
        <Progress 
          value={progress} 
          className="h-4 moisture-bar"
        />
        <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-xs text-muted-foreground">
          <span>Dry</span>
          <span>Low</span>
          <span>Moderate</span>
          <span>Good</span>
          <span>Wet</span>
        </div>
      </div>
      
      <div className="mt-8 bg-muted/40 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <div className="text-sm">
            <p className="font-medium text-foreground">Moisture Score</p>
            <p className="text-2xl font-bold">{moistureScore.toFixed(1)}/10</p>
          </div>
          <div className="flex items-end gap-1">
            {dropletSizes.map((size, i) => (
              <DropletIcon 
                key={i} 
                size={size} 
                className={`${getStatusColor()} ${size > 20 ? 'opacity-100' : 'opacity-30'}`}
                fill={size > 20 ? 'currentColor' : 'none'}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoistureDisplay;
