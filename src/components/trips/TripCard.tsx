import { Trip, tripModeLabels, tripPurposeLabels } from '@/types/trip';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Car, Bus, Train, Bike, PersonStanding, 
  Plane, MapPin, Clock, Navigation 
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const modeIcons = {
  car: Car,
  bus: Bus,
  train: Train,
  metro: Train,
  bike: Bike,
  walk: PersonStanding,
  auto: Car,
  taxi: Car,
  flight: Plane,
  other: Navigation
};

const modeColors = {
  car: 'bg-primary/10 text-primary',
  bus: 'bg-success/10 text-success',
  train: 'bg-secondary/10 text-secondary',
  metro: 'bg-chart-5/10 text-chart-5',
  bike: 'bg-accent/80 text-accent-foreground',
  walk: 'bg-success/10 text-success',
  auto: 'bg-accent/80 text-accent-foreground',
  taxi: 'bg-secondary/10 text-secondary',
  flight: 'bg-primary/10 text-primary',
  other: 'bg-muted text-muted-foreground'
};

interface TripCardProps {
  trip: Trip;
  onClick?: () => void;
}

export function TripCard({ trip, onClick }: TripCardProps) {
  const ModeIcon = modeIcons[trip.mode];
  
  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md",
        "border-border/50 bg-card"
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl",
            modeColors[trip.mode]
          )}>
            <ModeIcon className="h-6 w-6" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="h-3 w-3 text-success shrink-0" />
              <span className="text-sm font-medium truncate">{trip.origin}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-3 w-3 text-secondary shrink-0" />
              <span className="text-sm font-medium truncate">{trip.destination}</span>
            </div>
            
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {tripPurposeLabels[trip.purpose]}
              </Badge>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {trip.duration} min
              </span>
              {trip.distance && (
                <span className="text-xs text-muted-foreground">
                  {trip.distance.toFixed(1)} km
                </span>
              )}
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-xs text-muted-foreground">
              {format(trip.startTime, 'MMM d')}
            </p>
            <p className="text-xs font-medium">
              {format(trip.startTime, 'h:mm a')}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
