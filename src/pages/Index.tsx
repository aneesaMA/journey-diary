import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { TripCard } from '@/components/trips/TripCard';
import { TripStats } from '@/components/trips/TripStats';
import { MapView } from '@/components/maps/MapView';
import { Button } from '@/components/ui/button';
import { useTripStore } from '@/hooks/useTripStore';
import { MapPin, Plus, ChevronRight, Sparkles, Navigation } from 'lucide-react';
import heroImage from '@/assets/hero-travel.jpg';

const Index = () => {
  const navigate = useNavigate();
  const { trips, activeTrip, getTripStats } = useTripStore();
  const stats = getTripStats();
  
  const recentTrips = trips.slice(0, 3);
  const featuredTrip = trips[0];

  return (
    <AppLayout>
      {/* Hero Section with Gradient Overlay */}
      <div className="relative h-56 overflow-hidden">
        <img 
          src={heroImage} 
          alt="Travel adventure" 
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-background/40 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-5 w-5 text-accent animate-pulse" />
            <span className="text-sm font-medium text-primary">Ready to explore?</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            Your Journey<br />
            <span className="text-gradient">Awaits</span> ✨
          </h1>
        </div>
      </div>

      <div className="space-y-6 p-4 -mt-2">
        {/* Stats */}
        <TripStats 
          totalTrips={stats.totalTrips}
          totalDistance={stats.totalDistance}
          totalDuration={stats.totalDuration}
        />

        {/* Active Trip Banner */}
        {activeTrip && (
          <div className="rounded-2xl gradient-primary p-4 text-primary-foreground shadow-glow-primary">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-12 w-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                    <Navigation className="h-6 w-6" />
                  </div>
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"></span>
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-accent"></span>
                  </span>
                </div>
                <div>
                  <p className="font-bold text-lg">Trip in Progress</p>
                  <p className="text-sm opacity-90">From: {activeTrip.origin}</p>
                </div>
              </div>
              <Button 
                variant="secondary" 
                size="sm"
                className="bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30 border-0"
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
            className="flex-1 h-14 gap-2 text-base font-semibold rounded-2xl gradient-primary shadow-glow-primary hover:shadow-lg transition-all"
            onClick={() => navigate('/track')}
          >
            <Plus className="h-5 w-5" />
            Start New Trip
          </Button>
          <Button 
            variant="outline" 
            className="h-14 aspect-square rounded-2xl border-2 hover:bg-secondary/10 hover:border-secondary transition-all"
            onClick={() => navigate('/history')}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Featured Trip with Map */}
        {featuredTrip && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-accent" />
                Featured Trip
              </h2>
            </div>
            <TripCard 
              trip={featuredTrip} 
              variant="featured"
              onClick={() => navigate(`/trip/${featuredTrip.id}`)}
            />
          </div>
        )}

        {/* Live Map Preview */}
        <div>
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-success" />
            Your Location
          </h2>
          <MapView 
            height="180px"
            showCurrentLocation
            interactive={false}
            className="shadow-md"
          />
        </div>

        {/* Recent Trips */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold">Recent Trips</h2>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-primary font-semibold"
              onClick={() => navigate('/history')}
            >
              See All
            </Button>
          </div>
          <div className="space-y-3">
            {recentTrips.slice(1).map((trip) => (
              <TripCard 
                key={trip.id} 
                trip={trip} 
                onClick={() => navigate(`/trip/${trip.id}`)}
              />
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
