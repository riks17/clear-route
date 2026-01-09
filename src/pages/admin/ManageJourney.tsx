import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useBooking } from '@/context/BookingContext';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { SuccessMessage } from '@/components/SuccessMessage';
import { ErrorState } from '@/components/StateIndicators';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, AlertTriangle, MapPin, Users, Bus } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';

export default function ManageJourney() {
  const { journeyId } = useParams<{ journeyId: string }>();
  const navigate = useNavigate();
  const { getJourneyById, resetJourney, bookings, isLoading } = useBooking();
  
  const [showConfirm, setShowConfirm] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const journey = journeyId ? getJourneyById(journeyId) : undefined;

  if (!journey) {
    return (
      <AdminLayout>
        <ErrorState 
          message="Journey not found."
          onRetry={() => navigate('/admin/journeys')}
        />
      </AdminLayout>
    );
  }

  const bookedSeats = journey.seats.filter(s => s.isBooked).length;
  const journeyBookings = bookings.filter(b => b.journeyId === journey.id && b.status === 'confirmed');

  const handleResetConfirm = async () => {
    const success = await resetJourney(journey.id);
    if (success) {
      setResetSuccess(true);
    }
    setShowConfirm(false);
  };

  if (resetSuccess) {
    return (
      <AdminLayout>
        <SuccessMessage
          title="Journey Reset Successfully"
          message={`All seats on ${journey.sourceName} → ${journey.destinationName} have been freed and all bookings cancelled.`}
          action={{
            label: 'Back to Journeys',
            onClick: () => navigate('/admin/journeys'),
          }}
        />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-xl mx-auto space-y-6">
        <Link 
          to="/admin/journeys" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to journeys
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              {journey.sourceName} → {journey.destinationName}
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Bus className="h-4 w-4" />
              {journey.busNumber}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{bookedSeats} / {journey.totalSeats} seats booked</span>
            </div>

            <div className="text-sm text-muted-foreground">
              Active bookings: {journeyBookings.length}
            </div>
          </CardContent>
        </Card>

        {/* Destructive Reset Section */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Reset Journey
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Warning: Destructive Action</AlertTitle>
              <AlertDescription>
                This will cancel ALL bookings for this journey and free ALL seats. 
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
          title="Confirm Journey Reset"
          description={`This will cancel all ${journeyBookings.length} active bookings and free all ${bookedSeats} booked seats on ${journey.sourceName} → ${journey.destinationName}. This action cannot be undone.`}
          confirmLabel="Yes, Reset Journey"
          onConfirm={handleResetConfirm}
          variant="destructive"
        />
      </div>
    </AdminLayout>
  );
}
