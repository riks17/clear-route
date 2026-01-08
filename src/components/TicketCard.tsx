import { Booking } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Hash, Calendar } from 'lucide-react';

interface TicketCardProps {
  booking: Booking;
  onCancel: (bookingId: string) => void;
  isLoading?: boolean;
}

export function TicketCard({ booking, onCancel, isLoading }: TicketCardProps) {
  const isCancelled = booking.status === 'cancelled';

  return (
    <Card className={isCancelled ? 'opacity-60' : ''}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-lg">{booking.busNumber}</span>
          <Badge className={isCancelled ? 'status-cancelled' : 'status-confirmed'}>
            {isCancelled ? 'Cancelled' : 'Confirmed'}
          </Badge>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>{booking.route}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Hash className="h-4 w-4 text-muted-foreground" />
          <span>Seat {booking.seatNumber}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{new Date(booking.createdAt).toLocaleDateString()}</span>
        </div>

        {!isCancelled && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onCancel(booking.id)}
            disabled={isLoading}
            className="w-full mt-2"
          >
            {isLoading ? 'Cancelling...' : 'Cancel Booking'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
