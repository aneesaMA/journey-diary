import { Card, CardContent } from '@/components/ui/card';
import { Route, Clock, MapPin, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TripStatsProps {
  totalTrips: number;
  totalDistance: number;
  totalDuration: number;
}

const stats = [
  { key: 'trips', icon: MapPin, label: 'Trips', gradient: 'from-primary to-primary/70' },
  { key: 'distance', icon: Route, label: 'Distance', gradient: 'from-secondary to-secondary/70' },
  { key: 'duration', icon: Clock, label: 'Hours', gradient: 'from-success to-success/70' },
  { key: 'streak', icon: Flame, label: 'Streak', gradient: 'from-accent to-accent/70' }
];

export function TripStats({ totalTrips, totalDistance, totalDuration }: TripStatsProps) {
  const values = {
    trips: totalTrips,
    distance: `${totalDistance.toFixed(0)}km`,
    duration: `${Math.round(totalDuration / 60)}h`,
    streak: '7 days'
  };

  return (
    <div className="grid grid-cols-4 gap-2">
      {stats.map(({ key, icon: Icon, label, gradient }) => (
        <Card 
          key={key} 
          className="border-0 shadow-sm overflow-hidden bg-card hover:shadow-md transition-shadow"
        >
          <CardContent className="p-3 text-center">
            <div className={cn(
              "mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br shadow-sm",
              gradient
            )}>
              <Icon className="h-5 w-5 text-primary-foreground" />
            </div>
            <p className="text-lg font-bold text-foreground">
              {values[key as keyof typeof values]}
            </p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
              {label}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
