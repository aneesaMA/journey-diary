import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { CheckpointCard } from '@/components/trips/CheckpointCard';
import { MapView } from '@/components/maps/MapView';
import { useTripStore } from '@/hooks/useTripStore';
import { tripModeLabels, tripPurposeLabels } from '@/types/trip';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, MapPin, Clock, Route, Edit2, Trash2, 
  Car, Bus, Train, Bike, PersonStanding, Plane, Navigation,
  Share2, FileText, Sparkles, Zap
} from 'lucide-react';
import { format } from 'date-fns';

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

export default function TripDetails() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { getTripById, deleteTrip } = useTripStore();
  
  const trip = getTripById(tripId || '');
  
  if (!trip) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-96 gap-4">
          <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
            <MapPin className="h-10 w-10 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground font-medium">Trip not found</p>
          <Button onClick={() => navigate('/history')}>Back to History</Button>
        </div>
      </AppLayout>
    );
  }

  const ModeIcon = modeIcons[trip.mode];

  const handleDelete = () => {
    deleteTrip(trip.id);
    navigate('/history');
  };

  // Generate route for map
  const routePath = [
    { lat: 8.5241, lng: 76.9366 },
    { lat: 8.5341, lng: 76.9466 },
    { lat: 8.5441, lng: 76.9566 }
  ];

  return (
    <AppLayout>
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon"
            className="rounded-xl"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold flex-1">Trip Details</h1>
          <Button variant="ghost" size="icon" className="rounded-xl">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>

        {/* Map */}
        <MapView 
          height="200px"
          routePath={routePath}
          markers={[
            { lat: 8.5241, lng: 76.9366, type: 'origin' },
            { lat: 8.5441, lng: 76.9566, type: 'destination' }
          ]}
          className="shadow-lg"
        />

        {/* Route Card */}
        <Card className="overflow-hidden border-0">
          <div className="gradient-primary p-5 text-primary-foreground">
            <div className="flex items-center gap-4 mb-5">
              <div className="h-14 w-14 rounded-2xl bg-primary-foreground/20 flex items-center justify-center shadow-lg">
                <ModeIcon className="h-7 w-7" />
              </div>
              <div>
                <p className="font-bold text-lg">{tripModeLabels[trip.mode]}</p>
                <Badge className="bg-primary-foreground/20 text-primary-foreground border-0 text-xs">
                  {tripPurposeLabels[trip.purpose]}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-4 w-4 rounded-full bg-success border-2 border-primary-foreground shadow" />
                  <div className="w-0.5 h-10 bg-primary-foreground/40" />
                </div>
                <div>
                  <p className="text-xs opacity-75 font-medium">FROM</p>
                  <p className="font-bold text-lg">{trip.origin}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="h-4 w-4 rounded-full bg-secondary border-2 border-primary-foreground shadow" />
                <div>
                  <p className="text-xs opacity-75 font-medium">TO</p>
                  <p className="font-bold text-lg">{trip.destination}</p>
                </div>
              </div>
            </div>
          </div>
          
          <CardContent className="p-5">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 rounded-xl bg-primary/10">
                <Zap className="h-5 w-5 text-primary mx-auto mb-1" />
                <p className="text-2xl font-bold text-primary">
                  {trip.distance?.toFixed(1) || '—'}
                </p>
                <p className="text-xs text-muted-foreground font-medium">kilometers</p>
              </div>
              <div className="p-3 rounded-xl bg-secondary/10">
                <Clock className="h-5 w-5 text-secondary mx-auto mb-1" />
                <p className="text-2xl font-bold text-secondary">
                  {trip.duration || '—'}
                </p>
                <p className="text-xs text-muted-foreground font-medium">minutes</p>
              </div>
              <div className="p-3 rounded-xl bg-accent/20">
                <Sparkles className="h-5 w-5 text-accent-foreground mx-auto mb-1" />
                <p className="text-2xl font-bold text-accent-foreground">
                  {trip.checkpoints.length}
                </p>
                <p className="text-xs text-muted-foreground font-medium">moments</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Time Info */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-info/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-info" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">Date & Time</span>
              </div>
              <div className="text-right">
                <p className="font-bold">{format(trip.startTime, 'MMM d, yyyy')}</p>
                <p className="text-sm text-muted-foreground">
                  {format(trip.startTime, 'h:mm a')} - {trip.endTime ? format(trip.endTime, 'h:mm a') : 'Ongoing'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Checkpoints */}
        {trip.checkpoints.length > 0 && (
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-accent" />
                Moments Captured
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="space-y-0">
                {trip.checkpoints.map((cp, idx) => (
                  <CheckpointCard key={cp.id} checkpoint={cp} index={idx} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notes */}
        {trip.notes && (
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4 text-info" />
                Trip Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-sm text-muted-foreground leading-relaxed">{trip.notes}</p>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex gap-3 pb-4">
          <Button variant="outline" className="flex-1 gap-2 h-12 rounded-xl font-semibold">
            <Edit2 className="h-4 w-4" />
            Edit Trip
          </Button>
          <Button 
            variant="outline" 
            className="h-12 rounded-xl text-destructive hover:bg-destructive hover:text-destructive-foreground"
            onClick={handleDelete}
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
