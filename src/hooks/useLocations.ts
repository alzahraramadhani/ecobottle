import { useContext } from 'react';
import {
  LocationContext,
  type LocationContextType,
} from '../context/locationContextDef';

export function useLocations(): LocationContextType {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocations must be used within a LocationProvider');
  }
  return context;
}
