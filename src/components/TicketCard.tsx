import { Booking } from '@/lib/queue';
import { Ticket, Clock, Hash, Armchair, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface TicketCardProps {
  booking: Booking;
  type: 'confirmed' | 'waiting';
  position: number;
  isHighlighted?: boolean;
  onCancel?: (seatNumber: number) => void;
}

export function TicketCard({ booking, type, position, isHighlighted, onCancel }: TicketCardProps) {
  return (
    <div
      className={cn(
        'relative p-4 rounded-lg border-2 transition-all duration-300',
        type === 'confirmed' 
          ? 'bg-confirmed/10 border-confirmed' 
          : 'bg-waiting/10 border-waiting',
        isHighlighted && 'ring-2 ring-highlight ring-offset-2 ring-offset-background animate-pulse'
      )}
    >
      {/* Seat or Position badge */}
      <div
        className={cn(
          'absolute -top-2 -left-2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold',
          type === 'confirmed' 
            ? 'bg-confirmed text-confirmed-foreground' 
            : 'bg-waiting text-waiting-foreground'
        )}
      >
        {type === 'confirmed' ? (
          <span className="flex items-center gap-0.5">
            <Armchair className="h-3 w-3" />
            {booking.seatNumber}
          </span>
        ) : (
          position
        )}
      </div>

      {/* Type badge */}
      <div
        className={cn(
          'absolute -top-2 right-2 px-2 py-0.5 rounded text-xs font-medium',
          type === 'confirmed' 
            ? 'bg-confirmed text-confirmed-foreground' 
            : 'bg-waiting text-waiting-foreground'
        )}
      >
        {type === 'confirmed' ? `SEAT ${booking.seatNumber}` : 'WAITING'}
      </div>

      {/* Cancel button for confirmed tickets */}
      {type === 'confirmed' && onCancel && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onCancel(booking.seatNumber)}
          className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
        >
          <X className="h-3 w-3" />
        </Button>
      )}

      {/* Ticket content */}
      <div className="mt-2 space-y-2">
        <div className="flex items-center gap-2">
          <Ticket className={cn(
            'h-4 w-4',
            type === 'confirmed' ? 'text-confirmed' : 'text-waiting'
          )} />
          <span className="font-semibold text-foreground">{booking.name}</span>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Hash className="h-3 w-3" />
            <span className="font-mono">{booking.bookingId}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{booking.timestamp}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
