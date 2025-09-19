import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { User, MapPin, UserPlus, ArrowLeft, Lock } from "lucide-react";
import farmerHero from "@/assets/farmer-hero.jpg";
import { useLanguage } from "@/contexts/LanguageContext";
import { ThemeToggle } from "@/components/ThemeToggle";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    state: "",
    district: "",
    village: "",
    password: "",
    confirmPassword: ""
  });

  // Location data (same as before)
  const locationData = {
    "andhra-pradesh": {
      name: "Andhra Pradesh",
      districts: {
        "anantapur": { name: "Anantapur", villages: ["Hindupur", "Kalyanadurg", "Rayadurg", "Guntakal", "Tadpatri"] },
        "chittoor": { name: "Chittoor", villages: ["Tirupati", "Madanapalle", "Chandragiri", "Puttur", "Srikalahasti"] },
        "east-godavari": { name: "East Godavari", villages: ["Kakinada", "Rajahmundry", "Amalapuram", "Pithapuram", "Ramachandrapuram"] },
        "guntur": { name: "Guntur", villages: ["Tenali", "Bapatla", "Narasaraopet", "Sattenapalli", "Vinukonda"] },
        "krishna": { name: "Krishna", villages: ["Vijayawada", "Machilipatnam", "Gudivada", "Jaggayyapeta", "Nandigama"] }
      }
    },
    "gujarat": {
      name: "Gujarat",
      districts: {
        "ahmedabad": { name: "Ahmedabad", villages: ["Gandhinagar", "Kalol", "Sanand", "Dholka", "Bavla"] },
        "surat": { name: "Surat", villages: ["Navsari", "Valsad", "Bardoli", "Vyara", "Mandvi"] },
        "vadodara": { name: "Vadodara", villages: ["Anand", "Bharuch", "Padra", "Karjan", "Dabhoi"] },
        "rajkot": { name: "Rajkot", villages: ["Jamnagar", "Porbandar", "Gondal", "Jetpur", "Morbi"] }
      }
    },
    "haryana": {
      name: "Haryana",
      districts: {
        "gurgaon": { name: "Gurgaon", villages: ["Sohna", "Pataudi", "Farukh Nagar", "Manesar", "Bilaspur"] },
        "faridabad": { name: "Faridabad", villages: ["Ballabgarh", "Palwal", "Hathin", "Hodal", "Prithla"] },
        "karnal": { name: "Karnal", villages: ["Assandh", "Gharaunda", "Nilokheri", "Indri", "Taraori"] }
      }
    },
    "karnataka": {
      name: "Karnataka",
      districts: {
        "bangalore": { name: "Bangalore", villages: ["Anekal", "Hoskote", "Devanahalli", "Doddaballapur", "Nelamangala"] },
        "mysore": { name: "Mysore", villages: ["Mandya", "Srirangapatna", "KR Nagar", "Nanjangud", "T Narsipur"] },
        "hubli": { name: "Dharwad", villages: ["Hubli", "Kalghatgi", "Kundgol", "Navalgund", "Annigeri"] }
      }
    },
    "maharashtra": {
      name: "Maharashtra",
      districts: {
        "mumbai": { name: "Mumbai", villages: ["Kurla", "Andheri", "Borivali", "Thane", "Kalyan"] },
        "pune": { name: "Pune", villages: ["Pimpri", "Chinchwad", "Aundh", "Kothrud", "Hadapsar"] },
        "nagpur": { name: "Nagpur", villages: ["Wardha", "Kamptee", "Hingna", "Parseoni", "Saoner"] }
      }
    },
    "punjab": {
      name: "Punjab",
      districts: {
        "amritsar": { name: "Amritsar", villages: ["Ajnala", "Attari", "Bhikhiwind", "Rayya", "Tarn Taran"] },
        "ludhiana": { name: "Ludhiana", villages: ["Dehlon", "Jagraon", "Khanna", "Payal", "Raikot"] },
        "jalandhar": { name: "Jalandhar", villages: ["Adampur", "Nakodar", "Phillaur", "Shahkot", "Lohian"] }
      }
    },
    "rajasthan": {
      name: "Rajasthan",
      districts: {
        "jaipur": { name: "Jaipur", villages: ["Amber", "Sanganer", "Bagru", "Bassi", "Chomu"] },
        "jodhpur": { name: "Jodhpur", villages: ["Bilara", "Luni", "Phalodi", "Osian", "Bhopalgarh"] },
        "udaipur": { name: "Udaipur", villages: ["Nathdwara", "Rajsamand", "Bhinder", "Jhadol", "Salumber"] }
      }
    },
    "tamil-nadu": {
      name: "Tamil Nadu",
      districts: {
        "chennai": { name: "Chennai", villages: ["Tambaram", "Avadi", "Ambattur", "Madhavaram", "Pallavaram"] },
        "coimbatore": { name: "Coimbatore", villages: ["Pollachi", "Mettupalayam", "Valparai", "Sulur", "Annur"] },
        "madurai": { name: "Madurai", villages: ["Melur", "Vadipatti", "Peraiyur", "Thiruparankundram", "Usilampatti"] }
      }
    },
    "uttar-pradesh": {
      name: "Uttar Pradesh",
      districts: {
        "lucknow": { name: "Lucknow", villages: ["Bakshi Ka Talab", "Mall", "Mohanlalganj", "Gosainganj", "Sarojininagar"] },
        "kanpur": { name: "Kanpur", villages: ["Akbarpur", "Bhognipur", "Chaubepur", "Ghatampur", "Bilhaur"] },
        "agra": { name: "Agra", villages: ["Bah", "Fatehabad", "Kheragarh", "Etmadpur", "Achhnera"] }
      }
    },
    "west-bengal": {
      name: "West Bengal",
      districts: {
        "kolkata": { name: "Kolkata", villages: ["Salt Lake", "New Town", "Rajarhat", "Sonarpur", "Budge Budge"] },
        "howrah": { name: "Howrah", villages: ["Bally", "Serampore", "Chandannagar", "Rishra", "Konnagar"] },
        "darjeeling": { name: "Darjeeling", villages: ["Kalimpong", "Kurseong", "Mirik", "Sukhiapokhri", "Pedong"] }
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      if (field === 'state') {
        newData.district = '';
        newData.village = '';
      } else if (field === 'district') {
        newData.village = '';
      }
      return newData;
    });
  };

  const getDistricts = (state: string) => {
    const stateData = locationData[state as keyof typeof locationData];
    return stateData ? Object.entries(stateData.districts) : [];
  };

  const getVillages = (state: string, district: string) => {
    const stateData = locationData[state as keyof typeof locationData];
    if (!stateData) return [];
    const districtData = stateData.districts[district as keyof typeof stateData.districts] as any;
    return districtData ? districtData.villages : [];
  };

  const handleRegister = () => {
    if (!formData.name || !formData.state || !formData.district || !formData.village || !formData.password || !formData.confirmPassword) {
      alert("Please fill in all required fields");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    localStorage.setItem("farmerData", JSON.stringify({
      ...formData,
      isRegistered: true
    }));
    navigate("/crop-selection");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-emerald-900/20 dark:to-gray-800">
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>
      
      <div className="relative h-64 overflow-hidden">
        <img 
          src={farmerHero} 
          alt="Farmer in field" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-green-600/20" />
        <Button
          onClick={() => navigate("/login")}
          className="absolute top-4 left-4 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white rounded-xl"
          size="icon"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      <div className="px-6 -mt-16 relative z-10">
        <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 rounded-3xl">
          <CardHeader className="text-center pb-6 pt-8">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              {t('register')}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-base font-semibold text-gray-700 dark:text-gray-300">
                  <User className="inline mr-2 h-4 w-4 text-emerald-600" />
                  {t('yourName')}
                </Label>
                <Input
                  id="name"
                  placeholder={t('enterFullName')}
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="h-12 mt-2 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-emerald-500 dark:focus:border-emerald-400 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm transition-all duration-300"
                />
              </div>

              <div>
                <Label htmlFor="state" className="text-base font-semibold text-gray-700 dark:text-gray-300">
                  <MapPin className="inline mr-2 h-4 w-4 text-emerald-600" />
                  {t('state')}
                </Label>
                <Select onValueChange={(value) => handleInputChange("state", value)}>
                  <SelectTrigger className="h-12 mt-2 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-emerald-500 dark:focus:border-emerald-400 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                    <SelectValue placeholder={t('selectState')} />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-2 border-gray-200 dark:border-gray-700">
                    {Object.entries(locationData).map(([key, state]) => (
                      <SelectItem key={key} value={key} className="rounded-lg">
                        {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.state && (
                <div>
                  <Label htmlFor="district" className="text-base font-semibold text-gray-700 dark:text-gray-300">
                    <MapPin className="inline mr-2 h-4 w-4 text-emerald-600" />
                    District
                  </Label>
                  <Select onValueChange={(value) => handleInputChange("district", value)} value={formData.district}>
                    <SelectTrigger className="h-12 mt-2 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-emerald-500 dark:focus:border-emerald-400 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                      <SelectValue placeholder="Select District" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-2 border-gray-200 dark:border-gray-700">
                      {getDistricts(formData.state).map(([key, district]) => (
                        <SelectItem key={key} value={key} className="rounded-lg">
                          {district.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {formData.district && formData.state && (
                <div>
                  <Label htmlFor="village" className="text-base font-semibold text-gray-700 dark:text-gray-300">
                    <MapPin className="inline mr-2 h-4 w-4 text-emerald-600" />
                    Village
                  </Label>
                  <Select onValueChange={(value) => handleInputChange("village", value)} value={formData.village}>
                    <SelectTrigger className="h-12 mt-2 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-emerald-500 dark:focus:border-emerald-400 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                      <SelectValue placeholder="Select Village" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-2 border-gray-200 dark:border-gray-700">
                      {getVillages(formData.state, formData.district).map((village) => (
                        <SelectItem key={village} value={village} className="rounded-lg">
                          {village}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label htmlFor="password" className="text-base font-semibold text-gray-700 dark:text-gray-300">
                  <Lock className="inline mr-2 h-4 w-4 text-emerald-600" />
                  {t('password')}
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t('enterPassword')}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="h-12 mt-2 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-emerald-500 dark:focus:border-emerald-400 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm transition-all duration-300"
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-base font-semibold text-gray-700 dark:text-gray-300">
                  <Lock className="inline mr-2 h-4 w-4 text-emerald-600" />
                  {t('confirmPassword')}
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder={t('confirmYourPassword')}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  className="h-12 mt-2 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-emerald-500 dark:focus:border-emerald-400 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm transition-all duration-300"
                />
              </div>
            </div>

            <div className="pt-6">
              <Button 
                onClick={handleRegister}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
              >
                <UserPlus className="mr-2 h-5 w-5" />
                {t('register')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;