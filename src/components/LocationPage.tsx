import { LocationDisplay } from '@/components/LocationDisplay';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

const LocationPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <MapPin className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Location Management</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Current Location</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">Click to edit your location</p>
            <LocationDisplay />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LocationPage;