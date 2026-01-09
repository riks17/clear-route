import { Journey } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users } from 'lucide-react';

interface JourneyCardProps {
  journey: Journey;
  availableSeats: number;
  onSelectSeats: (journeyId: string) => void;
}

export function JourneyCard({ journey, availableSeats, onSelectSeats }: JourneyCardProps) {
  const isFull = availableSeats === 0;

  return (
    <Card className={isFull ? 'opacity-75' : ''}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            {journey.sourceName} → {journey.destinationName}
          </CardTitle>
        </div>
        <p className="text-xs text-muted-foreground">
          Bus: {journey.busNumber}
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{availableSeats} / {journey.totalSeats} seats available</span>
          </div>
          {isFull && (
            <Badge variant="secondary" className="text-xs">Full</Badge>
          )}
        </div>
        
        <Button 
          onClick={() => onSelectSeats(journey.id)} 
          className="w-full"
          disabled={isFull}
        >
          {isFull ? 'No Seats Available' : 'Select Seats'}
        </Button>
      </CardContent>
    </Card>
  );
}
