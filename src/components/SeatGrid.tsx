import { Seat } from '@/types';
import { cn } from '@/lib/utils';

interface SeatGridProps {
  seats: Seat[];
  selectedSeat: number | null;
  onSeatSelect: (seatNumber: number) => void;
  columns?: number;
}

export function SeatGrid({ seats, selectedSeat, onSeatSelect, columns = 4 }: SeatGridProps) {
  return (
    <div className="space-y-6">
      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-success" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-destructive" />
          <span>Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-primary ring-2 ring-primary ring-offset-2" />
          <span>Selected</span>
        </div>
      </div>

      {/* Seat grid */}
      <div 
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {seats.map((seat) => {
          const isSelected = selectedSeat === seat.seatNumber;
          const isBooked = seat.isBooked;

          return (
            <button
              key={seat.id}
              onClick={() => !isBooked && onSeatSelect(seat.seatNumber)}
              disabled={isBooked}
              className={cn(
                'h-12 w-full rounded-md flex items-center justify-center font-medium text-sm transition-all',
                isBooked && 'seat-booked',
                !isBooked && !isSelected && 'seat-available',
                isSelected && 'seat-selected'
              )}
              aria-label={`Seat ${seat.seatNumber}${isBooked ? ' (booked)' : isSelected ? ' (selected)' : ' (available)'}`}
            >
              {seat.seatNumber}
            </button>
          );
        })}
      </div>
    </div>
  );
}
