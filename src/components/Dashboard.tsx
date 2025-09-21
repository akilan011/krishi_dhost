import { useState, useEffect } from "react";
import { Sidebar, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { LocationDisplay } from "@/components/LocationDisplay";
import { LanguageSelector } from "@/components/LanguageSelector";
import { UserProfile } from "@/components/UserProfile";
import { ThemeToggle } from "@/components/ThemeToggle";

const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [farmerData, setFarmerData] = useState<any>(null);
  const [locationKey, setLocationKey] = useState(0);

  useEffect(() => {
    // Load farmer data from localStorage
    const data = localStorage.getItem("farmerData");
    if (data) {
      setFarmerData(JSON.parse(data));
    }
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className={`h-16 border-b backdrop-blur-sm flex items-center px-4 shadow-sm ${theme === 'dark' ? 'bg-black/95' : 'bg-white/95'}`}>
            <SidebarTrigger className={`mr-4 ${theme === 'dark' ? 'text-white hover:bg-gray-700' : ''}`} />
            <div className="flex-1">
              <h1 className={`text-xl font-bold flex items-center gap-2 ${theme === 'light' ? 'text-primary' : 'text-lime-400'}`}>
                <img src="https://i.postimg.cc/6yzmZ930/logo.png" alt="Krishi Dost Logo" className="h-8 w-8 bg-white p-1 rounded" />
                {t('krishiDost')}
              </h1>
              {farmerData && (
                <p className="text-sm text-muted-foreground">
                  {t('welcome')}, {farmerData.name}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <LocationDisplay key={locationKey} onLocationChange={() => {
                setLocationKey(prev => prev + 1);
                const data = localStorage.getItem('farmerData');
                if (data) setFarmerData(JSON.parse(data));
              }} />
              <LanguageSelector />
              <ThemeToggle />
              <UserProfile />
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-4 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;