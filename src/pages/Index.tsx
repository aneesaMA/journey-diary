import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { TripCard } from '@/components/trips/TripCard';
import { TripStats } from '@/components/trips/TripStats';
import { QuickStartButton } from '@/components/trips/QuickStartButton';
import { Button } from '@/components/ui/button';
import { useTripStore } from '@/hooks/useTripStore';
import { MapPin, Plus, ChevronRight } from 'lucide-react';
import heroImage from '@/assets/hero-travel.jpg';

const Index = () => {
  const navigate = useNavigate();
  const { trips, activeTrip, getTripStats } = useTripStore();
  const stats = getTripStats();
  const [isTracking, setIsTracking] = useState(false);
  
  const recentTrips = trips.slice(0, 3);

  const handleStartTracking = () => {
    setIsTracking(true);
    navigate('/track');
  };

  return (
    <AppLayout>
      {/* Hero Section */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={heroImage} 
          alt="Travel adventure" 
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background" />
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-2xl font-bold text-foreground">
            Welcome Back! 👋
          </h1>
          <p className="text-sm text-muted-foreground">
            Ready to track your next journey?
          </p>
        </div>
      </div>

      <div className="space-y-6 p-4">
        {/* Stats */}
        <TripStats 
          totalTrips={stats.totalTrips}
          totalDistance={stats.totalDistance}
          totalDuration={stats.totalDuration}
        />

        {/* Active Trip Banner */}
        {activeTrip && (
          <div className="rounded-xl bg-primary p-4 text-primary-foreground">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <MapPin className="h-6 w-6" />
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-foreground opacity-75"></span>
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-primary-foreground"></span>
                  </span>
                </div>
                <div>
                  <p className="font-semibold">Trip in Progress</p>
                  <p className="text-sm opacity-90">From: {activeTrip.origin}</p>
                </div>
              </div>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => navigate('/track')}
              >
                View
              </Button>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex gap-3">
          <Button 
            className="flex-1 h-14 gap-2"
            onClick={() => navigate('/track')}
          >
            <Plus className="h-5 w-5" />
            Start New Trip
          </Button>
          <Button 
            variant="outline" 
            className="h-14 aspect-square"
            onClick={() => navigate('/history')}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Recent Trips */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Recent Trips</h2>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/history')}
            >
              See All
            </Button>
          </div>
          <div className="space-y-3">
            {recentTrips.map((trip) => (
              <TripCard 
                key={trip.id} 
                trip={trip} 
                onClick={() => navigate(`/trip/${trip.id}`)}
              />
            ))}
          </div>
        </div>
      </div>

      <QuickStartButton 
        isTracking={isTracking}
        onStart={handleStartTracking}
        onStop={() => setIsTracking(false)}
      />
    </AppLayout>
  );
};

export default Index;
