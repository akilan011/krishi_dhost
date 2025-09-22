import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Bell, Droplets, Zap, Bug, Scissors, Wheat, Clock, MapPin, AlertTriangle, RefreshCw } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const AICropCalendar = () => {
  const { t } = useLanguage();
  const [crops, setCrops] = useState<any[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<any>(null);
  const [currentWeek, setCurrentWeek] = useState(0);
  const [todayActivities, setTodayActivities] = useState([]);
  
  // Crop-specific maintenance schedules
  const getCropSchedule = (cropName) => {
    const schedules = {
      'rice': {
        irrigation: { frequency: 'daily', times: ['6:00 AM', '6:00 PM'], amount: 'flood irrigation' },
        fertilizer: [15, 30, 45, 65], // days after planting
        pestControl: [20, 40, 60], // days after planting
        weeding: [25, 45], // days after planting
        stages: { germination: 14, vegetative: 45, flowering: 75, maturation: 120 }
      },
      'wheat': {
        irrigation: { frequency: 'every 2 days', times: ['7:00 AM'], amount: 'moderate watering' },
        fertilizer: [20, 40, 60], // days after planting
        pestControl: [30, 50], // days after planting
        weeding: [30, 50], // days after planting
        stages: { germination: 10, vegetative: 40, flowering: 70, maturation: 110 }
      },
      'corn': {
        irrigation: { frequency: 'every 3 days', times: ['6:30 AM'], amount: 'deep watering' },
        fertilizer: [15, 35, 55], // days after planting
        pestControl: [25, 45], // days after planting
        weeding: [20, 40], // days after planting
        stages: { germination: 7, vegetative: 35, flowering: 65, maturation: 90 }
      },
      'tomato': {
        irrigation: { frequency: 'daily', times: ['6:00 AM', '5:00 PM'], amount: 'consistent moisture' },
        fertilizer: [14, 28, 42, 56], // days after planting
        pestControl: [21, 35, 49], // days after planting
        weeding: [20, 35, 50], // days after planting
        stages: { germination: 10, vegetative: 30, flowering: 50, maturation: 80 }
      }
    };
    return schedules[cropName.toLowerCase()] || schedules['rice']; // default to rice
  };

  // Generate comprehensive daily activities
  const generateTodayActivities = () => {
    if (!selectedCrop) return [];
    
    const now = new Date();
    const currentHour = now.getHours();
    const plantedDate = new Date(selectedCrop.plantedDate);
    const daysSincePlanted = Math.floor((now.getTime() - plantedDate.getTime()) / (1000 * 60 * 60 * 24));
    const expectedHarvest = new Date(selectedCrop.expectedHarvest);
    const daysToHarvest = Math.floor((expectedHarvest.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    const activities = [];
    const cropSchedule = getCropSchedule(selectedCrop.name);
    
    // Determine current growth stage
    let currentStage = 'germination';
    if (daysSincePlanted > cropSchedule.stages.germination) currentStage = 'vegetative';
    if (daysSincePlanted > cropSchedule.stages.vegetative) currentStage = 'flowering';
    if (daysSincePlanted > cropSchedule.stages.flowering) currentStage = 'maturation';
    
    // Daily irrigation activities
    const morningIrrigationTime = cropSchedule.irrigation.times[0];
    const morningHour = parseInt(morningIrrigationTime.split(':')[0]);
    
    if (currentHour >= morningHour && currentHour <= morningHour + 2) {
      activities.push({
        id: 'morning_irrigation',
        title: `${selectedCrop.name} Morning Irrigation`,
        description: `${cropSchedule.irrigation.amount} - ${cropSchedule.irrigation.frequency} (Day ${daysSincePlanted}, ${currentStage} stage)`,
        icon: Droplets,
        color: 'text-blue-600 dark:text-blue-400',
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        borderColor: 'border-blue-200 dark:border-blue-700',
        priority: 'high',
        timeSlot: morningIrrigationTime,
        cropStage: currentStage
      });
    }
    
    // Evening irrigation (if applicable)
    if (cropSchedule.irrigation.times.length > 1) {
      const eveningIrrigationTime = cropSchedule.irrigation.times[1];
      const eveningHour = parseInt(eveningIrrigationTime.split(':')[0]);
      
      if (currentHour >= eveningHour && currentHour <= eveningHour + 2) {
        activities.push({
          id: 'evening_irrigation',
          title: `${selectedCrop.name} Evening Irrigation`,
          description: `Second watering session - maintain soil moisture for ${currentStage} stage`,
          icon: Droplets,
          color: 'text-blue-600 dark:text-blue-400',
          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
          borderColor: 'border-blue-200 dark:border-blue-700',
          priority: 'moderate',
          timeSlot: eveningIrrigationTime,
          cropStage: currentStage
        });
      }
    }
    
    // Fertilizer application (specific days)
    if (cropSchedule.fertilizer.includes(daysSincePlanted)) {
      let fertilizerType = '';
      const fertilizerIndex = cropSchedule.fertilizer.indexOf(daysSincePlanted);
      if (fertilizerIndex === 0) fertilizerType = 'Nitrogen (N) - 20kg/acre for vegetative growth';
      else if (fertilizerIndex === 1) fertilizerType = 'Phosphorus (P) - 15kg/acre for root development';
      else if (fertilizerIndex === 2) fertilizerType = 'Potassium (K) - 10kg/acre for flowering';
      else fertilizerType = 'Micronutrients - Zinc, Iron for grain filling';
      
      activities.push({
        id: 'fertilizer_application',
        title: `${selectedCrop.name} Fertilizer Application - Day ${daysSincePlanted}`,
        description: `Apply ${fertilizerType}. Best time: 8:00 AM - 10:00 AM`,
        icon: Zap,
        color: 'text-yellow-600 dark:text-yellow-400',
        bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
        borderColor: 'border-yellow-200 dark:border-yellow-700',
        priority: 'high',
        timeSlot: '8:00 AM - 10:00 AM',
        cropStage: currentStage
      });
    }
    
    // Pest control activities
    if (cropSchedule.pestControl.includes(daysSincePlanted)) {
      const pestTypes = {
        'rice': 'Brown planthopper, stem borer, leaf folder',
        'wheat': 'Aphids, rust, smut',
        'corn': 'Fall armyworm, corn borer, cutworm',
        'tomato': 'Whitefly, aphids, fruit borer'
      };
      
      activities.push({
        id: 'pest_control',
        title: `${selectedCrop.name} Pest Control - Day ${daysSincePlanted}`,
        description: `Spray for ${pestTypes[selectedCrop.name.toLowerCase()] || 'common pests'}. Best time: 6:00 PM - 8:00 PM`,
        icon: Bug,
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        borderColor: 'border-red-200 dark:border-red-700',
        priority: 'high',
        timeSlot: '6:00 PM - 8:00 PM',
        cropStage: currentStage
      });
    }
    
    // Weeding activities
    if (cropSchedule.weeding.includes(daysSincePlanted)) {
      activities.push({
        id: 'weeding',
        title: `${selectedCrop.name} Weeding - Day ${daysSincePlanted}`,
        description: `Remove weeds manually or use herbicide. Best time: 7:00 AM - 11:00 AM`,
        icon: Wheat,
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-50 dark:bg-green-900/20',
        borderColor: 'border-green-200 dark:border-green-700',
        priority: 'moderate',
        timeSlot: '7:00 AM - 11:00 AM',
        cropStage: currentStage
      });
    }
    
    // Daily monitoring (afternoon)
    if (currentHour >= 14 && currentHour <= 16) {
      const monitoringTasks = {
        'germination': 'Check seed emergence, soil moisture, temperature',
        'vegetative': 'Monitor leaf color, plant height, pest damage',
        'flowering': 'Check flower formation, pollination, water stress',
        'maturation': 'Assess grain filling, color change, harvest readiness'
      };
      
      activities.push({
        id: 'daily_monitoring',
        title: `${selectedCrop.name} Daily Monitoring`,
        description: `${monitoringTasks[currentStage]} (${currentStage} stage - Day ${daysSincePlanted})`,
        icon: Calendar,
        color: 'text-purple-600 dark:text-purple-400',
        bgColor: 'bg-purple-50 dark:bg-purple-900/20',
        borderColor: 'border-purple-200 dark:border-purple-700',
        priority: 'moderate',
        timeSlot: '2:00 PM - 4:00 PM',
        cropStage: currentStage
      });
    }
    
    // Harvest activities
    if (daysToHarvest <= 7 && daysToHarvest > 0) {
      activities.push({
        id: 'harvest_prep',
        title: `${selectedCrop.name} Harvest Preparation`,
        description: `Prepare harvesting tools, arrange labor, check market prices (${daysToHarvest} days left)`,
        icon: AlertTriangle,
        color: 'text-orange-600 dark:text-orange-400',
        bgColor: 'bg-orange-50 dark:bg-orange-900/20',
        borderColor: 'border-orange-200 dark:border-orange-700',
        priority: 'high',
        timeSlot: 'Anytime',
        cropStage: 'pre-harvest'
      });
    }
    
    // Overdue harvest
    if (daysToHarvest < 0) {
      activities.push({
        id: 'overdue_harvest',
        title: `URGENT: ${selectedCrop.name} Harvest Overdue`,
        description: `Harvest immediately! Crop is ${Math.abs(daysToHarvest)} days overdue. Quality may be affected.`,
        icon: AlertTriangle,
        color: 'text-red-700 dark:text-red-300',
        bgColor: 'bg-red-100 dark:bg-red-900/30',
        borderColor: 'border-red-300 dark:border-red-600',
        priority: 'urgent',
        timeSlot: 'IMMEDIATE',
        cropStage: 'overdue'
      });
    }
    
    return activities.slice(0, 5); // Show top 5 activities
  };

  // Generate crop-specific smart tips
  const generateSmartTips = () => {
    if (!selectedCrop) return [];
    
    const plantedDate = new Date(selectedCrop.plantedDate);
    const daysSincePlanted = Math.floor((new Date().getTime() - plantedDate.getTime()) / (1000 * 60 * 60 * 24));
    const cropSchedule = getCropSchedule(selectedCrop.name);
    
    // Determine current growth stage
    let currentStage = 'germination';
    if (daysSincePlanted > cropSchedule.stages.germination) currentStage = 'vegetative';
    if (daysSincePlanted > cropSchedule.stages.vegetative) currentStage = 'flowering';
    if (daysSincePlanted > cropSchedule.stages.flowering) currentStage = 'maturation';
    
    const cropTips = {
      'rice': {
        'germination': [
          { title: 'Water Management', tip: 'Maintain 2-3 cm standing water. Avoid deep flooding in early stage.' },
          { title: 'Temperature Control', tip: 'Optimal temperature: 20-35°C. Protect from cold winds.' },
          { title: 'Seed Quality', tip: 'Use certified seeds with 85%+ germination rate for better yield.' }
        ],
        'vegetative': [
          { title: 'Nitrogen Management', tip: 'Apply 50% nitrogen during tillering stage for maximum tillers.' },
          { title: 'Water Level', tip: 'Maintain 5-10 cm water depth. Drain during fertilizer application.' },
          { title: 'Weed Control', tip: 'Critical period: 15-45 days. Use pre-emergence herbicides.' }
        ],
        'flowering': [
          { title: 'Water Stress', tip: 'Avoid water stress during flowering. Maintain continuous flooding.' },
          { title: 'Pest Alert', tip: 'Monitor for brown planthopper and stem borer. Use pheromone traps.' },
          { title: 'Potassium Boost', tip: 'Apply potassium fertilizer to improve grain filling and disease resistance.' }
        ],
        'maturation': [
          { title: 'Harvest Timing', tip: 'Harvest when 80% grains turn golden yellow. Avoid over-maturity.' },
          { title: 'Water Management', tip: 'Drain fields 15 days before harvest for easy harvesting.' },
          { title: 'Storage Prep', tip: 'Dry grains to 14% moisture content before storage.' }
        ]
      },
      'wheat': {
        'germination': [
          { title: 'Sowing Depth', tip: 'Maintain 3-5 cm sowing depth. Deeper sowing reduces germination.' },
          { title: 'Soil Moisture', tip: 'Ensure adequate soil moisture but avoid waterlogging.' },
          { title: 'Temperature', tip: 'Optimal germination temperature: 15-25°C.' }
        ],
        'vegetative': [
          { title: 'Tillering Stage', tip: 'Apply first irrigation at crown root initiation (20-25 days).' },
          { title: 'Nitrogen Split', tip: 'Apply 50% nitrogen at sowing, 25% at tillering, 25% at jointing.' },
          { title: 'Weed Management', tip: 'Use post-emergence herbicides 30-35 days after sowing.' }
        ],
        'flowering': [
          { title: 'Critical Irrigation', tip: 'Ensure irrigation during flowering and grain filling stages.' },
          { title: 'Disease Watch', tip: 'Monitor for rust diseases. Apply fungicides if needed.' },
          { title: 'Wind Protection', tip: 'Protect from strong winds during flowering to prevent lodging.' }
        ],
        'maturation': [
          { title: 'Harvest Readiness', tip: 'Harvest when grains are hard and moisture is 20-25%.' },
          { title: 'Quality Check', tip: 'Test grain moisture before storage. Dry to 12% if needed.' },
          { title: 'Market Timing', tip: 'Monitor market prices for optimal selling time.' }
        ]
      },
      'corn': {
        'germination': [
          { title: 'Soil Temperature', tip: 'Plant when soil temperature reaches 10°C for good germination.' },
          { title: 'Seed Depth', tip: 'Plant 3-5 cm deep in heavy soils, 5-7 cm in light soils.' },
          { title: 'Spacing', tip: 'Maintain 20-25 cm plant spacing for optimal growth.' }
        ],
        'vegetative': [
          { title: 'Side Dressing', tip: 'Apply nitrogen side-dressing when plants are knee-high.' },
          { title: 'Weed Control', tip: 'Critical weed-free period: first 6 weeks after emergence.' },
          { title: 'Water Needs', tip: 'Corn needs 500-800mm water throughout growing season.' }
        ],
        'flowering': [
          { title: 'Pollination', tip: 'Ensure adequate water during tasseling and silking stages.' },
          { title: 'Pest Management', tip: 'Monitor for corn borer and fall armyworm during flowering.' },
          { title: 'Stress Avoidance', tip: 'Avoid any stress during 2 weeks before and after silking.' }
        ],
        'maturation': [
          { title: 'Moisture Testing', tip: 'Harvest when grain moisture is 20-25% for best quality.' },
          { title: 'Drying Process', tip: 'Dry corn to 14% moisture for safe storage.' },
          { title: 'Storage Tips', tip: 'Store in clean, dry bins with proper ventilation.' }
        ]
      },
      'tomato': [
        { title: 'Consistent Watering', tip: 'Maintain consistent soil moisture to prevent blossom end rot and cracking.' },
        { title: 'Mulching Benefits', tip: 'Use organic mulch to retain moisture and suppress weeds.' },
        { title: 'Pruning Technique', tip: 'Remove suckers and lower leaves to improve air circulation and fruit quality.' },
        { title: 'Support System', tip: 'Provide strong support with stakes or cages for indeterminate varieties.' }
      ]
    };
    
    // Get tips for current crop and stage
    const currentCropTips = cropTips[selectedCrop.name.toLowerCase()];
    if (!currentCropTips) return cropTips['tomato']; // default tips
    
    // If crop has stage-specific tips, return current stage tips
    if (Array.isArray(currentCropTips)) {
      return currentCropTips;
    } else {
      return currentCropTips[currentStage] || currentCropTips['vegetative'];
    }
  };

  // Get current user for user-specific data
  const getCurrentUser = () => {
    const farmerData = localStorage.getItem('farmerData');
    return farmerData ? JSON.parse(farmerData) : null;
  };

  const getUserCropsKey = () => {
    const user = getCurrentUser();
    return user ? `farmerCrops_${user.name}` : 'farmerCrops';
  };

  // Function to refresh crop data
  const refreshCropData = () => {
    const user = getCurrentUser();
    if (!user) {
      setCrops([]);
      setSelectedCrop(null);
      return;
    }

    const userCropsKey = getUserCropsKey();
    const savedCrops = localStorage.getItem(userCropsKey);
    if (savedCrops) {
      const parsedCrops = JSON.parse(savedCrops);
      setCrops(parsedCrops);
      
      // If selected crop still exists, update it; otherwise select first crop
      if (selectedCrop) {
        const updatedSelectedCrop = parsedCrops.find(crop => crop.id === selectedCrop.id);
        if (updatedSelectedCrop) {
          setSelectedCrop(updatedSelectedCrop);
        } else if (parsedCrops.length > 0) {
          setSelectedCrop(parsedCrops[0]);
        } else {
          setSelectedCrop(null);
        }
      } else if (parsedCrops.length > 0) {
        setSelectedCrop(parsedCrops[0]);
      }
    } else {
      setCrops([]);
      setSelectedCrop(null);
    }
  };

  // Load crops on component mount
  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      setCrops([]);
      return;
    }

    // Load crops from user-specific localStorage
    const userCropsKey = getUserCropsKey();
    const savedCrops = localStorage.getItem(userCropsKey);
    if (savedCrops) {
      const parsedCrops = JSON.parse(savedCrops);
      setCrops(parsedCrops);
      if (parsedCrops.length > 0 && !selectedCrop) {
        setSelectedCrop(parsedCrops[0]);
      }
    } else {
      setCrops([]);
    }
  }, []);

  // Update activities when selected crop changes
  useEffect(() => {
    if (selectedCrop) {
      setTodayActivities(generateTodayActivities());
    } else {
      setTodayActivities([]);
    }
    
    // Update activities every hour
    const interval = setInterval(() => {
      if (selectedCrop) {
        setTodayActivities(generateTodayActivities());
      }
    }, 3600000); // 1 hour
    
    return () => clearInterval(interval);
  }, [selectedCrop]);

  // Listen for crop updates from localStorage and focus events
  useEffect(() => {
    const handleStorageChange = () => {
      refreshCropData();
    };

    const handleFocus = () => {
      refreshCropData();
    };

    const handleCropsUpdated = (event) => {
      refreshCropData();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('cropsUpdated', handleCropsUpdated);
    
    // Also refresh when component becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refreshCropData();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('cropsUpdated', handleCropsUpdated);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [selectedCrop]);

  // Generate smart calendar based on crop data
  const generateCropCalendar = (crop: any) => {
    if (!crop) return [];

    const plantedDate = new Date(crop.plantedDate);
    const expectedHarvest = new Date(crop.expectedHarvest);
    const totalDays = Math.ceil((expectedHarvest.getTime() - plantedDate.getTime()) / (1000 * 60 * 60 * 24));
    const weeksCount = Math.ceil(totalDays / 7);

    const calendar = [];

    // Generate weekly activities based on crop type and growth stage
    for (let week = 0; week < weeksCount; week++) {
      const weekStartDate = new Date(plantedDate);
      weekStartDate.setDate(plantedDate.getDate() + (week * 7));
      
      const weekActivities = [];
      
      // Irrigation activities
      if (week % 2 === 1) {
        weekActivities.push({
          type: 'irrigation',
          title: t('irrigationSchedule'),
          description: t('weeklyIrrigation'),
          priority: 'high',
          icon: Droplets,
          color: 'text-blue-600'
        });
      }

      // Fertilization activities
      if (week === 3 || week === 6 || week === 10) {
        weekActivities.push({
          type: 'fertilization',
          title: t('fertilizerApplication'),
          description: t('applyNPKFertilizer'),
          priority: 'high',
          icon: Zap,
          color: 'text-yellow-600'
        });
      }

      // Pest control activities
      if (week === 4 || week === 8) {
        weekActivities.push({
          type: 'pestControl',
          title: t('pestInspection'),
          description: t('checkPestDamage'),
          priority: 'moderate',
          icon: Bug,
          color: 'text-red-600'
        });
      }

      // Harvesting activities
      if (week >= weeksCount - 2) {
        weekActivities.push({
          type: 'harvest',
          title: t('harvestPreparation'),
          description: t('prepareHarvestTools'),
          priority: 'high',
          icon: Scissors,
          color: 'text-green-600'
        });
      }

      calendar.push({
        week: week + 1,
        startDate: weekStartDate,
        activities: weekActivities,
        cropStage: getCropStage(week, weeksCount)
      });
    }

    return calendar;
  };

  const getCropStage = (week: number, totalWeeks: number) => {
    const progress = week / totalWeeks;
    if (progress < 0.25) return 'germination';
    if (progress < 0.5) return 'vegetative';
    if (progress < 0.75) return 'flowering';
    return 'maturation';
  };

  const getCropStageText = (stage: string) => {
    switch (stage) {
      case 'germination': return t('germination');
      case 'vegetative': return t('vegetativeGrowth');
      case 'flowering': return t('flowering');
      case 'maturation': return t('maturation');
      default: return stage;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const calendar = selectedCrop ? generateCropCalendar(selectedCrop) : [];
  const currentDate = new Date();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('aiCropCalendar')}</h1>
          <p className="text-muted-foreground">{t('smartRemindersSchedule')}</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshCropData}
            className="flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </Button>
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">{currentDate.toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {crops.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="space-y-4">
            <Wheat className="h-16 w-16 text-muted-foreground mx-auto" />
            <h3 className="text-xl font-semibold">{t('noCropsFound')}</h3>
            <p className="text-muted-foreground">{t('addCropsToSeeCalendar')}</p>
            <Button onClick={() => window.location.href = '/dashboard/my-crop'} variant="farmer">
              {t('addYourFirstCrop')}
            </Button>
          </div>
        </Card>
      ) : (
        <>
          {/* Crop Selector */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wheat className="mr-2 h-5 w-5" />
                {t('selectCrop')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {crops.map((crop) => {
                  const plantedDate = new Date(crop.plantedDate);
                  const daysSincePlanted = Math.floor((new Date().getTime() - plantedDate.getTime()) / (1000 * 60 * 60 * 24));
                  const isSelected = selectedCrop?.id === crop.id;
                  
                  return (
                    <div
                      key={crop.id}
                      onClick={() => setSelectedCrop(crop)}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                        isSelected 
                          ? 'border-primary bg-primary/5 shadow-md' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Wheat className={`h-4 w-4 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                          <div>
                            <div className="font-medium text-sm">{crop.name}</div>
                            <div className="text-xs text-muted-foreground">{crop.variety}</div>
                          </div>
                        </div>
                        {isSelected && (
                          <Badge variant="default" className="text-xs">
                            Selected
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex justify-between">
                          <span>Area:</span>
                          <span className="font-medium">{crop.area}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Days:</span>
                          <span className="font-medium">{daysSincePlanted}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Status:</span>
                          <Badge variant="outline" className="text-xs h-4">
                            {crop.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {selectedCrop && (
            <>
              {/* Current Crop Status */}
              <Card className="bg-gradient-field text-white">
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="text-center">
                      <Wheat className="h-8 w-8 mx-auto mb-2" />
                      <div className="text-sm opacity-90">{t('cropName')}</div>
                      <div className="font-semibold">{selectedCrop.name}</div>
                      <div className="text-xs opacity-75">{selectedCrop.variety}</div>
                    </div>
                    <div className="text-center">
                      <MapPin className="h-8 w-8 mx-auto mb-2" />
                      <div className="text-sm opacity-90">{t('area')}</div>
                      <div className="font-semibold">{selectedCrop.area}</div>
                    </div>
                    <div className="text-center">
                      <Calendar className="h-8 w-8 mx-auto mb-2" />
                      <div className="text-sm opacity-90">{t('plantedDate')}</div>
                      <div className="font-semibold">{new Date(selectedCrop.plantedDate).toLocaleDateString()}</div>
                      <div className="text-xs opacity-75">
                        {Math.floor((new Date().getTime() - new Date(selectedCrop.plantedDate).getTime()) / (1000 * 60 * 60 * 24))} days ago
                      </div>
                    </div>
                    <div className="text-center">
                      <Clock className="h-8 w-8 mx-auto mb-2" />
                      <div className="text-sm opacity-90">{t('expectedHarvest')}</div>
                      <div className="font-semibold">
                        {selectedCrop.expectedHarvest && !isNaN(new Date(selectedCrop.expectedHarvest).getTime()) 
                          ? new Date(selectedCrop.expectedHarvest).toLocaleDateString()
                          : selectedCrop.harvestWindow 
                          ? selectedCrop.harvestWindow.replace('Expected Harvest Window: ', '')
                          : 'Not calculated'
                        }
                      </div>
                      <div className="text-xs opacity-75">
                        {selectedCrop.expectedHarvest && !isNaN(new Date(selectedCrop.expectedHarvest).getTime()) 
                          ? (() => {
                              const daysToHarvest = Math.floor((new Date(selectedCrop.expectedHarvest).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                              return daysToHarvest > 0 ? `${daysToHarvest} days left` : `${Math.abs(daysToHarvest)} days overdue`;
                            })()
                          : ''
                        }
                      </div>
                    </div>
                    <div className="text-center">
                      <Badge className="h-8 w-8 mx-auto mb-2 flex items-center justify-center bg-white/20 text-white border-white/30">
                        {selectedCrop.status.charAt(0).toUpperCase()}
                      </Badge>
                      <div className="text-sm opacity-90">{t('status')}</div>
                      <div className="font-semibold capitalize">{selectedCrop.status}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Today's Activities */}
              <Card className="border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Bell className="mr-2 h-5 w-5" />
                      {t('todayActivities')}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date().toLocaleDateString()}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {todayActivities.length > 0 ? (
                    <div className="space-y-3">
                      {todayActivities.map((activity) => (
                        <div key={activity.id} className={`flex items-start space-x-3 p-3 ${activity.bgColor} rounded-lg border ${activity.borderColor}`}>
                          <activity.icon className={`h-5 w-5 ${activity.color} mt-0.5 flex-shrink-0`} />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium text-foreground">{activity.title}</h4>
                              <span className="text-xs text-muted-foreground">{activity.timeSlot}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{activity.description}</p>
                          </div>
                          <Badge className={`${
                            activity.priority === 'urgent'
                              ? 'bg-red-200 dark:bg-red-800/50 text-red-900 dark:text-red-200 border-red-300 dark:border-red-600'
                              : activity.priority === 'high' 
                              ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-700'
                              : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700'
                          }`}>
                            {t('priority')}: {t(activity.priority)}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No activities scheduled for this time</p>
                      <p className="text-xs mt-1">Activities will appear based on crop growth stage and time</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Weekly Calendar */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    {t('cropCalendar')} - {selectedCrop.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {calendar.map((week) => (
                      <div key={week.week} className="border rounded-lg p-4 bg-muted/30">
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center space-x-3">
                            <Badge variant="outline" className="px-3">
                              {t('week')} {week.week}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {week.startDate.toLocaleDateString()}
                            </span>
                          </div>
                          <Badge className="bg-green-100 text-green-800">
                            {getCropStageText(week.cropStage)}
                          </Badge>
                        </div>
                        
                        {week.activities.length > 0 ? (
                          <div className="space-y-2">
                            {week.activities.map((activity, index) => (
                              <div key={index} className="flex items-center space-x-3 p-2 rounded-md bg-background">
                                <activity.icon className={`h-4 w-4 ${activity.color}`} />
                                <div className="flex-1">
                                  <div className="font-medium text-sm">{activity.title}</div>
                                  <div className="text-xs text-muted-foreground">{activity.description}</div>
                                </div>
                                <Badge className={getPriorityColor(activity.priority) + ' text-xs'}>
                                  {t(activity.priority)}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4 text-muted-foreground">
                            <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">{t('noActivitiesScheduled')}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Smart Tips */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <AlertTriangle className="mr-2 h-5 w-5" />
                      Smart Tips for {selectedCrop.name}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Growth Stage Specific
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {generateSmartTips().map((tip, index) => {
                      const colors = [
                        { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-700', title: 'text-blue-900 dark:text-blue-100', text: 'text-blue-700 dark:text-blue-300' },
                        { bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-700', title: 'text-green-900 dark:text-green-100', text: 'text-green-700 dark:text-green-300' },
                        { bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-200 dark:border-purple-700', title: 'text-purple-900 dark:text-purple-100', text: 'text-purple-700 dark:text-purple-300' },
                        { bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-200 dark:border-orange-700', title: 'text-orange-900 dark:text-orange-100', text: 'text-orange-700 dark:text-orange-300' }
                      ];
                      const colorSet = colors[index % colors.length];
                      
                      return (
                        <div key={index} className={`p-3 ${colorSet.bg} rounded-lg border ${colorSet.border}`}>
                          <h4 className={`font-medium ${colorSet.title}`}>{tip.title}</h4>
                          <p className={`text-sm ${colorSet.text}`}>{tip.tip}</p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AICropCalendar;