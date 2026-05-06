import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { locations as initialLocations } from '../data/locations';
import type { Location, CapacityStatus } from '../types';

interface LocationContextType {
  locations: Location[];
  updateLocationStatus: (id: number, status: CapacityStatus) => void;
  addBottles: (id: number, qty: number) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

const STORAGE_KEY = 'ecobottle_locations_v3';

export function LocationProvider({ children }: { children: ReactNode }) {
  const [locations, setLocations] = useState<Location[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialLocations;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(locations));
  }, [locations]);

  const updateLocationStatus = (id: number, status: CapacityStatus) => {
    setLocations((prev) =>
      prev.map((loc) => {
        if (loc.id === id) {
          const isFull = status === 'full';
          const isLow = status === 'low';
          
          return {
            ...loc,
            status,
            capacity: isFull ? 100 : (isLow ? 5 : loc.capacity),
            bottles: isFull ? loc.maxBottles : (isLow ? Math.floor(loc.maxBottles * 0.05) : loc.bottles),
          };
        }
        return loc;
      })
    );
  };

  const addBottles = (id: number, qty: number) => {
    setLocations((prev) =>
      prev.map((loc) => {
        if (loc.id === id) {
          const newBottles = Math.min(loc.bottles + qty, loc.maxBottles);
          const newCapacity = Math.round((newBottles / loc.maxBottles) * 100);
          
          let newStatus: CapacityStatus = 'low';
          if (newCapacity >= 100) newStatus = 'full';
          else if (newCapacity > 80) newStatus = 'high';
          else if (newCapacity > 30) newStatus = 'mid';

          return {
            ...loc,
            bottles: newBottles,
            capacity: newCapacity,
            status: newStatus,
          };
        }
        return loc;
      })
    );
  };

  return (
    <LocationContext.Provider value={{ locations, updateLocationStatus, addBottles }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocations() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocations must be used within a LocationProvider');
  }
  return context;
}
