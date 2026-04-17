import { useState, useRef, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Search, Navigation, MapPin } from 'lucide-react';
import { locations } from '../../data/locations';
import type { Location, CapacityStatus } from '../../types';
import { getDistance } from '../../utils/distance';
import { useGeolocation } from '../../hooks/useGeolocation';
import 'leaflet/dist/leaflet.css';

const CENTER: [number, number] = [-7.9553, 112.6145];

const COLORS: Record<CapacityStatus, string> = {
  low: '#10b981', // emerald-500
  mid: '#f59e0b', // amber-500
  high: '#ef4444', // red-500
};

const BG_COLORS: Record<CapacityStatus, string> = {
  low: '#d1fae5', // emerald-100
  mid: '#fef3c7', // amber-100
  high: '#fee2e2', // red-100
};

const LABELS: Record<CapacityStatus, string> = {
  low: 'Tersedia',
  mid: 'Sebagian Penuh',
  high: 'Hampir Penuh',
};

function createWargaIcon(status: CapacityStatus) {
  const color = COLORS[status];
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width:36px; height:36px;
      background: ${color};
      border-radius: 50%;
      display:flex; align-items:center; justify-content:center;
      color: white; font-size:14px; font-weight:bold;
      box-shadow: 0 2px 12px ${color}88;
      border: 3px solid white;
    "><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
}

function MapController({ flyTo }: { flyTo: { lat: number; lng: number; zoom: number } | null }) {
  const map = useMap();
  useEffect(() => {
    if (flyTo) {
      map.flyTo([flyTo.lat, flyTo.lng], flyTo.zoom, { duration: 1.2 });
    }
  }, [flyTo, map]);
  return null;
}

export default function WargaMapPage() {
  const [selectedLoc, setSelectedLoc] = useState<Location | null>(null);
  const [flyTo, setFlyTo] = useState<{ lat: number; lng: number; zoom: number } | null>(null);
  const { getPosition } = useGeolocation();

  const handleLocate = async () => {
    const pos = await getPosition();
    setFlyTo({ lat: pos.lat, lng: pos.lng, zoom: 17 });
  };

  const handleInputBotol = () => {
    alert("Fitur input botol dijalankan (dummy). Scanner akan terbuka.");
  };

  return (
    <div className="h-full relative overflow-hidden flex flex-col" style={{ minHeight: 'calc(100vh - 85px)' }}>
      {/* Search overlay */}
      <div className="absolute top-3 left-3 right-3 z-[450] bg-white rounded-full p-1 pl-4 flex items-center gap-2 shadow-[0_4px_24px_rgba(0,0,0,0.1)]">
        <input 
          type="text" 
          placeholder="Cari lokasi bank sampah..." 
          className="flex-1 bg-transparent border-none outline-none text-sm font-semibold text-slate-800 placeholder-slate-400"
        />
        <button className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-400 rounded-full border-none flex items-center justify-center text-white cursor-pointer active:scale-95 transition-transform">
          <Search size={18} />
        </button>
      </div>

      {/* FAB locate */}
      <button 
        onClick={handleLocate}
        className={`absolute right-4 z-[450] w-12 h-12 bg-white rounded-full flex items-center justify-center text-emerald-600 shadow-[0_4px_20px_rgba(0,0,0,0.12)] border-none cursor-pointer active:scale-95 transition-all ${selectedLoc ? 'bottom-[310px]' : 'bottom-6'}`}
      >
        <Navigation size={22} fill="currentColor" />
      </button>

      {/* Map layer */}
      <div className="flex-1 z-[1] w-full bg-slate-100">
        <MapContainer
          center={CENTER}
          zoom={15}
          zoomControl={false}
          className="w-full h-full"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapController flyTo={flyTo} />
          {locations.map((loc) => (
            <Marker
              key={loc.id}
              position={[loc.lat, loc.lng]}
              icon={createWargaIcon(loc.status)}
              eventHandlers={{
                click: () => {
                  setSelectedLoc(loc);
                  setFlyTo({ lat: loc.lat, lng: loc.lng, zoom: 17 });
                }
              }}
            />
          ))}
        </MapContainer>
      </div>

      {/* Bottom Sheet */}
      <div className={`absolute bottom-0 left-0 right-0 z-[500] bg-white rounded-t-3xl p-3 px-5 pb-7 transition-transform duration-300 shadow-[0_-8px_40px_rgba(0,0,0,0.12)] border-t border-slate-100 ${selectedLoc ? 'translate-y-0' : 'translate-y-[110%]'}`}>
        <div className="w-10 h-1.5 bg-slate-200 rounded-full mx-auto mb-4" />
        
        {selectedLoc && (
          <>
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-[18px] font-extrabold text-slate-900">{selectedLoc.name}</h3>
              <div 
                className="px-3 py-1 rounded-full text-[11px] font-bold shrink-0"
                style={{ background: BG_COLORS[selectedLoc.status], color: COLORS[selectedLoc.status] }}
              >
                {LABELS[selectedLoc.status]}
              </div>
            </div>

            <p className="text-[13px] text-slate-500 leading-relaxed mb-4">
              Jarak: ~1.2 km dari lokasimu
            </p>

            <div className="mb-4">
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden mb-1.5">
                <div 
                  className="h-full rounded-full transition-all duration-500" 
                  style={{ 
                    width: `${selectedLoc.capacity}%`,
                    background: COLORS[selectedLoc.status]
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-500 font-semibold">
                <span>{selectedLoc.bottles} terisi</span>
                <span>Max {selectedLoc.maxBottles}</span>
              </div>
            </div>

            <div className="flex gap-2.5 mt-2">
              <a 
                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedLoc.lat},${selectedLoc.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3.5 rounded-xl border-none font-bold text-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform bg-slate-100 text-slate-700 hover:bg-slate-200 no-underline"
              >
                📍 Arahkan
              </a>
              <button 
                onClick={handleInputBotol}
                className="flex-1 py-3.5 rounded-xl border-none font-bold text-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform bg-gradient-to-br from-emerald-600 to-emerald-500 text-white shadow-[0_4px_16px_rgba(16,185,129,0.3)]"
              >
                📸 Tukar Botol
              </button>
            </div>
            
            <button 
              onClick={() => setSelectedLoc(null)}
              className="mt-3 w-full py-2 text-xs font-bold text-slate-400 bg-transparent border-none cursor-pointer"
            >
              Tutup
            </button>
          </>
        )}
      </div>
    </div>
  );
}
