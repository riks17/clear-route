import { Loader2, AlertCircle, Inbox } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
      <Loader2 className="h-8 w-8 animate-spin mb-3" />
      <p>{message}</p>
    </div>
  );
}

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <AlertCircle className="h-12 w-12 text-destructive mb-3" />
      <p className="text-destructive font-medium mb-2">Error</p>
      <p className="text-muted-foreground text-sm mb-4">{message}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="text-primary hover:underline text-sm"
        >
          Try again
        </button>
      )}
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Inbox className="h-12 w-12 text-muted-foreground mb-3" />
      <h3 className="font-medium mb-1">{title}</h3>
      <p className="text-muted-foreground text-sm mb-4">{description}</p>
      {action && (
        <button 
          onClick={action.onClick}
          className="text-primary hover:underline text-sm font-medium"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
