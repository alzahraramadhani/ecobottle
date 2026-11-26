import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Navigation2,
  Droplet,
  Star,
  TreePine,
  MapPin,
  ArrowRight,
  Lightbulb,
  Droplets,
  Minimize2,
  Scissors,
  Globe,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useLocations } from '../../hooks/useLocations';

export default function WargaHomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { locations } = useLocations();

  const highlightedDropbox = useMemo(() => {
    const available = locations.filter((l) => l.status !== 'full');
    if (available.length === 0) return locations[0] ?? null;
    return [...available].sort((a, b) => b.capacity - a.capacity)[0];
  }, [locations]);

  const remainingBottles = highlightedDropbox
    ? Math.max(0, highlightedDropbox.maxBottles - highlightedDropbox.bottles)
    : 0;

  return (
    <div className="flex flex-col min-h-full pb-6">
      <div className="p-5">
        {/* Hero Card */}
        <div className="bg-gradient-to-br from-emerald-700 via-emerald-500 to-teal-400 rounded-2xl p-6 mb-6 relative overflow-hidden text-white shadow-lg">
          <div className="absolute -right-6 -top-6 opacity-10 pointer-events-none select-none">
            <Globe strokeWidth={1} className="w-[180px] h-[180px] text-emerald-100" />
          </div>
          <div className="text-[11px] font-semibold tracking-widest uppercase text-emerald-200 mb-2">
            Halo, {user?.name || 'Warga'}!
          </div>
          <h2 className="text-[28px] font-extrabold leading-tight mb-1.5 z-10 relative text-shadow-sm">
            Waktunya
            <br />
            Kumpul Botol.
          </h2>
          <p className="text-[13px] text-white/80 mb-4 bg-transparent max-w-[85%] leading-relaxed">
            Tukarkan botol plastikmu menjadi poin dan reward menarik!
          </p>
          <button
            type="button"
            onClick={() => navigate('/map')}
            className="inline-flex items-center gap-2 px-5 py-3 bg-white text-emerald-700 border-none rounded-full font-bold text-sm shadow-md transition-transform active:scale-95 z-10 relative cursor-pointer"
          >
            <Navigation2 size={18} />
            Cari Lokasi Terdekat
          </button>
        </div>

        {/* Impact Strip */}
        <div className="grid grid-cols-3 gap-2.5 md:gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] text-center flex flex-col items-center">
            <div className="mb-2 text-slate-800 bg-slate-50 p-2 rounded-full">
              <Droplet size={28} />
            </div>
            <div className="text-[20px] md:text-2xl font-extrabold text-slate-900 tracking-tight">
              {(user?.bottlesSaved ?? 0).toLocaleString('id-ID')}
            </div>
            <div className="text-[10px] md:text-xs font-semibold text-slate-500 mt-0.5">
              Botol Diselamatkan
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] text-center flex flex-col items-center">
            <div className="mb-2 text-amber-500 bg-amber-50 p-2 rounded-full">
              <Star size={28} />
            </div>
            <div className="text-[20px] md:text-2xl font-extrabold text-slate-900 tracking-tight">
              {(user?.points ?? 0).toLocaleString('id-ID')}
            </div>
            <div className="text-[10px] md:text-xs font-semibold text-slate-500 mt-0.5">
              Eco Poin
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] text-center flex flex-col items-center">
            <div className="mb-2 text-emerald-600 bg-emerald-50 p-2 rounded-full">
              <TreePine size={28} />
            </div>
            <div className="text-[20px] md:text-2xl font-extrabold text-slate-900 tracking-tight">
              {(user?.emissionKg ?? 0).toFixed(1)}
            </div>
            <div className="text-[10px] md:text-xs font-semibold text-slate-500 mt-0.5">
              Kg Emisi Dicegah
            </div>
          </div>
        </div>

        {/* Highlighted Dropbox */}
        <div className="flex justify-between items-center mb-3.5">
          <h3 className="text-[17px] font-bold text-slate-900 flex items-center gap-2">
            <MapPin size={20} className="text-emerald-500" /> Status Dropbox Teratas
          </h3>
          <button
            type="button"
            onClick={() => navigate('/map')}
            className="text-xs font-semibold text-emerald-600 cursor-pointer hover:underline bg-transparent border-none"
          >
            Lihat Peta
          </button>
        </div>
        <div className="mb-6">
          {highlightedDropbox ? (
            <div
              onClick={() => navigate('/map')}
              className="bg-white rounded-2xl p-4 flex items-center gap-3.5 border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] cursor-pointer active:shadow-[0_2px_16px_rgba(16,185,129,0.15)] transition-shadow"
            >
              <div
                className={`w-[50px] h-[50px] rounded-[14px] flex items-center justify-center text-sm font-extrabold shrink-0 ${
                  highlightedDropbox.status === 'high' || highlightedDropbox.status === 'full'
                    ? 'bg-red-100 text-red-700'
                    : highlightedDropbox.status === 'mid'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                {highlightedDropbox.capacity}%
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-slate-800">
                  {highlightedDropbox.name}
                </div>
                <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                  Sisa ruang {remainingBottles} botol ·{' '}
                  {highlightedDropbox.status === 'full' ? 'Penuh' : 'Siap menerima setor'}
                </div>
              </div>
              <div className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center text-sm text-slate-400 shrink-0">
                <ArrowRight size={16} className="text-slate-500" />
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-4 border border-slate-100 text-xs text-slate-400 text-center">
              Memuat data lokasi dropbox...
            </div>
          )}
        </div>

        {/* Eco Tips */}
        <div className="flex justify-between items-center mb-3.5">
          <h3 className="text-[17px] font-bold text-slate-900 flex items-center gap-2">
            <Lightbulb size={20} className="text-amber-500" /> Eco Tips
          </h3>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl p-5 text-white bg-gradient-to-br from-emerald-600 to-emerald-400 shadow-md">
            <div className="mb-3 opacity-100">
              <Droplets size={32} />
            </div>
            <div className="text-sm font-bold mb-1">Bilas Botol Dulu</div>
            <div className="text-xs text-white/85 leading-relaxed">
              Pastikan botol bersih dari sisa cairan sebelum dimasukkan agar tak mengundang semut.
            </div>
          </div>
          <div className="rounded-2xl p-5 text-white bg-gradient-to-br from-teal-700 to-teal-400 shadow-md">
            <div className="mb-3 opacity-100">
              <Minimize2 size={32} />
            </div>
            <div className="text-sm font-bold mb-1">Remas Botol</div>
            <div className="text-xs text-white/85 leading-relaxed">
              Remas botol plastikmu untuk menghemat ruang penyimpanan di dropbox.
            </div>
          </div>
          <div className="rounded-2xl p-5 text-white bg-gradient-to-br from-amber-600 to-amber-400 shadow-md">
            <div className="mb-3 opacity-100">
              <Scissors size={32} />
            </div>
            <div className="text-sm font-bold mb-1">Pisahkan Tutup</div>
            <div className="text-xs text-white/85 leading-relaxed">
              Tutup botol dan labelnya terbuat dari plastik berbeda, pisahkan untuk daur ulang maksimal.
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .text-shadow-sm {
          text-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
}
