import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, RefreshCw, Search, X } from 'lucide-react';
import LocationMarker from './LocationMarker';
import NearestBanner from './NearestBanner';
import { useAuth } from '../../hooks/useAuth';
import { useLocations } from '../../hooks/useLocations';
import { useGeolocation } from '../../hooks/useGeolocation';
import { useToast } from '../../hooks/useToast';
import { getDistance } from '../../utils/distance';
import type { Location, PlasticType } from '../../types';
import 'leaflet/dist/leaflet.css';

const CENTER: [number, number] = [-7.961, 112.6175];
const DEFAULT_ZOOM = 17;

type StatusFilter = 'all' | 'available' | 'nearly_full';

function MapController({
  flyTo,
}: {
  flyTo: { lat: number; lng: number; zoom: number } | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (flyTo) {
      map.flyTo([flyTo.lat, flyTo.lng], flyTo.zoom, { duration: 1.2 });
    }
  }, [flyTo, map]);

  return null;
}

export default function MapView() {
  const { user, refreshProfile } = useAuth();
  const { getPosition } = useGeolocation();
  const { showToast } = useToast();
  const { locations, depositBottles, refreshData } = useLocations();

  const [nearest, setNearest] = useState<Location | null>(null);
  const [nearestDist, setNearestDist] = useState(0);
  const [showBanner, setShowBanner] = useState(false);
  const [flyTo, setFlyTo] = useState<{ lat: number; lng: number; zoom: number } | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const [depositLoc, setDepositLoc] = useState<Location | null>(null);
  const [depositQty, setDepositQty] = useState('5');
  const [depositType, setDepositType] = useState<PlasticType>('PET');
  const [depositing, setDepositing] = useState(false);

  const markersRef = useRef<Record<number, L.Marker>>({});

  const registerMarker = useCallback((id: number, marker: L.Marker) => {
    markersRef.current[id] = marker;
  }, []);

  const filteredLocations = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return locations.filter((loc) => {
      const matchesQuery = !query || loc.name.toLowerCase().includes(query);
      const matchesFilter =
        statusFilter === 'all' ||
        (statusFilter === 'available' && loc.status !== 'full') ||
        (statusFilter === 'nearly_full' &&
          (loc.status === 'high' || loc.status === 'full'));
      return matchesQuery && matchesFilter;
    });
  }, [locations, searchQuery, statusFilter]);

  const handleSelectSearchLocation = (loc: Location) => {
    setFlyTo({ lat: loc.lat, lng: loc.lng, zoom: 18 });
    setSearchQuery('');
    const marker = markersRef.current[loc.id];
    if (marker) {
      setTimeout(() => marker.openPopup(), 450);
    }
  };

  const handleFindNearest = async () => {
    showToast('📍 Mencari lokasi kamu...');
    const pos = await getPosition();

    if (pos.isDemo) {
      showToast('📍 Menggunakan lokasi demo kampus');
    }

    let nearestLoc: Location | null = null;
    let minDist = Infinity;

    for (const loc of filteredLocations) {
      if (user?.role === 'warga' && loc.status === 'full') continue;

      const d = getDistance(pos.lat, pos.lng, loc.lat, loc.lng);
      if (d < minDist) {
        minDist = d;
        nearestLoc = loc;
      }
    }

    if (nearestLoc) {
      setNearest(nearestLoc);
      setNearestDist(Math.round(minDist));
      setShowBanner(true);
      setFlyTo({ lat: nearestLoc.lat, lng: nearestLoc.lng, zoom: 18 });

      const marker = markersRef.current[nearestLoc.id];
      if (marker) {
        setTimeout(() => marker.openPopup(), 500);
      }
    } else {
      showToast('⚠️ Tidak ada dropbox yang sesuai filter');
    }
  };

  const handleRefresh = async () => {
    await refreshData();
    setFlyTo({ lat: CENTER[0], lng: CENTER[1], zoom: DEFAULT_ZOOM });
    setShowBanner(false);
    showToast('🔄 Peta diperbarui');
  };

  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositLoc) return;

    const qtyNum = parseInt(depositQty, 10);
    if (Number.isNaN(qtyNum) || qtyNum < 1 || qtyNum > 100) {
      showToast('⚠️ Jumlah botol harus antara 1 sampai 100');
      return;
    }

    setDepositing(true);
    try {
      const res = await depositBottles({
        locationId: depositLoc.id,
        qty: qtyNum,
        type: depositType,
      });

      if (!res.ok) {
        showToast(`❌ ${res.error || 'Gagal menyetor botol'}`);
        return;
      }

      await refreshProfile();
      showToast(
        `✅ Berhasil setor ${qtyNum} botol (+${res.pointsAwarded ?? qtyNum * 10} Eco Poin)!`
      );
      setDepositLoc(null);
      setDepositQty('5');
      setDepositType('PET');
    } finally {
      setDepositing(false);
    }
  };

  const estimatedPoints = Math.max(0, parseInt(depositQty || '0', 10) || 0) * 10;

  return (
    <div className="h-[calc(100vh-140px)] md:h-[calc(100vh-0px)] relative">
      {/* Search & Status Filter Overlay */}
      <div className="absolute top-3 left-3 right-3 z-[460] flex flex-col gap-2 max-w-md">
        <div className="bg-white rounded-2xl px-3.5 py-2 shadow-app-lg flex items-center gap-2 border border-gray-100">
          <Search size={17} className="text-gray-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari lokasi dropbox..."
            className="flex-1 bg-transparent border-none outline-none text-sm text-gray-800 placeholder-gray-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Hapus pencarian"
              className="text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer p-0.5"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="flex gap-1.5 flex-wrap">
          {(
            [
              { id: 'all', label: 'Semua' },
              { id: 'available', label: 'Tersedia' },
              { id: 'nearly_full', label: 'Hampir Penuh' },
            ] as const
          ).map((pill) => (
            <button
              key={pill.id}
              type="button"
              onClick={() => setStatusFilter(pill.id)}
              className={`px-3 py-1 rounded-full text-xs font-bold border shadow-sm cursor-pointer transition-colors ${
                statusFilter === pill.id
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {searchQuery.trim() && (
          <div className="bg-white rounded-2xl shadow-app-lg border border-gray-100 max-h-44 overflow-y-auto divide-y divide-gray-100">
            {filteredLocations.length === 0 ? (
              <div className="px-4 py-3 text-xs text-gray-400">
                Lokasi tidak ditemukan
              </div>
            ) : (
              filteredLocations.map((loc) => (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => handleSelectSearchLocation(loc)}
                  className="w-full px-4 py-2.5 text-left bg-transparent border-none hover:bg-green-50 cursor-pointer flex items-center justify-between text-xs"
                >
                  <span className="font-semibold text-gray-800">{loc.name}</span>
                  <span className="text-gray-500">{loc.capacity}%</span>
                </button>
              ))
            )}
          </div>
        )}
      </div>

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
        {filteredLocations.map((loc) => (
          <LocationMarker
            key={loc.id}
            location={loc}
            onMarkerReady={registerMarker}
            onDepositClick={(selected) => setDepositLoc(selected)}
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
        type="button"
        onClick={() => void handleFindNearest()}
        title="Cari Terdekat"
        className="absolute bottom-[88px] right-4 z-[450] bg-white border-none w-[52px] h-[52px] rounded-full shadow-app-lg cursor-pointer flex items-center justify-center transition-transform active:scale-[0.93] hover:bg-gray-50"
      >
        <MapPin size={22} className="text-green-600" />
      </button>
      <button
        type="button"
        onClick={() => void handleRefresh()}
        title="Refresh"
        className="absolute bottom-6 right-4 z-[450] bg-white border-none w-[52px] h-[52px] rounded-full shadow-app-lg cursor-pointer flex items-center justify-center transition-transform active:scale-[0.93] hover:bg-gray-50"
      >
        <RefreshCw size={22} className="text-gray-600" />
      </button>

      {/* Warga Deposit Modal */}
      {depositLoc && (
        <div className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-[2px] flex items-end md:items-center justify-center p-4">
          <form
            onSubmit={handleDepositSubmit}
            className="bg-white rounded-3xl w-full max-w-md p-6 shadow-app-lg"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-extrabold text-gray-900">
                  Tukar Botol Plastik
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Lokasi: <span className="font-semibold text-gray-700">{depositLoc.name}</span> ({depositLoc.capacity}% terisi)
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDepositLoc(null)}
                aria-label="Tutup modal"
                className="text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer p-1"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                Jumlah Botol (1 - 100)
              </label>
              <input
                type="number"
                min={1}
                max={100}
                value={depositQty}
                onChange={(e) => setDepositQty(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-app-sm text-[15px] text-gray-800 bg-gray-50 outline-none focus:border-green-500 focus:bg-white"
              />
            </div>

            <div className="mb-4">
              <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                Jenis Plastik
              </label>
              <select
                value={depositType}
                onChange={(e) => setDepositType(e.target.value as PlasticType)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-app-sm text-[15px] text-gray-800 bg-gray-50 outline-none focus:border-green-500 focus:bg-white"
              >
                <option value="PET">PET (Botol minum)</option>
                <option value="HDPE">HDPE (Botol susu/sabun)</option>
                <option value="PP">PP (Tutup botol)</option>
                <option value="Campuran">Campuran</option>
              </select>
            </div>

            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 mb-4 flex items-center justify-between text-xs">
              <span className="text-emerald-700 font-semibold">Estimasi Reward</span>
              <span className="text-emerald-800 font-extrabold">
                +{estimatedPoints.toLocaleString('id-ID')} Eco Poin
              </span>
            </div>

            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => setDepositLoc(null)}
                className="flex-1 py-3 rounded-app-sm bg-gray-100 text-gray-700 font-bold text-sm border-none cursor-pointer hover:bg-gray-200"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={depositing}
                className="flex-1 py-3 rounded-app-sm bg-gradient-to-br from-emerald-600 to-emerald-500 text-white font-bold text-sm border-none cursor-pointer shadow-md disabled:opacity-60"
              >
                {depositing ? 'Menyimpan...' : 'Setor Sekarang'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
