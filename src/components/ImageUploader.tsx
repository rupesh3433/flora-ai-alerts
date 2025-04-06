
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImageIcon, Upload } from 'lucide-react';

interface ImageUploaderProps {
  onImageUpload: (image: File) => void;
  isUploading: boolean;
  imagePreview: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImageUpload, 
  isUploading,
  imagePreview 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-all
          ${isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/50'}
          ${imagePreview ? 'h-auto' : 'h-64'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={!imagePreview ? triggerFileInput : undefined}
      >
        {imagePreview ? (
          <div className="w-full flex flex-col items-center">
            <div className="relative w-full max-w-md mb-4">
              <img 
                src={imagePreview} 
                alt="Uploaded plant" 
                className="w-full h-auto rounded-md object-cover shadow-md" 
              />
              {isUploading && (
                <div className="absolute inset-0 bg-black/50 rounded-md flex items-center justify-center">
                  <div className="animate-pulse text-white font-medium">Analyzing...</div>
                </div>
              )}
            </div>
            <Button 
              onClick={triggerFileInput} 
              variant="outline" 
              disabled={isUploading}
              className="mt-2"
            >
              Upload different image
            </Button>
          </div>
        ) : (
          <>
            <div className="bg-muted rounded-full p-3 mb-4">
              <ImageIcon className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-1">Upload plant image</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Drag and drop or click to upload a clear image of your plant's soil
            </p>
            <Button 
              variant="default" 
              onClick={triggerFileInput}
              disabled={isUploading}
              className="flex items-center gap-2"
            >
              <Upload size={18} />
              Choose image
            </Button>
          </>
        )}
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />
      </div>

      {!imagePreview && (
        <p className="text-xs text-muted-foreground text-center mt-2">
          For best results, ensure the soil is clearly visible and well-lit
        </p>
      )}
    </div>
  );
};

export default ImageUploader;
