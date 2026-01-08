import { useNavigate } from 'react-router-dom';
import { useBooking } from '@/context/BookingContext';
import { BusCard } from '@/components/BusCard';
import { EmptyState } from '@/components/StateIndicators';
import UserLayout from '@/layouts/UserLayout';

export default function BusList() {
  const { buses, getAvailableSeatsCount } = useBooking();
  const navigate = useNavigate();

  const handleViewSeats = (busId: string) => {
    navigate(`/user/bus/${busId}`);
  };

  return (
    <UserLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Available Buses</h1>
          <p className="text-muted-foreground">Select a bus to view seats and make a booking</p>
        </div>

        {buses.length === 0 ? (
          <EmptyState
            title="No buses available"
            description="There are currently no buses in the system. Please check back later."
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {buses.map((bus) => (
              <BusCard
                key={bus.id}
                bus={bus}
                availableSeats={getAvailableSeatsCount(bus.id)}
                onViewSeats={handleViewSeats}
              />
            ))}
          </div>
        )}
      </div>
    </UserLayout>
  );
}
