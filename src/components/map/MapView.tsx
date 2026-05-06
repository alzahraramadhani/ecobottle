import { useEffect, useRef, useState, useCallback } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, RefreshCw } from 'lucide-react';
import LocationMarker from './LocationMarker';
import NearestBanner from './NearestBanner';
import { useAuth } from '../../context/AuthContext';
import { useLocations } from '../../context/LocationContext';
import { useGeolocation } from '../../hooks/useGeolocation';
import { useToast } from '../../context/ToastContext';
import { getDistance } from '../../utils/distance';
import type { Location } from '../../types';
import 'leaflet/dist/leaflet.css';

const CENTER: [number, number] = [-7.9610, 112.6175];
const DEFAULT_ZOOM = 17;

function MapController({ flyTo }: { flyTo: { lat: number; lng: number; zoom: number } | null }) {
  const map = useMap();

  useEffect(() => {
    if (flyTo) {
      map.flyTo([flyTo.lat, flyTo.lng], flyTo.zoom, { duration: 1.2 });
    }
  }, [flyTo, map]);

  return null;
}

export default function MapView() {
  const { user } = useAuth();
  const { getPosition } = useGeolocation();
  const { showToast } = useToast();
  const { locations } = useLocations();
  const [nearest, setNearest] = useState<Location | null>(null);
  const [nearestDist, setNearestDist] = useState(0);
  const [showBanner, setShowBanner] = useState(false);
  const [flyTo, setFlyTo] = useState<{ lat: number; lng: number; zoom: number } | null>(null);
  const markersRef = useRef<Record<number, L.Marker>>({});

  const registerMarker = useCallback((id: number, marker: L.Marker) => {
    markersRef.current[id] = marker;
  }, []);

  const handleFindNearest = async () => {
    showToast('📍 Mencari lokasi kamu...');
    const pos = await getPosition();

    if (pos.isDemo) {
      showToast('📍 Menggunakan lokasi demo kampus');
    }

    let nearestLoc: Location | null = null;
    let minDist = Infinity;

    locations.forEach((loc) => {
      // If user is Warga, skip full/closed bins
      if (user?.role === 'warga' && loc.status === 'full') return;

      const d = getDistance(pos.lat, pos.lng, loc.lat, loc.lng);
      if (d < minDist) {
        minDist = d;
        nearestLoc = loc;
      }
    });

    if (nearestLoc) {
      setNearest(nearestLoc);
      setNearestDist(Math.round(minDist));
      setShowBanner(true);
      setFlyTo({ lat: nearestLoc.lat, lng: nearestLoc.lng, zoom: 18 });

      // Open popup
      const marker = markersRef.current[nearestLoc.id];
      if (marker) {
        setTimeout(() => marker.openPopup(), 500);
      }
    }
  };

  const handleRefresh = () => {
    setFlyTo({ lat: CENTER[0], lng: CENTER[1], zoom: DEFAULT_ZOOM });
    setShowBanner(false);
    showToast('🔄 Peta diperbarui');
  };

  return (
    <div className="h-[calc(100vh-140px)] md:h-[calc(100vh-0px)] relative">
      <MapContainer
        center={CENTER}
        zoom={DEFAULT_ZOOM}
        zoomControl={false}
        className="w-full h-full z-[1]"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController flyTo={flyTo} />
        {locations.map((loc) => (
          <LocationMarker
            key={loc.id}
            location={loc}
            onMarkerReady={registerMarker}
          />
        ))}
      </MapContainer>

      {/* Nearest Banner */}
      <NearestBanner
        show={showBanner}
        nearest={nearest}
        distance={nearestDist}
        onClose={() => setShowBanner(false)}
      />

      {/* FAB buttons */}
      <button
        onClick={handleFindNearest}
        title="Cari Terdekat"
        className="absolute bottom-[88px] right-4 z-[450] bg-white border-none w-[52px] h-[52px] rounded-full shadow-app-lg cursor-pointer flex items-center justify-center transition-transform active:scale-[0.93] hover:bg-gray-50"
      >
        <MapPin size={22} className="text-green-600" />
      </button>
      <button
        onClick={handleRefresh}
        title="Refresh"
        className="absolute bottom-6 right-4 z-[450] bg-white border-none w-[52px] h-[52px] rounded-full shadow-app-lg cursor-pointer flex items-center justify-center transition-transform active:scale-[0.93] hover:bg-gray-50"
      >
        <RefreshCw size={22} className="text-gray-600" />
      </button>
    </div>
  );
}
