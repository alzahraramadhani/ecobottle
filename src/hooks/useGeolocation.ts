import { useState, useCallback } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  loading: boolean;
  error: string | null;
}

// Fallback: campus center (UM)
const DEMO_LAT = -7.9555;
const DEMO_LNG = 112.6145;

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    loading: false,
    error: null,
  });

  const getPosition = useCallback((): Promise<{ lat: number; lng: number; isDemo: boolean }> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setState((prev) => ({ ...prev, error: 'Geolocation tidak tersedia' }));
        resolve({ lat: DEMO_LAT, lng: DEMO_LNG, isDemo: true });
        return;
      }

      setState((prev) => ({ ...prev, loading: true, error: null }));

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setState({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            loading: false,
            error: null,
          });
          resolve({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            isDemo: false,
          });
        },
        () => {
          setState({
            latitude: DEMO_LAT,
            longitude: DEMO_LNG,
            loading: false,
            error: 'Menggunakan lokasi demo kampus',
          });
          resolve({ lat: DEMO_LAT, lng: DEMO_LNG, isDemo: true });
        }
      );
    });
  }, []);

  return { ...state, getPosition };
}
