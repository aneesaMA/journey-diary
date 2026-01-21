import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Clock, Route, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TripStatsProps {
  totalTrips: number;
  totalDistance: number;
  totalDuration: number;
}

const stats = [
  { 
    key: 'trips', 
    label: 'Total Trips', 
    icon: MapPin, 
    color: 'bg-primary/10 text-primary',
    format: (v: number) => v.toString()
  },
  { 
    key: 'distance', 
    label: 'Distance', 
    icon: Route, 
    color: 'bg-secondary/10 text-secondary',
    format: (v: number) => `${v.toFixed(1)} km`
  },
  { 
    key: 'duration', 
    label: 'Time', 
    icon: Clock, 
    color: 'bg-success/10 text-success',
    format: (v: number) => `${Math.floor(v / 60)}h ${v % 60}m`
  },
  { 
    key: 'avg', 
    label: 'Avg/Trip', 
    icon: TrendingUp, 
    color: 'bg-accent/80 text-accent-foreground',
    format: (v: number, t: number) => t > 0 ? `${(v / t).toFixed(1)} km` : '0 km'
  }
];

export function TripStats({ totalTrips, totalDistance, totalDuration }: TripStatsProps) {
  const values: Record<string, number> = {
    trips: totalTrips,
    distance: totalDistance,
    duration: totalDuration,
    avg: totalDistance
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map(({ key, label, icon: Icon, color, format }) => (
        <Card key={key} className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl",
                color
              )}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-bold">
                  {key === 'avg' ? format(values[key], totalTrips) : format(values[key], totalTrips)}
                </p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
