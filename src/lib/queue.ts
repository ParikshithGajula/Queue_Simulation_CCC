/**
 * QUEUE DATA STRUCTURE - Array-based FIFO implementation
 * 
 * This is the ONLY data structure used in the entire system.
 * The queue is logically divided into two zones:
 * 
 * [ Confirmed Seats (0 to maxSeats-1) | Waiting List (maxSeats onwards) ]
 * 
 * FIFO (First In, First Out) principle ensures fairness:
 * - First person to book gets confirmed first
 * - First person to wait gets confirmed when a seat is cancelled
 */

export interface Booking {
  name: string;
  timestamp: string;
  bookingId: string;
  seatNumber: number; // 1-indexed seat number
}

// Configuration - can be loaded from JSON
export const CONFIG = {
  maxSeats: 5,
  maxWaitingList: 10, // Optional capacity limit for waiting list
};

// The ONE queue array - the only data structure in this system
let queue: Booking[] = [];

// Counter for generating unique booking IDs
let bookingCounter = 1;

/**
 * Generate a year-based incremental booking ID
 * Format: TKT-YYYY-XXX (e.g., TKT-2025-001)
 */
function generateBookingId(): string {
  const year = new Date().getFullYear();
  const id = `TKT-${year}-${String(bookingCounter).padStart(3, '0')}`;
  bookingCounter++;
  return id;
}

/**
 * Get current timestamp in HH:MM:SS format
 */
function getCurrentTimestamp(): string {
  const now = new Date();
  return now.toLocaleTimeString('en-US', { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  });
}

/**
 * Get list of available seat numbers
 */
export function getAvailableSeats(): number[] {
  const takenSeats = new Set(
    queue
      .filter(b => b.seatNumber > 0 && b.seatNumber <= CONFIG.maxSeats)
      .map(b => b.seatNumber)
  );
  
  const available: number[] = [];
  for (let i = 1; i <= CONFIG.maxSeats; i++) {
    if (!takenSeats.has(i)) {
      available.push(i);
    }
  }
  return available;
}

/**
 * Check if a specific seat is available
 */
export function isSeatAvailable(seatNumber: number): boolean {
  if (seatNumber < 1 || seatNumber > CONFIG.maxSeats) return false;
  return !queue.some(b => b.seatNumber === seatNumber);
}

/**
 * ENQUEUE - Add a booking to the queue with a specific seat
 * Time Complexity: O(n) - checking for duplicates
 * 
 * @param name - User's name
 * @param seatNumber - Chosen seat number (1 to maxSeats), or 0 for waiting list
 * @returns Object with success status, booking info, and zone (confirmed/waiting)
 */
export function enqueue(name: string, seatNumber: number = 0): { 
  success: boolean; 
  message: string; 
  booking?: Booking; 
  zone?: 'confirmed' | 'waiting';
} {
  // Edge case: Empty name
  if (!name || name.trim() === '') {
    return { success: false, message: 'Please enter a valid name.' };
  }

  const trimmedName = name.trim();

  // Edge case: Duplicate booking name
  const duplicate = queue.find(b => b.name.toLowerCase() === trimmedName.toLowerCase());
  if (duplicate) {
    return { 
      success: false, 
      message: `Booking already exists for "${trimmedName}".` 
    };
  }

  // Check seat availability
  const availableSeats = getAvailableSeats();
  
  if (seatNumber > 0) {
    // User chose a specific seat
    if (!isSeatAvailable(seatNumber)) {
      return { 
        success: false, 
        message: `Seat ${seatNumber} is already taken. Please choose another seat.` 
      };
    }
  } else {
    // No seat chosen - check if any seats available
    if (availableSeats.length === 0) {
      // All seats taken - add to waiting list
      const waitingCount = queue.filter(b => b.seatNumber === 0).length;
      if (waitingCount >= CONFIG.maxWaitingList) {
        return { 
          success: false, 
          message: 'Sorry, both confirmed seats and waiting list are full.' 
        };
      }
    } else {
      return { 
        success: false, 
        message: 'Please select a seat to book.' 
      };
    }
  }

  // Create booking object with timestamp for FIFO fairness
  const booking: Booking = {
    name: trimmedName,
    timestamp: getCurrentTimestamp(),
    bookingId: generateBookingId(),
    seatNumber: seatNumber,
  };

  // Add to queue
  queue.push(booking);

  const isConfirmed = seatNumber > 0;
  
  return {
    success: true,
    message: isConfirmed 
      ? `Seat ${seatNumber} confirmed for ${trimmedName}!` 
      : `${trimmedName} added to waiting list.`,
    booking,
    zone: isConfirmed ? 'confirmed' : 'waiting',
  };
}

/**
 * Add to waiting list without choosing a seat
 */
export function addToWaitingList(name: string): ReturnType<typeof enqueue> {
  // Edge case: Empty name
  if (!name || name.trim() === '') {
    return { success: false, message: 'Please enter a valid name.' };
  }

  const trimmedName = name.trim();

  // Edge case: Duplicate booking name
  const duplicate = queue.find(b => b.name.toLowerCase() === trimmedName.toLowerCase());
  if (duplicate) {
    return { 
      success: false, 
      message: `Booking already exists for "${trimmedName}".` 
    };
  }

  // Check waiting list capacity
  const waitingCount = queue.filter(b => b.seatNumber === 0).length;
  if (waitingCount >= CONFIG.maxWaitingList) {
    return { 
      success: false, 
      message: 'Sorry, the waiting list is full.' 
    };
  }

  const booking: Booking = {
    name: trimmedName,
    timestamp: getCurrentTimestamp(),
    bookingId: generateBookingId(),
    seatNumber: 0, // 0 means waiting list
  };

  queue.push(booking);

  return {
    success: true,
    message: `${trimmedName} added to waiting list.`,
    booking,
    zone: 'waiting',
  };
}

/**
 * CANCEL - Cancel a specific booking by seat number or booking ID
 * 
 * When a confirmed booking is cancelled:
 * 1. The seat becomes available
 * 2. First waiting user (FIFO) gets auto-confirmed to that seat
 */
export function cancelBooking(seatNumber: number): {
  success: boolean;
  message: string;
  cancelled?: Booking;
  autoConfirmed?: Booking;
} {
  // Find the booking with this seat number
  const bookingIndex = queue.findIndex(b => b.seatNumber === seatNumber);
  
  if (bookingIndex === -1) {
    return { 
      success: false, 
      message: `No booking found for seat ${seatNumber}.` 
    };
  }

  // Remove the booking
  const [cancelled] = queue.splice(bookingIndex, 1);
  const freedSeatNumber = cancelled.seatNumber;

  // Check if there's someone waiting (FIFO - first in the waiting list)
  const waitingIndex = queue.findIndex(b => b.seatNumber === 0);
  let autoConfirmed: Booking | undefined;

  if (waitingIndex !== -1 && freedSeatNumber > 0) {
    // Auto-confirm the first waiting person to the freed seat
    queue[waitingIndex].seatNumber = freedSeatNumber;
    autoConfirmed = queue[waitingIndex];
  }

  let message = `Ticket cancelled for ${cancelled.name} (Seat ${freedSeatNumber}).`;
  if (autoConfirmed) {
    message += ` ${autoConfirmed.name} has been auto-confirmed to Seat ${freedSeatNumber}!`;
  }

  return {
    success: true,
    message,
    cancelled,
    autoConfirmed,
  };
}

/**
 * DEQUEUE - Cancel the first confirmed booking (oldest by queue position)
 * This maintains FIFO for cancellation order
 */
export function dequeue(): {
  success: boolean;
  message: string;
  cancelled?: Booking;
  autoConfirmed?: Booking;
} {
  // Find first confirmed booking
  const confirmedBooking = queue.find(b => b.seatNumber > 0);
  
  if (!confirmedBooking) {
    // Check if there are waiting list entries
    if (queue.length > 0) {
      const [cancelled] = queue.splice(0, 1);
      return {
        success: true,
        message: `Removed ${cancelled.name} from waiting list.`,
        cancelled,
      };
    }
    return { 
      success: false, 
      message: 'No bookings to cancel. Queue is empty.' 
    };
  }

  return cancelBooking(confirmedBooking.seatNumber);
}

/**
 * PEEK - View the next confirmed user without removing
 */
export function peek(): Booking | null {
  return queue.find(b => b.seatNumber > 0) || null;
}

/**
 * IS_FULL - Check if all seats are taken
 */
export function isFull(): boolean {
  return getAvailableSeats().length === 0;
}

/**
 * IS_EMPTY - Check if queue has no bookings
 */
export function isEmpty(): boolean {
  return queue.length === 0;
}

/**
 * GET_CONFIRMED_BOOKINGS - Get all confirmed bookings (sorted by seat number)
 */
export function getConfirmedBookings(): Booking[] {
  return queue
    .filter(b => b.seatNumber > 0)
    .sort((a, b) => a.seatNumber - b.seatNumber);
}

/**
 * GET_WAITING_LIST - Get all waiting bookings (FIFO order)
 */
export function getWaitingList(): Booking[] {
  return queue.filter(b => b.seatNumber === 0);
}

/**
 * GET_AVAILABLE_SEAT_COUNT - Get number of remaining seats
 */
export function getAvailableSeatCount(): number {
  return getAvailableSeats().length;
}

/**
 * GET_QUEUE_SIZE - Get total queue size
 */
export function getQueueSize(): number {
  return queue.length;
}

/**
 * RESET_QUEUE - Clear all bookings (for simulation reset)
 */
export function resetQueue(): void {
  queue = [];
  bookingCounter = 1;
}

/**
 * GET_QUEUE_STATE - Get current state for debugging/display
 */
export function getQueueState() {
  return {
    queue: [...queue],
    confirmed: getConfirmedBookings(),
    waiting: getWaitingList(),
    availableSeats: getAvailableSeats(),
    availableSeatCount: getAvailableSeatCount(),
    isFull: isFull(),
    isEmpty: isEmpty(),
    maxSeats: CONFIG.maxSeats,
  };
}
