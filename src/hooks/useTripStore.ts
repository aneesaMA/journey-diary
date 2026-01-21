import { useState, useCallback } from 'react';
import { Trip, Checkpoint, TripMode, TripPurpose } from '@/types/trip';

// Demo trips data
const demoTrips: Trip[] = [
  {
    id: '1',
    origin: 'Home - Trivandrum',
    destination: 'Technopark Office',
    startTime: new Date('2026-01-20T08:30:00'),
    endTime: new Date('2026-01-20T09:15:00'),
    duration: 45,
    distance: 12.5,
    mode: 'car',
    purpose: 'work',
    checkpoints: [
      {
        id: 'cp1',
        name: 'Coffee Stop',
        latitude: 8.5241,
        longitude: 76.9366,
        timestamp: new Date('2026-01-20T08:45:00'),
        note: 'Quick coffee break'
      }
    ],
    notes: 'Light traffic today, smooth commute',
    photos: [],
    isActive: false
  },
  {
    id: '2',
    origin: 'Technopark Office',
    destination: 'Kovalam Beach',
    startTime: new Date('2026-01-19T17:00:00'),
    endTime: new Date('2026-01-19T17:45:00'),
    duration: 45,
    distance: 18,
    mode: 'car',
    purpose: 'leisure',
    checkpoints: [],
    notes: 'Evening beach visit with colleagues',
    photos: [],
    isActive: false
  },
  {
    id: '3',
    origin: 'Home',
    destination: 'Lulu Mall',
    startTime: new Date('2026-01-18T11:00:00'),
    endTime: new Date('2026-01-18T11:30:00'),
    duration: 30,
    distance: 8,
    mode: 'auto',
    purpose: 'shopping',
    checkpoints: [],
    notes: 'Weekly grocery shopping',
    photos: [],
    isActive: false
  }
];

export function useTripStore() {
  const [trips, setTrips] = useState<Trip[]>(demoTrips);
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);

  const startTrip = useCallback((origin: string) => {
    const newTrip: Trip = {
      id: Date.now().toString(),
      origin,
      destination: '',
      startTime: new Date(),
      mode: 'car',
      purpose: 'other',
      checkpoints: [],
      notes: '',
      photos: [],
      isActive: true
    };
    setActiveTrip(newTrip);
    return newTrip;
  }, []);

  const endTrip = useCallback((tripData: Partial<Trip>) => {
    if (!activeTrip) return null;
    
    const completedTrip: Trip = {
      ...activeTrip,
      ...tripData,
      endTime: new Date(),
      duration: Math.round((new Date().getTime() - activeTrip.startTime.getTime()) / 60000),
      isActive: false
    };
    
    setTrips(prev => [completedTrip, ...prev]);
    setActiveTrip(null);
    return completedTrip;
  }, [activeTrip]);

  const addCheckpoint = useCallback((checkpoint: Omit<Checkpoint, 'id'>) => {
    if (!activeTrip) return;
    
    const newCheckpoint: Checkpoint = {
      ...checkpoint,
      id: Date.now().toString()
    };
    
    setActiveTrip(prev => prev ? {
      ...prev,
      checkpoints: [...prev.checkpoints, newCheckpoint]
    } : null);
  }, [activeTrip]);

  const updateTrip = useCallback((tripId: string, updates: Partial<Trip>) => {
    setTrips(prev => prev.map(trip => 
      trip.id === tripId ? { ...trip, ...updates } : trip
    ));
  }, []);

  const deleteTrip = useCallback((tripId: string) => {
    setTrips(prev => prev.filter(trip => trip.id !== tripId));
  }, []);

  const getTripById = useCallback((tripId: string) => {
    return trips.find(trip => trip.id === tripId);
  }, [trips]);

  const getTripStats = useCallback(() => {
    const totalTrips = trips.length;
    const totalDistance = trips.reduce((acc, trip) => acc + (trip.distance || 0), 0);
    const totalDuration = trips.reduce((acc, trip) => acc + (trip.duration || 0), 0);
    
    const modeBreakdown = trips.reduce((acc, trip) => {
      acc[trip.mode] = (acc[trip.mode] || 0) + 1;
      return acc;
    }, {} as Record<TripMode, number>);

    return {
      totalTrips,
      totalDistance,
      totalDuration,
      modeBreakdown
    };
  }, [trips]);

  return {
    trips,
    activeTrip,
    startTrip,
    endTrip,
    addCheckpoint,
    updateTrip,
    deleteTrip,
    getTripById,
    getTripStats
  };
}
