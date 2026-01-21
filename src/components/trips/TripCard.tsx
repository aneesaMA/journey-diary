import { Trip, tripModeLabels, tripPurposeLabels } from '@/types/trip';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StaticMapPreview } from '@/components/maps/StaticMapPreview';
import { 
  Car, Bus, Train, Bike, PersonStanding, 
  Plane, MapPin, Clock, Navigation, ChevronRight,
  Image as ImageIcon
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

const modeGradients = {
  car: 'from-primary to-primary/70',
  bus: 'from-success to-success/70',
  train: 'from-info to-info/70',
  metro: 'from-secondary to-secondary/70',
  bike: 'from-accent to-accent/70',
  walk: 'from-success to-success/70',
  auto: 'from-accent to-accent/70',
  taxi: 'from-primary to-primary/70',
  flight: 'from-info to-info/70',
  other: 'from-muted-foreground to-muted-foreground/70'
};

interface TripCardProps {
  trip: Trip;
  onClick?: () => void;
  variant?: 'default' | 'compact' | 'featured';
}

export function TripCard({ trip, onClick, variant = 'default' }: TripCardProps) {
  const ModeIcon = modeIcons[trip.mode];
  const hasPhotos = trip.checkpoints.some(cp => cp.photoUrl);
  
  if (variant === 'featured') {
    return (
      <Card 
        className={cn(
          "cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
          "border-0 overflow-hidden bg-card"
        )}
        onClick={onClick}
      >
        {/* Map Preview */}
        <div className="relative">
          <StaticMapPreview 
            origin={{ lat: 8.5241, lng: 76.9366 }}
            destination={{ lat: 8.5441, lng: 76.9566 }}
            height="140px"
          />
          <div className="absolute top-3 left-3">
            <div className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl shadow-lg bg-gradient-to-br",
              modeGradients[trip.mode]
            )}>
              <ModeIcon className="h-5 w-5 text-primary-foreground" />
            </div>
          </div>
          {hasPhotos && (
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-card/90 backdrop-blur-sm px-2 py-1 rounded-full">
              <ImageIcon className="h-3 w-3 text-primary" />
              <span className="text-xs font-medium">{trip.checkpoints.length}</span>
            </div>
          )}
        </div>
        
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <div className="h-2 w-2 rounded-full bg-success" />
                <span className="text-sm font-semibold truncate">{trip.origin}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-secondary" />
                <span className="text-sm font-semibold truncate">{trip.destination}</span>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
          
          <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
            <Badge variant="secondary" className="text-xs font-medium">
              {tripPurposeLabels[trip.purpose]}
            </Badge>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {trip.duration} min
            </span>
            {trip.distance && (
              <span className="font-medium text-foreground">
                {trip.distance.toFixed(1)} km
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-0.5",
        "border-border/50 bg-card overflow-hidden"
      )}
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="flex">
          {/* Mini Map Preview */}
          <div className="w-24 h-24 shrink-0 bg-gradient-to-br from-info/20 to-success/20 flex items-center justify-center">
            <div className="relative">
              <div className="h-3 w-3 rounded-full bg-success absolute -top-2 -left-2" />
              <div className="h-8 w-0.5 bg-gradient-to-b from-success via-muted-foreground to-secondary rotate-45 origin-top" />
              <div className="h-3 w-3 rounded-full bg-secondary absolute -bottom-2 -right-2" />
            </div>
          </div>
          
          <div className="flex-1 p-3">
            <div className="flex items-start gap-3">
              <div className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl shrink-0 bg-gradient-to-br shadow-sm",
                modeGradients[trip.mode]
              )}>
                <ModeIcon className="h-5 w-5 text-primary-foreground" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-success" />
                  <span className="text-sm font-medium truncate">{trip.origin}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-secondary" />
                  <span className="text-sm font-medium truncate">{trip.destination}</span>
                </div>
                
                <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {trip.duration}m
                  </span>
                  {trip.distance && (
                    <span className="font-medium">
                      {trip.distance.toFixed(1)}km
                    </span>
                  )}
                </div>
              </div>
              
              <div className="text-right shrink-0">
                <p className="text-xs font-medium text-primary">
                  {format(trip.startTime, 'h:mm a')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {format(trip.startTime, 'MMM d')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
