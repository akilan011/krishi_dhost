import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Wheat, TrendingUp, Building, UserCheck, Calendar, Bell, Mic, Droplets, Bug, Zap, AlertTriangle, IndianRupee, FileText, Beaker } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import Weather from "@/components/Weather";

const DashboardHome = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [liveAlerts, setLiveAlerts] = useState([]);
  
  // Function to scroll to alerts section
  const scrollToAlerts = () => {
    const alertsSection = document.getElementById('live-alerts-section');
    if (alertsSection) {
      alertsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  
  // Get current user and time-based greeting
  const getCurrentUser = () => {
    const farmerData = localStorage.getItem('farmerData');
    return farmerData ? JSON.parse(farmerData) : null;
  };
  
  const getUserCropsKey = () => {
    const user = getCurrentUser();
    return user ? `farmerCrops_${user.name}` : 'farmerCrops';
  };
  
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    const user = getCurrentUser();
    const userName = user?.name || 'Farmer';
    
    if (hour < 12) {
      return `Good Morning, ${userName}!`;
    } else if (hour < 17) {
      return `Good Afternoon, ${userName}!`;
    } else {
      return `Good Evening, ${userName}!`;
    }
  };
  
  // Generate live alerts based on crops and time
  const generateLiveAlerts = () => {
    const user = getCurrentUser();
    if (!user) return [];
    
    const userCropsKey = getUserCropsKey();
    const savedCrops = localStorage.getItem(userCropsKey);
    if (!savedCrops) return [];
    
    const crops = JSON.parse(savedCrops);
    const alerts = [];
    const now = new Date();
    const currentHour = now.getHours();
    
    crops.forEach(crop => {
      const plantedDate = new Date(crop.plantedDate);
      const daysSincePlanted = Math.floor((now.getTime() - plantedDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // Morning irrigation alerts (6-8 AM)
      if (currentHour >= 6 && currentHour <= 8) {
        alerts.push({
          id: `irrigation_${crop.id}`,
          type: 'irrigation',
          priority: 'high',
          icon: Droplets,
          color: 'text-blue-600 dark:text-blue-400',
          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
          borderColor: 'border-blue-200 dark:border-blue-700',
          title: `Morning Irrigation - ${crop.name}`,
          message: `Check soil moisture for ${crop.name} in ${crop.area}`,
          time: 'Now'
        });
      }
      
      // Fertilizer alerts (every 21 days)
      if (daysSincePlanted > 0 && daysSincePlanted % 21 === 0) {
        alerts.push({
          id: `fertilizer_${crop.id}`,
          type: 'fertilizer',
          priority: 'high',
          icon: Zap,
          color: 'text-yellow-600 dark:text-yellow-400',
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
          borderColor: 'border-yellow-200 dark:border-yellow-700',
          title: `Fertilizer Application - ${crop.name}`,
          message: `Apply NPK fertilizer to ${crop.name} (Day ${daysSincePlanted})`,
          time: 'Today'
        });
      }
      
      // Pest inspection alerts (every 14 days)
      if (daysSincePlanted > 7 && daysSincePlanted % 14 === 0) {
        alerts.push({
          id: `pest_${crop.id}`,
          type: 'pest',
          priority: 'moderate',
          icon: Bug,
          color: 'text-red-600 dark:text-red-400',
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          borderColor: 'border-red-200 dark:border-red-700',
          title: `Pest Inspection - ${crop.name}`,
          message: `Check for pest damage on ${crop.name} leaves`,
          time: 'Today'
        });
      }
      
      // Harvest preparation (7 days before expected harvest)
      const expectedHarvest = new Date(crop.expectedHarvest);
      const daysToHarvest = Math.floor((expectedHarvest.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysToHarvest <= 7 && daysToHarvest > 0) {
        alerts.push({
          id: `harvest_${crop.id}`,
          type: 'harvest',
          priority: 'high',
          icon: AlertTriangle,
          color: 'text-orange-600 dark:text-orange-400',
          bgColor: 'bg-orange-50 dark:bg-orange-900/20',
          borderColor: 'border-orange-200 dark:border-orange-700',
          title: `Harvest Preparation - ${crop.name}`,
          message: `Prepare for harvest in ${daysToHarvest} days`,
          time: `${daysToHarvest} days left`
        });
      }
      
      // Overdue harvest alerts
      if (daysToHarvest < 0) {
        alerts.push({
          id: `overdue_${crop.id}`,
          type: 'overdue',
          priority: 'urgent',
          icon: AlertTriangle,
          color: 'text-red-700 dark:text-red-300',
          bgColor: 'bg-red-100 dark:bg-red-900/30',
          borderColor: 'border-red-300 dark:border-red-600',
          title: `Harvest Overdue - ${crop.name}`,
          message: `${crop.name} harvest is ${Math.abs(daysToHarvest)} days overdue!`,
          time: 'Urgent'
        });
      }
    });
    
    // Market Price Alerts (simulated - would connect to real API)
    const marketAlerts = generateMarketAlerts(crops);
    alerts.push(...marketAlerts);
    
    // Government Scheme Alerts
    const schemeAlerts = generateSchemeAlerts();
    alerts.push(...schemeAlerts);
    
    // Fertilizer & Input Alerts
    const fertilizerAlerts = generateFertilizerAlerts(crops);
    alerts.push(...fertilizerAlerts);
    
    return alerts.slice(0, 8); // Increased limit for more alert types
  };
  
  useEffect(() => {
    // Generate alerts on component mount
    setLiveAlerts(generateLiveAlerts());
    
    // Update alerts every minute
    const interval = setInterval(() => {
      setLiveAlerts(generateLiveAlerts());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Generate market price alerts
  const generateMarketAlerts = (crops) => {
    const alerts = [];
    const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Market price updates (simulate price changes)
    crops.forEach(crop => {
      const priceChange = Math.random() > 0.7; // 30% chance of price change
      if (priceChange) {
        const isIncrease = Math.random() > 0.5;
        const percentage = Math.floor(Math.random() * 15) + 5; // 5-20% change
        
        alerts.push({
          id: `market_${crop.id}`,
          type: 'market',
          priority: isIncrease ? 'moderate' : 'high',
          icon: IndianRupee,
          color: isIncrease ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
          bgColor: isIncrease ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20',
          borderColor: isIncrease ? 'border-green-200 dark:border-green-700' : 'border-red-200 dark:border-red-700',
          title: `${crop.name} Price ${isIncrease ? 'Increased' : 'Decreased'}`,
          message: `Market price ${isIncrease ? 'up' : 'down'} by ${percentage}% - ₹${Math.floor(Math.random() * 1000) + 2000}/quintal`,
          time: 'Today'
        });
      }
    });
    
    return alerts;
  };
  
  // Generate government scheme alerts
  const generateSchemeAlerts = () => {
    const alerts = [];
    const schemes = [
      {
        name: 'PM-KISAN Scheme',
        message: 'Next installment of ₹2000 will be credited on 15th',
        priority: 'moderate'
      },
      {
        name: 'Crop Insurance Scheme',
        message: 'Last date for Kharif crop insurance registration: 31st July',
        priority: 'high'
      },
      {
        name: 'Soil Health Card',
        message: 'Free soil testing available at nearest agriculture center',
        priority: 'moderate'
      },
      {
        name: 'Subsidy Alert',
        message: 'New fertilizer subsidy rates updated - Check eligibility',
        priority: 'moderate'
      }
    ];
    
    // Show 1-2 random scheme alerts
    const randomSchemes = schemes.sort(() => 0.5 - Math.random()).slice(0, 2);
    
    randomSchemes.forEach((scheme, index) => {
      alerts.push({
        id: `scheme_${index}`,
        type: 'scheme',
        priority: scheme.priority,
        icon: Building,
        color: 'text-blue-600 dark:text-blue-400',
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        borderColor: 'border-blue-200 dark:border-blue-700',
        title: scheme.name,
        message: scheme.message,
        time: 'New'
      });
    });
    
    return alerts;
  };
  
  // Generate fertilizer and input alerts
  const generateFertilizerAlerts = (crops) => {
    const alerts = [];
    const fertilizerUpdates = [
      {
        type: 'Urea',
        message: 'Urea prices reduced by ₹50/bag - Stock up now!',
        priority: 'moderate',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      },
      {
        type: 'DAP Fertilizer',
        message: 'DAP shortage expected next month - Order in advance',
        priority: 'high',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200'
      },
      {
        type: 'Organic Fertilizer',
        message: 'New organic fertilizer subsidy available - 50% off',
        priority: 'moderate',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      },
      {
        type: 'Pesticide Alert',
        message: 'Fake pesticides detected in market - Buy from authorized dealers',
        priority: 'high',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
      }
    ];
    
    // Show 1 random fertilizer alert
    const randomUpdate = fertilizerUpdates[Math.floor(Math.random() * fertilizerUpdates.length)];
    
    alerts.push({
      id: `fertilizer_update`,
      type: 'fertilizer',
      priority: randomUpdate.priority,
      icon: Beaker,
      color: randomUpdate.color + ' dark:text-green-400',
      bgColor: randomUpdate.bgColor + ' dark:bg-green-900/20',
      borderColor: randomUpdate.borderColor + ' dark:border-green-700',
      title: `${randomUpdate.type} Update`,
      message: randomUpdate.message,
      time: 'Latest'
    });
    
    return alerts;
  };
  
  useEffect(() => {
    // Generate alerts on component mount
    setLiveAlerts(generateLiveAlerts());
    
    // Update alerts every minute
    const interval = setInterval(() => {
      setLiveAlerts(generateLiveAlerts());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const quickActions = [
    {
      title: t('myCrop'),
      description: t('checkCropsField'),
      icon: Wheat,
      path: "/dashboard/my-crop",
      color: "bg-gradient-field"
    },
    {
      title: t('marketPrice'),
      description: t('todayMandiRates'),
      icon: TrendingUp,
      path: "/dashboard/market-price",
      color: "bg-gradient-harvest"
    },
    {
      title: t('govtSchemes'),
      description: t('availableGovtSchemes'),
      icon: Building,
      path: "/dashboard/government-schemes",
      color: "bg-accent"
    },
    {
      title: t('expertHelp'),
      description: t('connectExperts'),
      icon: UserCheck,
      path: "/dashboard/expert-help",
      color: "bg-success"
    }
  ];

  const todayStats = [
    { label: t('season'), value: "Kharif", icon: Calendar, color: "text-green-500" },
    { 
      label: t('alerts'), 
      value: `${liveAlerts.length} ` + t('newAlerts'), 
      icon: Bell, 
      color: "text-red-500",
      onClick: scrollToAlerts,
      clickable: true
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-agricultural rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">
          {getTimeBasedGreeting()}
        </h2>
        <p className="text-white/90">
          {t('farmingDashboardToday')}
        </p>
      </div>

      {/* Weather and Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <Weather />
        </div>
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          {todayStats.map((stat) => (
            <Card 
              key={stat.label} 
              className={`text-center ${stat.clickable ? 'cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105' : ''}`}
              onClick={stat.onClick || undefined}
            >
              <CardContent className="p-4">
                <stat.icon className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="font-semibold text-lg">{stat.value}</p>
                {stat.clickable && (
                  <p className="text-xs text-muted-foreground mt-1">Click to view</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Voice Assistant */}
      <Card className="bg-gradient-agricultural text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">🎤 {t('voiceAssistant')}</h3>
              <p className="text-white/90 mb-4">
                {t('askFarmingQuestions')}
              </p>
            </div>
            <Button 
              variant="hero"
              size="lg"
              className="shadow-xl"
              onClick={() => {/* TODO: Implement voice assistant */}}
            >
              <Mic className="mr-2 h-5 w-5" />
              {t('startVoiceChat')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        {quickActions.map((action) => (
          <Card 
            key={action.path} 
            className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
            onClick={() => navigate(action.path)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${action.color}`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">{action.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {action.description}
              </p>
              <Button variant="outline" size="sm">
                {t('open')} →
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Live Alerts */}
      <Card id="live-alerts-section">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              {t('liveAlerts')} & {t('reminders')}
            </div>
            {liveAlerts.length > 0 && (
              <span className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-xs px-2 py-1 rounded-full">
                {liveAlerts.length} active
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {liveAlerts.length > 0 ? (
            <div className="space-y-3">
              {liveAlerts.map((alert) => (
                <div key={alert.id} className={`flex items-start space-x-3 p-3 ${alert.bgColor} rounded-lg border ${alert.borderColor}`}>
                  <alert.icon className={`h-5 w-5 ${alert.color} mt-0.5 flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm truncate text-foreground">{alert.title}</p>
                      <span className={`text-xs px-2 py-1 rounded ${
                        alert.priority === 'urgent' 
                          ? 'bg-red-200 dark:bg-red-800/50 text-red-800 dark:text-red-200' 
                          : alert.priority === 'high' 
                          ? 'bg-orange-200 dark:bg-orange-800/50 text-orange-800 dark:text-orange-200' 
                          : 'bg-yellow-200 dark:bg-yellow-800/50 text-yellow-800 dark:text-yellow-200'
                      }`}>
                        {alert.priority}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">{t('noActiveAlerts')}</p>
              <p className="text-xs mt-1">{t('addCropsToSeeAlerts')}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardHome;