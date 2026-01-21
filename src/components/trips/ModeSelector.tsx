import { TripMode, tripModeLabels } from '@/types/trip';
import { 
  Car, Bus, Train, Bike, PersonStanding, 
  Plane, Navigation 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const modeIcons: Record<TripMode, React.ElementType> = {
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

const modeColors: Record<TripMode, string> = {
  car: 'hover:bg-primary/10 hover:text-primary data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground',
  bus: 'hover:bg-success/10 hover:text-success data-[selected=true]:bg-success data-[selected=true]:text-success-foreground',
  train: 'hover:bg-secondary/10 hover:text-secondary data-[selected=true]:bg-secondary data-[selected=true]:text-secondary-foreground',
  metro: 'hover:bg-chart-5/10 hover:text-chart-5 data-[selected=true]:bg-chart-5 data-[selected=true]:text-chart-5',
  bike: 'hover:bg-accent hover:text-accent-foreground data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground',
  walk: 'hover:bg-success/10 hover:text-success data-[selected=true]:bg-success data-[selected=true]:text-success-foreground',
  auto: 'hover:bg-accent hover:text-accent-foreground data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground',
  taxi: 'hover:bg-secondary/10 hover:text-secondary data-[selected=true]:bg-secondary data-[selected=true]:text-secondary-foreground',
  flight: 'hover:bg-primary/10 hover:text-primary data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground',
  other: 'hover:bg-muted hover:text-muted-foreground data-[selected=true]:bg-muted data-[selected=true]:text-foreground'
};

interface ModeSelectorProps {
  selected: TripMode;
  onSelect: (mode: TripMode) => void;
}

export function ModeSelector({ selected, onSelect }: ModeSelectorProps) {
  const modes: TripMode[] = ['car', 'bus', 'train', 'bike', 'walk', 'auto', 'taxi', 'flight'];
  
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">Mode of Transport</label>
      <div className="grid grid-cols-4 gap-2">
        {modes.map((mode) => {
          const Icon = modeIcons[mode];
          return (
            <button
              key={mode}
              type="button"
              data-selected={selected === mode}
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl border border-border p-3",
                "transition-all duration-200",
                modeColors[mode]
              )}
              onClick={() => onSelect(mode)}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{tripModeLabels[mode].split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
