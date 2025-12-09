import { Play, Pause, SkipForward, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SimulationOverlayProps {
  isRunning: boolean;
  isPaused: boolean;
  currentStep: number;
  totalSteps: number;
  message: string;
  onPause: () => void;
  onResume: () => void;
  onSkip: () => void;
  onStop: () => void;
}

export const SimulationOverlay = ({
  isRunning,
  isPaused,
  currentStep,
  totalSteps,
  message,
  onPause,
  onResume,
  onSkip,
  onStop
}: SimulationOverlayProps) => {
  if (!isRunning) return null;

  return (
    <div className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg">
      <div className="container py-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Status indicator and message */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-3 h-3 rounded-full bg-destructive animate-pulse" />
              <span className="font-semibold text-sm">SIMULATING</span>
            </div>
            <div className="h-4 w-px bg-primary-foreground/30 hidden md:block" />
            <p className="font-mono text-sm truncate">
              {message.split('\n')[0]}
            </p>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2 text-sm">
              <span className="opacity-70">Step</span>
              <span className="font-bold">{currentStep}/{totalSteps}</span>
            </div>
            
            {/* Progress bar */}
            <div className="w-24 h-2 bg-primary-foreground/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary-foreground transition-all duration-300 rounded-full"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {isPaused ? (
              <Button onClick={onResume} size="sm" variant="secondary" className="gap-1">
                <Play className="h-3 w-3" />
                Resume
              </Button>
            ) : (
              <Button onClick={onPause} size="sm" variant="secondary" className="gap-1">
                <Pause className="h-3 w-3" />
                Pause
              </Button>
            )}
            <Button onClick={onSkip} size="sm" variant="secondary" className="gap-1">
              <SkipForward className="h-3 w-3" />
              Skip
            </Button>
            <Button onClick={onStop} size="sm" variant="destructive" className="gap-1">
              <RotateCcw className="h-3 w-3" />
              Stop
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
