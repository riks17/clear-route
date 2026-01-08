import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useBooking } from '@/context/BookingContext';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { SuccessMessage } from '@/components/SuccessMessage';
import { ErrorState } from '@/components/StateIndicators';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, AlertTriangle, MapPin, Users } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';

export default function ManageBus() {
  const { busId } = useParams<{ busId: string }>();
  const navigate = useNavigate();
  const { getBusById, resetBus, bookings, isLoading } = useBooking();
  
  const [showConfirm, setShowConfirm] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const bus = busId ? getBusById(busId) : undefined;

  if (!bus) {
    return (
      <AdminLayout>
        <ErrorState 
          message="Bus not found."
          onRetry={() => navigate('/admin/dashboard')}
        />
      </AdminLayout>
    );
  }

  const bookedSeats = bus.seats.filter(s => s.isBooked).length;
  const busBookings = bookings.filter(b => b.busId === bus.id && b.status === 'confirmed');

  const handleResetConfirm = async () => {
    const success = await resetBus(bus.id);
    if (success) {
      setResetSuccess(true);
    }
    setShowConfirm(false);
  };

  if (resetSuccess) {
    return (
      <AdminLayout>
        <SuccessMessage
          title="Bus Reset Successfully"
          message={`All seats on ${bus.busNumber} have been freed and all bookings cancelled.`}
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
      <div className="max-w-xl mx-auto space-y-6">
        <Link 
          to="/admin/dashboard" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>{bus.busNumber}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {bus.source} → {bus.destination}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{bookedSeats} / {bus.totalSeats} seats booked</span>
            </div>

            <div className="text-sm text-muted-foreground">
              Active bookings: {busBookings.length}
            </div>
          </CardContent>
        </Card>

        {/* Destructive Reset Section */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Reset Bus
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Warning: Destructive Action</AlertTitle>
              <AlertDescription>
                This will cancel ALL bookings for this bus and free ALL seats. 
                This action cannot be undone. All passengers will lose their bookings.
              </AlertDescription>
            </Alert>

            <Button 
              variant="destructive" 
              onClick={() => setShowConfirm(true)}
              disabled={isLoading || bookedSeats === 0}
              className="w-full"
            >
              {bookedSeats === 0 ? 'No Bookings to Reset' : `Reset All ${bookedSeats} Bookings`}
            </Button>
          </CardContent>
        </Card>

        <ConfirmDialog
          open={showConfirm}
          onOpenChange={setShowConfirm}
          title="Confirm Bus Reset"
          description={`This will cancel all ${busBookings.length} active bookings and free all ${bookedSeats} booked seats on ${bus.busNumber}. This action cannot be undone.`}
          confirmLabel="Yes, Reset Bus"
          onConfirm={handleResetConfirm}
          variant="destructive"
        />
      </div>
    </AdminLayout>
  );
}
