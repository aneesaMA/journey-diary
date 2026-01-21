import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { CheckpointCard } from '@/components/trips/CheckpointCard';
import { useTripStore } from '@/hooks/useTripStore';
import { tripModeLabels, tripPurposeLabels } from '@/types/trip';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, MapPin, Clock, Route, Edit2, Trash2, 
  Car, Bus, Train, Bike, PersonStanding, Plane, Navigation,
  Share2, FileText
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

export default function TripDetails() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { getTripById, deleteTrip } = useTripStore();
  
  const trip = getTripById(tripId || '');
  
  if (!trip) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Trip not found</p>
        </div>
      </AppLayout>
    );
  }

  const ModeIcon = modeIcons[trip.mode];

  const handleDelete = () => {
    deleteTrip(trip.id);
    navigate('/history');
  };

  return (
    <AppLayout>
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold flex-1">Trip Details</h1>
          <Button variant="ghost" size="icon">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>

        {/* Route Card */}
        <Card className="overflow-hidden">
          <div className="bg-primary p-4 text-primary-foreground">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-foreground/20">
                <ModeIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold">{tripModeLabels[trip.mode]}</p>
                <p className="text-sm opacity-90">{tripPurposeLabels[trip.purpose]}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-success border-2 border-primary-foreground" />
                  <div className="w-0.5 h-8 bg-primary-foreground/50" />
                </div>
                <div>
                  <p className="text-xs opacity-75">From</p>
                  <p className="font-medium">{trip.origin}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-3 w-3 rounded-full bg-secondary border-2 border-primary-foreground" />
                <div>
                  <p className="text-xs opacity-75">To</p>
                  <p className="font-medium">{trip.destination}</p>
                </div>
              </div>
            </div>
          </div>
          
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">
                  {trip.distance?.toFixed(1) || '—'}
                </p>
                <p className="text-xs text-muted-foreground">km</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-secondary">
                  {trip.duration || '—'}
                </p>
                <p className="text-xs text-muted-foreground">minutes</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-accent-foreground">
                  {trip.checkpoints.length}
                </p>
                <p className="text-xs text-muted-foreground">stops</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Time Info */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Date & Time</span>
              </div>
              <div className="text-right">
                <p className="font-medium">{format(trip.startTime, 'MMM d, yyyy')}</p>
                <p className="text-sm text-muted-foreground">
                  {format(trip.startTime, 'h:mm a')} - {trip.endTime ? format(trip.endTime, 'h:mm a') : 'Ongoing'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Checkpoints */}
        {trip.checkpoints.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Checkpoints
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
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-sm text-muted-foreground">{trip.notes}</p>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex gap-3 pb-4">
          <Button variant="outline" className="flex-1 gap-2">
            <Edit2 className="h-4 w-4" />
            Edit
          </Button>
          <Button 
            variant="outline" 
            className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
