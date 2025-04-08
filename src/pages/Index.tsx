import React from 'react';
import PlantAnalyzer from '@/components/PlantAnalyzer';

const Index = () => {
  return (
    <div className="min-h-screen bg-[#F9FBF7] leaf-background px-4 py-8 md:px-8">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#2E3B2F] mb-4">
            Soil <span className="text-primary">Moisture</span> Analyzer
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload a photo of your plant's soil to receive watering recommendations and moisture analysis.
          </p>
        </header>
        
        <main>
          <PlantAnalyzer />
        </main>
      </div>
      
      <footer className="mt-20 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Flora AI Assistant • Helping your plants thrive</p>
      </footer>
    </div>
  );
};

export default Index;
