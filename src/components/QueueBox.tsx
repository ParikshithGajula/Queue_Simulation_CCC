import { Booking } from '@/lib/queue';
import { cn } from '@/lib/utils';

interface QueueBoxProps {
  booking: Booking;
  type: 'confirmed' | 'waiting';
  position: number;
  isHighlighted?: boolean;
  isNew?: boolean;
  isLeaving?: boolean;
}

export function QueueBox({ 
  booking, 
  type, 
  position,
  isHighlighted,
  isNew,
  isLeaving
}: QueueBoxProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center min-w-[70px] h-[70px] rounded-lg border-2 transition-all duration-300",
        type === 'confirmed' 
          ? "bg-confirmed/20 border-confirmed text-confirmed" 
          : "bg-waiting/20 border-waiting text-waiting",
        isHighlighted && "ring-2 ring-highlight ring-offset-2 scale-110",
        isNew && "animate-slide-in-right",
        isLeaving && "animate-fade-out opacity-0"
      )}
    >
      <span className="text-xs font-mono opacity-70">#{position}</span>
      <span className="font-semibold text-sm truncate max-w-[60px]">
        {booking.name.slice(0, 6)}
      </span>
      {type === 'confirmed' && (
        <span className="text-[10px] font-mono bg-confirmed/30 px-1 rounded">
          S{booking.seatNumber}
        </span>
      )}
    </div>
  );
}
