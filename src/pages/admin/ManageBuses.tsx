import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBooking } from '@/context/BookingContext';
import { BusCapacity } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Bus, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/layouts/AdminLayout';

const SEAT_CAPACITIES: BusCapacity[] = [16, 20, 28, 40];

export default function ManageBuses() {
  const [busNumber, setBusNumber] = useState('');
  const [capacity, setCapacity] = useState<BusCapacity | ''>('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { buses, createBus, isBusAssignedToJourney, isLoading } = useBooking();

  const handleCreateBus = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!busNumber.trim()) {
      setError('Bus number is required');
      return;
    }

    if (!capacity) {
      setError('Please select a seat capacity');
      return;
    }

    const result = await createBus(busNumber.trim(), capacity);
    
    if (result) {
      setSuccess(`Bus "${busNumber.trim()}" with ${capacity} seats created successfully`);
      setBusNumber('');
      setCapacity('');
    } else {
      setError('Bus number already exists or failed to create');
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
            <Bus className="h-6 w-6" />
            Manage Buses
          </h1>
          <p className="text-muted-foreground">Register physical bus assets</p>
        </div>

        {/* Create New Bus */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Create New Bus</CardTitle>
            <CardDescription>
              Buses are physical assets. Assign them to journeys to make them available for booking.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateBus} className="space-y-4">
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

              <div className="space-y-2">
                <Label htmlFor="busNumber">Bus Number</Label>
                <Input
                  id="busNumber"
                  placeholder="e.g., MH-04-AB-1234"
                  value={busNumber}
                  onChange={(e) => setBusNumber(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Seat Capacity</Label>
                <Select 
                  value={capacity ? String(capacity) : ''} 
                  onValueChange={(val) => setCapacity(Number(val) as BusCapacity)}
                  disabled={isLoading}
                >
                  <SelectTrigger id="capacity" className="bg-background">
                    <SelectValue placeholder="Select seat capacity" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-50">
                    {SEAT_CAPACITIES.map((cap) => (
                      <SelectItem key={cap} value={String(cap)}>
                        {cap} seats ({cap / 4} rows)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Seats are auto-arranged in rows of 4 (2 left + aisle + 2 right)
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                <Plus className="h-4 w-4 mr-2" />
                Create Bus
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Existing Buses */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Registered Buses</CardTitle>
            <CardDescription>
              {buses.length} buses in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            {buses.length === 0 ? (
              <p className="text-sm text-muted-foreground">No buses registered yet.</p>
            ) : (
              <div className="space-y-2">
                {buses.map((bus) => {
                  const isAssigned = isBusAssignedToJourney(bus.id);
                  return (
                    <div 
                      key={bus.id} 
                      className="flex items-center justify-between p-3 border rounded-md bg-muted/30"
                    >
                      <div className="flex items-center gap-3">
                        <Bus className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <span className="font-medium">{bus.busNumber}</span>
                          <p className="text-xs text-muted-foreground">{bus.capacity} seats</p>
                        </div>
                      </div>
                      <Badge variant={isAssigned ? 'default' : 'secondary'}>
                        {isAssigned ? 'Assigned' : 'Available'}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
