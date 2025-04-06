
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { DropletIcon, AlertCircle, Bell, SunIcon } from 'lucide-react';
import { toast } from 'sonner';
import { getMoistureAction, getRecommendationIcon } from '@/utils/moistureUtils';

interface RecommendationCardProps {
  recommendation: string;
  moistureStatus: string;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ 
  recommendation, 
  moistureStatus 
}) => {
  const { icon: ActionIcon, text: actionText, variant } = getMoistureAction(moistureStatus);
  const RecommendationIcon = getRecommendationIcon(moistureStatus);
  
  const scheduleReminder = () => {
    // In a real app, this would connect to a notification system
    toast.success("Watering reminder scheduled!", {
      description: "We'll remind you when it's time to water your plant."
    });
  };

  // Determine the severity of the alert
  const getAlertVariant = () => {
    switch(moistureStatus.toLowerCase()) {
      case 'dry':
        return 'destructive';
      case 'slightly moist':
        return 'default';
      case 'moist':
        return 'default';
      case 'wet':
        return 'default';
      default:
        return 'default';
    }
  };
  
  return (
    <div>
      <h3 className="text-lg font-medium mb-3">Recommendation</h3>
      
      <Alert variant={getAlertVariant() as "default" | "destructive"} className="mb-4">
        <RecommendationIcon className="h-4 w-4" />
        <AlertTitle>Plant Care Action Required</AlertTitle>
        <AlertDescription>
          {recommendation}
        </AlertDescription>
      </Alert>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
            <div className="flex items-center gap-2">
              <ActionIcon className={`h-5 w-5 ${variant === 'default' ? 'text-primary' : 'text-destructive'}`} />
              <span className="font-medium">{actionText}</span>
            </div>
            <Button 
              onClick={scheduleReminder} 
              variant="default"
              size="sm"
              className="whitespace-nowrap w-full sm:w-auto"
            >
              <Bell className="mr-2 h-4 w-4" />
              Schedule Reminder
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {moistureStatus.toLowerCase() === 'dry' && (
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <SunIcon className="h-5 w-5 text-amber-500 mt-0.5" />
            <p className="text-sm text-amber-800">
              Tip: Water thoroughly until water drains from the bottom of the pot, then allow soil to dry slightly before watering again.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendationCard;
