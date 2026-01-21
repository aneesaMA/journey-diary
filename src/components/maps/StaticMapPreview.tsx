import { MapPin, Navigation } from 'lucide-react';

interface StaticMapPreviewProps {
  origin?: { lat: number; lng: number };
  destination?: { lat: number; lng: number };
  height?: string;
  className?: string;
}

export function StaticMapPreview({ 
  origin,
  destination,
  height = '120px',
  className = ''
}: StaticMapPreviewProps) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  
  // Generate static map URL
  const getStaticMapUrl = () => {
    if (!apiKey) return null;
    
    const center = origin || destination || { lat: 8.5241, lng: 76.9366 };
    let url = `https://maps.googleapis.com/maps/api/staticmap?`;
    url += `center=${center.lat},${center.lng}`;
    url += `&zoom=12&size=400x200&scale=2&maptype=roadmap`;
    
    if (origin) {
      url += `&markers=color:green|${origin.lat},${origin.lng}`;
    }
    if (destination) {
      url += `&markers=color:purple|${destination.lat},${destination.lng}`;
    }
    
    // Custom styling for aesthetic look
    url += '&style=feature:water|color:0xa3d4f7';
    url += '&style=feature:landscape|color:0xf5f5f5';
    
    url += `&key=${apiKey}`;
    return url;
  };

  const mapUrl = getStaticMapUrl();

  return (
    <div 
      className={`relative overflow-hidden rounded-xl ${className}`}
      style={{ height }}
    >
      {mapUrl ? (
        <img 
          src={mapUrl}
          alt="Trip route preview"
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        // Beautiful placeholder with gradient
        <div className="w-full h-full bg-gradient-to-br from-info/30 via-success/20 to-primary/30 flex items-center justify-center">
          <div className="relative flex items-center gap-4">
            <div className="flex flex-col items-center gap-1">
              <div className="h-6 w-6 rounded-full bg-success/80 flex items-center justify-center shadow-lg">
                <MapPin className="h-3 w-3 text-success-foreground" />
              </div>
              <span className="text-[10px] text-muted-foreground font-medium">Start</span>
            </div>
            <div className="flex items-center">
              <div className="h-0.5 w-8 bg-gradient-to-r from-success to-secondary rounded-full" />
              <Navigation className="h-4 w-4 text-muted-foreground mx-1" />
              <div className="h-0.5 w-8 bg-gradient-to-r from-secondary to-secondary rounded-full" />
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="h-6 w-6 rounded-full bg-secondary/80 flex items-center justify-center shadow-lg">
                <MapPin className="h-3 w-3 text-secondary-foreground" />
              </div>
              <span className="text-[10px] text-muted-foreground font-medium">End</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Glass overlay at bottom */}
      <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-card/60 to-transparent" />
    </div>
  );
}
