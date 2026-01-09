import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useBooking } from '@/context/BookingContext';
import { BusSeatLayout } from '@/components/BusSeatLayout';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { SuccessMessage } from '@/components/SuccessMessage';
import { ErrorState, LoadingState } from '@/components/StateIndicators';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, MapPin } from 'lucide-react';
import UserLayout from '@/layouts/UserLayout';

export default function SeatSelection() {
  const { journeyId } = useParams<{ journeyId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getJourneyById, bookSeat, isLoading, error } = useBooking();
  
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookedSeatNumber, setBookedSeatNumber] = useState<number | null>(null);

  const journey = journeyId ? getJourneyById(journeyId) : undefined;

  if (!journey) {
    return (
      <UserLayout>
        <ErrorState 
          message="Journey not found. It may have been removed from the system."
          onRetry={() => navigate('/user/journeys')}
        />
      </UserLayout>
    );
  }

  const handleSeatSelect = (seatNumber: number) => {
    setSelectedSeat(seatNumber === selectedSeat ? null : seatNumber);
  };

  const handleBookClick = () => {
    if (selectedSeat) {
      setShowConfirm(true);
    }
  };

  const handleConfirmBooking = async () => {
    if (!selectedSeat || !user) return;

    const success = await bookSeat(journey.id, selectedSeat, user.id, user.email);
    
    if (success) {
      setBookedSeatNumber(selectedSeat);
      setBookingSuccess(true);
      setSelectedSeat(null);
    }
    
    setShowConfirm(false);
  };

  const selectedSeatObj = journey.seats.find(s => s.seatNumber === selectedSeat);
  const seatPositionText = selectedSeatObj 
    ? `Row ${selectedSeatObj.row}, ${selectedSeatObj.position.includes('window') ? 'Window' : 'Aisle'} (${selectedSeatObj.position.includes('left') ? 'Left' : 'Right'})`
    : '';

  if (bookingSuccess) {
    return (
      <UserLayout>
        <SuccessMessage
          title="Booking Confirmed!"
          message={`Your Seat #${bookedSeatNumber} on the journey from ${journey.sourceName} to ${journey.destinationName} has been booked successfully.`}
          action={{
            label: 'View My Tickets',
            onClick: () => navigate('/user/tickets'),
          }}
        />
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="space-y-6 max-w-2xl mx-auto">
        <Link 
          to="/user/journeys" 
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
            <p className="text-sm text-muted-foreground">
              Bus: {journey.busNumber} • {journey.totalSeats} seats
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoading ? (
              <LoadingState message="Processing..." />
            ) : (
              <>
                {error && (
                  <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-md text-destructive text-sm">
                    {error}
                  </div>
                )}

                <BusSeatLayout
                  seats={journey.seats}
                  selectedSeat={selectedSeat}
                  onSeatSelect={handleSeatSelect}
                />

                {selectedSeat && (
                  <div className="pt-4 border-t space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Selected Seat:</span>
                        <span className="font-semibold">Seat #{selectedSeat}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Position:</span>
                        <span>{seatPositionText}</span>
                      </div>
                    </div>
                    <Button onClick={handleBookClick} className="w-full" size="lg">
                      Book Seat #{selectedSeat}
                    </Button>
                  </div>
                )}

                {!selectedSeat && (
                  <p className="text-center text-sm text-muted-foreground pt-4 border-t">
                    Click on an available seat (green) to select it
                  </p>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <ConfirmDialog
          open={showConfirm}
          onOpenChange={setShowConfirm}
          title="Confirm Booking"
          description={`Book Seat #${selectedSeat} (${seatPositionText}) on the journey ${journey.sourceName} → ${journey.destinationName}?`}
          confirmLabel="Confirm Booking"
          onConfirm={handleConfirmBooking}
        />
      </div>
    </UserLayout>
  );
}
