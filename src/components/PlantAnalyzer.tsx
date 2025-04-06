import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { DropletIcon, LeafIcon } from 'lucide-react';
import ImageUploader from './ImageUploader';
import RecommendationCard from './RecommendationCard';
import { toast } from 'sonner';
import MoistureDisplay from './MoistureDisplay';

export type AnalysisResult = {
  classifiedSoilMoisture: string;
  recommendation: string;
  moistureScore: number;
  timestamp: number;
  success: boolean;
  details?: {
    color: {
      averageBrightness: number;
      brightnessStdDev: number;
      averageSaturation: number;
      colorChannels: {
        red: number;
        green: number;
        blue: number;
      };
      blueToRedRatio: number;
      averageLightness: number;
      brownColorRatio: number;
      highlightRatio: number;
    };
    texture: {
      edgeDensity: number;
      granularity: number;
      crackDensity: number;
      reflectanceVariation: number;
      waterDetected: boolean;
      waterAreaRatio: number;
      isDarkSoil: boolean;
      isLightSoil: boolean;
    };
  };
};

const PlantAnalyzer: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const handleImageUpload = async (image: File) => {
    try {
      setIsAnalyzing(true);
      setImagePreview(URL.createObjectURL(image));

      const formData = new FormData();
      formData.append('image', image);

      // Use your actual API endpoint here
      const response = await fetch('http://127.0.0.1:5000/api/analyze-soil', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to analyze image: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Unknown error occurred');
      }
      
      setAnalysisResult(data);
      toast.success("Analysis complete!", {
        description: "Soil moisture analysis has been completed successfully."
      });
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast.error('Failed to analyze image', {
        description: error instanceof Error ? error.message : 'Please try uploading a different image.'
      });
    } finally {
      setIsAnalyzing(false);
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
                moistureStatus={analysisResult.classifiedSoilMoisture}
                moistureScore={analysisResult.moistureScore} 
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
                  <p className="text-lg">Soil Moisture: {analysisResult.classifiedSoilMoisture}</p>
                  <p className="text-lg">Score: {analysisResult.moistureScore.toFixed(1)}</p>
                  <p className="text-lg">
                    Timestamp: {new Date(analysisResult.timestamp * 1000).toLocaleString()}
                  </p>
                </TabsContent>

                <TabsContent value="color" className="mt-4 space-y-4">
                  {analysisResult.details ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-3 rounded-md bg-muted/50">
                          <p className="text-sm font-medium">Average Brightness</p>
                          <p className="text-lg">{analysisResult.details.color.averageBrightness.toFixed(2)}</p>
                        </div>
                        <div className="p-3 rounded-md bg-muted/50">
                          <p className="text-sm font-medium">Brightness Std Dev</p>
                          <p className="text-lg">{analysisResult.details.color.brightnessStdDev.toFixed(2)}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2">
                        <div className="p-3 rounded-md bg-muted/50">
                          <p className="text-sm font-medium">Red</p>
                          <p className="text-lg">{analysisResult.details.color.colorChannels.red.toFixed(2)}</p>
                        </div>
                        <div className="p-3 rounded-md bg-muted/50">
                          <p className="text-sm font-medium">Green</p>
                          <p className="text-lg">{analysisResult.details.color.colorChannels.green.toFixed(2)}</p>
                        </div>
                        <div className="p-3 rounded-md bg-muted/50">
                          <p className="text-sm font-medium">Blue</p>
                          <p className="text-lg">{analysisResult.details.color.colorChannels.blue.toFixed(2)}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-3 rounded-md bg-muted/50">
                          <p className="text-sm font-medium">Blue-Red Ratio</p>
                          <p className="text-lg">{analysisResult.details.color.blueToRedRatio.toFixed(2)}</p>
                        </div>
                        <div className="p-3 rounded-md bg-muted/50">
                          <p className="text-sm font-medium">Brown Color Ratio</p>
                          <p className="text-lg">{analysisResult.details.color.brownColorRatio.toFixed(2)}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-3 rounded-md bg-muted/50">
                          <p className="text-sm font-medium">Average Saturation</p>
                          <p className="text-lg">{analysisResult.details.color.averageSaturation.toFixed(2)}</p>
                        </div>
                        <div className="p-3 rounded-md bg-muted/50">
                          <p className="text-sm font-medium">Highlight Ratio</p>
                          <p className="text-lg">{analysisResult.details.color.highlightRatio.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-lg">Color analysis data not available from API.</p>
                  )}
                </TabsContent>

                <TabsContent value="texture" className="mt-4 space-y-4">
                  {analysisResult.details ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-3 rounded-md bg-muted/50">
                          <p className="text-sm font-medium">Edge Density</p>
                          <p className="text-lg">{analysisResult.details.texture.edgeDensity.toFixed(4)}</p>
                        </div>
                        <div className="p-3 rounded-md bg-muted/50">
                          <p className="text-sm font-medium">Granularity</p>
                          <p className="text-lg">{analysisResult.details.texture.granularity.toFixed(2)}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-3 rounded-md bg-muted/50">
                          <p className="text-sm font-medium">Crack Density</p>
                          <p className="text-lg">{analysisResult.details.texture.crackDensity.toFixed(4)}</p>
                        </div>
                        <div className="p-3 rounded-md bg-muted/50">
                          <p className="text-sm font-medium">Reflectance Variation</p>
                          <p className="text-lg">{analysisResult.details.texture.reflectanceVariation.toFixed(4)}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-3 rounded-md bg-muted/50">
                          <p className="text-sm font-medium">Water Detected</p>
                          <p className="text-lg">{analysisResult.details.texture.waterDetected ? 'Yes' : 'No'}</p>
                        </div>
                        <div className="p-3 rounded-md bg-muted/50">
                          <p className="text-sm font-medium">Water Area Ratio</p>
                          <p className="text-lg">{analysisResult.details.texture.waterAreaRatio.toFixed(4)}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-3 rounded-md bg-muted/50">
                          <p className="text-sm font-medium">Soil Type</p>
                          <p className="text-lg">
                            {analysisResult.details.texture.isDarkSoil ? 'Dark Soil' : 
                             analysisResult.details.texture.isLightSoil ? 'Light Soil' : 'Medium Soil'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-lg">Texture analysis data not available from API.</p>
                  )}
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
