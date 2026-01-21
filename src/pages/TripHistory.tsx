import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { TripCard } from '@/components/trips/TripCard';
import { MapView } from '@/components/maps/MapView';
import { useTripStore } from '@/hooks/useTripStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { TripMode, tripModeLabels } from '@/types/trip';
import { Search, Filter, Calendar, MapPin, Sparkles } from 'lucide-react';
import { format } from 'date-fns';

export default function TripHistory() {
  const navigate = useNavigate();
  const { trips } = useTripStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMode, setSelectedMode] = useState<TripMode | 'all'>('all');
  const [showMap, setShowMap] = useState(false);

  const modes: (TripMode | 'all')[] = ['all', 'car', 'bus', 'train', 'bike', 'walk', 'auto'];

  const modeColors: Record<string, string> = {
    all: 'bg-primary',
    car: 'bg-primary',
    bus: 'bg-success',
    train: 'bg-info',
    bike: 'bg-accent',
    walk: 'bg-success',
    auto: 'bg-accent'
  };

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

  // Get all trip locations for map
  const allMarkers = trips.map(trip => ({
    lat: 8.5241 + Math.random() * 0.05,
    lng: 76.9366 + Math.random() * 0.05
  }));

  return (
    <AppLayout>
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Trip History</h1>
            <p className="text-sm text-muted-foreground">
              {trips.length} adventures recorded
            </p>
          </div>
          <Button 
            variant={showMap ? "default" : "outline"} 
            size="sm" 
            className="rounded-xl gap-2"
            onClick={() => setShowMap(!showMap)}
          >
            <MapPin className="h-4 w-4" />
            Map
          </Button>
        </div>

        {/* Map View Toggle */}
        {showMap && (
          <Card className="border-0 overflow-hidden">
            <MapView 
              height="200px"
              markers={allMarkers}
              zoom={11}
            />
          </Card>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search your trips..."
            className="pl-11 rounded-xl border-2 h-12"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Mode Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {modes.map((mode) => (
            <Badge
              key={mode}
              variant={selectedMode === mode ? 'default' : 'outline'}
              className={`cursor-pointer whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedMode === mode 
                  ? `${modeColors[mode]} text-primary-foreground border-0 shadow-sm` 
                  : 'hover:bg-muted'
              }`}
              onClick={() => setSelectedMode(mode)}
            >
              {mode === 'all' ? '✨ All' : tripModeLabels[mode as TripMode]}
            </Badge>
          ))}
        </div>

        {/* Stats Summary */}
        <Card className="border-0 gradient-hero">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-accent/20 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="font-bold text-lg">{filteredTrips.length} trips</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="gap-1">
                <Calendar className="h-4 w-4" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Trip List */}
        <div className="space-y-6">
          {Object.entries(groupedTrips).map(([date, dayTrips]) => (
            <div key={date}>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {format(new Date(date), 'EEEE, MMMM d')}
              </h3>
              <div className="space-y-3">
                {dayTrips.map((trip, index) => (
                  <TripCard 
                    key={trip.id} 
                    trip={trip}
                    variant={index === 0 ? 'featured' : 'default'}
                    onClick={() => navigate(`/trip/${trip.id}`)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {filteredTrips.length === 0 && (
          <div className="text-center py-16">
            <div className="h-20 w-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <MapPin className="h-10 w-10 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium">No trips found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Start tracking to see your adventures here!
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
