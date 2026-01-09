import { Seat } from '@/types';
import { cn } from '@/lib/utils';

interface BusSeatLayoutProps {
  seats: Seat[];
  selectedSeat: number | null;
  onSeatSelect: (seatNumber: number) => void;
}

export function BusSeatLayout({ seats, selectedSeat, onSeatSelect }: BusSeatLayoutProps) {
  // Group seats by row
  const seatsByRow: Record<number, Seat[]> = {};
  seats.forEach(seat => {
    if (!seatsByRow[seat.row]) {
      seatsByRow[seat.row] = [];
    }
    seatsByRow[seat.row].push(seat);
  });

  const rows = Object.keys(seatsByRow).map(Number).sort((a, b) => a - b);

  const getSeatTypeLabel = (position: Seat['position']) => {
    if (position.includes('window')) return 'W';
    return 'A';
  };

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm pb-2">
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
        <div className="flex items-center gap-2 ml-auto text-muted-foreground">
          <span className="text-xs">W = Window • A = Aisle</span>
        </div>
      </div>

      {/* Bus Layout Container */}
      <div className="border-2 border-border rounded-lg p-4 bg-muted/30">
        {/* Driver / Front Indicator */}
        <div className="flex justify-center mb-4">
          <div className="bg-muted px-4 py-1.5 rounded text-xs font-medium text-muted-foreground border">
            ↑ FRONT OF BUS (Driver)
          </div>
        </div>

        {/* Seat Grid */}
        <div className="space-y-2">
          {rows.map(rowNum => {
            const rowSeats = seatsByRow[rowNum];
            const leftSeats = rowSeats.filter(s => s.position.includes('left'));
            const rightSeats = rowSeats.filter(s => s.position.includes('right'));

            // Sort: window first, then aisle
            const sortedLeft = leftSeats.sort((a, b) => 
              a.position === 'window-left' ? -1 : 1
            );
            const sortedRight = rightSeats.sort((a, b) => 
              a.position === 'aisle-right' ? -1 : 1
            );

            return (
              <div key={rowNum} className="flex items-center justify-center gap-1">
                {/* Row Number */}
                <span className="w-6 text-xs text-muted-foreground text-right pr-2">
                  {rowNum}
                </span>

                {/* Left side seats */}
                <div className="flex gap-1">
                  {sortedLeft.map(seat => (
                    <SeatButton
                      key={seat.id}
                      seat={seat}
                      isSelected={selectedSeat === seat.seatNumber}
                      onSelect={onSeatSelect}
                      label={getSeatTypeLabel(seat.position)}
                    />
                  ))}
                </div>

                {/* Aisle */}
                <div className="w-8 flex items-center justify-center">
                  <div className="w-1 h-8 bg-muted rounded" />
                </div>

                {/* Right side seats */}
                <div className="flex gap-1">
                  {sortedRight.map(seat => (
                    <SeatButton
                      key={seat.id}
                      seat={seat}
                      isSelected={selectedSeat === seat.seatNumber}
                      onSelect={onSeatSelect}
                      label={getSeatTypeLabel(seat.position)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Back Indicator */}
        <div className="flex justify-center mt-4">
          <div className="bg-muted px-4 py-1.5 rounded text-xs font-medium text-muted-foreground border">
            ↓ BACK OF BUS
          </div>
        </div>
      </div>
    </div>
  );
}

interface SeatButtonProps {
  seat: Seat;
  isSelected: boolean;
  onSelect: (seatNumber: number) => void;
  label: string;
}

function SeatButton({ seat, isSelected, onSelect, label }: SeatButtonProps) {
  const isBooked = seat.isBooked;

  return (
    <button
      onClick={() => !isBooked && onSelect(seat.seatNumber)}
      disabled={isBooked}
      className={cn(
        'h-10 w-10 rounded-md flex flex-col items-center justify-center font-medium text-xs transition-all relative',
        isBooked && 'seat-booked cursor-not-allowed',
        !isBooked && !isSelected && 'seat-available hover:scale-105',
        isSelected && 'seat-selected'
      )}
      aria-label={`Seat ${seat.seatNumber}, Row ${seat.row}, ${label === 'W' ? 'Window' : 'Aisle'}${isBooked ? ' (booked)' : isSelected ? ' (selected)' : ' (available)'}`}
      title={`Seat ${seat.seatNumber} - Row ${seat.row} ${label === 'W' ? 'Window' : 'Aisle'}`}
    >
      <span className="font-semibold">{seat.seatNumber}</span>
      <span className="text-[10px] opacity-70">{label}</span>
    </button>
  );
}
