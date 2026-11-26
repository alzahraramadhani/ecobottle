import { useEffect, useRef } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Navigation, Scan, PowerOff, CheckCircle } from 'lucide-react';
import type { Location, CapacityStatus } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { useLocations } from '../../hooks/useLocations';
import { useToast } from '../../hooks/useToast';

interface LocationMarkerProps {
  location: Location;
  onMarkerReady: (id: number, marker: L.Marker) => void;
  onDepositClick: (location: Location) => void;
}

const COLORS: Record<CapacityStatus, string> = {
  low: '#22c55e',
  mid: '#f59e0b',
  high: '#ef4444',
  full: '#475569',
};

const LABELS: Record<CapacityStatus, string> = {
  low: 'Tersedia',
  mid: 'Sebagian Penuh',
  high: 'Hampir Penuh',
  full: 'Penuh (Tutup)',
};

const BG_COLORS: Record<CapacityStatus, string> = {
  low: '#dcfce7',
  mid: '#fef3c7',
  high: '#fee2e2',
  full: '#f1f5f9',
};

function createIcon(status: CapacityStatus) {
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
    "><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/></svg></div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20],
  });
}

export default function LocationMarker({
  location,
  onMarkerReady,
  onDepositClick,
}: LocationMarkerProps) {
  const markerRef = useRef<L.Marker>(null);
  const { user } = useAuth();
  const { updateLocationStatus } = useLocations();
  const { showToast } = useToast();

  useEffect(() => {
    if (markerRef.current) {
      onMarkerReady(location.id, markerRef.current);
    }
  }, [location.id, onMarkerReady]);

  const color = COLORS[location.status];
  const bgColor = BG_COLORS[location.status];
  const label = LABELS[location.status];

  const handleStatusChange = async (newStatus: CapacityStatus) => {
    const res = await updateLocationStatus(location.id, newStatus);
    if (!res.ok) {
      showToast(`❌ ${res.error || 'Gagal memperbarui status'}`);
      return;
    }
    if (newStatus === 'low') {
      showToast(`✅ ${location.name} dikosongkan & dibuka kembali`);
    } else {
      showToast(`🚨 ${location.name} ditutup manual`);
    }
  };

  return (
    <Marker
      ref={markerRef}
      position={[location.lat, location.lng]}
      icon={createIcon(location.status)}
    >
      <Popup className="custom-popup">
        <div className="p-3.5 px-4 font-sans flex flex-col items-center text-center">
          <div className="text-sm font-bold text-gray-900 mb-1.5">
            {location.name}
          </div>
          <div className="text-xs text-gray-500 leading-relaxed">
            Kapasitas: {location.bottles}/{location.maxBottles} botol
            <br />
            Terisi: {location.capacity}%
          </div>
          <div
            className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold mt-2 mb-3"
            style={{ background: bgColor, color }}
          >
            {label}
          </div>

          <div className="w-full flex flex-col gap-2">
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 bg-slate-800 text-white flex gap-1.5 items-center justify-center text-[11px] font-bold rounded cursor-pointer hover:bg-slate-900 transition-colors no-underline"
            >
              <Navigation size={14} /> Arahkan
            </a>
            {user?.role === 'warga' && location.status !== 'full' && (
              <button
                type="button"
                onClick={() => onDepositClick(location)}
                className="w-full py-2 bg-emerald-600 text-white border-none flex gap-1.5 items-center justify-center text-[11px] font-bold rounded cursor-pointer shadow-sm hover:bg-emerald-700 transition-colors"
              >
                <Scan size={14} /> Tukar Botol
              </button>
            )}

            {user?.role === 'petugas' &&
              (location.status === 'full' ? (
                <button
                  type="button"
                  onClick={() => void handleStatusChange('low')}
                  className="w-full py-2 bg-emerald-50 text-emerald-700 border border-emerald-100 flex gap-1.5 items-center justify-center text-[11px] font-bold rounded cursor-pointer hover:bg-emerald-100 transition-colors"
                >
                  <CheckCircle size={14} /> Kosongkan &amp; Buka
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => void handleStatusChange('full')}
                  className="w-full py-2 bg-red-50 text-red-600 border border-red-100 flex gap-1.5 items-center justify-center text-[11px] font-bold rounded cursor-pointer hover:bg-red-100 transition-colors"
                >
                  <PowerOff size={14} /> Tutup Tempat Sampah
                </button>
              ))}
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
