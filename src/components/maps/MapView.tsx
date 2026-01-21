import { GoogleMap, useJsApiLoader, Marker, Polyline } from '@react-google-maps/api';
import { useMemo, useCallback, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, Navigation2 } from 'lucide-react';

interface MapViewProps {
  center?: { lat: number; lng: number };
  markers?: Array<{ lat: number; lng: number; label?: string; type?: 'origin' | 'destination' | 'checkpoint' }>;
  routePath?: Array<{ lat: number; lng: number }>;
  zoom?: number;
  height?: string;
  showCurrentLocation?: boolean;
  interactive?: boolean;
  className?: string;
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: 'inherit'
};

const darkMapStyles = [
  { elementType: 'geometry', stylers: [{ color: '#1d1d3b' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1d1d3b' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8b8bb5' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2d2d5b' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0e0e2a' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#1a3a2a' }] }
];

const lightMapStyles = [
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#a3d4f7' }] },
  { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#c5e8c5' }] }
];

export function MapView({ 
  center = { lat: 8.5241, lng: 76.9366 },
  markers = [],
  routePath = [],
  zoom = 14,
  height = '200px',
  showCurrentLocation = false,
  interactive = true,
  className = ''
}: MapViewProps) {
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    id: 'google-map-script'
  });

  const mapCenter = useMemo(() => {
    if (currentLocation) return currentLocation;
    if (markers.length > 0) return markers[0];
    return center;
  }, [center, markers, currentLocation]);

  const options = useMemo(() => ({
    disableDefaultUI: !interactive,
    zoomControl: interactive,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    styles: lightMapStyles,
    gestureHandling: interactive ? 'greedy' : 'none'
  }), [interactive]);

  const onLoad = useCallback((map: google.maps.Map) => {
    if (showCurrentLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.log('Geolocation error:', error)
      );
    }
  }, [showCurrentLocation]);

  // Show placeholder if no API key
  if (!apiKey) {
    return (
      <div 
        className={`relative overflow-hidden rounded-xl bg-gradient-to-br from-info/20 via-success/10 to-primary/20 ${className}`}
        style={{ height }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
          <div className="relative">
            <div className="absolute inset-0 animate-ping">
              <MapPin className="h-8 w-8 text-primary/30" />
            </div>
            <MapPin className="h-8 w-8 text-primary" />
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Add Google Maps API key to enable maps
          </p>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-4 left-4 h-2 w-2 rounded-full bg-success animate-pulse" />
        <div className="absolute bottom-6 right-8 h-3 w-3 rounded-full bg-secondary animate-pulse delay-75" />
        <div className="absolute top-1/2 right-4 h-2 w-2 rounded-full bg-accent animate-pulse delay-150" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div 
        className={`flex items-center justify-center bg-muted rounded-xl ${className}`}
        style={{ height }}
      >
        <p className="text-sm text-muted-foreground">Failed to load map</p>
      </div>
    );
  }

  if (!isLoaded) {
    return <Skeleton className={`rounded-xl ${className}`} style={{ height }} />;
  }

  return (
    <div className={`relative overflow-hidden rounded-xl shadow-md ${className}`} style={{ height }}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={mapCenter}
        zoom={zoom}
        options={options}
        onLoad={onLoad}
      >
        {/* Route polyline */}
        {routePath.length > 1 && (
          <Polyline
            path={routePath}
            options={{
              strokeColor: '#f97316',
              strokeOpacity: 0.9,
              strokeWeight: 4,
              geodesic: true
            }}
          />
        )}

        {/* Markers */}
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={{ lat: marker.lat, lng: marker.lng }}
            label={marker.label}
            icon={marker.type === 'origin' ? {
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: '#22c55e',
              fillOpacity: 1,
              strokeWeight: 3,
              strokeColor: '#ffffff',
              scale: 10
            } : marker.type === 'destination' ? {
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: '#a855f7',
              fillOpacity: 1,
              strokeWeight: 3,
              strokeColor: '#ffffff',
              scale: 10
            } : undefined}
          />
        ))}

        {/* Current location */}
        {currentLocation && (
          <Marker
            position={currentLocation}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: '#3b82f6',
              fillOpacity: 1,
              strokeWeight: 3,
              strokeColor: '#ffffff',
              scale: 8
            }}
          />
        )}
      </GoogleMap>
      
      {/* Gradient overlay for aesthetics */}
      <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-card/20 to-transparent pointer-events-none" />
    </div>
  );
}
