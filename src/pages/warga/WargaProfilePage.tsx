import { useNavigate } from 'react-router-dom';
import { LogOut, Settings, Award, Shield, History, MapPin, User, Droplet, Star, Flame, TreePine } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function WargaProfilePage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-full pb-6 bg-slate-50">
      <div className="bg-white px-5 pt-8 pb-6 border-b border-slate-100/50 shadow-sm shadow-slate-200/50">
        <div className="flex justify-end mb-2">
          <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 border-none cursor-pointer active:scale-95 transition-transform hover:bg-slate-100">
            <Settings size={20} />
          </button>
        </div>
        
        <div className="text-center mb-6">
          <div className="w-[88px] h-[88px] bg-gradient-to-br from-emerald-300 to-teal-400 rounded-full flex items-center justify-center text-white mx-auto mb-3 border-4 border-white shadow-[0_4px_20px_rgba(16,185,129,0.2)]">
            <User size={40} />
          </div>
          <h2 className="text-[22px] font-extrabold text-slate-900 tracking-tight">Budi Santoso</h2>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full text-xs font-bold text-white mt-2 shadow-sm">
            <Award size={14} /> Level 42 - Pahlawan Bumi
          </div>
        </div>

        <div className="px-6 mb-2">
          <div className="flex justify-between text-[11px] text-slate-500 font-bold mb-1.5">
            <span>XP Menuju Level 43</span>
            <span className="text-emerald-600">650 / 1000 XP</span>
          </div>
          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full w-[65%]" />
          </div>
        </div>
      </div>

      <div className="p-5 max-w-3xl mx-auto w-full">
        <h3 className="text-[15px] font-bold text-slate-800 mb-3 ml-1">Statistik Peran Serta</h3>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
          <div className="bg-white rounded-[16px] p-4 border border-slate-100/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
            <div className="text-emerald-500 mb-2"><Droplet size={26} /></div>
            <div className="text-[22px] font-extrabold text-slate-900 leading-none mb-1 tracking-tight">410</div>
            <div className="text-[11px] font-semibold text-slate-500">Botol Terkumpul</div>
          </div>
          <div className="bg-white rounded-[16px] p-4 border border-slate-100/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
            <div className="text-amber-400 mb-2"><Star size={26} /></div>
            <div className="text-[22px] font-extrabold text-slate-900 leading-none mb-1 tracking-tight">15.4K</div>
            <div className="text-[11px] font-semibold text-slate-500">Total Eco Poin</div>
          </div>
          <div className="bg-white rounded-[16px] p-4 border border-slate-100/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
            <div className="text-orange-500 mb-2"><Flame size={26} /></div>
            <div className="text-[22px] font-extrabold text-slate-900 leading-none mb-1 tracking-tight">14</div>
            <div className="text-[11px] font-semibold text-slate-500">Hari Beruntun (Streak)</div>
          </div>
          <div className="bg-white rounded-[16px] p-4 border border-slate-100/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
            <div className="text-green-600 mb-2"><TreePine size={26} /></div>
            <div className="text-[22px] font-extrabold text-slate-900 leading-none mb-1 tracking-tight">5.8</div>
            <div className="text-[11px] font-semibold text-slate-500">Kg Emisi Dicegah</div>
          </div>
        </div>

        <h3 className="text-[15px] font-bold text-slate-800 mb-3 ml-1">Menu Lainnya</h3>
        <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden mb-6">
          <button className="w-full flex items-center gap-3.5 p-4 bg-transparent border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors text-left">
            <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
              <History size={18} />
            </div>
            <div className="flex-1">
              <div className="text-[14px] font-bold text-slate-800">Riwayat Penukaran</div>
              <div className="text-[11px] text-slate-500 font-semibold mt-0.5">Lihat history botol yang disetor</div>
            </div>
          </button>
          <button className="w-full flex items-center gap-3.5 p-4 bg-transparent border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors text-left">
            <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
              <MapPin size={18} />
            </div>
            <div className="flex-1">
              <div className="text-[14px] font-bold text-slate-800">Lokasi Favorit</div>
              <div className="text-[11px] text-slate-500 font-semibold mt-0.5">Daftar bank sampah tersimpan</div>
            </div>
          </button>
          <button className="w-full flex items-center gap-3.5 p-4 bg-transparent border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors text-left">
            <div className="w-9 h-9 rounded-full bg-violet-50 flex items-center justify-center text-violet-600 shrink-0">
              <Shield size={18} />
            </div>
            <div className="flex-1">
              <div className="text-[14px] font-bold text-slate-800">Kebijakan Privasi</div>
              <div className="text-[11px] text-slate-500 font-semibold mt-0.5">Aturan perlindungan data</div>
            </div>
          </button>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full flex justify-center items-center gap-2 bg-red-50 text-red-600 border-2 border-red-100 rounded-xl py-3.5 font-bold text-[14px] cursor-pointer hover:bg-red-100 active:scale-[0.98] transition-all"
        >
          <LogOut size={18} /> Keluar Akun
        </button>
      </div>
    </div>
  );
}
