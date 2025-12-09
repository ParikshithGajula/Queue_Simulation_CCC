import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserPlus, XCircle, Play, RotateCcw, Clock } from 'lucide-react';
import { SeatSelector } from './SeatSelector';

interface BookingFormProps {
  onBook: (name: string, seatNumber: number) => void;
  onJoinWaitingList: (name: string) => void;
  onCancel: () => void;
  onSimulate: () => void;
  onReset: () => void;
  isQueueEmpty: boolean;
  availableSeats: number[];
  confirmedSeats: { seatNumber: number; name: string }[];
}

export function BookingForm({ 
  onBook, 
  onJoinWaitingList,
  onCancel, 
  onSimulate, 
  onReset,
  isQueueEmpty,
  availableSeats,
  confirmedSeats
}: BookingFormProps) {
  const [name, setName] = useState('');
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && selectedSeat) {
      onBook(name, selectedSeat);
      setName('');
      setSelectedSeat(null);
    }
  };

  const handleJoinWaitingList = () => {
    if (name.trim()) {
      onJoinWaitingList(name);
      setName('');
    }
  };

  const allSeatsTaken = availableSeats.length === 0;

  return (
    <div className="space-y-6">
      {/* Seat selector */}
      <SeatSelector
        availableSeats={availableSeats}
        selectedSeat={selectedSeat}
        onSelectSeat={setSelectedSeat}
        confirmedSeats={confirmedSeats}
      />

      {/* Booking form */}
      <form onSubmit={handleBook} className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter your name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1"
          maxLength={50}
        />
        <Button 
          type="submit" 
          disabled={!selectedSeat || !name.trim()}
          className="bg-confirmed hover:bg-confirmed/90 text-confirmed-foreground"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Book Seat {selectedSeat || ''}
        </Button>
      </form>

      {/* Waiting list button - show when all seats taken */}
      {allSeatsTaken && (
        <div className="flex items-center gap-2 p-3 bg-waiting/10 border border-waiting/30 rounded-lg">
          <Clock className="h-5 w-5 text-waiting flex-shrink-0" />
          <p className="text-sm text-muted-foreground flex-1">
            All seats are booked. Join the waiting list and you'll be auto-confirmed when a seat becomes available.
          </p>
          <Button 
            variant="outline"
            onClick={handleJoinWaitingList}
            disabled={!name.trim()}
            className="border-waiting text-waiting hover:bg-waiting hover:text-waiting-foreground"
          >
            Join Waiting List
          </Button>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2 pt-2 border-t">
        <Button 
          variant="outline" 
          onClick={onCancel}
          disabled={isQueueEmpty}
          className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
        >
          <XCircle className="h-4 w-4 mr-2" />
          Cancel First Ticket
        </Button>

        <Button 
          variant="outline" 
          onClick={onSimulate}
          className="border-highlight text-highlight hover:bg-highlight hover:text-highlight-foreground"
        >
          <Play className="h-4 w-4 mr-2" />
          Simulate Bookings
        </Button>

        <Button 
          variant="outline" 
          onClick={() => {
            onReset();
            setSelectedSeat(null);
          }}
          disabled={isQueueEmpty}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>
    </div>
  );
}
