import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, Sun, CloudRain, Thermometer, Droplets, Wind, Eye, MapPin } from "lucide-react";

interface WeatherData {
  location: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  icon: string;
}

const Weather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getCurrentUser = () => {
    const farmerData = localStorage.getItem('farmerData');
    return farmerData ? JSON.parse(farmerData) : null;
  };

  const getWeatherIcon = (iconCode: string) => {
    if (iconCode.includes('01')) return <Sun className="h-8 w-8 text-yellow-500" />;
    if (iconCode.includes('02') || iconCode.includes('03') || iconCode.includes('04')) return <Cloud className="h-8 w-8 text-gray-500" />;
    if (iconCode.includes('09') || iconCode.includes('10') || iconCode.includes('11')) return <CloudRain className="h-8 w-8 text-blue-500" />;
    return <Sun className="h-8 w-8 text-yellow-500" />;
  };

  const fetchWeatherByLocation = async (city: string, state: string) => {
    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
    if (!API_KEY || API_KEY === 'YOUR_OPENWEATHERMAP_API_KEY_HERE') {
      setError("Weather API key not configured");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city},${state},IN&appid=${API_KEY}&units=metric`
      );
      
      if (!response.ok) throw new Error('Weather data not found');
      
      const data = await response.json();
      
      setWeather({
        location: `${data.name}, ${state}`,
        temperature: Math.round(data.main.temp),
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        visibility: data.visibility / 1000,
        icon: data.weather[0].icon
      });
    } catch (err) {
      setError("Unable to fetch weather data");
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCoords = async (lat: number, lon: number) => {
    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
    if (!API_KEY || API_KEY === 'YOUR_OPENWEATHERMAP_API_KEY_HERE') {
      setError("Weather API key not configured");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      
      if (!response.ok) throw new Error('Weather data not found');
      
      const data = await response.json();
      
      setWeather({
        location: `${data.name}, ${data.sys.country}`,
        temperature: Math.round(data.main.temp),
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        visibility: data.visibility / 1000,
        icon: data.weather[0].icon
      });
    } catch (err) {
      setError("Unable to fetch weather data");
    } finally {
      setLoading(false);
    }
  };

  const loadWeatherData = () => {
    const user = getCurrentUser();
    
    // Always prioritize user's registered location
    if (user && user.district && user.state) {
      console.log('Using user registered location:', user.district, user.state);
      fetchWeatherByLocation(user.district, user.state);
    } else if (user && user.village && user.state) {
      console.log('Using user village location:', user.village, user.state);
      fetchWeatherByLocation(user.village, user.state);
    } else {
      // Only use default if no user location data
      console.log('No user location found, using default Delhi');
      fetchWeatherByLocation("Delhi", "Delhi");
    }
  };

  useEffect(() => {
    loadWeatherData();

    // Listen for localStorage changes to refresh weather when location is updated
    const handleStorageChange = (e) => {
      if (e.key === 'farmerData') {
        setLoading(true);
        loadWeatherData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events for same-tab updates
    const handleLocationUpdate = () => {
      setLoading(true);
      loadWeatherData();
    };
    
    window.addEventListener('locationUpdated', handleLocationUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('locationUpdated', handleLocationUpdate);
    };
  }, []);

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-gray-300 h-12 w-12"></div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-center text-red-500">
            <Cloud className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!weather) return null;

  return (
    <Card className="w-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-blue-800 dark:text-blue-200">
          <MapPin className="h-5 w-5 mr-2" />
          Live Weather
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {weather.location}
            </h3>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {weather.temperature}°C
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
              {weather.description}
            </p>
          </div>
          <div className="text-right">
            {getWeatherIcon(weather.icon)}
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="flex items-center">
            <Droplets className="h-4 w-4 text-blue-500 mr-1" />
            <span className="text-gray-600 dark:text-gray-400">{weather.humidity}%</span>
          </div>
          <div className="flex items-center">
            <Wind className="h-4 w-4 text-gray-500 mr-1" />
            <span className="text-gray-600 dark:text-gray-400">{weather.windSpeed} m/s</span>
          </div>
          <div className="flex items-center">
            <Eye className="h-4 w-4 text-gray-500 mr-1" />
            <span className="text-gray-600 dark:text-gray-400">{weather.visibility} km</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Weather;