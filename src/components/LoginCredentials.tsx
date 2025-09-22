import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { User, Lock, LogIn, ArrowLeft, UserPlus, WifiOff, AlertCircle, Eye, EyeOff } from "lucide-react";
import farmerHero from "@/assets/farmer-hero.jpg";
import { useLanguage } from "@/contexts/LanguageContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { supabase } from "@/lib/supabase";

const LoginCredentials = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });
  const [error, setError] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
  };

  const handleLogin = async () => {
    setError("");
    setIsLoading(true);
    
    if (!credentials.username || !credentials.password) {
      setError("Please enter both username and password");
      setIsLoading(false);
      return;
    }

    try {
      let userData = null;
      
      // Try Supabase first
      try {
        const { data, error } = await supabase
          .from('farmers')
          .select('*')
          .eq('name', credentials.username)
          .eq('password', credentials.password)
          .single();

        if (data && !error) {
          userData = data;
          console.log('Login successful via Supabase');
        }
      } catch (supabaseError) {
        console.log('Supabase login failed, trying localStorage');
      }
      
      // Fallback to localStorage if Supabase failed
      if (!userData) {
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        userData = registeredUsers.find(user => 
          user.name === credentials.username && user.password === credentials.password
        );
        
        if (userData) {
          console.log('Login successful via localStorage');
        }
      }

      if (!userData) {
        setError("Incorrect username or password");
        setIsLoading(false);
        return;
      }

      // Store farmer data in localStorage
      localStorage.setItem('farmerData', JSON.stringify({
        ...userData,
        isLoggedIn: true
      }));

      navigate("/dashboard");
    } catch (error) {
      setError("Incorrect username or password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = () => {
    navigate("/register");
  };

  const handleOfflineMode = () => {
    if (!credentials.username) {
      alert("Please enter your name to continue offline");
      return;
    }
    // Store minimal data for offline mode
    localStorage.setItem('farmerData', JSON.stringify({
      name: credentials.username,
      isOffline: true,
      isLoggedIn: true
    }));
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-gray-800">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>
      {/* Header with Farmer Image */}
      <div className="relative h-72 overflow-hidden">
        <img 
          src={farmerHero} 
          alt="Farmer in field" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20" />
        <Button
          onClick={() => navigate("/")}
          className="absolute top-4 left-4 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white rounded-xl"
          size="icon"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      {/* Form Section */}
      <div className="px-6 -mt-20 relative z-10">
        <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 rounded-3xl">
          <CardHeader className="text-center pb-6 pt-8">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {t('loginToKrishiDost')}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <p className="text-red-700 dark:text-red-400 font-medium">{error}</p>
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-6">
              <div>
                <Label htmlFor="username" className="text-base font-semibold text-gray-700 dark:text-gray-300">
                  <User className="inline mr-2 h-4 w-4 text-blue-600" />
                  {t('usernameLabel')}
                </Label>
                <Input
                  id="username"
                  placeholder={t('enterName')}
                  value={credentials.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  className="h-14 mt-2 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm transition-all duration-300"
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-base font-semibold text-gray-700 dark:text-gray-300">
                  <Lock className="inline mr-2 h-4 w-4 text-blue-600" />
                  {t('password')}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t('enterPassword')}
                    value={credentials.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="h-14 mt-2 pr-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm transition-all duration-300"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-6">
              <Button 
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50"
              >
                <LogIn className="mr-2 h-4 w-4" />
                {isLoading ? 'Logging in...' : t('login')}
              </Button>

              <Button 
                onClick={handleOfflineMode}
                className="w-full h-11 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold backdrop-blur-sm transition-all duration-300 transform hover:scale-[1.02]"
              >
                <WifiOff className="mr-2 h-4 w-4" />
                {t('continueOffline')}
              </Button>
            </div>

            {/* Register Link */}
            <div className="pt-4 text-center border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {t('newToKrishiDost')}
              </p>
              <Button 
                onClick={handleRegister}
                variant="outline"
                className="w-full h-10 rounded-xl border-2 border-emerald-300 dark:border-emerald-600 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 font-semibold transition-all duration-300"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                {t('createNewAccount')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginCredentials;