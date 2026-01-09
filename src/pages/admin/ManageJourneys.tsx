import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBooking } from '@/context/BookingContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Navigation, Plus, MapPin, Bus, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/layouts/AdminLayout';

export default function ManageJourneys() {
  const [selectedBusId, setSelectedBusId] = useState('');
  const [selectedSourceId, setSelectedSourceId] = useState('');
  const [selectedDestinationId, setSelectedDestinationId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { 
    locations, 
    buses, 
    journeys, 
    createJourney, 
    getJourneyByBus, 
    findBusForRoute,
    isBusAssignedToJourney,
    getAvailableSeatsCount,
    isLoading 
  } = useBooking();

  // Auto-fill: If bus is selected, check if it has an existing route
  useEffect(() => {
    if (selectedBusId) {
      const existingJourney = getJourneyByBus(selectedBusId);
      if (existingJourney) {
        // Bus already assigned - this shouldn't happen in the dropdown, but just in case
        setError('This bus is already assigned to a journey');
      }
    }
  }, [selectedBusId, getJourneyByBus]);

  // Auto-fill: If source and destination are selected, find matching bus
  useEffect(() => {
    if (selectedSourceId && selectedDestinationId && !selectedBusId) {
      const matchingBus = findBusForRoute(selectedSourceId, selectedDestinationId);
      if (matchingBus && !isBusAssignedToJourney(matchingBus.id)) {
        setSelectedBusId(matchingBus.id);
      }
    }
  }, [selectedSourceId, selectedDestinationId, selectedBusId, findBusForRoute, isBusAssignedToJourney]);

  const handleCreateJourney = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedBusId) {
      setError('Please select a bus');
      return;
    }

    if (!selectedSourceId) {
      setError('Please select a source location');
      return;
    }

    if (!selectedDestinationId) {
      setError('Please select a destination location');
      return;
    }

    if (selectedSourceId === selectedDestinationId) {
      setError('Source and destination cannot be the same');
      return;
    }

    const result = await createJourney(selectedBusId, selectedSourceId, selectedDestinationId);
    
    if (result) {
      const bus = buses.find(b => b.id === selectedBusId);
      const source = locations.find(l => l.id === selectedSourceId);
      const dest = locations.find(l => l.id === selectedDestinationId);
      setSuccess(`Journey created: ${source?.name} → ${dest?.name} (Bus: ${bus?.busNumber})`);
      setSelectedBusId('');
      setSelectedSourceId('');
      setSelectedDestinationId('');
    } else {
      setError('Failed to create journey. Bus may already be assigned.');
    }
  };

  // Available buses (not assigned to any journey)
  const availableBuses = buses.filter(bus => !isBusAssignedToJourney(bus.id));

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
            <Navigation className="h-6 w-6" />
            Manage Journeys
          </h1>
          <p className="text-muted-foreground">Create routes that users can book</p>
        </div>

        {/* Create New Journey */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Create New Journey</CardTitle>
            <CardDescription>
              Assign a bus to a route. Only journeys are visible to users.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateJourney} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert>
                  <AlertDescription className="text-success">{success}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="bus">Bus</Label>
                <Select 
                  value={selectedBusId} 
                  onValueChange={setSelectedBusId}
                  disabled={isLoading}
                >
                  <SelectTrigger id="bus" className="bg-background">
                    <SelectValue placeholder="Select a bus" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-50">
                    {availableBuses.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground">
                        No available buses. All buses are assigned to journeys.
                      </div>
                    ) : (
                      availableBuses.map((bus) => (
                        <SelectItem key={bus.id} value={bus.id}>
                          {bus.busNumber} ({bus.capacity} seats)
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {availableBuses.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    <Link to="/admin/buses" className="text-primary hover:underline">
                      Create a new bus
                    </Link>{' '}
                    to add more journeys
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="source">Source</Label>
                  <Select 
                    value={selectedSourceId} 
                    onValueChange={setSelectedSourceId}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="source" className="bg-background">
                      <SelectValue placeholder="From" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg z-50">
                      {locations.map((loc) => (
                        <SelectItem 
                          key={loc.id} 
                          value={loc.id}
                          disabled={loc.id === selectedDestinationId}
                        >
                          {loc.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="destination">Destination</Label>
                  <Select 
                    value={selectedDestinationId} 
                    onValueChange={setSelectedDestinationId}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="destination" className="bg-background">
                      <SelectValue placeholder="To" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg z-50">
                      {locations.map((loc) => (
                        <SelectItem 
                          key={loc.id} 
                          value={loc.id}
                          disabled={loc.id === selectedSourceId}
                        >
                          {loc.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedSourceId === selectedDestinationId && selectedSourceId && (
                <p className="text-xs text-destructive">
                  Source and destination cannot be the same
                </p>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || availableBuses.length === 0}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Journey
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Existing Journeys */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Active Journeys</CardTitle>
            <CardDescription>
              {journeys.length} journeys available for booking
            </CardDescription>
          </CardHeader>
          <CardContent>
            {journeys.length === 0 ? (
              <p className="text-sm text-muted-foreground">No journeys created yet.</p>
            ) : (
              <div className="space-y-3">
                {journeys.map((journey) => {
                  const available = getAvailableSeatsCount(journey.id);
                  const booked = journey.totalSeats - available;
                  return (
                    <div 
                      key={journey.id} 
                      className="p-4 border rounded-lg bg-muted/30 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span className="font-medium">
                            {journey.sourceName} → {journey.destinationName}
                          </span>
                        </div>
                        <Badge variant="outline">
                          {available}/{journey.totalSeats} available
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Bus className="h-3 w-3" />
                          {journey.busNumber}
                        </div>
                        <span>•</span>
                        <span>{booked} booked</span>
                      </div>
                      <Link 
                        to={`/admin/journey/${journey.id}`}
                        className="text-sm text-primary hover:underline"
                      >
                        Manage Journey →
                      </Link>
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
