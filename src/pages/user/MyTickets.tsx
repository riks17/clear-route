import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useBooking } from '@/context/BookingContext';
import { TicketCard } from '@/components/TicketCard';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { EmptyState, LoadingState } from '@/components/StateIndicators';
import UserLayout from '@/layouts/UserLayout';

export default function MyTickets() {
  const { user } = useAuth();
  const { getUserBookings, cancelBooking, isLoading } = useBooking();
  const navigate = useNavigate();
  
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const bookings = user ? getUserBookings(user.id) : [];

  const handleCancelClick = (bookingId: string) => {
    setCancelId(bookingId);
    setShowConfirm(true);
  };

  const handleConfirmCancel = async () => {
    if (cancelId) {
      await cancelBooking(cancelId);
    }
    setShowConfirm(false);
    setCancelId(null);
  };

  return (
    <UserLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">My Tickets</h1>
          <p className="text-muted-foreground">View and manage your bookings</p>
        </div>

        {isLoading && <LoadingState message="Processing..." />}

        {!isLoading && bookings.length === 0 ? (
          <EmptyState
            title="No tickets yet"
            description="You haven't made any bookings. Browse available buses to book a seat."
            action={{
              label: 'Browse Buses',
              onClick: () => navigate('/user/buses'),
            }}
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookings.map((booking) => (
              <TicketCard
                key={booking.id}
                booking={booking}
                onCancel={handleCancelClick}
                isLoading={isLoading && cancelId === booking.id}
              />
            ))}
          </div>
        )}

        <ConfirmDialog
          open={showConfirm}
          onOpenChange={setShowConfirm}
          title="Cancel Booking"
          description="Are you sure you want to cancel this booking? This action cannot be undone and the seat will be released."
          confirmLabel="Yes, Cancel Booking"
          onConfirm={handleConfirmCancel}
          variant="destructive"
        />
      </div>
    </UserLayout>
  );
}
