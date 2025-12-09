import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  enqueue, 
  addToWaitingList,
  dequeue,
  cancelBooking,
  resetQueue, 
  getQueueState,
  CONFIG
} from '@/lib/queue';
import { BookingForm } from '@/components/BookingForm';
import { QueueVisualizer } from '@/components/QueueVisualizer';
import { StatusMessage } from '@/components/StatusMessage';
import { QueueExplanation } from '@/components/QueueExplanation';
import { SimulationOverlay } from '@/components/SimulationOverlay';
import { Ticket, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Dummy names for simulation
const DUMMY_NAMES = ['Alice', 'Bob', 'Charlie', 'Diana', 'Edward', 'Fiona', 'George'];

// Simulation steps with explanatory messages
interface SimulationStep {
  type: 'enqueue' | 'dequeue' | 'waiting' | 'message';
  name?: string;
  seatNumber?: number;
  message: string;
}

const Index = () => {
  const navigate = useNavigate();
  const [queueState, setQueueState] = useState(getQueueState());
  const [statusMessage, setStatusMessage] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | undefined>();
  const [newId, setNewId] = useState<string | undefined>();
  const [leavingId, setLeavingId] = useState<string | undefined>();

  // Simulation state
  const [isSimulating, setIsSimulating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [simulationMessage, setSimulationMessage] = useState('');
  const simulationRef = useRef<{ paused: boolean; stopped: boolean }>({ paused: false, stopped: false });

  // Update UI after any queue operation
  const updateUI = useCallback(() => {
    setQueueState(getQueueState());
  }, []);

  // Show temporary status message
  const showStatus = useCallback((message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    setStatusMessage({ message, type });
    setTimeout(() => setStatusMessage(null), 4000);
  }, []);

  // Highlight a booking temporarily
  const highlightBooking = useCallback((id: string) => {
    setHighlightedId(id);
    setTimeout(() => setHighlightedId(undefined), 2000);
  }, []);

  // Mark a booking as new (entering from rear)
  const markAsNew = useCallback((id: string) => {
    setNewId(id);
    setTimeout(() => setNewId(undefined), 500);
  }, []);

  // Mark a booking as leaving (exiting from front)
  const markAsLeaving = useCallback((id: string) => {
    setLeavingId(id);
    setTimeout(() => setLeavingId(undefined), 300);
  }, []);

  // Handle booking with seat selection
  const handleBook = useCallback((name: string, seatNumber: number) => {
    const result = enqueue(name, seatNumber);
    
    if (result.success && result.booking) {
      markAsNew(result.booking.bookingId);
      setTimeout(() => {
        updateUI();
        showStatus(result.message, 'success');
        highlightBooking(result.booking!.bookingId);
      }, 100);
    } else {
      updateUI();
      showStatus(result.message, 'error');
    }
  }, [updateUI, showStatus, highlightBooking, markAsNew]);

  // Handle joining waiting list
  const handleJoinWaitingList = useCallback((name: string) => {
    const result = addToWaitingList(name);
    
    if (result.success && result.booking) {
      markAsNew(result.booking.bookingId);
      setTimeout(() => {
        updateUI();
        showStatus(result.message, 'warning');
        highlightBooking(result.booking!.bookingId);
      }, 100);
    } else {
      updateUI();
      showStatus(result.message, 'error');
    }
  }, [updateUI, showStatus, highlightBooking, markAsNew]);

  // Handle cancelling first ticket
  const handleCancel = useCallback(() => {
    // Get first confirmed to animate leaving
    const firstConfirmed = queueState.confirmed[0];
    if (firstConfirmed) {
      markAsLeaving(firstConfirmed.bookingId);
    }

    setTimeout(() => {
      const result = dequeue();
      updateUI();
      
      if (result.success) {
        if (result.autoConfirmed) {
          showStatus(result.message, 'info');
          highlightBooking(result.autoConfirmed.bookingId);
        } else {
          showStatus(result.message, 'success');
        }
      } else {
        showStatus(result.message, 'error');
      }
    }, 300);
  }, [updateUI, showStatus, highlightBooking, markAsLeaving, queueState.confirmed]);

  // Handle cancelling specific seat
  const handleCancelSeat = useCallback((seatNumber: number) => {
    // Find booking to animate leaving
    const booking = queueState.confirmed.find(b => b.seatNumber === seatNumber);
    if (booking) {
      markAsLeaving(booking.bookingId);
    }

    setTimeout(() => {
      const result = cancelBooking(seatNumber);
      updateUI();
      
      if (result.success) {
        if (result.autoConfirmed) {
          showStatus(result.message, 'info');
          highlightBooking(result.autoConfirmed.bookingId);
        } else {
          showStatus(result.message, 'success');
        }
      } else {
        showStatus(result.message, 'error');
      }
    }, 300);
  }, [updateUI, showStatus, highlightBooking, markAsLeaving, queueState.confirmed]);

  // Helper to wait with pause/stop support
  const waitWithControl = useCallback((ms: number): Promise<boolean> => {
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (simulationRef.current.stopped) {
          clearInterval(checkInterval);
          resolve(false);
        } else if (!simulationRef.current.paused) {
          clearInterval(checkInterval);
          setTimeout(() => resolve(!simulationRef.current.stopped), ms);
        }
      }, 100);
    });
  }, []);

  // Step-by-step simulation with explanatory messages
  const handleSimulate = useCallback(async () => {
    resetQueue();
    updateUI();
    
    // Generate simulation steps
    const steps: SimulationStep[] = [];
    const names = [...DUMMY_NAMES].sort(() => Math.random() - 0.5).slice(0, 7);
    
    // Add enqueue steps for confirmed seats
    for (let i = 0; i < CONFIG.maxSeats; i++) {
      steps.push({
        type: 'enqueue',
        name: names[i],
        seatNumber: i + 1,
        message: `📥 ENQUEUE: Adding "${names[i]}" to REAR of queue...\n→ Seat ${i + 1} (Confirmed Zone)`
      });
    }
    
    // Add waiting list steps
    for (let i = CONFIG.maxSeats; i < 7; i++) {
      steps.push({
        type: 'waiting',
        name: names[i],
        message: `📥 ENQUEUE: Adding "${names[i]}" to REAR of queue...\n→ Waiting List (All seats full)`
      });
    }
    
    // Add a dequeue step to show auto-confirmation
    steps.push({
      type: 'message',
      message: `⏳ Now let's DEQUEUE from FRONT...\nThis will trigger auto-confirmation!`
    });
    
    steps.push({
      type: 'dequeue',
      message: `📤 DEQUEUE: Removing FRONT element...\n→ First waiting user auto-confirmed!`
    });

    setTotalSteps(steps.length);
    setCurrentStep(0);
    setIsSimulating(true);
    setIsPaused(false);
    simulationRef.current = { paused: false, stopped: false };

    // Execute steps
    for (let i = 0; i < steps.length; i++) {
      if (simulationRef.current.stopped) break;
      
      const step = steps[i];
      setCurrentStep(i + 1);
      setSimulationMessage(step.message);

      // Wait before executing
      const shouldContinue = await waitWithControl(1200);
      if (!shouldContinue) break;

      // Execute the step
      if (step.type === 'enqueue' && step.name && step.seatNumber) {
        const result = enqueue(step.name, step.seatNumber);
        if (result.booking) {
          markAsNew(result.booking.bookingId);
          setTimeout(() => {
            updateUI();
            highlightBooking(result.booking!.bookingId);
          }, 100);
        }
      } else if (step.type === 'waiting' && step.name) {
        const result = addToWaitingList(step.name);
        if (result.booking) {
          markAsNew(result.booking.bookingId);
          setTimeout(() => {
            updateUI();
            highlightBooking(result.booking!.bookingId);
          }, 100);
        }
      } else if (step.type === 'dequeue') {
        const state = getQueueState();
        const firstConfirmed = state.confirmed[0];
        if (firstConfirmed) {
          markAsLeaving(firstConfirmed.bookingId);
        }
        setTimeout(() => {
          const result = dequeue();
          updateUI();
          if (result.autoConfirmed) {
            highlightBooking(result.autoConfirmed.bookingId);
          }
        }, 300);
      }

      // Wait after executing
      const continueAfter = await waitWithControl(800);
      if (!continueAfter) break;
    }

    // Finish simulation
    setSimulationMessage('✅ Simulation Complete!\nQueue operations demonstrated FIFO order.');
    await waitWithControl(1500);
    setIsSimulating(false);
    showStatus('Simulation completed! Queue operations demonstrated FIFO order.', 'success');
  }, [updateUI, showStatus, highlightBooking, markAsNew, markAsLeaving, waitWithControl]);

  // Simulation controls
  const handlePauseSimulation = useCallback(() => {
    simulationRef.current.paused = true;
    setIsPaused(true);
  }, []);

  const handleResumeSimulation = useCallback(() => {
    simulationRef.current.paused = false;
    setIsPaused(false);
  }, []);

  const handleSkipStep = useCallback(() => {
    simulationRef.current.paused = false;
    setIsPaused(false);
  }, []);

  const handleStopSimulation = useCallback(() => {
    simulationRef.current.stopped = true;
    setIsSimulating(false);
    showStatus('Simulation stopped.', 'info');
  }, [showStatus]);

  // Reset queue
  const handleReset = useCallback(() => {
    resetQueue();
    updateUI();
    showStatus('Queue has been reset.', 'info');
  }, [updateUI, showStatus]);

  // Prepare confirmed seats data for seat selector
  const confirmedSeats = queueState.confirmed.map(b => ({
    seatNumber: b.seatNumber,
    name: b.name
  }));

  return (
    <div className="min-h-screen bg-background">
      {/* Simulation Overlay */}
      <SimulationOverlay
        isRunning={isSimulating}
        isPaused={isPaused}
        currentStep={currentStep}
        totalSteps={totalSteps}
        message={simulationMessage}
        onPause={handlePauseSimulation}
        onResume={handleResumeSimulation}
        onSkip={handleSkipStep}
        onStop={handleStopSimulation}
      />

      {/* Header */}
      <header className="border-b bg-card">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <Ticket className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">QueueShow</h1>
                <p className="text-sm text-muted-foreground">
                  Choose your seat • FIFO waiting list • {CONFIG.maxSeats} seats available
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/')}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8 space-y-8">
        {/* Status Message */}
        {statusMessage && (
          <StatusMessage message={statusMessage.message} type={statusMessage.type} />
        )}

        {/* Booking Form with Seat Selection */}
        <section className="bg-card border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Book Your Ticket</h2>
          <BookingForm
            onBook={handleBook}
            onJoinWaitingList={handleJoinWaitingList}
            onCancel={handleCancel}
            onSimulate={handleSimulate}
            onReset={handleReset}
            isQueueEmpty={queueState.isEmpty}
            availableSeats={queueState.availableSeats}
            confirmedSeats={confirmedSeats}
          />
        </section>

        {/* Queue Visualizer */}
        <section>
          <QueueVisualizer
            confirmed={queueState.confirmed}
            waiting={queueState.waiting}
            availableSeatCount={queueState.availableSeatCount}
            highlightedId={highlightedId}
            leavingId={leavingId}
            newId={newId}
            onCancelSeat={handleCancelSeat}
          />
        </section>

        {/* Explanation Section */}
        <section>
          <QueueExplanation />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-auto">
        <div className="container py-4">
          <p className="text-sm text-muted-foreground text-center">
            Queue Data Structure Demo — FIFO (First In, First Out) Ticket Booking with Seat Selection
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
