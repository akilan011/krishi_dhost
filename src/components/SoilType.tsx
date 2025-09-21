import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Beaker, MapPin, CheckCircle, Droplets, Leaf, Edit2 } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const SoilType = () => {
  const { theme } = useTheme();
  const [selectedLocation, setSelectedLocation] = useState(() => {
    const farmerData = localStorage.getItem('farmerData');
    return farmerData ? JSON.parse(farmerData).village || '' : '';
  });
  const [soilResults, setSoilResults] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedVillage, setSelectedVillage] = useState('');

  const states = ['Punjab', 'Haryana', 'Uttar Pradesh', 'Maharashtra', 'Gujarat', 'Rajasthan', 'Karnataka', 'Tamil Nadu', 'Kerala', 'West Bengal'];
  const districts = {
    'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar'],
    'Haryana': ['Gurgaon', 'Faridabad', 'Karnal'],
    'Uttar Pradesh': ['Lucknow', 'Agra', 'Kanpur'],
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur'],
    'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara'],
    'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur'],
    'Karnataka': ['Bangalore', 'Mysore', 'Hubli'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai'],
    'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode'],
    'West Bengal': ['Kolkata', 'Howrah', 'Darjeeling']
  };
  const villages = {
    'Ludhiana': ['Khanna', 'Samrala', 'Payal'],
    'Amritsar': ['Tarn Taran', 'Patti', 'Khadoor Sahib'],
    'Jalandhar': ['Adampur', 'Nakodar', 'Phillaur'],
    'Gurgaon': ['Sohna', 'Pataudi', 'Manesar'],
    'Faridabad': ['Ballabgarh', 'Palwal', 'Hathin'],
    'Karnal': ['Assandh', 'Nilokheri', 'Indri'],
    'Lucknow': ['Mohanlalganj', 'Malihabad', 'Bakshi Ka Talab'],
    'Agra': ['Fatehabad', 'Kiraoli', 'Bah'],
    'Kanpur': ['Akbarpur', 'Bhognipur', 'Chaubepur'],
    'Mumbai': ['Thane', 'Kalyan', 'Navi Mumbai'],
    'Pune': ['Pimpri', 'Chinchwad', 'Talegaon'],
    'Nagpur': ['Wardha', 'Kamptee', 'Hingna'],
    'Ahmedabad': ['Gandhinagar', 'Kalol', 'Sanand'],
    'Surat': ['Navsari', 'Valsad', 'Bardoli'],
    'Vadodara': ['Anand', 'Bharuch', 'Padra'],
    'Jaipur': ['Amber', 'Sanganer', 'Bassi'],
    'Jodhpur': ['Bilara', 'Luni', 'Phalodi'],
    'Udaipur': ['Nathdwara', 'Rajsamand', 'Bhinder'],
    'Bangalore': ['Anekal', 'Hoskote', 'Devanahalli'],
    'Mysore': ['Mandya', 'Srirangapatna', 'KR Nagar'],
    'Hubli': ['Kalghatgi', 'Kundgol', 'Navalgund'],
    'Chennai': ['Tambaram', 'Avadi', 'Ambattur'],
    'Coimbatore': ['Pollachi', 'Mettupalayam', 'Valparai'],
    'Madurai': ['Melur', 'Vadipatti', 'Peraiyur'],
    'Thiruvananthapuram': ['Nedumangad', 'Attingal', 'Varkala'],
    'Kochi': ['Aluva', 'Perumbavoor', 'Muvattupuzha'],
    'Kozhikode': ['Vatakara', 'Koyilandy', 'Ramanattukara'],
    'Kolkata': ['Salt Lake', 'New Town', 'Rajarhat'],
    'Howrah': ['Bally', 'Serampore', 'Chandannagar'],
    'Darjeeling': ['Kalimpong', 'Kurseong', 'Mirik']
  };

  useEffect(() => {
    const handleLocationChange = (event: any) => {
      setSelectedLocation(event.detail || 'Location');
    };
    
    window.addEventListener('locationChanged', handleLocationChange);
    return () => window.removeEventListener('locationChanged', handleLocationChange);
  }, []);

  const handleLocationSave = () => {
    const newLocation = `${selectedVillage}, ${selectedDistrict}, ${selectedState}`;
    setSelectedLocation(newLocation);
    const farmerData = localStorage.getItem('farmerData');
    if (farmerData) {
      const data = JSON.parse(farmerData);
      data.village = newLocation;
      localStorage.setItem('farmerData', JSON.stringify(data));
    }
    setIsEditingLocation(false);
    (window as any).currentLocation = newLocation;
    window.dispatchEvent(new CustomEvent('locationChanged', { detail: newLocation }));
  };

  const handleLocationCancel = () => {
    setSelectedState('');
    setSelectedDistrict('');
    setSelectedVillage('');
    setIsEditingLocation(false);
  };

  const analyzeSoil = async () => {
    if (!selectedLocation) return;
    
    setAnalyzing(true);
    
    // Simulate soil analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const soilTypes = ['Loamy', 'Sandy', 'Clay', 'Silty', 'Peaty', 'Chalky'];
    const randomSoil = soilTypes[Math.floor(Math.random() * soilTypes.length)];
    
    const result = {
      soil_type: randomSoil,
      ph_level: (Math.random() * 6 + 4).toFixed(1),
      moisture: Math.floor(Math.random() * 40 + 30),
      organic_matter: Math.floor(Math.random() * 15 + 5),
      nitrogen: Math.floor(Math.random() * 50 + 20),
      phosphorus: Math.floor(Math.random() * 30 + 10),
      potassium: Math.floor(Math.random() * 40 + 15),
      recommendations: [
        `This ${randomSoil.toLowerCase()} soil is suitable for crops like wheat, rice, and vegetables`,
        `Consider adding organic compost to improve soil structure`,
        `Regular soil testing recommended every 6 months`,
        `Maintain proper irrigation based on soil moisture levels`
      ]
    };
    
    setSoilResults(result);
    setAnalyzing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-foreground'}`}>
          🌍 Soil Analysis
        </h1>
        <p className={theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'}>
          Analyze soil type and properties for your location
        </p>
      </div>

      {/* Location Selection */}
      <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-600' : ''}>
        <CardHeader>
          <CardTitle className={`flex items-center ${theme === 'dark' ? 'text-white' : ''}`}>
            <MapPin className="mr-2 h-5 w-5" />
            Select Location for Soil Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className={`flex items-center justify-between p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {selectedLocation || 'No location selected'}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditingLocation(true)}
                className="h-8"
              >
                <Edit2 className="h-3 w-3 mr-1" />
                Change
              </Button>
            </div>
            
            {isEditingLocation && (
              <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <Select value={selectedState} onValueChange={(value) => {
                    setSelectedState(value);
                    setSelectedDistrict('');
                    setSelectedVillage('');
                  }}>
                    <SelectTrigger className={`text-xs ${theme === 'dark' ? 'bg-gray-600 text-white' : ''}`}>
                      <SelectValue placeholder="State" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map(state => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedDistrict} onValueChange={(value) => {
                    setSelectedDistrict(value);
                    setSelectedVillage('');
                  }} disabled={!selectedState}>
                    <SelectTrigger className={`text-xs ${theme === 'dark' ? 'bg-gray-600 text-white' : ''}`}>
                      <SelectValue placeholder="District" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedState && districts[selectedState as keyof typeof districts]?.map(district => (
                        <SelectItem key={district} value={district}>{district}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedVillage} onValueChange={setSelectedVillage} disabled={!selectedDistrict}>
                    <SelectTrigger className={`text-xs ${theme === 'dark' ? 'bg-gray-600 text-white' : ''}`}>
                      <SelectValue placeholder="Village" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedDistrict && villages[selectedDistrict as keyof typeof villages]?.map(village => (
                        <SelectItem key={village} value={village}>{village}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex space-x-2">
                  <Button size="sm" onClick={handleLocationSave} disabled={!selectedVillage} className="flex-1">
                    Save Location
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleLocationCancel}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          <Button 
            onClick={analyzeSoil}
            disabled={!selectedLocation || analyzing}
            className="w-full"
            variant="default"
          >
            {analyzing ? (
              <>
                <Beaker className="mr-2 h-4 w-4 animate-pulse" />
                Analyzing Soil...
              </>
            ) : (
              <>
                <Beaker className="mr-2 h-4 w-4" />
                Analyze Soil
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Soil Analysis Results */}
      {soilResults && (
        <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-600' : ''}>
          <CardHeader>
            <CardTitle className={`flex items-center justify-between ${theme === 'dark' ? 'text-white' : ''}`}>
              <span>Soil Analysis Results</span>
              <Badge className={theme === 'dark' ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'}>
                {selectedLocation.split(',')[0]}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Main Soil Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-green-900' : 'bg-green-50'}`}>
                <h3 className={`font-semibold ${theme === 'dark' ? 'text-green-300' : 'text-green-800'}`}>
                  Soil Type
                </h3>
                <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-green-200' : 'text-green-600'}`}>
                  {soilResults.soil_type}
                </p>
              </div>
              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-blue-900' : 'bg-blue-50'}`}>
                <h3 className={`font-semibold ${theme === 'dark' ? 'text-blue-300' : 'text-blue-800'}`}>
                  pH Level
                </h3>
                <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-blue-200' : 'text-blue-600'}`}>
                  {soilResults.ph_level}
                </p>
              </div>
            </div>
            
            {/* Soil Properties */}
            <div className="grid grid-cols-3 gap-4">
              <div className={`text-center p-3 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <Droplets className={`h-5 w-5 mx-auto mb-1 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Moisture</p>
                <p className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : ''}`}>{soilResults.moisture}%</p>
              </div>
              <div className={`text-center p-3 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <Leaf className={`h-5 w-5 mx-auto mb-1 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Organic Matter</p>
                <p className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : ''}`}>{soilResults.organic_matter}%</p>
              </div>
              <div className={`text-center p-3 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <Beaker className={`h-5 w-5 mx-auto mb-1 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Nitrogen</p>
                <p className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : ''}`}>{soilResults.nitrogen} ppm</p>
              </div>
            </div>

            {/* Nutrient Levels */}
            <div className="grid grid-cols-2 gap-4">
              <div className={`p-3 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Phosphorus</p>
                <p className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : ''}`}>{soilResults.phosphorus} ppm</p>
              </div>
              <div className={`p-3 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Potassium</p>
                <p className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : ''}`}>{soilResults.potassium} ppm</p>
              </div>
            </div>
            
            {/* Recommendations */}
            <div>
              <h3 className={`font-semibold mb-3 ${theme === 'dark' ? 'text-white' : ''}`}>
                Recommendations:
              </h3>
              <ul className="space-y-2">
                {soilResults.recommendations?.map((rec: string, idx: number) => (
                  <li key={idx} className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : ''}`}>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SoilType;