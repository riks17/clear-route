import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBooking } from '@/context/BookingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, MapPin, Plus, Trash2 } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';

export default function ManageLocations() {
  const [newLocation, setNewLocation] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { locations, addLocation, isLoading } = useBooking();

  const handleAddLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!newLocation.trim()) {
      setError('Location name is required');
      return;
    }

    if (newLocation.trim().length < 2) {
      setError('Location name must be at least 2 characters');
      return;
    }

    const result = await addLocation(newLocation.trim());
    
    if (result) {
      setSuccess(`"${newLocation.trim()}" added successfully`);
      setNewLocation('');
    } else {
      setError('Location already exists or failed to add');
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <Link 
          to="/admin/dashboard" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>

        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MapPin className="h-6 w-6" />
            Manage Locations
          </h1>
          <p className="text-muted-foreground">Add and manage pickup/drop locations</p>
        </div>

        {/* Add New Location */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Add New Location</CardTitle>
            <CardDescription>
              Locations are used as pickup and drop points for journeys
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddLocation} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert>
                  <AlertDescription className="text-success">{success}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                <Input
                  placeholder="e.g., Thane, Andheri, Ghatkopar"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button type="submit" disabled={isLoading}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Existing Locations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Existing Locations</CardTitle>
            <CardDescription>
              {locations.length} locations configured
            </CardDescription>
          </CardHeader>
          <CardContent>
            {locations.length === 0 ? (
              <p className="text-sm text-muted-foreground">No locations added yet.</p>
            ) : (
              <div className="space-y-2">
                {locations.map((location) => (
                  <div 
                    key={location.id} 
                    className="flex items-center justify-between p-3 border rounded-md bg-muted/30"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{location.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
