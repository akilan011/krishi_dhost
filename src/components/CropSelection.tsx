import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Wheat, MapPin, Calendar, Plus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ThemeToggle } from "@/components/ThemeToggle";

const CropSelection = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [cropData, setCropData] = useState({
    cropType: "",
    acreage: "",
    plantingDate: ""
  });
  const [harvestWindow, setHarvestWindow] = useState<string>("");

  // Crop duration database
  const cropDurationDatabase: { [key: string]: { min: number; max: number } } = {
    "Corn": { "min": 60, "max": 130 },
    "Millets": { "min": 60, "max": 180 },
    "Oats": { "min": 80, "max": 120 },
    "Soybeans": { "min": 90, "max": 110 },
    "Sugarcane": { "min": 360, "max": 540 },
    "Rice": { "min": 100, "max": 180 },
    "Wheat": { "min": 100, "max": 250 }
  };

  const cropTypes = [
    "Rice",
    "Wheat", 
    "Corn",
    "Millets",
    "Oats",
    "Soybeans",
    "Sugarcane",
    "Cotton",
    "Soybean",
    "Chickpea",
    "Mustard",
    "Potato",
    "Tomato",
    "Onion",
    "Other"
  ];

  // Format date as DD-MMM-YYYY
  const formatDate = (date: Date): string => {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const day = date.getDate().toString().padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Calculate harvest window
  const calculateHarvestWindow = (cropType: string, plantingDate: string): string => {
    if (!cropType || !plantingDate) return "";
    
    const cropDuration = cropDurationDatabase[cropType];
    if (!cropDuration) {
      return "Sorry, harvest information for this crop is not available.";
    }

    const plantDate = new Date(plantingDate);
    const earliestHarvest = new Date(plantDate);
    const latestHarvest = new Date(plantDate);
    
    earliestHarvest.setDate(plantDate.getDate() + cropDuration.min);
    latestHarvest.setDate(plantDate.getDate() + cropDuration.max);
    
    return `Expected Harvest Window: ${formatDate(earliestHarvest)} to ${formatDate(latestHarvest)}`;
  };

  const handleInputChange = (field: string, value: string) => {
    setCropData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddCrop = () => {
    // Calculate harvest window
    const harvestWindowText = calculateHarvestWindow(cropData.cropType, cropData.plantingDate);
    setHarvestWindow(harvestWindowText);

    // Save crop data and generate lifecycle notifications
    const cropLifecycle = generateCropLifecycle(cropData.cropType, cropData.plantingDate);
    
    const newCrop = {
      id: Date.now(),
      name: cropData.cropType,
      area: cropData.acreage,
      plantedDate: cropData.plantingDate,
      harvestWindow: harvestWindowText,
      lifecycle: cropLifecycle,
      status: "growing"
    };

    // Save to localStorage
    const existingCrops = JSON.parse(localStorage.getItem("farmerCrops") || "[]");
    const updatedCrops = [...existingCrops, newCrop];
    localStorage.setItem("farmerCrops", JSON.stringify(updatedCrops));

    // Generate notifications
    generateNotifications(newCrop);
    
    // Don't navigate immediately, show harvest window first
    setTimeout(() => {
      navigate("/dashboard/my-crop");
    }, 3000);
  };

  const generateCropLifecycle = (cropType: string, plantingDate: string) => {
    const startDate = new Date(plantingDate);
    const lifecycle = [];

    // Basic lifecycle for different crops (in days from planting)
    const cropLifecycles: { [key: string]: Array<{days: number, activity: string, type: string}> } = {
      "Rice": [
        { days: 7, activity: "First watering check", type: "watering" },
        { days: 21, activity: "First fertilizer application", type: "fertilizer" },
        { days: 45, activity: "Weed control", type: "maintenance" },
        { days: 60, activity: "Second fertilizer dose", type: "fertilizer" },
        { days: 90, activity: "Pest monitoring", type: "pest" },
        { days: 120, activity: "Harvest preparation", type: "harvest" }
      ],
      "Wheat": [
        { days: 10, activity: "Germination check", type: "monitoring" },
        { days: 30, activity: "First irrigation", type: "watering" },
        { days: 45, activity: "Fertilizer application", type: "fertilizer" },
        { days: 75, activity: "Disease monitoring", type: "pest" },
        { days: 110, activity: "Harvest ready", type: "harvest" }
      ]
    };

    const defaultLifecycle = [
      { days: 7, activity: "Initial care check", type: "monitoring" },
      { days: 21, activity: "Fertilizer application", type: "fertilizer" },
      { days: 45, activity: "Mid-season care", type: "maintenance" },
      { days: 90, activity: "Harvest preparation", type: "harvest" }
    ];

    const selectedLifecycle = cropLifecycles[cropType] || defaultLifecycle;

    selectedLifecycle.forEach(stage => {
      const stageDate = new Date(startDate);
      stageDate.setDate(stageDate.getDate() + stage.days);
      lifecycle.push({
        ...stage,
        date: stageDate.toISOString(),
        completed: false
      });
    });

    return lifecycle;
  };

  const generateNotifications = (crop: any) => {
    // Generate notifications for the crop lifecycle
    const notifications = crop.lifecycle.map((stage: any) => ({
      id: Date.now() + Math.random(),
      cropId: crop.id,
      cropName: crop.name,
      message: `${stage.activity} for ${crop.name} (${cropData.acreage})`,
      type: stage.type,
      date: stage.date,
      completed: false
    }));

    const existingNotifications = JSON.parse(localStorage.getItem("cropNotifications") || "[]");
    const updatedNotifications = [...existingNotifications, ...notifications];
    localStorage.setItem("cropNotifications", JSON.stringify(updatedNotifications));
  };

  return (
    <div className="min-h-screen bg-gradient-field p-6">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-foreground flex items-center justify-center">
            <Wheat className="mr-2 h-6 w-6" />
            {t('addNewCrop')}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Crop Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="cropType" className="text-base font-semibold">
              What crop are you sowing?
            </Label>
            <Select onValueChange={(value) => handleInputChange("cropType", value)}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select crop type" />
              </SelectTrigger>
              <SelectContent>
                {cropTypes.map((crop) => (
                  <SelectItem key={crop} value={crop}>
                    {crop}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Acreage Input */}
          <div className="space-y-2">
            <Label htmlFor="acreage" className="text-base font-semibold">
              <MapPin className="inline mr-2 h-4 w-4" />
              {t('area')}
            </Label>
            <Input
              id="acreage"
              placeholder="e.g., 2.5 acres, 1 hectare"
              value={cropData.acreage}
              onChange={(e) => handleInputChange("acreage", e.target.value)}
              className="h-12"
            />
          </div>

          {/* Planting Date */}
          <div className="space-y-2">
            <Label htmlFor="plantingDate" className="text-base font-semibold">
              <Calendar className="inline mr-2 h-4 w-4" />
              {t('plantedDate')}
            </Label>
            <Input
              id="plantingDate"
              type="date"
              value={cropData.plantingDate}
              onChange={(e) => handleInputChange("plantingDate", e.target.value)}
              className="h-12"
            />
          </div>

          {/* Add Crop Button */}
          <Button 
            onClick={handleAddCrop}
            variant="farmer"
            size="lg"
            className="w-full"
            disabled={!cropData.cropType || !cropData.acreage || !cropData.plantingDate}
          >
            <Plus className="mr-2 h-5 w-5" />
            {t('addCrop')} & Generate Schedule
          </Button>

          {/* Display Harvest Window */}
          {harvestWindow && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
              <h3 className="font-semibold text-green-800 mb-2">Harvest Information</h3>
              <p className="text-green-700">{harvestWindow}</p>
              <p className="text-sm text-green-600 mt-2">Redirecting to My Crops page...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CropSelection;