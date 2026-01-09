import { useNavigate } from 'react-router-dom';
import { useBooking } from '@/context/BookingContext';
import { JourneyCard } from '@/components/JourneyCard';
import { EmptyState } from '@/components/StateIndicators';
import UserLayout from '@/layouts/UserLayout';

export default function JourneyList() {
  const { journeys, getAvailableSeatsCount } = useBooking();
  const navigate = useNavigate();

  const handleSelectSeats = (journeyId: string) => {
    navigate(`/user/journey/${journeyId}`);
  };

  return (
    <UserLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Available Journeys</h1>
          <p className="text-muted-foreground">Select a journey to view seats and make a booking</p>
        </div>

        {journeys.length === 0 ? (
          <EmptyState
            title="No journeys available"
            description="There are currently no journeys in the system. Please check back later."
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {journeys.map((journey) => (
              <JourneyCard
                key={journey.id}
                journey={journey}
                availableSeats={getAvailableSeatsCount(journey.id)}
                onSelectSeats={handleSelectSeats}
              />
            ))}
          </div>
        )}
      </div>
    </UserLayout>
  );
}
