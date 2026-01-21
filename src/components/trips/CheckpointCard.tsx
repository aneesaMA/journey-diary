import { Checkpoint } from '@/types/trip';
import { MapPin, Clock, Camera, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface CheckpointCardProps {
  checkpoint: Checkpoint;
  index: number;
}

export function CheckpointCard({ checkpoint, index }: CheckpointCardProps) {
  return (
    <div className="relative flex gap-3">
      {/* Timeline line */}
      <div className="flex flex-col items-center">
        <div className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full",
          "bg-secondary text-secondary-foreground text-sm font-bold"
        )}>
          {index + 1}
        </div>
        <div className="flex-1 w-0.5 bg-border" />
      </div>
      
      {/* Content */}
      <div className="flex-1 pb-6">
        <div className="rounded-xl border border-border bg-card p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-secondary" />
              <span className="font-medium">{checkpoint.name}</span>
            </div>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {format(checkpoint.timestamp, 'h:mm a')}
            </span>
          </div>
          
          {checkpoint.note && (
            <p className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4 shrink-0 mt-0.5" />
              {checkpoint.note}
            </p>
          )}
          
          {checkpoint.photoUrl && (
            <div className="mt-2 flex items-center gap-2 text-sm text-primary">
              <Camera className="h-4 w-4" />
              <span>Photo attached</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
