import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Bell, Droplets, Zap, Bug, Scissors, Wheat, Clock, MapPin, AlertTriangle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const AICropCalendar = () => {
  const { t } = useLanguage();
  const [crops, setCrops] = useState<any[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<any>(null);
  const [currentWeek, setCurrentWeek] = useState(0);

  // Get current user for user-specific data
  const getCurrentUser = () => {
    const farmerData = localStorage.getItem('farmerData');
    return farmerData ? JSON.parse(farmerData) : null;
  };

  const getUserCropsKey = () => {
    const user = getCurrentUser();
    return user ? `farmerCrops_${user.name}` : 'farmerCrops';
  };

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
      if (parsedCrops.length > 0) {
        setSelectedCrop(parsedCrops[0]);
      }
    } else {
      setCrops([]);
    }
  }, []);

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
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-primary" />
          <span className="text-sm text-muted-foreground">{currentDate.toLocaleDateString()}</span>
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
              <div className="flex flex-wrap gap-2">
                {crops.map((crop) => (
                  <Button
                    key={crop.id}
                    variant={selectedCrop?.id === crop.id ? "farmer" : "outline"}
                    onClick={() => setSelectedCrop(crop)}
                    className="flex items-center space-x-2"
                  >
                    <Wheat className="h-4 w-4" />
                    <span>{crop.name} - {crop.variety}</span>
                    <Badge variant="secondary" className="text-xs">
                      {crop.area}
                    </Badge>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {selectedCrop && (
            <>
              {/* Current Crop Status */}
              <Card className="bg-gradient-field text-white">
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <Wheat className="h-8 w-8 mx-auto mb-2" />
                      <div className="text-sm opacity-90">{t('cropName')}</div>
                      <div className="font-semibold">{selectedCrop.name}</div>
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
                    </div>
                    <div className="text-center">
                      <Clock className="h-8 w-8 mx-auto mb-2" />
                      <div className="text-sm opacity-90">{t('expectedHarvest')}</div>
                      <div className="font-semibold">{new Date(selectedCrop.expectedHarvest).toLocaleDateString()}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Today's Activities */}
              <Card className="border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="mr-2 h-5 w-5" />
                    {t('todayActivities')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <Droplets className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-blue-900">{t('morningIrrigation')}</h4>
                        <p className="text-sm text-blue-700">{t('checkSoilMoisture')}</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                        {t('priority')}: {t('high')}
                      </Badge>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <Bug className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-yellow-900">{t('pestMonitoring')}</h4>
                        <p className="text-sm text-yellow-700">{t('inspectLeafDamage')}</p>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                        {t('priority')}: {t('moderate')}
                      </Badge>
                    </div>
                  </div>
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
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="mr-2 h-5 w-5" />
                    {t('smartTips')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-900">{t('weatherBasedIrrigation')}</h4>
                      <p className="text-sm text-blue-700">{t('adjustIrrigationWeather')}</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-medium text-green-900">{t('nutrientManagement')}</h4>
                      <p className="text-sm text-green-700">{t('soilTestRecommended')}</p>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <h4 className="font-medium text-yellow-900">{t('marketTiming')}</h4>
                      <p className="text-sm text-yellow-700">{t('planHarvestMarketPrices')}</p>
                    </div>
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