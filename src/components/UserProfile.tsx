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