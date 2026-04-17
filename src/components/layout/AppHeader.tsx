import { Recycle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ROLE_LABELS: Record<string, string> = {
  admin: 'Admin',
  petugas: 'Petugas',
  warga: 'Warga',
};

export default function AppHeader() {
  const { user } = useAuth();

  return (
    <header className="bg-white px-5 py-4 flex items-center justify-between border-b border-gray-100 sticky top-0 z-[100]">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 bg-gradient-to-br from-green-600 to-green-400 rounded-[10px] flex items-center justify-center">
          <Recycle size={18} className="text-white" />
        </div>
        <span className="text-lg font-extrabold text-green-800 tracking-tight">
          EcoBottle
        </span>
      </div>
      {user && (
        <div className="px-3 py-1.5 bg-green-50 rounded-full text-xs font-semibold text-green-700">
          {ROLE_LABELS[user.role]}
        </div>
      )}
    </header>
  );
}
