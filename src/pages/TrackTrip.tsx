import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ModeSelector } from '@/components/trips/ModeSelector';
import { PurposeSelector } from '@/components/trips/PurposeSelector';
import { CheckpointCard } from '@/components/trips/CheckpointCard';
import { MapView } from '@/components/maps/MapView';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useTripStore } from '@/hooks/useTripStore';
import { TripMode, TripPurpose, Checkpoint } from '@/types/trip';
import { 
  MapPin, Navigation, Clock, Plus, Camera, 
  StopCircle, CheckCircle2, Route, Sparkles, Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TrackTrip() {
  const navigate = useNavigate();
  const { activeTrip, startTrip, endTrip, addCheckpoint } = useTripStore();
  
  const [isTracking, setIsTracking] = useState(!!activeTrip);
  const [origin, setOrigin] = useState(activeTrip?.origin || '');
  const [destination, setDestination] = useState(activeTrip?.destination || '');
  const [mode, setMode] = useState<TripMode>(activeTrip?.mode || 'car');
  const [purpose, setPurpose] = useState<TripPurpose>(activeTrip?.purpose || 'work');
  const [notes, setNotes] = useState(activeTrip?.notes || '');
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>(activeTrip?.checkpoints || []);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showAddCheckpoint, setShowAddCheckpoint] = useState(false);
  const [checkpointName, setCheckpointName] = useState('');
  const [checkpointNote, setCheckpointNote] = useState('');

  const [currentLocation] = useState({ lat: 8.5241, lng: 76.9366 });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTracking) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartTracking = () => {
    if (!origin) return;
    startTrip(origin);
    setIsTracking(true);
  };

  const handleStopTracking = () => {
    endTrip({
      destination,
      mode,
      purpose,
      notes,
      checkpoints,
      distance: Math.random() * 20 + 5
    });
    setIsTracking(false);
    navigate('/');
  };

  const handleAddCheckpoint = () => {
    if (!checkpointName) return;
    
    const newCheckpoint: Checkpoint = {
      id: Date.now().toString(),
      name: checkpointName,
      latitude: currentLocation.lat,
      longitude: currentLocation.lng,
      timestamp: new Date(),
      note: checkpointNote
    };
    
    setCheckpoints(prev => [...prev, newCheckpoint]);
    addCheckpoint(newCheckpoint);
    setCheckpointName('');
    setCheckpointNote('');
    setShowAddCheckpoint(false);
  };

  // Generate route path for visualization
  const routePath = [
    currentLocation,
    { lat: currentLocation.lat + 0.01, lng: currentLocation.lng + 0.01 },
    { lat: currentLocation.lat + 0.02, lng: currentLocation.lng + 0.015 }
  ];

  return (
    <AppLayout>
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {isTracking ? 'Trip in Progress' : 'New Adventure'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isTracking ? 'Recording your journey...' : 'Where are you heading?'}
            </p>
          </div>
          {isTracking && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 text-success">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success"></span>
              </span>
              <span className="text-xs font-semibold">Live</span>
            </div>
          )}
        </div>

        {/* Live Map */}
        {isTracking && (
          <MapView 
            center={currentLocation}
            height="200px"
            showCurrentLocation
            routePath={routePath}
            markers={checkpoints.map(cp => ({
              lat: cp.latitude,
              lng: cp.longitude,
              type: 'checkpoint' as const
            }))}
            className="shadow-lg"
          />
        )}

        {/* Timer Card */}
        {isTracking && (
          <Card className="border-0 overflow-hidden">
            <div className="gradient-primary p-6 text-primary-foreground">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Zap className="h-5 w-5" />
                  <span className="text-sm font-semibold opacity-90">Trip Duration</span>
                </div>
                <p className="text-5xl font-mono font-bold tracking-wider">{formatTime(elapsedTime)}</p>
              </div>
              <div className="mt-6 flex items-center justify-center gap-8">
                <div className="text-center">
                  <p className="text-3xl font-bold">{(elapsedTime / 60 * 0.5).toFixed(1)}</p>
                  <p className="text-xs opacity-80 font-medium">km traveled</p>
                </div>
                <div className="h-10 w-px bg-primary-foreground/30" />
                <div className="text-center">
                  <p className="text-3xl font-bold">{checkpoints.length}</p>
                  <p className="text-xs opacity-80 font-medium">checkpoints</p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Location Inputs */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-success flex items-center justify-center">
                  <MapPin className="h-2.5 w-2.5 text-success-foreground" />
                </div>
                Starting Point
              </label>
              <Input
                placeholder="Where are you starting from?"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                disabled={isTracking}
                className="border-2 focus:border-success rounded-xl"
              />
            </div>
            
            <div className="flex justify-center">
              <div className="flex flex-col items-center gap-1">
                <div className="h-6 w-0.5 bg-gradient-to-b from-success to-secondary rounded-full" />
                <Route className="h-4 w-4 text-muted-foreground" />
                <div className="h-6 w-0.5 bg-gradient-to-b from-secondary to-secondary rounded-full" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-secondary flex items-center justify-center">
                  <MapPin className="h-2.5 w-2.5 text-secondary-foreground" />
                </div>
                Destination
              </label>
              <Input
                placeholder="Where are you heading?"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="border-2 focus:border-secondary rounded-xl"
              />
            </div>
          </CardContent>
        </Card>

        {/* Mode & Purpose */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 space-y-4">
            <ModeSelector selected={mode} onSelect={setMode} />
            <PurposeSelector selected={purpose} onSelect={setPurpose} />
          </CardContent>
        </Card>

        {/* Checkpoints */}
        {isTracking && (
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-accent" />
                  Moments
                </CardTitle>
                <Sheet open={showAddCheckpoint} onOpenChange={setShowAddCheckpoint}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="rounded-xl gap-1">
                      <Plus className="h-4 w-4" />
                      Add
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="h-auto rounded-t-3xl">
                    <SheetHeader>
                      <SheetTitle className="text-left">Capture a Moment ✨</SheetTitle>
                    </SheetHeader>
                    <div className="space-y-4 mt-4">
                      <Input
                        placeholder="Name this stop..."
                        value={checkpointName}
                        onChange={(e) => setCheckpointName(e.target.value)}
                        className="rounded-xl border-2"
                      />
                      <Textarea
                        placeholder="Add a memory note (optional)..."
                        value={checkpointNote}
                        onChange={(e) => setCheckpointNote(e.target.value)}
                        className="rounded-xl border-2"
                      />
                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1 gap-2 rounded-xl h-12">
                          <Camera className="h-5 w-5 text-primary" />
                          Add Photo
                        </Button>
                        <Button className="flex-1 rounded-xl h-12 gradient-primary" onClick={handleAddCheckpoint}>
                          <CheckCircle2 className="h-5 w-5 mr-2" />
                          Save
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              {checkpoints.length > 0 ? (
                <div className="space-y-0">
                  {checkpoints.map((cp, idx) => (
                    <CheckpointCard key={cp.id} checkpoint={cp} index={idx} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="h-16 w-16 mx-auto mb-3 rounded-full bg-accent/20 flex items-center justify-center">
                    <Camera className="h-8 w-8 text-accent" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    No moments yet. Capture stops along your journey!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Notes */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <label className="text-sm font-semibold mb-2 block">Trip Notes</label>
            <Textarea
              placeholder="What makes this trip special?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="rounded-xl border-2"
            />
          </CardContent>
        </Card>

        {/* Action Button */}
        <div className="pb-4">
          {isTracking ? (
            <Button 
              className="w-full h-14 text-lg gap-2 gradient-secondary shadow-glow-secondary rounded-2xl font-semibold"
              onClick={handleStopTracking}
            >
              <StopCircle className="h-6 w-6" />
              End Trip
            </Button>
          ) : (
            <Button 
              className="w-full h-14 text-lg gap-2 gradient-primary shadow-glow-primary rounded-2xl font-semibold"
              onClick={handleStartTracking}
              disabled={!origin}
            >
              <Navigation className="h-6 w-6" />
              Start Tracking
            </Button>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
