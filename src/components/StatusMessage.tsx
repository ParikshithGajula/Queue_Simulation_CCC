import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusMessageProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

export function StatusMessage({ message, type }: StatusMessageProps) {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  };

  const Icon = icons[type];

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-4 rounded-lg border animate-in fade-in slide-in-from-top-2 duration-300',
        type === 'success' && 'bg-confirmed/10 border-confirmed text-confirmed',
        type === 'error' && 'bg-destructive/10 border-destructive text-destructive',
        type === 'warning' && 'bg-waiting/10 border-waiting text-waiting',
        type === 'info' && 'bg-highlight/10 border-highlight text-highlight'
      )}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      <p className="font-medium">{message}</p>
    </div>
  );
}
