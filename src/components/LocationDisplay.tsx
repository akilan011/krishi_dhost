import { useState } from 'react';
import { MapPin, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase';

export function LocationDisplay({ onLocationChange }: { onLocationChange?: () => void }) {
  const { theme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [location, setLocation] = useState(() => {
    const farmerData = localStorage.getItem('farmerData');
    return farmerData ? JSON.parse(farmerData).village || 'Location' : 'Location';
  });
  const [editData, setEditData] = useState(() => {
    const farmerData = localStorage.getItem('farmerData');
    return farmerData ? JSON.parse(farmerData) : {};
  });

  // Location data (same as UserProfile and RegisterPage)
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

  const handleLocationChange = (field: string, value: string) => {
    const newData = { ...editData, [field]: value };
    if (field === 'state') {
      newData.district = '';
      newData.village = '';
    } else if (field === 'district') {
      newData.village = '';
    }
    setEditData(newData);
  };

  const handleSave = async () => {
    try {
      // Update Supabase if possible
      await supabase
        .from('farmers')
        .update({
          state: editData.state,
          district: editData.district,
          village: editData.village
        })
        .eq('name', editData.name);
    } catch (error) {
      console.log('Supabase update failed, using localStorage only');
    }
    
    // Update localStorage
    localStorage.setItem('farmerData', JSON.stringify(editData));
    
    // Update registered users in localStorage
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const updatedUsers = registeredUsers.map(user => 
      user.name === editData.name ? { ...user, ...editData } : user
    );
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
    
    // Update display location
    const newLocation = [
      editData.village,
      editData.district && locationData[editData.state]?.districts[editData.district]?.name,
      editData.state && locationData[editData.state]?.name
    ].filter(Boolean).join(', ');
    setLocation(newLocation);
    
    setIsEditing(false);
    onLocationChange?.();
    
    // Trigger weather refresh
    window.dispatchEvent(new Event('locationUpdated'));
  };

  const handleCancel = () => {
    const farmerData = localStorage.getItem('farmerData');
    setEditData(farmerData ? JSON.parse(farmerData) : {});
    setIsEditing(false);
  };

  return (
    <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border-2 ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-600' : 'bg-green-100 text-green-800 border-green-300'}`}>
      <MapPin className="h-4 w-4" />
      {isEditing ? (
        <div className="flex items-center space-x-1">
          <Select onValueChange={(value) => handleLocationChange("state", value)} value={editData.state || ''}>
            <SelectTrigger className="h-8 w-20 text-xs">
              <SelectValue placeholder="State" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(locationData).map(([key, state]) => (
                <SelectItem key={key} value={key}>{state.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {editData.state && (
            <Select onValueChange={(value) => handleLocationChange("district", value)} value={editData.district || ''}>
              <SelectTrigger className="h-8 w-20 text-xs">
                <SelectValue placeholder="District" />
              </SelectTrigger>
              <SelectContent>
                {getDistricts(editData.state).map(([key, district]) => (
                  <SelectItem key={key} value={key}>{district.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          {editData.district && editData.state && (
            <Select onValueChange={(value) => handleLocationChange("village", value)} value={editData.village || ''}>
              <SelectTrigger className="h-8 w-20 text-xs">
                <SelectValue placeholder="Village" />
              </SelectTrigger>
              <SelectContent>
                {getVillages(editData.state, editData.district).map((village) => (
                  <SelectItem key={village} value={village}>{village}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          <Button size="sm" onClick={handleSave} disabled={!editData.village} className="h-8 px-1">✓</Button>
          <Button size="sm" variant="outline" onClick={handleCancel} className="h-8 px-1">✕</Button>
        </div>
      ) : (
        <div className="flex items-center space-x-1 cursor-pointer" onClick={() => setIsEditing(true)}>
          <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-green-800'}`}>{location}</span>
          <Edit2 className={`h-3 w-3 ${theme === 'dark' ? 'text-white' : 'text-green-800'}`} />
        </div>
      )}
    </div>
  );
}