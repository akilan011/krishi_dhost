import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Wheat, TrendingUp, Building, UserCheck, Calendar, Bell, Mic } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import Weather from "@/components/Weather";

const DashboardHome = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

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
    { label: t('alerts'), value: "2 " + t('newAlerts'), icon: Bell, color: "text-red-500" }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-agricultural rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">
          {t('goodMorningFarmer')}
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
            <Card key={stat.label} className="text-center">
              <CardContent className="p-4">
                <stat.icon className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="font-semibold text-lg">{stat.value}</p>
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

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            {t('recentActivity')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-success/10 rounded-lg">
              <Wheat className="h-5 w-5 text-success" />
              <div>
                <p className="font-medium">{t('riceCropUpdated')}</p>
                <p className="text-sm text-muted-foreground">2 {t('hoursAgo')}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-accent/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-accent" />
              <div>
                <p className="font-medium">{t('marketPriceAlert')}</p>
                <p className="text-sm text-muted-foreground">5 {t('hoursAgo')}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardHome;