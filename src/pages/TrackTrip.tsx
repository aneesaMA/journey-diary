import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ModeSelector } from '@/components/trips/ModeSelector';
import { PurposeSelector } from '@/components/trips/PurposeSelector';
import { CheckpointCard } from '@/components/trips/CheckpointCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useTripStore } from '@/hooks/useTripStore';
import { TripMode, TripPurpose, Checkpoint } from '@/types/trip';
import { 
  MapPin, Navigation, Clock, Plus, Camera, 
  StopCircle, CheckCircle2, Route 
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

  // Simulated GPS coordinates
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
    if (!origin) {
      return;
    }
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
      distance: Math.random() * 20 + 5 // Simulated distance
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

  return (
    <AppLayout>
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">
            {isTracking ? 'Trip in Progress' : 'Start New Trip'}
          </h1>
          {isTracking && (
            <div className="flex items-center gap-2 text-primary">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
              </span>
              <span className="text-sm font-medium">Recording</span>
            </div>
          )}
        </div>

        {/* Timer Card */}
        {isTracking && (
          <Card className="bg-primary text-primary-foreground border-none">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="h-5 w-5" />
                  <span className="text-sm font-medium opacity-90">Duration</span>
                </div>
                <p className="text-4xl font-mono font-bold">{formatTime(elapsedTime)}</p>
              </div>
              <div className="mt-4 flex items-center justify-center gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold">{(elapsedTime / 60 * 0.5).toFixed(1)}</p>
                  <p className="text-xs opacity-90">km traveled</p>
                </div>
                <div className="h-8 w-px bg-primary-foreground/30" />
                <div className="text-center">
                  <p className="text-2xl font-bold">{checkpoints.length}</p>
                  <p className="text-xs opacity-90">checkpoints</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Location Inputs */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4 text-success" />
                Origin
              </label>
              <Input
                placeholder="Enter starting point..."
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                disabled={isTracking}
              />
            </div>
            
            <div className="flex justify-center">
              <div className="flex flex-col items-center">
                <Route className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4 text-secondary" />
                Destination
              </label>
              <Input
                placeholder="Enter destination..."
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Mode & Purpose */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <ModeSelector selected={mode} onSelect={setMode} />
            <PurposeSelector selected={purpose} onSelect={setPurpose} />
          </CardContent>
        </Card>

        {/* Checkpoints */}
        {isTracking && (
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Checkpoints</CardTitle>
                <Sheet open={showAddCheckpoint} onOpenChange={setShowAddCheckpoint}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="h-auto">
                    <SheetHeader>
                      <SheetTitle>Add Checkpoint</SheetTitle>
                    </SheetHeader>
                    <div className="space-y-4 mt-4">
                      <Input
                        placeholder="Checkpoint name..."
                        value={checkpointName}
                        onChange={(e) => setCheckpointName(e.target.value)}
                      />
                      <Textarea
                        placeholder="Add a note (optional)..."
                        value={checkpointNote}
                        onChange={(e) => setCheckpointNote(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1 gap-2">
                          <Camera className="h-4 w-4" />
                          Photo
                        </Button>
                        <Button className="flex-1" onClick={handleAddCheckpoint}>
                          <CheckCircle2 className="h-4 w-4 mr-2" />
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
                <p className="text-sm text-muted-foreground text-center py-4">
                  No checkpoints yet. Add stops along your journey!
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Notes */}
        <Card>
          <CardContent className="p-4">
            <label className="text-sm font-medium mb-2 block">Trip Notes</label>
            <Textarea
              placeholder="Add notes about your trip..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </CardContent>
        </Card>

        {/* Action Button */}
        <div className="pb-4">
          {isTracking ? (
            <Button 
              className="w-full h-14 text-lg gap-2 bg-secondary hover:bg-secondary/90"
              onClick={handleStopTracking}
            >
              <StopCircle className="h-5 w-5" />
              End Trip
            </Button>
          ) : (
            <Button 
              className="w-full h-14 text-lg gap-2"
              onClick={handleStartTracking}
              disabled={!origin}
            >
              <Navigation className="h-5 w-5" />
              Start Tracking
            </Button>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
