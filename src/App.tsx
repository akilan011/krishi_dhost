import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import VoiceAssistant from "@/components/VoiceAssistant";
import SplashScreen from "./components/SplashScreen";
import LoginPage from "./components/LoginPage";
import LoginCredentials from "./components/LoginCredentials";
import RegisterPage from "./components/RegisterPage";
import Dashboard from "./components/Dashboard";
import DashboardHome from "./components/DashboardHome";
import MyCrop from "./components/MyCrop";
import CropSelection from "./components/CropSelection";
import MarketPrice from "./components/MarketPrice";
import GovernmentSchemes from "./components/GovernmentSchemes";
import ExpertHelp from "./components/ExpertHelp";
import CameraDetection from "./components/CameraDetection";
import AICropCalendar from "./components/AICropCalendar";
import LocationPage from "./components/LocationPage";
import Fertilizer from "./components/Fertilizer";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <LanguageProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<SplashScreen />} />
            <Route path="/login" element={<LoginCredentials />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/crop-selection" element={<CropSelection />} />
            <Route path="/dashboard" element={<Dashboard />}>
              <Route index element={<DashboardHome />} />
              <Route path="my-crop" element={<MyCrop />} />
              <Route path="ai-crop-calendar" element={<AICropCalendar />} />
              <Route path="market-price" element={<MarketPrice />} />
              <Route path="government-schemes" element={<GovernmentSchemes />} />
              <Route path="expert-help" element={<ExpertHelp />} />
              <Route path="camera-detection" element={<CameraDetection />} />
              <Route path="fertilizer" element={<Fertilizer />} />
              <Route path="location" element={<LocationPage />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <VoiceAssistant />
        </BrowserRouter>
        </LanguageProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
