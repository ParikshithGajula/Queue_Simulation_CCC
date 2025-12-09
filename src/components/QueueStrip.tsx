import { Booking, CONFIG } from '@/lib/queue';
import { QueueBox } from './QueueBox';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface QueueStripProps {
  queue: Booking[];
  highlightedId?: string;
  leavingId?: string;
  newId?: string;
}

export function QueueStrip({ queue, highlightedId, leavingId, newId }: QueueStripProps) {
  const confirmed = queue.slice(0, CONFIG.maxSeats);
  const waiting = queue.slice(CONFIG.maxSeats);

  return (
    <div className="space-y-3">
      {/* Queue strip header */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" />
          <span className="font-mono">FRONT (Dequeue)</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-mono">REAR (Enqueue)</span>
          <ArrowRight className="h-4 w-4" />
        </div>
      </div>

      {/* Visual queue strip */}
      <div className="relative bg-muted/30 border-2 border-dashed border-muted rounded-xl p-4 overflow-x-auto">
        <div className="flex items-center gap-3 min-h-[80px]">
          {/* Empty state */}
          {queue.length === 0 && (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <span className="font-mono">[ Queue is empty ]</span>
            </div>
          )}

          {/* Confirmed zone */}
          {confirmed.map((booking, index) => (
            <QueueBox
              key={booking.bookingId}
              booking={booking}
              type="confirmed"
              position={index + 1}
              isHighlighted={booking.bookingId === highlightedId}
              isNew={booking.bookingId === newId}
              isLeaving={booking.bookingId === leavingId}
            />
          ))}

          {/* Divider between confirmed and waiting */}
          {(confirmed.length > 0 || waiting.length > 0) && (
            <div className="flex flex-col items-center gap-1 px-2">
              <div className="h-[70px] w-0.5 bg-border border-l-2 border-dashed" />
              <span className="text-[10px] text-muted-foreground font-mono whitespace-nowrap">
                MAX={CONFIG.maxSeats}
              </span>
            </div>
          )}

          {/* Waiting zone */}
          {waiting.map((booking, index) => (
            <QueueBox
              key={booking.bookingId}
              booking={booking}
              type="waiting"
              position={CONFIG.maxSeats + index + 1}
              isHighlighted={booking.bookingId === highlightedId}
              isNew={booking.bookingId === newId}
            />
          ))}
        </div>
      </div>

      {/* Zone labels */}
      <div className="flex items-center text-xs font-mono">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-confirmed" />
          <span>Confirmed Zone (0 to {CONFIG.maxSeats - 1})</span>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-waiting" />
          <span>Waiting Zone ({CONFIG.maxSeats}+)</span>
        </div>
      </div>

      {/* Internal array representation */}
      <div className="bg-card border rounded-lg p-3 font-mono text-xs overflow-x-auto">
        <span className="text-muted-foreground">queue = [</span>
        {queue.map((b, i) => (
          <span key={b.bookingId}>
            <span className={i < CONFIG.maxSeats ? "text-confirmed" : "text-waiting"}>
              {` {${b.name.slice(0, 4)}, S${b.seatNumber || '?'}}`}
            </span>
            {i === CONFIG.maxSeats - 1 && queue.length > CONFIG.maxSeats && (
              <span className="text-muted-foreground"> |</span>
            )}
            {i < queue.length - 1 && i !== CONFIG.maxSeats - 1 && ","}
          </span>
        ))}
        <span className="text-muted-foreground"> ]</span>
      </div>
    </div>
  );
}
