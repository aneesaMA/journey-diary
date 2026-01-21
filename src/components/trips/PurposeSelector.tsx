import { TripPurpose, tripPurposeLabels } from '@/types/trip';
import { 
  Briefcase, GraduationCap, ShoppingBag, Gamepad2, 
  Heart, Users, ClipboardList, HelpCircle 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const purposeIcons: Record<TripPurpose, React.ElementType> = {
  work: Briefcase,
  education: GraduationCap,
  shopping: ShoppingBag,
  leisure: Gamepad2,
  healthcare: Heart,
  social: Users,
  errands: ClipboardList,
  other: HelpCircle
};

interface PurposeSelectorProps {
  selected: TripPurpose;
  onSelect: (purpose: TripPurpose) => void;
}

export function PurposeSelector({ selected, onSelect }: PurposeSelectorProps) {
  const purposes: TripPurpose[] = ['work', 'education', 'shopping', 'leisure', 'healthcare', 'social', 'errands', 'other'];
  
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">Trip Purpose</label>
      <div className="grid grid-cols-4 gap-2">
        {purposes.map((purpose) => {
          const Icon = purposeIcons[purpose];
          const isSelected = selected === purpose;
          return (
            <button
              key={purpose}
              type="button"
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl border border-border p-3",
                "transition-all duration-200",
                isSelected 
                  ? "bg-primary text-primary-foreground border-primary" 
                  : "hover:bg-primary/10 hover:text-primary"
              )}
              onClick={() => onSelect(purpose)}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs truncate w-full text-center">
                {tripPurposeLabels[purpose].split('/')[0]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
