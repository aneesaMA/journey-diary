import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { TripCard } from '@/components/trips/TripCard';
import { useTripStore } from '@/hooks/useTripStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TripMode, tripModeLabels } from '@/types/trip';
import { Search, Filter, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export default function TripHistory() {
  const navigate = useNavigate();
  const { trips } = useTripStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMode, setSelectedMode] = useState<TripMode | 'all'>('all');

  const modes: (TripMode | 'all')[] = ['all', 'car', 'bus', 'train', 'bike', 'walk', 'auto'];

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = 
      trip.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.destination.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMode = selectedMode === 'all' || trip.mode === selectedMode;
    return matchesSearch && matchesMode;
  });

  // Group trips by date
  const groupedTrips = filteredTrips.reduce((acc, trip) => {
    const date = format(trip.startTime, 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(trip);
    return acc;
  }, {} as Record<string, typeof trips>);

  return (
    <AppLayout>
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Trip History</h1>
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search trips..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Mode Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
          {modes.map((mode) => (
            <Badge
              key={mode}
              variant={selectedMode === mode ? 'default' : 'outline'}
              className="cursor-pointer whitespace-nowrap"
              onClick={() => setSelectedMode(mode)}
            >
              {mode === 'all' ? 'All' : tripModeLabels[mode as TripMode]}
            </Badge>
          ))}
        </div>

        {/* Trip List */}
        <div className="space-y-6">
          {Object.entries(groupedTrips).map(([date, dayTrips]) => (
            <div key={date}>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                {format(new Date(date), 'EEEE, MMMM d')}
              </h3>
              <div className="space-y-3">
                {dayTrips.map((trip) => (
                  <TripCard 
                    key={trip.id} 
                    trip={trip}
                    onClick={() => navigate(`/trip/${trip.id}`)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {filteredTrips.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No trips found</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
