import { Recycle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import type { Role } from '../../types';

const ROLE_LABELS: Record<Role, string> = {
  petugas: 'Petugas',
  warga: 'Warga',
};

export default function AppHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="bg-white px-5 py-4 flex items-center justify-between border-b border-gray-100 sticky top-0 z-[100] print:hidden">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 bg-gradient-to-br from-green-600 to-green-400 rounded-[10px] flex items-center justify-center">
          <Recycle size={18} className="text-white" />
        </div>
        <span className="text-lg font-extrabold text-green-800 tracking-tight">
          EcoBottle
        </span>
      </div>
      {user && (
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 bg-green-50 rounded-full text-xs font-semibold text-green-700">
            {ROLE_LABELS[user.role]}
          </div>
          <button
            type="button"
            onClick={handleLogout}
            title="Keluar Akun"
            aria-label="Keluar Akun"
            className="w-9 h-9 rounded-full bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-600 flex items-center justify-center border-none cursor-pointer transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>
      )}
    </header>
  );
}
