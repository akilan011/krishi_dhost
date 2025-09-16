import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Wheat, TrendingUp, Building, UserCheck, Home, Camera, Calendar, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { t, language, setLanguage } = useLanguage();
  const { theme } = useTheme();
  const isCollapsed = state === "collapsed";
  


  const menuItems = [
    {
      titleKey: "dashboard",
      url: "/dashboard",
      icon: Home,
      descriptionKey: "dashboardOverview",
      color: "hsl(279, 66%, 38%)" // Purple
    },
    {
      titleKey: "myCrop",
      url: "/dashboard/my-crop",
      icon: Wheat,
      descriptionKey: "manageYourCrops",
      color: "hsl(122, 39%, 49%)" // Green
    },
    {
      titleKey: "aiCropCalendar",
      url: "/dashboard/ai-crop-calendar",
      icon: Calendar,
      descriptionKey: "smartFarmingCalendar",
      color: "hsl(269, 100%, 67%)" // Light Purple
    },
    {
      titleKey: "marketPrice",
      url: "/dashboard/market-price",
      icon: TrendingUp,
      descriptionKey: "getCurrentMarketRates",
      color: "hsl(36, 100%, 50%)" // Orange
    },
    {
      titleKey: "govtSchemes",
      url: "/dashboard/government-schemes",
      icon: Building,
      descriptionKey: "governmentSchemes",
      color: "hsl(51, 100%, 50%)" // Gold
    },
    {
      titleKey: "expertHelp",
      url: "/dashboard/expert-help",
      icon: UserCheck,
      descriptionKey: "getExpertAdvice",
      color: "hsl(353, 66%, 47%)" // Crimson Red
    },
    {
      titleKey: "cameraDetection",
      url: "/dashboard/camera-detection",
      icon: Camera,
      descriptionKey: "identifyCropDiseases",
      color: "hsl(207, 89%, 67%)" // Sky Blue
    },
  ];

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar className="border-r bg-gradient-field">
      <SidebarContent>
        <div className="p-4 border-b border-white/20">
          <h2 className={`font-bold text-lg ${theme === 'light' ? 'text-black' : 'text-lime-400'}`}>{!isCollapsed && "Krishi Dost"}</h2>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel className={`font-semibold ${theme === 'light' ? 'text-black/90' : 'text-white/90'}`}>
            {!isCollapsed && t('mainMenu')}
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.titleKey}>
                  <SidebarMenuButton asChild>
                     <NavLink
                       to={item.url}
                       end={item.url === "/dashboard"}
                       className={`
                         flex items-center p-3 m-2 rounded-lg transition-all duration-200
                         bg-neutral-100 shadow-sm hover:shadow-md min-h-[60px]
                         ${isActive(item.url) 
                           ? "ring-2 ring-primary/20 shadow-md" 
                           : ""
                         }
                       `}
                     >
                       <item.icon 
                         className={`h-5 w-5 ${isCollapsed ? "" : "mr-3"}`} 
                         style={{ color: item.color }}
                       />
                       {!isCollapsed && (
                         <div className="text-black flex-1 min-w-0">
                           <div className="font-bold text-sm leading-tight truncate">{t(item.titleKey)}</div>
                           <div className="text-xs font-medium opacity-70 leading-tight overflow-hidden" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}>
                             {t(item.descriptionKey)}
                           </div>
                         </div>
                       )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}