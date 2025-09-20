import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { User, MapPin, LogIn, UserPlus, WifiOff, Lock } from "lucide-react";
import farmerHero from "@/assets/farmer-hero.jpg";
import { useLanguage } from "@/contexts/LanguageContext";
import { ThemeToggle } from "@/components/ThemeToggle";

const LoginPage = () => {
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

  // Comprehensive data for Indian states, districts, and villages
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
    "arunachal-pradesh": {
      name: "Arunachal Pradesh",
      districts: {
        "itanagar": { name: "Itanagar", villages: ["Naharlagun", "Banderdewa", "Kimin", "Doimukh", "Sagalee"] },
        "tawang": { name: "Tawang", villages: ["Tawang Town", "Lumla", "Mukto", "Thingbu", "Kitpi"] },
        "west-kameng": { name: "West Kameng", villages: ["Bomdila", "Rupa", "Singchung", "Thembang", "Dirang"] }
      }
    },
    "assam": {
      name: "Assam",
      districts: {
        "kamrup": { name: "Kamrup", villages: ["Guwahati", "Rangia", "Hajo", "Sualkuchi", "Palashbari"] },
        "dibrugarh": { name: "Dibrugarh", villages: ["Dibrugarh Town", "Naharkatiya", "Duliajan", "Moran", "Tingkhong"] },
        "jorhat": { name: "Jorhat", villages: ["Jorhat Town", "Teok", "Titabar", "Mariani", "Pulibor"] },
        "sivasagar": { name: "Sivasagar", villages: ["Sivasagar Town", "Nazira", "Sonari", "Amguri", "Charaideo"] }
      }
    },
    "bihar": {
      name: "Bihar",
      districts: {
        "patna": { name: "Patna", villages: ["Danapur", "Phulwari Sharif", "Masaurhi", "Naubatpur", "Bikram"] },
        "gaya": { name: "Gaya", villages: ["Bodhgaya", "Sherghati", "Tekari", "Banke Bazaar", "Dobhi"] },
        "muzaffarpur": { name: "Muzaffarpur", villages: ["Sitamarhi", "Sheohar", "Kanti", "Aurai", "Gaighat"] },
        "darbhanga": { name: "Darbhanga", villages: ["Laheriasarai", "Keoti", "Ghanshyampur", "Singhwara", "Kusheshwar Asthan"] }
      }
    },
    "chhattisgarh": {
      name: "Chhattisgarh",
      districts: {
        "raipur": { name: "Raipur", villages: ["Abhanpur", "Tilda", "Dharsiwa", "Arang", "Mahasamund"] },
        "bilaspur": { name: "Bilaspur", villages: ["Ratanpur", "Kota", "Masturi", "Bilha", "Takhatpur"] },
        "durg": { name: "Durg", villages: ["Bhilai", "Rajnandgaon", "Khairgarh", "Dongargarh", "Gunderdehi"] }
      }
    },
    "goa": {
      name: "Goa",
      districts: {
        "north-goa": { name: "North Goa", villages: ["Panaji", "Mapusa", "Bicholim", "Pernem", "Bardez"] },
        "south-goa": { name: "South Goa", villages: ["Margao", "Vasco", "Ponda", "Quepem", "Sanguem"] }
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
        "ambala": { name: "Ambala", villages: ["Barara", "Naraingarh", "Saha", "Shahzadpur", "Mullana"] },
        "karnal": { name: "Karnal", villages: ["Assandh", "Gharaunda", "Nilokheri", "Indri", "Taraori"] },
        "hisar": { name: "Hisar", villages: ["Adampur", "Barwala", "Hansi", "Uklana", "Bhiwani"] }
      }
    },
    "himachal-pradesh": {
      name: "Himachal Pradesh",
      districts: {
        "shimla": { name: "Shimla", villages: ["Kufri", "Mashobra", "Theog", "Narkanda", "Rohru"] },
        "kangra": { name: "Kangra", villages: ["Dharamshala", "Palampur", "Baijnath", "Nagrota", "Indora"] },
        "mandi": { name: "Mandi", villages: ["Sundernagar", "Jogindernagar", "Karsog", "Sarkaghat", "Thunag"] }
      }
    },
    "jharkhand": {
      name: "Jharkhand",
      districts: {
        "ranchi": { name: "Ranchi", villages: ["Bundu", "Tamar", "Sonahatu", "Angara", "Namkum"] },
        "jamshedpur": { name: "East Singhbhum", villages: ["Jamshedpur", "Ghatsila", "Potka", "Gurabandha", "Patamda"] },
        "dhanbad": { name: "Dhanbad", villages: ["Jharia", "Sindri", "Nirsa", "Govindpur", "Katras"] }
      }
    },
    "karnataka": {
      name: "Karnataka",
      districts: {
        "bangalore": { name: "Bangalore", villages: ["Anekal", "Hoskote", "Devanahalli", "Doddaballapur", "Nelamangala"] },
        "mysore": { name: "Mysore", villages: ["Mandya", "Srirangapatna", "KR Nagar", "Nanjangud", "T Narsipur"] },
        "hubli": { name: "Dharwad", villages: ["Hubli", "Kalghatgi", "Kundgol", "Navalgund", "Annigeri"] },
        "belgaum": { name: "Belgaum", villages: ["Gokak", "Athni", "Raybag", "Khanapur", "Soundatti"] }
      }
    },
    "kerala": {
      name: "Kerala",
      districts: {
        "thiruvananthapuram": { name: "Thiruvananthapuram", villages: ["Nedumangad", "Attingal", "Varkala", "Chirayinkeezhu", "Neyyattinkara"] },
        "kochi": { name: "Ernakulam", villages: ["Kochi", "Aluva", "Perumbavoor", "Kothamangalam", "Muvattupuzha"] },
        "kozhikode": { name: "Kozhikode", villages: ["Vatakara", "Koyilandy", "Ramanattukara", "Feroke", "Balussery"] },
        "thrissur": { name: "Thrissur", villages: ["Chalakudy", "Kodungallur", "Irinjalakuda", "Guruvayur", "Kunnamkulam"] }
      }
    },
    "madhya-pradesh": {
      name: "Madhya Pradesh",
      districts: {
        "bhopal": { name: "Bhopal", villages: ["Berasia", "Phanda", "Huzur", "Sehore", "Raisen"] },
        "indore": { name: "Indore", villages: ["Depalpur", "Mhow", "Sanwer", "Hatod", "Gautampura"] },
        "gwalior": { name: "Gwalior", villages: ["Dabra", "Bhitarwar", "Morar", "Murar", "Antri"] },
        "jabalpur": { name: "Jabalpur", villages: ["Sihora", "Patan", "Shahpura", "Majholi", "Panagar"] }
      }
    },
    "maharashtra": {
      name: "Maharashtra",
      districts: {
        "mumbai": { name: "Mumbai", villages: ["Kurla", "Andheri", "Borivali", "Thane", "Kalyan"] },
        "pune": { name: "Pune", villages: ["Pimpri", "Chinchwad", "Aundh", "Kothrud", "Hadapsar"] },
        "nagpur": { name: "Nagpur", villages: ["Wardha", "Kamptee", "Hingna", "Parseoni", "Saoner"] },
        "nashik": { name: "Nashik", villages: ["Sinnar", "Niphad", "Dindori", "Kalwan", "Baglan"] },
        "aurangabad": { name: "Aurangabad", villages: ["Paithan", "Vaijapur", "Gangapur", "Khultabad", "Sillod"] }
      }
    },
    "manipur": {
      name: "Manipur",
      districts: {
        "imphal-west": { name: "Imphal West", villages: ["Lamphelpat", "Wangoi", "Patsoi", "Iroisemba", "Sekmai"] },
        "imphal-east": { name: "Imphal East", villages: ["Porompat", "Jiribam", "Sawombung", "Heingang", "Keishamthong"] }
      }
    },
    "meghalaya": {
      name: "Meghalaya",
      districts: {
        "east-khasi-hills": { name: "East Khasi Hills", villages: ["Shillong", "Sohra", "Pynursla", "Mawkyrwat", "Laitumkhrah"] },
        "west-garo-hills": { name: "West Garo Hills", villages: ["Tura", "Williamnagar", "Resubelpara", "Dadengiri", "Tikrikilla"] }
      }
    },
    "mizoram": {
      name: "Mizoram",
      districts: {
        "aizawl": { name: "Aizawl", villages: ["Aizawl City", "Durtlang", "Serchhip", "Champhai", "Kolasib"] },
        "lunglei": { name: "Lunglei", villages: ["Lunglei Town", "Hnahthial", "Tlabung", "Bunghmun", "Thingsulthliah"] }
      }
    },
    "nagaland": {
      name: "Nagaland",
      districts: {
        "kohima": { name: "Kohima", villages: ["Kohima Town", "Jotsoma", "Khuzama", "Mezoma", "Tseminyu"] },
        "dimapur": { name: "Dimapur", villages: ["Dimapur Town", "Chumukedima", "Medziphema", "Diphupar", "Rangapahar"] }
      }
    },
    "odisha": {
      name: "Odisha",
      districts: {
        "khordha": { name: "Khordha", villages: ["Bhubaneswar", "Jatni", "Balianta", "Begunia", "Bolagarh"] },
        "cuttack": { name: "Cuttack", villages: ["Cuttack City", "Athagarh", "Banki", "Baranga", "Niali"] },
        "puri": { name: "Puri", villages: ["Puri Town", "Konark", "Pipili", "Satyabadi", "Gop"] },
        "ganjam": { name: "Ganjam", villages: ["Berhampur", "Chhatrapur", "Gopalpur", "Aska", "Polasara"] }
      }
    },
    "punjab": {
      name: "Punjab",
      districts: {
        "amritsar": { name: "Amritsar", villages: ["Ajnala", "Attari", "Bhikhiwind", "Rayya", "Tarn Taran"] },
        "ludhiana": { name: "Ludhiana", villages: ["Dehlon", "Jagraon", "Khanna", "Payal", "Raikot"] },
        "jalandhar": { name: "Jalandhar", villages: ["Adampur", "Nakodar", "Phillaur", "Shahkot", "Lohian"] },
        "patiala": { name: "Patiala", villages: ["Rajpura", "Samana", "Ghanaur", "Shutrana", "Dera Bassi"] },
        "bathinda": { name: "Bathinda", villages: ["Rampura Phul", "Talwandi Sabo", "Nathana", "Maur", "Sangat"] }
      }
    },
    "rajasthan": {
      name: "Rajasthan",
      districts: {
        "jaipur": { name: "Jaipur", villages: ["Amber", "Sanganer", "Bagru", "Bassi", "Chomu"] },
        "jodhpur": { name: "Jodhpur", villages: ["Bilara", "Luni", "Phalodi", "Osian", "Bhopalgarh"] },
        "udaipur": { name: "Udaipur", villages: ["Nathdwara", "Rajsamand", "Bhinder", "Jhadol", "Salumber"] },
        "kota": { name: "Kota", villages: ["Pipalda", "Ladpura", "Sangod", "Sultanganj", "Digod"] },
        "bikaner": { name: "Bikaner", villages: ["Nokha", "Kolayat", "Lunkaransar", "Khajuwala", "Poogal"] }
      }
    },
    "sikkim": {
      name: "Sikkim",
      districts: {
        "east-sikkim": { name: "East Sikkim", villages: ["Gangtok", "Pakyong", "Ranipool", "Singtam", "Rangpo"] },
        "west-sikkim": { name: "West Sikkim", villages: ["Gyalshing", "Pelling", "Jorethang", "Nayabazar", "Tikjuk"] }
      }
    },
    "tamil-nadu": {
      name: "Tamil Nadu",
      districts: {
        "chennai": { name: "Chennai", villages: ["Tambaram", "Avadi", "Ambattur", "Madhavaram", "Pallavaram"] },
        "coimbatore": { name: "Coimbatore", villages: ["Pollachi", "Mettupalayam", "Valparai", "Sulur", "Annur"] },
        "madurai": { name: "Madurai", villages: ["Melur", "Vadipatti", "Peraiyur", "Thiruparankundram", "Usilampatti"] },
        "salem": { name: "Salem", villages: ["Attur", "Mettur", "Omalur", "Sankari", "Vazhapadi"] },
        "tiruchirappalli": { name: "Tiruchirappalli", villages: ["Srirangam", "Lalgudi", "Manachanallur", "Marungapuri", "Thuraiyur"] }
      }
    },
    "telangana": {
      name: "Telangana",
      districts: {
        "hyderabad": { name: "Hyderabad", villages: ["Secunderabad", "Cyberabad", "Shamshabad", "Patancheru", "Quthbullapur"] },
        "warangal": { name: "Warangal", villages: ["Hanamkonda", "Kazipet", "Nallabelly", "Geesugonda", "Dharmasagar"] },
        "nizamabad": { name: "Nizamabad", villages: ["Bodhan", "Kamareddy", "Banswada", "Yellareddy", "Kotagiri"] }
      }
    },
    "tripura": {
      name: "Tripura",
      districts: {
        "west-tripura": { name: "West Tripura", villages: ["Agartala", "Mohanpur", "Hezamara", "Jirania", "Mandwi"] },
        "south-tripura": { name: "South Tripura", villages: ["Udaipur", "Amarpur", "Karbook", "Kakraban", "Rupaichhari"] }
      }
    },
    "uttarakhand": {
      name: "Uttarakhand",
      districts: {
        "dehradun": { name: "Dehradun", villages: ["Mussoorie", "Rishikesh", "Herbertpur", "Doiwala", "Sahaspur"] },
        "haridwar": { name: "Haridwar", villages: ["Roorkee", "Laksar", "Jwalapur", "Bhagwanpur", "Narsan"] },
        "nainital": { name: "Nainital", villages: ["Haldwani", "Rudrapur", "Kaladhungi", "Lalkuan", "Ramnagar"] }
      }
    },
    "uttar-pradesh": {
      name: "Uttar Pradesh",
      districts: {
        "lucknow": { name: "Lucknow", villages: ["Bakshi Ka Talab", "Mall", "Mohanlalganj", "Gosainganj", "Sarojininagar"] },
        "kanpur": { name: "Kanpur", villages: ["Akbarpur", "Bhognipur", "Chaubepur", "Ghatampur", "Bilhaur"] },
        "agra": { name: "Agra", villages: ["Bah", "Fatehabad", "Kheragarh", "Etmadpur", "Achhnera"] },
        "varanasi": { name: "Varanasi", villages: ["Cholapur", "Pindra", "Arajiline", "Harhua", "Sevapuri"] },
        "allahabad": { name: "Prayagraj", villages: ["Phulpur", "Soraon", "Handia", "Meja", "Karchhana"] },
        "meerut": { name: "Meerut", villages: ["Sardhana", "Daurala", "Parikshitgarh", "Rajpura", "Hastinapur"] }
      }
    },
    "west-bengal": {
      name: "West Bengal",
      districts: {
        "kolkata": { name: "Kolkata", villages: ["Salt Lake", "New Town", "Rajarhat", "Sonarpur", "Budge Budge"] },
        "howrah": { name: "Howrah", villages: ["Bally", "Serampore", "Chandannagar", "Rishra", "Konnagar"] },
        "darjeeling": { name: "Darjeeling", villages: ["Kalimpong", "Kurseong", "Mirik", "Sukhiapokhri", "Pedong"] },
        "north-24-parganas": { name: "North 24 Parganas", villages: ["Barasat", "Basirhat", "Bongaon", "Habra", "Naihati"] }
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      // Reset dependent fields when parent field changes
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

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    if (formData.password !== formData.confirmPassword) return;
    // Save to localStorage and navigate
    localStorage.setItem("farmerData", JSON.stringify({
      ...formData,
      isRegistered: true
    }));
    navigate("/crop-selection");
  };

  const handleOfflineMode = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-emerald-900/20 dark:to-gray-800">
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
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-green-600/20" />
      </div>

      {/* Form Section */}
      <div className="px-6 -mt-20 relative z-10">
        <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 rounded-3xl">
          <CardHeader className="text-center pb-6 pt-8">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              {t('welcomeToKrishiDost')}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Form Fields */}
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
                  className="h-14 mt-2 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-emerald-500 dark:focus:border-emerald-400 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm transition-all duration-300"
                />
              </div>

              {/* State Selection */}
              <div>
                <Label htmlFor="state" className="text-base font-semibold text-gray-700 dark:text-gray-300">
                  <MapPin className="inline mr-2 h-4 w-4 text-emerald-600" />
                  {t('state')}
                </Label>
                <Select onValueChange={(value) => handleInputChange("state", value)}>
                  <SelectTrigger className="h-14 mt-2 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-emerald-500 dark:focus:border-emerald-400 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
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

              {/* District Selection - Only show if state is selected */}
              {formData.state && (
                <div>
                  <Label htmlFor="district" className="text-base font-semibold text-gray-700 dark:text-gray-300">
                    <MapPin className="inline mr-2 h-4 w-4 text-emerald-600" />
                    {t('district')}
                  </Label>
                  <Select onValueChange={(value) => handleInputChange("district", value)} value={formData.district}>
                    <SelectTrigger className="h-14 mt-2 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-emerald-500 dark:focus:border-emerald-400 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                      <SelectValue placeholder={t('selectDistrict')} />
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

              {/* Village Selection - Only show if district is selected */}
              {formData.district && formData.state && (
                <div>
                  <Label htmlFor="village" className="text-base font-semibold text-gray-700 dark:text-gray-300">
                    <MapPin className="inline mr-2 h-4 w-4 text-emerald-600" />
                    {t('village')}
                  </Label>
                  <Select onValueChange={(value) => handleInputChange("village", value)} value={formData.village}>
                    <SelectTrigger className="h-14 mt-2 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-emerald-500 dark:focus:border-emerald-400 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                      <SelectValue placeholder={t('selectVillage')} />
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
                  className="h-14 mt-2 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-emerald-500 dark:focus:border-emerald-400 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm transition-all duration-300"
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
                  className="h-14 mt-2 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-emerald-500 dark:focus:border-emerald-400 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm transition-all duration-300"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-6">
              <Button 
                onClick={handleLogin}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
              >
                <LogIn className="mr-2 h-4 w-4" />
                {t('login')}
              </Button>

              <Button 
                onClick={() => navigate("/register")}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                {t('register')}
              </Button>

              <Button 
                onClick={handleOfflineMode}
                className="w-full h-12 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold backdrop-blur-sm transition-all duration-300 transform hover:scale-[1.02]"
              >
                <WifiOff className="mr-2 h-4 w-4" />
                {t('continueOffline')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;