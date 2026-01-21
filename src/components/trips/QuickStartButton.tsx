import { Button } from '@/components/ui/button';
import { Play, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickStartButtonProps {
  isTracking: boolean;
  onStart: () => void;
  onStop: () => void;
}

export function QuickStartButton({ isTracking, onStart, onStop }: QuickStartButtonProps) {
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40">
      <Button
        size="lg"
        className={cn(
          "h-16 w-16 rounded-full shadow-xl transition-all duration-300",
          "hover:scale-105 active:scale-95",
          isTracking 
            ? "bg-secondary hover:bg-secondary/90" 
            : "bg-primary hover:bg-primary/90"
        )}
        onClick={isTracking ? onStop : onStart}
      >
        {isTracking ? (
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-foreground opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-primary-foreground"></span>
            </span>
          </div>
        ) : (
          <Play className="h-6 w-6 fill-current" />
        )}
      </Button>
    </div>
  );
}
