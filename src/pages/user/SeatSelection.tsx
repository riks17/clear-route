import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useBooking } from '@/context/BookingContext';
import { SeatGrid } from '@/components/SeatGrid';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { SuccessMessage } from '@/components/SuccessMessage';
import { ErrorState, LoadingState } from '@/components/StateIndicators';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, MapPin } from 'lucide-react';
import UserLayout from '@/layouts/UserLayout';

export default function SeatSelection() {
  const { busId } = useParams<{ busId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getBusById, bookSeat, isLoading, error } = useBooking();
  
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookedSeatNumber, setBookedSeatNumber] = useState<number | null>(null);

  const bus = busId ? getBusById(busId) : undefined;

  if (!bus) {
    return (
      <UserLayout>
        <ErrorState 
          message="Bus not found. It may have been removed from the system."
          onRetry={() => navigate('/user/buses')}
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

    const success = await bookSeat(bus.id, selectedSeat, user.id, user.email);
    
    if (success) {
      setBookedSeatNumber(selectedSeat);
      setBookingSuccess(true);
      setSelectedSeat(null);
    }
    
    setShowConfirm(false);
  };

  if (bookingSuccess) {
    return (
      <UserLayout>
        <SuccessMessage
          title="Booking Confirmed!"
          message={`Your seat #${bookedSeatNumber} on ${bus.busNumber} (${bus.source} → ${bus.destination}) has been booked successfully.`}
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
          to="/user/buses" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to buses
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{bus.busNumber}</span>
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{bus.source} → {bus.destination}</span>
            </div>
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

                <SeatGrid
                  seats={bus.seats}
                  selectedSeat={selectedSeat}
                  onSeatSelect={handleSeatSelect}
                  columns={4}
                />

                {selectedSeat && (
                  <div className="pt-4 border-t space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Selected Seat:</span>
                      <span className="font-semibold">Seat #{selectedSeat}</span>
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
          description={`Are you sure you want to book Seat #${selectedSeat} on ${bus.busNumber} (${bus.source} → ${bus.destination})?`}
          confirmLabel="Confirm Booking"
          onConfirm={handleConfirmBooking}
        />
      </div>
    </UserLayout>
  );
}
