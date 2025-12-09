import { Booking, CONFIG, getQueueState } from '@/lib/queue';
import { TicketCard } from './TicketCard';
import { QueueStrip } from './QueueStrip';
import { CheckCircle, Clock, Users } from 'lucide-react';

interface QueueVisualizerProps {
  confirmed: Booking[];
  waiting: Booking[];
  availableSeatCount: number;
  highlightedId?: string;
  leavingId?: string;
  newId?: string;
  onCancelSeat?: (seatNumber: number) => void;
}

export function QueueVisualizer({ 
  confirmed, 
  waiting, 
  availableSeatCount,
  highlightedId,
  leavingId,
  newId,
  onCancelSeat
}: QueueVisualizerProps) {
  // Combine into single queue array for visualization
  const fullQueue = [...confirmed, ...waiting];

  return (
    <div className="space-y-6">
      {/* Horizontal Queue Strip - THE VISUAL SIMULATION */}
      <QueueStrip 
        queue={fullQueue} 
        highlightedId={highlightedId}
        leavingId={leavingId}
        newId={newId}
      />

      {/* Detailed cards below */}
      <div className="grid md:grid-cols-2 gap-6">
      {/* Confirmed Zone */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-confirmed" />
            <h2 className="text-lg font-semibold">Confirmed Bookings</h2>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="font-mono">
              <span className="text-confirmed font-bold">{confirmed.length}</span>
              <span className="text-muted-foreground">/{CONFIG.maxSeats}</span>
            </span>
          </div>
        </div>

        {/* Seat availability bar */}
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-confirmed transition-all duration-500 ease-out"
            style={{ width: `${(confirmed.length / CONFIG.maxSeats) * 100}%` }}
          />
        </div>

        {/* Available seats message */}
        <p className="text-sm text-muted-foreground">
          {availableSeatCount > 0 
            ? `${availableSeatCount} seat${availableSeatCount !== 1 ? 's' : ''} available`
            : 'All seats booked - new users join waiting list'
          }
        </p>

        {/* Confirmed tickets */}
        <div className="space-y-3 min-h-[200px]">
          {confirmed.length === 0 ? (
            <div className="flex items-center justify-center h-[200px] border-2 border-dashed border-muted rounded-lg">
              <p className="text-muted-foreground">No confirmed bookings yet</p>
            </div>
          ) : (
            confirmed.map((booking, index) => (
              <TicketCard
                key={booking.bookingId}
                booking={booking}
                type="confirmed"
                position={index + 1}
                isHighlighted={booking.bookingId === highlightedId}
                onCancel={onCancelSeat}
              />
            ))
          )}
        </div>
      </div>

      {/* Waiting Zone */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-waiting" />
            <h2 className="text-lg font-semibold">Waiting List</h2>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="font-mono">
              <span className="text-waiting font-bold">{waiting.length}</span>
              <span className="text-muted-foreground"> in queue</span>
            </span>
          </div>
        </div>

        {/* FIFO explanation */}
        <div className="p-3 bg-waiting/10 border border-waiting/30 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>FIFO Order:</strong> When a seat is cancelled, 
            the first person here gets auto-confirmed to that seat.
          </p>
        </div>

        {/* Waiting tickets */}
        <div className="space-y-3 min-h-[200px]">
          {waiting.length === 0 ? (
            <div className="flex items-center justify-center h-[168px] border-2 border-dashed border-muted rounded-lg">
              <p className="text-muted-foreground">Waiting list is empty</p>
            </div>
          ) : (
            waiting.map((booking, index) => (
              <TicketCard
                key={booking.bookingId}
                booking={booking}
                type="waiting"
                position={index + 1}
                isHighlighted={booking.bookingId === highlightedId}
              />
            ))
          )}
        </div>
        </div>
      </div>
    </div>
  );
}
