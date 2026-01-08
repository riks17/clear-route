import { Bus } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users } from 'lucide-react';

interface BusCardProps {
  bus: Bus;
  availableSeats: number;
  onViewSeats: (busId: string) => void;
}

export function BusCard({ bus, availableSeats, onViewSeats }: BusCardProps) {
  const isFullyBooked = availableSeats === 0;

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{bus.busNumber}</CardTitle>
          <Badge variant={isFullyBooked ? 'destructive' : 'default'}>
            {isFullyBooked ? 'Fully Booked' : `${availableSeats} seats available`}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{bus.source}</span>
          <span className="text-muted-foreground">→</span>
          <span className="font-medium">{bus.destination}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>Total {bus.totalSeats} seats</span>
        </div>

        <Button 
          onClick={() => onViewSeats(bus.id)}
          className="w-full"
          disabled={isFullyBooked}
        >
          {isFullyBooked ? 'No Seats Available' : 'View Seats & Book'}
        </Button>
      </CardContent>
    </Card>
  );
}
