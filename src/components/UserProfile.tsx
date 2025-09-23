import { useState } from 'react';
import { User, Edit2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useTheme } from '@/contexts/ThemeContext';

export function UserProfile() {
  const { theme } = useTheme();
  const [farmerData, setFarmerData] = useState(() => {
    const data = localStorage.getItem('farmerData');
    return data ? JSON.parse(data) : null;
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(farmerData || {});
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });

  if (!farmerData) return null;

  const handleSave = () => {
    setFarmerData(editData);
    localStorage.setItem('farmerData', JSON.stringify(editData));
    setIsEditing(false);
  };

  const handlePasswordChange = () => {
    if (passwordData.current === farmerData.password && passwordData.new === passwordData.confirm) {
      const updatedData = { ...farmerData, password: passwordData.new };
      setFarmerData(updatedData);
      localStorage.setItem('farmerData', JSON.stringify(updatedData));
      setPasswordData({ current: '', new: '', confirm: '' });
      setShowPasswordChange(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`h-9 w-9 rounded-full ${theme === 'dark' ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
        >
          <User className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Profile
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {!showPasswordChange ? (
            <>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                {isEditing ? (
                  <Input
                    value={editData.name || ''}
                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                    className="mt-1"
                  />
                ) : (
                  <p className="text-base font-semibold">{farmerData.name}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Location</label>
                {isEditing ? (
                  <Input
                    value={editData.village || ''}
                    onChange={(e) => setEditData({...editData, village: e.target.value})}
                    className="mt-1"
                    placeholder="Village, District, State"
                  />
                ) : (
                  <p className="text-base">{farmerData.village || 'Not specified'}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Registration Status</label>
                <p className="text-base">{farmerData.isRegistered ? 'Registered' : 'Guest'}</p>
              </div>
              <div className="flex gap-2 pt-2">
                {isEditing ? (
                  <>
                    <Button onClick={handleSave} size="sm">
                      <Save className="h-4 w-4 mr-1" /> Save
                    </Button>
                    <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button onClick={() => setIsEditing(true)} size="sm">
                      <Edit2 className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button onClick={() => setShowPasswordChange(true)} variant="outline" size="sm">
                      Change Password
                    </Button>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Current Password</label>
                <Input
                  type="password"
                  value={passwordData.current}
                  onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">New Password</label>
                <Input
                  type="password"
                  value={passwordData.new}
                  onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Confirm New Password</label>
                <Input
                  type="password"
                  value={passwordData.confirm}
                  onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button 
                  onClick={handlePasswordChange} 
                  size="sm"
                  disabled={!passwordData.current || !passwordData.new || passwordData.new !== passwordData.confirm}
                >
                  Update Password
                </Button>
                <Button onClick={() => setShowPasswordChange(false)} variant="outline" size="sm">
                  Cancel
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
import { useState } from 'react';
import { User, Edit2, Save, X, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useTheme } from '@/contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export function UserProfile() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [farmerData, setFarmerData] = useState(() => {
    const data = localStorage.getItem('farmerData');
    return data ? JSON.parse(data) : null;
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(farmerData || {});

  // Location data (same as RegisterPage)
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
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });

  if (!farmerData) return null;

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
    setFarmerData(editData);
    localStorage.setItem('farmerData', JSON.stringify(editData));
    
    // Update registered users in localStorage
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const updatedUsers = registeredUsers.map(user => 
      user.name === editData.name ? { ...user, ...editData } : user
    );
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
    
    setIsEditing(false);
    
    // Trigger weather refresh when location is updated
    window.dispatchEvent(new Event('locationUpdated'));
  };

  const handlePasswordChange = () => {
    if (passwordData.current === farmerData.password && passwordData.new === passwordData.confirm) {
      const updatedData = { ...farmerData, password: passwordData.new };
      setFarmerData(updatedData);
      localStorage.setItem('farmerData', JSON.stringify(updatedData));
      setPasswordData({ current: '', new: '', confirm: '' });
      setShowPasswordChange(false);
    }
  };

  const handleLogout = () => {
    // Clear farmer data completely on logout
    localStorage.removeItem('farmerData');
    navigate('/login');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`h-9 w-9 rounded-full ${theme === 'dark' ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
        >
          <User className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Profile
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {!showPasswordChange ? (
            <>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                {isEditing ? (
                  <Input
                    value={editData.name || ''}
                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                    className="mt-1"
                  />
                ) : (
                  <p className="text-base font-semibold">{farmerData.name}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Location</label>
                {isEditing ? (
                  <div className="space-y-2 mt-1">
                    <Select onValueChange={(value) => handleLocationChange("state", value)} value={editData.state || ''}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select State" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(locationData).map(([key, state]) => (
                          <SelectItem key={key} value={key}>
                            {state.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {editData.state && (
                      <Select onValueChange={(value) => handleLocationChange("district", value)} value={editData.district || ''}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select District" />
                        </SelectTrigger>
                        <SelectContent>
                          {getDistricts(editData.state).map(([key, district]) => (
                            <SelectItem key={key} value={key}>
                              {district.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    
                    {editData.district && editData.state && (
                      <Select onValueChange={(value) => handleLocationChange("village", value)} value={editData.village || ''}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Village" />
                        </SelectTrigger>
                        <SelectContent>
                          {getVillages(editData.state, editData.district).map((village) => (
                            <SelectItem key={village} value={village}>
                              {village}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                ) : (
                  <p className="text-base">
                    {[
                      farmerData.village,
                      farmerData.district && locationData[farmerData.state]?.districts[farmerData.district]?.name,
                      farmerData.state && locationData[farmerData.state]?.name
                    ].filter(Boolean).join(', ') || 'Not specified'}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Registration Status</label>
                <p className="text-base">{farmerData.isRegistered ? 'Registered' : 'Guest'}</p>
              </div>
              <div className="flex gap-2 pt-2">
                {isEditing ? (
                  <>
                    <Button onClick={handleSave} size="sm">
                      <Save className="h-4 w-4 mr-1" /> Save
                    </Button>
                    <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button onClick={() => setIsEditing(true)} size="sm">
                      <Edit2 className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button onClick={() => setShowPasswordChange(true)} variant="outline" size="sm">
                      Change Password
                    </Button>
                    <Button onClick={handleLogout} variant="destructive" size="sm">
                      <LogOut className="h-4 w-4 mr-1" /> Logout
                    </Button>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Current Password</label>
                <Input
                  type="password"
                  value={passwordData.current}
                  onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">New Password</label>
                <Input
                  type="password"
                  value={passwordData.new}
                  onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Confirm New Password</label>
                <Input
                  type="password"
                  value={passwordData.confirm}
                  onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button 
                  onClick={handlePasswordChange} 
                  size="sm"
                  disabled={!passwordData.current || !passwordData.new || passwordData.new !== passwordData.confirm}
                >
                  Update Password
                </Button>
                <Button onClick={() => setShowPasswordChange(false)} variant="outline" size="sm">
                  Cancel
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}