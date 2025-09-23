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
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const analysisResponse = await fetch(`${supabaseUrl}/functions/v1/plant-disease-detection`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
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
        description: `Detected: ${result.disease} (${result.confidence}% confidence)`,
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
              <Badge variant={results.severity === "High" ? "destructive" : results.severity === "Moderate" ? "secondary" : "default"}>
                {results.confidence}% {t('confidence')}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Disease Info */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                {results.severity === "High" ? (
                  <AlertTriangle className="h-5 w-5 text-destructive mr-2" />
                ) : (
                  <CheckCircle className="h-5 w-5 text-success mr-2" />
                )}
                <h3 className="text-lg font-semibold">{results.disease}</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                <strong>{t('severity')}:</strong> {results.severity === "High" ? t('high') : results.severity === "Moderate" ? t('moderate') : t('low')}
              </p>
              <p className="text-sm">{results.description}</p>
            </div>

            {/* Detection Labels */}
            {results.labels && results.labels.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3 text-primary">🔍 {t('detectedFeatures') || 'Detected Features'}:</h4>
                <div className="flex flex-wrap gap-2">
                  {results.labels.map((label: any, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {label.description} ({label.score}%)
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Remedies */}
            <div>
              <h4 className="font-semibold mb-3 text-destructive">🩺 {t('immediateText')}:</h4>
              <div className="space-y-2">
                {results.remedies.map((remedy: string, index: number) => (
                  <div key={index} className="flex items-start space-x-2">
                    <span className="bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded-full font-bold">
                      {index + 1}
                    </span>
                    <p className="text-sm">{remedy}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Prevention */}
            <div>
              <h4 className="font-semibold mb-3 text-success">🛡️ {t('preventionTips')}:</h4>
              <div className="space-y-2">
                {results.prevention.map((tip: string, index: number) => (
                  <div key={index} className="flex items-start space-x-2">
                    <span className="bg-success text-success-foreground text-xs px-2 py-1 rounded-full font-bold">
                      {index + 1}
                    </span>
                    <p className="text-sm">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CameraDetection;