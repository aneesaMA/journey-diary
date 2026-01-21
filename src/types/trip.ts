export interface Checkpoint {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  timestamp: Date;
  note?: string;
  photoUrl?: string;
}

export interface Trip {
  id: string;
  origin: string;
  destination: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // in minutes
  distance?: number; // in km
  mode: TripMode;
  purpose: TripPurpose;
  checkpoints: Checkpoint[];
  notes: string;
  photos: string[];
  isActive: boolean;
}

export type TripMode = 
  | 'car' 
  | 'bus' 
  | 'train' 
  | 'metro' 
  | 'bike' 
  | 'walk' 
  | 'auto' 
  | 'taxi' 
  | 'flight' 
  | 'other';

export type TripPurpose = 
  | 'work' 
  | 'education' 
  | 'shopping' 
  | 'leisure' 
  | 'healthcare' 
  | 'social' 
  | 'errands' 
  | 'other';

export const tripModeLabels: Record<TripMode, string> = {
  car: 'Car',
  bus: 'Bus',
  train: 'Train',
  metro: 'Metro',
  bike: 'Bicycle',
  walk: 'Walking',
  auto: 'Auto Rickshaw',
  taxi: 'Taxi/Cab',
  flight: 'Flight',
  other: 'Other'
};

export const tripPurposeLabels: Record<TripPurpose, string> = {
  work: 'Work/Office',
  education: 'Education',
  shopping: 'Shopping',
  leisure: 'Leisure/Recreation',
  healthcare: 'Healthcare',
  social: 'Social Visit',
  errands: 'Errands',
  other: 'Other'
};
