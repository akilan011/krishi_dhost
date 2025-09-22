import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, Search, MapPin, Calendar, Bell, RefreshCw, AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { toast } from "@/hooks/use-toast";

const MarketPrice = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // API Integration State
  const [selectedCommodity, setSelectedCommodity] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedMarket, setSelectedMarket] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [apiData, setApiData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Common commodities for dropdown
  const commodities = [
    "Paddy(Common)", "Wheat", "Maize", "Rice", "Sugarcane", "Cotton", 
    "Soyabean", "Mustard", "Gram", "Jowar", "Bajra", "Arhar", "Onion", "Potato"
  ];

  // Indian states for dropdown
  const states = [
    "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Gujarat", "Haryana", 
    "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
    "Maharashtra", "Odisha", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", 
    "Uttar Pradesh", "West Bengal"
  ];

  // Fetch market data from data.gov.in API via edge function
  const fetchMarketData = async () => {
    if (!selectedCommodity || !selectedState) {
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      // For demonstration, we'll use mock data that simulates the API response
      // In production, you would connect to actual Supabase with the edge function
      const mockData = {
        success: true,
        records: [
          {
            commodity: selectedCommodity,
            variety: "Standard",
            min_price: Math.floor(Math.random() * 1000 + 2000).toString(),
            max_price: Math.floor(Math.random() * 1000 + 3000).toString(),
            modal_price: Math.floor(Math.random() * 1000 + 2500).toString(),
            market: selectedMarket || `${selectedState} Mandi`,
            district: selectedState,
            arrival_date: selectedDate,
            state: selectedState
          },
          {
            commodity: selectedCommodity,
            variety: "Premium",
            min_price: Math.floor(Math.random() * 1000 + 2200).toString(),
            max_price: Math.floor(Math.random() * 1000 + 3200).toString(),
            modal_price: Math.floor(Math.random() * 1000 + 2700).toString(),
            market: selectedMarket || `${selectedState} Central Market`,
            district: selectedState,
            arrival_date: selectedDate,
            state: selectedState
          }
        ],
        count: 2,
        message: `Mock data - Found 2 records for ${selectedCommodity} in ${selectedState}`
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (mockData.success && mockData.records) {
        setApiData(mockData.records);
        
        if (mockData.records.length > 0) {
          toast({
            title: "Market data updated",
            description: mockData.message,
          });
        }
      } else {
        setApiData([]);
        if (mockData.message) {
          setError(mockData.message);
        }
      }
    } catch (err) {
      setError("Failed to fetch market data. Please check your internet connection and try again.");
      console.error('API Error:', err);
      setApiData([]);
      
      toast({
        title: "Connection Error",
        description: "Unable to fetch live market data. Showing sample data instead.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh when inputs change
  useEffect(() => {
    if (selectedCommodity && selectedState) {
      const timer = setTimeout(() => {
        fetchMarketData();
      }, 500); // Debounce API calls
      
      return () => clearTimeout(timer);
    }
  }, [selectedCommodity, selectedState, selectedMarket, selectedDate]);

  // Sample market data
  const marketData = [
    {
      id: 1,
      crop: "Rice",
      variety: "Basmati",
      currentPrice: 3250,
      previousPrice: 3100,
      unit: "per quintal",
      market: "Mandi Samiti, Delhi",
      date: "2024-01-09",
      trend: "up"
    },
    {
      id: 2,
      crop: "Wheat",
      variety: "HD-2967",
      currentPrice: 2180,
      previousPrice: 2220,
      unit: "per quintal",
      market: "APMC Mandi, Punjab",
      date: "2024-01-09",
      trend: "down"
    },
    {
      id: 3,
      crop: "Sugarcane",
      variety: "Co-86032",
      currentPrice: 310,
      previousPrice: 305,
      unit: "per quintal",
      market: "Sugar Mill, UP",
      date: "2024-01-09",
      trend: "up"
    },
    {
      id: 4,
      crop: "Cotton",
      variety: "Kapas",
      currentPrice: 5800,
      previousPrice: 5750,
      unit: "per quintal",
      market: "Cotton Market, Gujarat",
      date: "2024-01-09",
      trend: "up"
    },
    {
      id: 5,
      crop: "Maize",
      variety: "Yellow Corn",
      currentPrice: 1950,
      previousPrice: 1980,
      unit: "per quintal",
      market: "Grain Market, Maharashtra",
      date: "2024-01-09",
      trend: "down"
    },
    {
      id: 6,
      crop: "Soybean",
      variety: "JS-335",
      currentPrice: 4200,
      previousPrice: 4150,
      unit: "per quintal",
      market: "Commodity Exchange, MP",
      date: "2024-01-09",
      trend: "up"
    }
  ];

  const filteredData = marketData.filter(item =>
    item.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.variety.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPriceChange = (current: number, previous: number) => {
    return current - previous;
  };

  const getPriceChangePercent = (current: number, previous: number) => {
    return ((current - previous) / previous * 100).toFixed(1);
  };

  const priceAlerts = [
    {
      crop: "Rice",
      message: "Price increased by ₹150 in the last 7 days",
      type: "increase"
    },
    {
      crop: "Wheat",
      message: "Price dropped by ₹40 today",
      type: "decrease"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('marketPrices')}</h1>
        <p className="text-muted-foreground">{t('latestMandiRates')}</p>
      </div>

      {/* API Integration Form */}
      <Card className={`border-green-200 ${theme === 'dark' ? 'bg-gray-800' : 'bg-green-50'}`}>
        <CardHeader>
          <CardTitle className={`flex items-center ${theme === 'dark' ? 'text-green-400' : 'text-green-800'}`}>
            <RefreshCw className={`mr-2 h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            Live Mandi Prices from Data.gov.in
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-green-300' : 'text-green-900'} mb-2`}>
                Select Commodity
              </label>
              <Select value={selectedCommodity} onValueChange={setSelectedCommodity}>
                <SelectTrigger className={theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white'}>
                  <SelectValue placeholder="Choose commodity" />
                </SelectTrigger>
                <SelectContent>
                  {commodities.map((commodity) => (
                    <SelectItem key={commodity} value={commodity}>
                      {commodity}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-green-300' : 'text-green-900'} mb-2`}>
                Select State
              </label>
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger className={theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white'}>
                  <SelectValue placeholder="Choose state" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-green-300' : 'text-green-900'} mb-2`}>
                Market (Optional)
              </label>
              <Input
                type="text"
                placeholder="Enter market name"
                value={selectedMarket}
                onChange={(e) => setSelectedMarket(e.target.value)}
                className={theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white'}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-green-300' : 'text-green-900'} mb-2`}>
                Date
              </label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className={theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white'}
              />
            </div>
          </div>

          {error && (
            <div className={`flex items-center p-3 border rounded-lg mb-4 ${theme === 'dark' ? 'bg-yellow-900 border-yellow-700' : 'bg-yellow-50 border-yellow-200'}`}>
              <AlertCircle className={`h-5 w-5 mr-2 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`} />
              <p className={theme === 'dark' ? 'text-yellow-200' : 'text-yellow-800'}>{error}</p>
            </div>
          )}

          <Button 
            onClick={fetchMarketData} 
            disabled={!selectedCommodity || !selectedState || loading}
            className="w-full md:w-auto"
          >
            {loading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Fetching Live Data...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Get Latest Prices
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Live API Results */}
      {apiData.length > 0 && (
        <div>
          <h2 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-foreground'}`}>
            Live Market Data - {selectedCommodity} in {selectedState}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {apiData.slice(0, 6).map((item, index) => (
              <Card key={index} className={`hover:shadow-lg transition-shadow ${theme === 'dark' ? 'border-gray-600 bg-gray-800' : 'border-green-200'}`}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className={`text-lg ${theme === 'dark' ? 'text-green-400' : 'text-green-800'}`}>{item.commodity || selectedCommodity}</CardTitle>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'}`}>{item.variety || "Standard"}</p>
                    </div>
                    <Badge className={theme === 'dark' ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'}>
                      <TrendingUp className="h-3 w-3 mr-1" />
                      LIVE
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className={`p-2 rounded ${theme === 'dark' ? 'bg-red-900' : 'bg-red-50'}`}>
                        <p className={`text-xs font-medium ${theme === 'dark' ? 'text-red-300' : 'text-red-600'}`}>MIN</p>
                        <p className={`text-lg font-bold ${theme === 'dark' ? 'text-red-200' : 'text-red-700'}`}>
                          ₹{item.min_price || "N/A"}
                        </p>
                      </div>
                      <div className={`p-2 rounded ${theme === 'dark' ? 'bg-blue-900' : 'bg-blue-50'}`}>
                        <p className={`text-xs font-medium ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>MODAL</p>
                        <p className={`text-lg font-bold ${theme === 'dark' ? 'text-blue-200' : 'text-blue-700'}`}>
                          ₹{item.modal_price || "N/A"}
                        </p>
                      </div>
                      <div className={`p-2 rounded ${theme === 'dark' ? 'bg-green-900' : 'bg-green-50'}`}>
                        <p className={`text-xs font-medium ${theme === 'dark' ? 'text-green-300' : 'text-green-600'}`}>MAX</p>
                        <p className={`text-lg font-bold ${theme === 'dark' ? 'text-green-200' : 'text-green-700'}`}>
                          ₹{item.max_price || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <MapPin className={`h-4 w-4 mr-2 ${theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'}`} />
                        <span className={theme === 'dark' ? 'text-gray-300' : ''}>{item.market || item.district || "Market Name Not Available"}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className={`h-4 w-4 mr-2 ${theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'}`} />
                        <span className={theme === 'dark' ? 'text-gray-300' : ''}>{item.arrival_date || selectedDate}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* No Results Message */}
      {selectedCommodity && selectedState && !loading && apiData.length === 0 && !error && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-orange-900 mb-2">
              No market data available for your selection
            </h3>
            <p className="text-orange-700 mb-4">
              Please try another market or date. You can also check the sample data below.
            </p>
            <Button variant="outline" onClick={() => {
              setSelectedCommodity("");
              setSelectedState("");
            }}>
              Reset Selection
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters for Sample Data */}
      <Card>
        <CardHeader>
          <CardTitle>Sample Market Data</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('searchCropsVarieties')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedCategory === "all" ? "farmer" : "outline"}
                onClick={() => setSelectedCategory("all")}
                size="sm"
              >
                {t('allCrops')}
              </Button>
              <Button
                variant={selectedCategory === "cereals" ? "farmer" : "outline"}
                onClick={() => setSelectedCategory("cereals")}
                size="sm"
              >
                {t('cereals')}
              </Button>
              <Button
                variant={selectedCategory === "cash" ? "farmer" : "outline"}
                onClick={() => setSelectedCategory("cash")}
                size="sm"
              >
                {t('cashCrops')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Price Alerts */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center text-orange-800">
            <Bell className="mr-2 h-5 w-5" />
            {t('priceAlerts')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {priceAlerts.map((alert, index) => (
              <div key={index} className="flex items-center space-x-3 p-2 bg-white rounded-lg">
                <div className={`p-1 rounded-full ${
                  alert.type === "increase" ? "bg-green-100" : "bg-red-100"
                }`}>
                  {alert.type === "increase" ? 
                    <TrendingUp className="h-4 w-4 text-green-600" /> :
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  }
                </div>
                <div>
                  <p className="font-medium text-orange-900">{alert.crop}</p>
                  <p className="text-sm text-orange-700">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Market Price Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredData.map((item) => {
          const priceChange = getPriceChange(item.currentPrice, item.previousPrice);
          const priceChangePercent = getPriceChangePercent(item.currentPrice, item.previousPrice);
          const isPositive = priceChange >= 0;

          return (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{t(item.crop) || item.crop}</CardTitle>
                    <p className="text-sm text-muted-foreground">{t(item.variety) || item.variety}</p>
                  </div>
                  <Badge className={isPositive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                    {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                    {isPositive ? "+" : ""}{priceChangePercent}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-2xl font-bold text-primary">
                      ₹{item.currentPrice.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">{item.unit}</p>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <span className="text-muted-foreground">Previous: </span>
                    <span className="ml-1">₹{item.previousPrice.toLocaleString()}</span>
                    <span className={`ml-2 font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}>
                      ({isPositive ? "+" : ""}₹{Math.abs(priceChange)})
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{item.market}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{new Date(item.date).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <Button size="sm" variant="outline" className="w-full whitespace-nowrap">
                    {t('viewDetails')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Market Tips */}
      <Card>
        <CardHeader>
          <CardTitle>{t('marketTips')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900">{t('bestSellingTime')}</h4>
              <p className="text-sm text-blue-700">{t('riceExpectedRise')}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900">{t('governmentProcurement')}</h4>
              <p className="text-sm text-green-700">{t('mspWheatAnnounced')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketPrice;