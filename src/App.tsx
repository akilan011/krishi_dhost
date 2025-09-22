import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import SoilType from "./components/SoilType";
import FeedBackPage from "./components/FeedBackPage";
import FeedbackAdmin from "./components/FeedbackAdmin";
import NotFound from "./pages/NotFound";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const farmerData = localStorage.getItem('farmerData');
  return farmerData ? <>{children}</> : <Navigate to="/login" replace />;
};

const HomeRoute = () => {
  const hasSeenSplash = localStorage.getItem('hasSeenSplash');
  const farmerData = localStorage.getItem('farmerData');
  
  // Always show splash screen first if not seen
  if (!hasSeenSplash) {
    return <SplashScreen />;
  }
  
  // If user is logged in, go to dashboard
  if (farmerData) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Otherwise go to login
  return <Navigate to="/login" replace />;
};

const LoginRoute = () => {
  const farmerData = localStorage.getItem('farmerData');
  return farmerData ? <Navigate to="/dashboard" replace /> : <LoginCredentials />;
};

const RegisterRoute = () => {
  const farmerData = localStorage.getItem('farmerData');
  return farmerData ? <Navigate to="/dashboard" replace /> : <RegisterPage />;
};

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
            <Route path="/" element={<HomeRoute />} />
            <Route path="/login" element={<LoginRoute />} />
            <Route path="/register" element={<RegisterRoute />} />
            <Route path="/crop-selection" element={<CropSelection />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
              <Route index element={<DashboardHome />} />
              <Route path="my-crop" element={<MyCrop />} />
              <Route path="ai-crop-calendar" element={<AICropCalendar />} />
              <Route path="market-price" element={<MarketPrice />} />
              <Route path="government-schemes" element={<GovernmentSchemes />} />
              <Route path="expert-help" element={<ExpertHelp />} />
              <Route path="camera-detection" element={<CameraDetection />} />
              <Route path="fertilizer" element={<Fertilizer />} />
              <Route path="soil-type" element={<SoilType />} />
              <Route path="feedback" element={<FeedBackPage />} />
              <Route path="feedback-admin" element={<FeedbackAdmin />} />
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
