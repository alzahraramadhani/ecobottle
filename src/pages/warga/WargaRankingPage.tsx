import { useEffect, useState } from 'react';
import { Trophy, Medal, Award } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import type { LeaderboardEntry } from '../../types';

interface LeaderboardRow {
  id: string;
  full_name: string;
  points: number;
  bottles_saved: number;
  level: number;
}

export default function WargaRankingPage() {
  const { user: currentUser } = useAuth();
  const [rankings, setRankings] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let active = true;

    async function loadLeaderboard() {
      if (!supabase) {
        if (active) setLoading(false);
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, points, bottles_saved, level')
        .eq('role', 'warga')
        .order('points', { ascending: false })
        .order('bottles_saved', { ascending: false })
        .limit(20);

      if (!active) return;

      if (!error && data) {
        setRankings(
          (data as LeaderboardRow[]).map((row) => ({
            id: row.id,
            name: row.full_name,
            points: row.points,
            bottles: row.bottles_saved,
            level: row.level,
          }))
        );
      }
      setLoading(false);
    }

    void loadLeaderboard();

    return () => {
      active = false;
    };
  }, []);

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
          {loading ? (
            <div className="p-8 text-center text-sm text-slate-400">
              Memuat papan peringkat...
            </div>
          ) : rankings.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-400">
              Belum ada data peringkat warga.
            </div>
          ) : (
            rankings.map((entry, index) => {
              const isTop3 = index < 3;
              const isCurrentUser = currentUser?.id === entry.id;
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
                  key={entry.id}
                  className={`flex items-center gap-3.5 p-3.5 mb-1.5 rounded-2xl transition-all ${
                    isCurrentUser
                      ? 'bg-emerald-50/80 ring-1 ring-emerald-200'
                      : index === 0
                        ? 'bg-gradient-to-r from-amber-50/50 to-white'
                        : 'hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center border font-bold text-lg ${rankColor}`}
                  >
                    {isTop3 && RankIcon ? <RankIcon size={20} /> : index + 1}
                  </div>

                  <div className="flex-1">
                    <div className="font-bold text-slate-800 text-[15px] flex items-center gap-2 flex-wrap">
                      {entry.name}
                      {index === 0 && (
                        <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                          #1
                        </span>
                      )}
                      {isCurrentUser && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                          Kamu
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 font-semibold mt-0.5">
                      Lvl {entry.level} • {entry.bottles.toLocaleString('id-ID')} botol diselamatkan
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-extrabold text-emerald-600 text-[15px]">
                      {entry.points.toLocaleString('id-ID')}
                    </div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Poin
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
