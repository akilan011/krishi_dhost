import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { User, Lock, LogIn, ArrowLeft } from "lucide-react";
import farmerHero from "@/assets/farmer-hero.jpg";
import { useLanguage } from "@/contexts/LanguageContext";
import { ThemeToggle } from "@/components/ThemeToggle";

const LoginCredentials = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
  };

  const handleLogin = () => {
    // Simulate login validation
    const savedData = localStorage.getItem("farmerData");
    if (savedData) {
      const farmerData = JSON.parse(savedData);
      if (farmerData.name === credentials.username && farmerData.password === credentials.password) {
        navigate("/dashboard");
        return;
      }
    }
    // For demo purposes, allow any login
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-field">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>
      {/* Header with Farmer Image */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={farmerHero} 
          alt="Farmer in field" 
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
        <Button
          onClick={() => navigate(-1)}
          variant="hero"
          size="icon"
          className="absolute top-4 left-4 z-10"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      {/* Form Section */}
      <div className="px-6 -mt-16 relative z-10">
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-foreground">
              {t('loginToKrishiDost')}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="username" className="text-base font-semibold">
                  <User className="inline mr-2 h-4 w-4" />
                  {t('usernameLabel')}
                </Label>
                <Input
                  id="username"
                  placeholder={t('enterName')}
                  value={credentials.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  className="h-12 mt-2"
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-base font-semibold">
                  <Lock className="inline mr-2 h-4 w-4" />
                  {t('password')}
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t('enterPassword')}
                  value={credentials.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="h-12 mt-2"
                />
              </div>
            </div>

            {/* Login Button */}
            <div className="pt-4">
              <Button 
                onClick={handleLogin}
                variant="farmer"
                size="lg"
                className="w-full"
                disabled={!credentials.username || !credentials.password}
              >
                <LogIn className="mr-2 h-5 w-5" />
                {t('login')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginCredentials;