
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { DropletIcon, LeafIcon, SunIcon } from 'lucide-react';
import ImageUploader from './ImageUploader';
import MoistureDisplay from './MoistureDisplay';
import RecommendationCard from './RecommendationCard';
import { toast } from 'sonner';

export type AnalysisResult = {
  averageBrightness: number;
  brightnessStdDev: number;
  averageSaturation: number;
  averageBlue: number;
  averageGreen: number;
  averageRed: number;
  blueToRedRatio: number;
  averageLightness: number;
  edgeDensity: number;
  granularity: number;
  localContrast: number;
  hueSTD: number;
  crackDensity: number;
  brownColorRatio: number;
  highlightRatio: number;
  reflectanceVariation: number;
  waterDetected: boolean;
  waterAreaRatio: number;
  isDarkSoil: boolean;
  isLightSoil: boolean;
  soilMoistureScore: number;
  classifiedSoilMoisture: string;
  recommendation: string;
}

const PlantAnalyzer: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const handleImageUpload = async (image: File) => {
    try {
      setIsAnalyzing(true);
      setImagePreview(URL.createObjectURL(image));
      
      // Create FormData for the API request
      const formData = new FormData();
      formData.append('image', image);
      
      // Mock API call since we don't have an actual backend
      // In production, replace this with a real API call
      setTimeout(() => {
        // Mock data based on provided example
        const mockResult: AnalysisResult = {
          averageBrightness: 73.51,
          brightnessStdDev: 36.72,
          averageSaturation: 50.71,
          averageBlue: 61.14,
          averageGreen: 67.85,
          averageRed: 73.50,
          blueToRedRatio: 0.83,
          averageLightness: 72.85,
          edgeDensity: 0.1153,
          granularity: 22.49,
          localContrast: 56.96,
          hueSTD: 10.56,
          crackDensity: 0.6081,
          brownColorRatio: 0.9708,
          highlightRatio: 0.0163,
          reflectanceVariation: 0.4995,
          waterDetected: false,
          waterAreaRatio: 0.0206,
          isDarkSoil: true,
          isLightSoil: false,
          soilMoistureScore: 5.48,
          classifiedSoilMoisture: 'Dry',
          recommendation: 'Soil is dry. Watering needed immediately.'
        };

        setAnalysisResult(mockResult);
        setIsAnalyzing(false);
        toast.success("Analysis complete!", {
          description: "Soil moisture analysis has been completed successfully."
        });
      }, 2000);

      /* In production, uncomment this code and use your actual API endpoint
      const response = await fetch('/api/analyze-soil', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze image');
      }

      const data = await response.json();
      setAnalysisResult(data);
      setIsAnalyzing(false);
      toast.success("Analysis complete!");
      */
    } catch (error) {
      console.error('Error analyzing image:', error);
      setIsAnalyzing(false);
      toast.error('Failed to analyze image', {
        description: 'Please try uploading a different image.'
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="md:col-span-2">
        <CardContent className="p-6">
          <ImageUploader 
            onImageUpload={handleImageUpload} 
            isUploading={isAnalyzing} 
            imagePreview={imagePreview}
          />
        </CardContent>
      </Card>
      
      {analysisResult && (
        <>
          <Card className="md:col-span-1">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <DropletIcon className="mr-2 text-primary" size={24} />
                Moisture Analysis
              </h2>
              <MoistureDisplay 
                moistureScore={analysisResult.soilMoistureScore} 
                moistureStatus={analysisResult.classifiedSoilMoisture} 
              />
              
              <Separator className="my-6" />
              
              <RecommendationCard 
                recommendation={analysisResult.recommendation}
                moistureStatus={analysisResult.classifiedSoilMoisture}
              />
            </CardContent>
          </Card>
          
          <Card className="md:col-span-1">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <LeafIcon className="mr-2 text-primary" size={24} />
                Detailed Analysis
              </h2>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="color">Color</TabsTrigger>
                  <TabsTrigger value="texture">Texture</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="mt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-sm font-medium">Soil Type</p>
                      <p className="text-lg">{analysisResult.isDarkSoil ? 'Dark Soil' : 'Light Soil'}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-sm font-medium">Water Detected</p>
                      <p className="text-lg">{analysisResult.waterDetected ? 'Yes' : 'No'}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-sm font-medium">Water Area Ratio</p>
                      <p className="text-lg">{(analysisResult.waterAreaRatio * 100).toFixed(1)}%</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-sm font-medium">Brown Color Ratio</p>
                      <p className="text-lg">{(analysisResult.brownColorRatio * 100).toFixed(1)}%</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="color" className="mt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-sm font-medium">Average Red</p>
                      <p className="text-lg">{analysisResult.averageRed.toFixed(1)}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-sm font-medium">Average Green</p>
                      <p className="text-lg">{analysisResult.averageGreen.toFixed(1)}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-sm font-medium">Average Blue</p>
                      <p className="text-lg">{analysisResult.averageBlue.toFixed(1)}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-sm font-medium">Blue-to-Red Ratio</p>
                      <p className="text-lg">{analysisResult.blueToRedRatio.toFixed(2)}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-sm font-medium">Avg. Saturation</p>
                      <p className="text-lg">{analysisResult.averageSaturation.toFixed(1)}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-sm font-medium">Avg. Brightness</p>
                      <p className="text-lg">{analysisResult.averageBrightness.toFixed(1)}</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="texture" className="mt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-sm font-medium">Edge Density</p>
                      <p className="text-lg">{analysisResult.edgeDensity.toFixed(4)}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-sm font-medium">Granularity</p>
                      <p className="text-lg">{analysisResult.granularity.toFixed(2)}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-sm font-medium">Local Contrast</p>
                      <p className="text-lg">{analysisResult.localContrast.toFixed(2)}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-sm font-medium">Crack Density</p>
                      <p className="text-lg">{analysisResult.crackDensity.toFixed(4)}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-sm font-medium">Reflectance Variation</p>
                      <p className="text-lg">{analysisResult.reflectanceVariation.toFixed(4)}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-sm font-medium">Highlight Ratio</p>
                      <p className="text-lg">{(analysisResult.highlightRatio * 100).toFixed(2)}%</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default PlantAnalyzer;
