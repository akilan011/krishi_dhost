import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Wheat, Calendar, Droplets, Bug, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const MyCrop = () => {
  const navigate = useNavigate();  
  const { t } = useLanguage();
  const [crops, setCrops] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCrop, setEditingCrop] = useState<any>(null);
  const [newCrop, setNewCrop] = useState({
    name: "",
    variety: "",
    plantedDate: "",
    expectedHarvest: "",
    area: "",
    status: "growing"
  });

  // Crop growing periods in days
  const cropGrowingPeriods: { [key: string]: number } = {
    'rice': 120,
    'wheat': 120,
    'corn': 90,
    'maize': 90,
    'barley': 90,
    'millet': 75,
    'sorghum': 100,
    'cotton': 180,
    'sugarcane': 365,
    'potato': 90,
    'tomato': 80,
    'onion': 120,
    'cabbage': 90,
    'carrot': 75,
    'default': 100
  };

  // Calculate expected harvest date based on planting date and crop type
  const calculateHarvestDate = (plantedDate: string, cropName: string) => {
    if (!plantedDate || !cropName) return "";
    
    const plantDate = new Date(plantedDate);
    const growingPeriod = cropGrowingPeriods[cropName.toLowerCase()] || cropGrowingPeriods['default'];
    const harvestDate = new Date(plantDate);
    harvestDate.setDate(plantDate.getDate() + growingPeriod);
    
    return harvestDate.toISOString().split('T')[0];
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

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }

    // Load crops from user-specific localStorage
    const userCropsKey = getUserCropsKey();
    const savedCrops = localStorage.getItem(userCropsKey);
    if (savedCrops) {
      setCrops(JSON.parse(savedCrops));
    } else {
      // Initialize empty crops array for new users
      setCrops([]);
    }
  }, [navigate]);

  const handleAddCrop = () => {
    const expectedHarvest = calculateHarvestDate(newCrop.plantedDate, newCrop.name);
    const crop = {
      ...newCrop,
      expectedHarvest,
      id: Date.now()
    };
    const updatedCrops = [...crops, crop];
    setCrops(updatedCrops);
    localStorage.setItem(getUserCropsKey(), JSON.stringify(updatedCrops));
    resetForm();
  };

  const handleEditCrop = (crop: any) => {
    setEditingCrop(crop);
    setNewCrop(crop);
    setShowAddForm(true);
  };

  const handleUpdateCrop = () => {
    const expectedHarvest = calculateHarvestDate(newCrop.plantedDate, newCrop.name);
    const updatedCrops = crops.map(crop => 
      crop.id === editingCrop.id ? { ...newCrop, expectedHarvest } : crop
    );
    setCrops(updatedCrops);
    localStorage.setItem(getUserCropsKey(), JSON.stringify(updatedCrops));
    resetForm();
  };

  const handleDeleteCrop = (cropId: number) => {
    const updatedCrops = crops.filter(crop => crop.id !== cropId);
    setCrops(updatedCrops); 
    localStorage.setItem(getUserCropsKey(), JSON.stringify(updatedCrops));
  };

  const resetForm = () => {
    setNewCrop({
      name: "",
      variety: "",
      plantedDate: "",
      expectedHarvest: "",
      area: "",
      status: "growing"
    });
    setShowAddForm(false);
    setEditingCrop(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "growing": return "bg-green-100 text-green-800";
      case "flowering": return "bg-yellow-100 text-yellow-800";
      case "harvesting": return "bg-orange-100 text-orange-800";
      case "harvested": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "growing": return t('growing');
      case "flowering": return t('flowering');
      case "harvesting": return t('harvesting');
      case "harvested": return t('harvested');
      default: return status;
    }
  };

  const cropTips = [
    {
      icon: Droplets,
      title: t('irrigationReminder'),
      description: t('waterRiceCrop')
    },
    {
      icon: Bug,
      title: t('pestAlert'),
      description: t('brownPlanthopper')
    },
    {
      icon: Calendar,
      title: t('fertilizerSchedule'),
      description: t('applyUreaFertilizer')
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('myCrops')}</h1>
          <p className="text-muted-foreground">{t('manageCrops')}</p>
        </div>
        <Button 
          onClick={() => navigate("/crop-selection")}
          variant="farmer"
          className="shadow-lg"
        >
          <Plus className="mr-2 h-4 w-4" />
          {t('addCrop')}
        </Button>
      </div>

      {/* Add Crop Form */}
      {showAddForm && (
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle>{editingCrop ? t('edit') + ' ' + t('myCrop') : t('addNewCrop')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cropName">{t('cropName')}</Label>
                <Input
                  id="cropName"
                  placeholder="e.g., Rice, Wheat"
                  value={newCrop.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const expectedHarvest = calculateHarvestDate(newCrop.plantedDate, name);
                    setNewCrop({...newCrop, name, expectedHarvest});
                  }}
                />
              </div>
              <div>
                <Label htmlFor="variety">{t('variety')}</Label>
                <Input
                  id="variety"
                  placeholder="e.g., Basmati, HD-2967"
                  value={newCrop.variety}
                  onChange={(e) => setNewCrop({...newCrop, variety: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="planted">{t('plantedDate')}</Label>
                <Input
                  id="planted"
                  type="date"
                  value={newCrop.plantedDate}
                  onChange={(e) => {
                    const plantedDate = e.target.value;
                    const expectedHarvest = calculateHarvestDate(plantedDate, newCrop.name);
                    setNewCrop({...newCrop, plantedDate, expectedHarvest});
                  }}
                />
              </div>
              <div>
                <Label htmlFor="harvest">{t('expectedHarvest')} ({t('autoCalculated')})</Label>
                <Input
                  id="harvest"
                  type="date"
                  value={newCrop.expectedHarvest}
                  disabled
                  className="bg-muted cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {t('harvestDateAutoCalculated')}
                </p>
              </div>
              <div>
                <Label htmlFor="area">{t('area')}</Label>
                <Input
                  id="area"
                  placeholder="e.g., 2.5 acres"
                  value={newCrop.area}
                  onChange={(e) => setNewCrop({...newCrop, area: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="status">{t('status')}</Label>
                <Select 
                  onValueChange={(value) => setNewCrop({...newCrop, status: value})}
                  value={newCrop.status}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('selectCategory')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="growing">{t('growing')}</SelectItem>
                    <SelectItem value="flowering">{t('flowering')}</SelectItem>
                    <SelectItem value="harvesting">{t('harvesting')}</SelectItem>
                    <SelectItem value="harvested">{t('harvested')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={editingCrop ? handleUpdateCrop : handleAddCrop} variant="farmer">
                {editingCrop ? t('save') : t('addCrop')}
              </Button>
              <Button onClick={resetForm} variant="outline">
                {t('cancel')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Crop Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {crops.map((crop) => (
          <Card key={crop.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  <Wheat className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{t(crop.name) || crop.name}</CardTitle>
                </div>
                <Badge className={getStatusColor(crop.status)}>
                  {getStatusText(crop.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><strong>{t('area')}:</strong> {crop.area}</p>
                <p><strong>{t('plantedDate')}:</strong> {new Date(crop.plantedDate).toLocaleDateString()}</p>
                {crop.harvestWindow ? (
                  <p><strong>Harvest Window:</strong> {crop.harvestWindow.replace('Expected Harvest Window: ', '')}</p>
                ) : (
                  <p><strong>{t('expectedHarvest')}:</strong> {new Date(crop.expectedHarvest).toLocaleDateString()}</p>
                )}
              </div>
              <div className="flex space-x-2 mt-4">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleEditCrop(crop)}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  {t('edit')}
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleDeleteCrop(crop.id)}
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  {t('delete')}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tips and Reminders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            {t('todayTipsReminders')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {cropTips.map((tip, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                <tip.icon className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">{tip.title}</h4>
                  <p className="text-sm text-muted-foreground">{tip.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyCrop;