import { useState } from 'react';
import { MapPin, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from '@/contexts/ThemeContext';

export function LocationDisplay({ onLocationChange }: { onLocationChange?: () => void }) {
  const { theme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [location, setLocation] = useState(() => {
    const farmerData = localStorage.getItem('farmerData');
    return farmerData ? JSON.parse(farmerData).village || 'Location' : 'Location';
  });
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

  const handleSave = () => {
    const newLocation = `${selectedVillage}, ${selectedDistrict}, ${selectedState}`;
    setLocation(newLocation);
    const farmerData = localStorage.getItem('farmerData');
    if (farmerData) {
      const data = JSON.parse(farmerData);
      data.village = newLocation;
      localStorage.setItem('farmerData', JSON.stringify(data));
    }
    setIsEditing(false);
    onLocationChange?.();
  };

  const handleCancel = () => {
    setSelectedState('');
    setSelectedDistrict('');
    setSelectedVillage('');
    setIsEditing(false);
  };

  return (
    <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${theme === 'dark' ? 'bg-white text-black' : 'bg-green-100 text-green-800'}`}>
      <MapPin className="h-4 w-4" />
      {isEditing ? (
        <div className="flex items-center space-x-1">
          <Select value={selectedState} onValueChange={(value) => {
            setSelectedState(value);
            setSelectedDistrict('');
            setSelectedVillage('');
          }}>
            <SelectTrigger className="h-8 w-20 text-xs">
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
            <SelectTrigger className="h-8 w-20 text-xs">
              <SelectValue placeholder="District" />
            </SelectTrigger>
            <SelectContent>
              {selectedState && districts[selectedState as keyof typeof districts]?.map(district => (
                <SelectItem key={district} value={district}>{district}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedVillage} onValueChange={setSelectedVillage} disabled={!selectedDistrict}>
            <SelectTrigger className="h-8 w-20 text-xs">
              <SelectValue placeholder="Village" />
            </SelectTrigger>
            <SelectContent>
              {selectedDistrict && villages[selectedDistrict as keyof typeof villages]?.map(village => (
                <SelectItem key={village} value={village}>{village}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button size="sm" onClick={handleSave} disabled={!selectedVillage} className="h-8 px-1">✓</Button>
          <Button size="sm" variant="outline" onClick={handleCancel} className="h-8 px-1">✕</Button>
        </div>
      ) : (
        <div className="flex items-center space-x-1 cursor-pointer" onClick={() => setIsEditing(true)}>
          <span className="text-sm font-medium">{location}</span>
          <Edit2 className="h-3 w-3" />
        </div>
      )}
    </div>
  );
}