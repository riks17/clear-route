import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useBooking } from '@/context/BookingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SuccessMessage } from '@/components/SuccessMessage';
import { ArrowLeft } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';

export default function CreateBus() {
  const [busNumber, setBusNumber] = useState('');
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [totalSeats, setTotalSeats] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const { createBus, isLoading } = useBooking();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!busNumber.trim()) {
      setError('Bus number is required');
      return;
    }
    if (!source.trim()) {
      setError('Source location is required');
      return;
    }
    if (!destination.trim()) {
      setError('Destination is required');
      return;
    }
    if (source.trim().toLowerCase() === destination.trim().toLowerCase()) {
      setError('Source and destination cannot be the same');
      return;
    }
    
    const seats = parseInt(totalSeats);
    if (isNaN(seats) || seats < 1) {
      setError('Please enter a valid number of seats (minimum 1)');
      return;
    }
    if (seats > 50) {
      setError('Maximum 50 seats allowed per bus');
      return;
    }

    const result = await createBus(busNumber.trim(), source.trim(), destination.trim(), seats);
    
    if (result) {
      setSuccess(true);
    } else {
      setError('Failed to create bus. Please try again.');
    }
  };

  if (success) {
    return (
      <AdminLayout>
        <SuccessMessage
          title="Bus Created Successfully!"
          message={`${busNumber} with ${totalSeats} seats has been added to the system.`}
          action={{
            label: 'Back to Dashboard',
            onClick: () => navigate('/admin/dashboard'),
          }}
        />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-md mx-auto space-y-4">
        <Link 
          to="/admin/dashboard" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Create New Bus</CardTitle>
            <CardDescription>
              Add a new bus with its route and seat configuration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="busNumber">Bus Number</Label>
                <Input
                  id="busNumber"
                  placeholder="e.g., BUS-001"
                  value={busNumber}
                  onChange={(e) => setBusNumber(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                <Input
                  id="source"
                  placeholder="e.g., New York"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="destination">Destination</Label>
                <Input
                  id="destination"
                  placeholder="e.g., Boston"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalSeats">Total Seats</Label>
                <Input
                  id="totalSeats"
                  type="number"
                  min="1"
                  max="50"
                  placeholder="e.g., 20"
                  value={totalSeats}
                  onChange={(e) => setTotalSeats(e.target.value)}
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">Minimum 1, maximum 50 seats</p>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Bus'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
