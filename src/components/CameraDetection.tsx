import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Upload, Scan, RefreshCw, CheckCircle, AlertTriangle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";

const CameraDetection = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        setResults(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!image) return;
    
    setAnalyzing(true);
    try {
      // Convert base64 image to blob
      const response = await fetch(image);
      const blob = await response.blob();
      
      // Create form data
      const formData = new FormData();
      formData.append('image', blob, 'plant-image.jpg');
      
      // Call Supabase edge function
      const aiURL = import.meta.env.VITE_MODEL_URL;
      const analysisResponse = await fetch(`${aiURL}/predict`, {
        method: 'POST',
        body: formData,
      });
      
      if (!analysisResponse.ok) {
        throw new Error('Failed to analyze image');
      }
      
      const result = await analysisResponse.json();
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      setResults(result);
      toast({
        title: "Analysis Complete",
        description: `Detected: ${result.predicted_label}`,
      });
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze the image. Please try again.",
        variant: "destructive",
      });
      setResults({
        disease: "Analysis Failed",
        confidence: 0,
        severity: "Unknown",
        description: "Unable to analyze the image. Please try again with a clearer image of the plant.",
        remedies: [
          "Ensure image is clear and well-lit",
          "Focus on affected plant parts",
          "Try uploading a different image",
          "Consult with local agricultural expert"
        ],
        prevention: [
          "Regular plant monitoring",
          "Proper plant care",
          "Good agricultural practices"
        ]
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const resetDetection = () => {
    setImage(null);
    setResults(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">📸 {t('cameraDetection')}</h1>
        <p className="text-muted-foreground">{t('takePhotoIdentify')}</p>
      </div>



      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Camera className="mr-2 h-5 w-5" />
            {t('uploadCropImage')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!image ? (
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <Camera className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                {t('takePhotoUpload')}
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button 
                onClick={() => fileInputRef.current?.click()}
                variant="farmer"
                className="mr-2"
              >
                <Upload className="mr-2 h-4 w-4" />
                {t('uploadImage')}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <img 
                  src={image} 
                  alt="Uploaded crop" 
                  className="w-full h-60 object-cover rounded-lg"
                />
              </div>
              <div className="flex space-x-2">
                <Button 
                  onClick={analyzeImage}
                  variant="farmer"
                  disabled={analyzing}
                  className="flex-1"
                >
                  {analyzing ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      {t('analyzing')}
                    </>
                  ) : (
                    <>
                      <Scan className="mr-2 h-4 w-4" />
                      {t('analyzeImage')}
                    </>
                  )}
                </Button>
                <Button 
                  onClick={resetDetection}
                  variant="outline"
                >
                  {t('reset')}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      {results && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{t('detectionResults')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            Predicted: {results.predicted_label}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CameraDetection;