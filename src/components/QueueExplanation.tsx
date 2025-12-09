import { ArrowRight, ArrowDown } from 'lucide-react';

export function QueueExplanation() {
  return (
    <div className="bg-card border rounded-lg p-6 space-y-4">
      <h3 className="font-semibold text-lg">How the Queue Works (FIFO)</h3>
      
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <div className="px-3 py-1.5 bg-muted rounded font-mono text-xs">New Booking</div>
        <ArrowRight className="h-4 w-4" />
        <div className="px-3 py-1.5 bg-confirmed/20 text-confirmed border border-confirmed rounded font-mono text-xs">
          Confirmed (if seats available)
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <div className="px-3 py-1.5 bg-muted rounded font-mono text-xs">New Booking</div>
        <ArrowRight className="h-4 w-4" />
        <div className="px-3 py-1.5 bg-waiting/20 text-waiting border border-waiting rounded font-mono text-xs">
          Waiting List (if seats full)
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <div className="px-3 py-1.5 bg-destructive/20 text-destructive border border-destructive rounded font-mono text-xs">
          Cancel First Confirmed
        </div>
        <ArrowRight className="h-4 w-4" />
        <div className="px-3 py-1.5 bg-waiting/20 text-waiting border border-waiting rounded font-mono text-xs">
          First Waiting
        </div>
        <ArrowDown className="h-4 w-4 rotate-[-90deg]" />
        <div className="px-3 py-1.5 bg-confirmed/20 text-confirmed border border-confirmed rounded font-mono text-xs">
          Auto-Confirmed!
        </div>
      </div>

      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
        <p className="text-xs text-muted-foreground">
          <strong>Single Queue Array:</strong> 
          <code className="mx-1 px-1 py-0.5 bg-background rounded text-[10px]">
            [ Confirmed Seats | Waiting List ]
          </code>
          — First {5} elements are confirmed, rest are waiting.
        </p>
      </div>
    </div>
  );
}
