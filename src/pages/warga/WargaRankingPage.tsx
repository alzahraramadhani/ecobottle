import { Trophy, Medal, Award } from 'lucide-react';

const DUMMY_RANKINGS = [
  { id: 1, name: 'Budi Santoso', points: 15420, bottles: 410, level: 42 },
  { id: 2, name: 'Siti Aminah', points: 14200, bottles: 382, level: 38 },
  { id: 3, name: 'Joko Widodo', points: 13500, bottles: 350, level: 35 },
  { id: 4, name: 'Agus Setiawan', points: 12100, bottles: 301, level: 31 },
  { id: 5, name: 'Sri Wahyuni', points: 11850, bottles: 295, level: 30 },
  { id: 6, name: 'Wahyu Hidayat', points: 10400, bottles: 260, level: 27 },
  { id: 7, name: 'Dwi Ningsih', points: 9800, bottles: 245, level: 25 },
  { id: 8, name: 'Arif Rahman', points: 8900, bottles: 220, level: 23 },
  { id: 9, name: 'Nur Hidayah', points: 8100, bottles: 201, level: 21 },
  { id: 10, name: 'Eko Prasetyo', points: 7500, bottles: 180, level: 19 },
];

export default function WargaRankingPage() {
  return (
    <div className="flex flex-col min-h-full pb-6 bg-slate-50">
      <header className="bg-gradient-to-b from-emerald-600 to-emerald-500 pt-7 pb-16 px-5 relative overflow-hidden rounded-b-[40px]">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1)_0%,transparent_60%)]" />
        <h1 className="text-white text-2xl font-extrabold text-center relative z-10 drop-shadow-sm flex items-center justify-center gap-2">
          <Trophy size={26} className="text-amber-300" />
          Papan Peringkat
        </h1>
        <p className="text-emerald-50 text-center text-[13px] mt-1.5 relative z-10 font-medium">
          Daftar warga paling aktif menyelamatkan bumi 🌍
        </p>
      </header>

      <div className="px-4 -mt-10 relative z-20 flex-1 max-w-2xl mx-auto w-full">
        <div className="bg-white rounded-3xl p-2 shadow-xl shadow-emerald-900/5 mb-6 border border-emerald-50">
          {DUMMY_RANKINGS.map((user, index) => {
            const isTop3 = index < 3;
            let RankIcon = null;
            let rankColor = '';

            if (index === 0) {
              RankIcon = Trophy;
              rankColor = 'text-amber-500 bg-amber-50 border-amber-200';
            } else if (index === 1) {
              RankIcon = Medal;
              rankColor = 'text-slate-400 bg-slate-50 border-slate-200';
            } else if (index === 2) {
              RankIcon = Award;
              rankColor = 'text-amber-700 bg-orange-50 border-orange-200';
            } else {
              rankColor = 'text-slate-500 bg-slate-50 border-transparent';
            }

            return (
              <div 
                key={user.id} 
                className={`flex items-center gap-3.5 p-3.5 mb-1.5 rounded-2xl transition-all ${
                  index === 0 ? 'bg-gradient-to-r from-amber-50/50 to-white' : 'hover:bg-slate-50'
                }`}
              >
                <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center border font-bold text-lg ${rankColor}`}>
                  {isTop3 && RankIcon ? <RankIcon size={20} /> : index + 1}
                </div>
                
                <div className="flex-1">
                  <div className="font-bold text-slate-800 text-[15px] flex items-center gap-2">
                    {user.name}
                    {index === 0 && <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">#1</span>}
                  </div>
                  <div className="text-[11px] text-slate-500 font-semibold mt-0.5">
                    Lvl {user.level} • {user.bottles} botol diselamatkan
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-extrabold text-emerald-600 text-[15px]">
                    {user.points.toLocaleString('id-ID')}
                  </div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Poin
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
