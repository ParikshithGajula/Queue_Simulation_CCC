import { CONFIG } from '@/lib/queue';
import { cn } from '@/lib/utils';
import { Armchair } from 'lucide-react';

interface SeatSelectorProps {
  availableSeats: number[];
  selectedSeat: number | null;
  onSelectSeat: (seatNumber: number) => void;
  confirmedSeats: { seatNumber: number; name: string }[];
}

export function SeatSelector({ 
  availableSeats, 
  selectedSeat, 
  onSelectSeat,
  confirmedSeats
}: SeatSelectorProps) {
  const seats = Array.from({ length: CONFIG.maxSeats }, (_, i) => i + 1);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-foreground">Select Your Seat</h3>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-muted border" />
            <span className="text-muted-foreground">Available</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-confirmed" />
            <span className="text-muted-foreground">Booked</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-highlight" />
            <span className="text-muted-foreground">Selected</span>
          </div>
        </div>
      </div>

      {/* Screen indicator */}
      <div className="relative">
        <div className="w-full h-2 bg-muted rounded-t-full mb-6" />
        <p className="absolute -top-1 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground uppercase tracking-widest">
          Screen / Stage
        </p>
      </div>

      {/* Seats grid */}
      <div className="flex justify-center gap-3 flex-wrap">
        {seats.map((seatNum) => {
          const isAvailable = availableSeats.includes(seatNum);
          const isSelected = selectedSeat === seatNum;
          const confirmedBooking = confirmedSeats.find(c => c.seatNumber === seatNum);

          return (
            <button
              key={seatNum}
              onClick={() => isAvailable && onSelectSeat(seatNum)}
              disabled={!isAvailable}
              className={cn(
                'relative flex flex-col items-center justify-center w-16 h-16 rounded-lg border-2 transition-all duration-200',
                isAvailable && !isSelected && 'bg-muted/50 border-border hover:border-highlight hover:bg-highlight/10 cursor-pointer',
                isSelected && 'bg-highlight/20 border-highlight ring-2 ring-highlight ring-offset-2 ring-offset-background',
                !isAvailable && 'bg-confirmed/20 border-confirmed cursor-not-allowed',
              )}
            >
              <Armchair 
                className={cn(
                  'h-6 w-6 transition-colors',
                  isAvailable && !isSelected && 'text-muted-foreground',
                  isSelected && 'text-highlight',
                  !isAvailable && 'text-confirmed'
                )} 
              />
              <span className={cn(
                'text-xs font-bold mt-1',
                isAvailable && !isSelected && 'text-muted-foreground',
                isSelected && 'text-highlight',
                !isAvailable && 'text-confirmed'
              )}>
                {seatNum}
              </span>

              {/* Show name on booked seat */}
              {confirmedBooking && (
                <span className="absolute -bottom-5 text-[10px] text-confirmed font-medium truncate max-w-16">
                  {confirmedBooking.name}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Selection message */}
      <div className="text-center pt-4">
        {selectedSeat ? (
          <p className="text-sm text-highlight font-medium">
            Seat {selectedSeat} selected - Enter your name and click Book
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Click on an available seat to select it
          </p>
        )}
      </div>
    </div>
  );
}
