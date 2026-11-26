import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Map, ClipboardEdit, FileText, LogOut, Recycle, Trophy, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import type { Feature, Role } from '../../types';

interface NavItem {
  path: string;
  label: string;
  icon: typeof Home;
  feature: Feature;
}

const NAV_ITEMS: NavItem[] = [
  { path: '/home', label: 'Beranda', icon: Home, feature: 'dashboard' },
  { path: '/map', label: 'Peta', icon: Map, feature: 'map' },
  { path: '/input', label: 'Input', icon: ClipboardEdit, feature: 'input' },
  { path: '/report', label: 'Laporan', icon: FileText, feature: 'report' },
  { path: '/rangking', label: 'Rangking', icon: Trophy, feature: 'rangking' },
  { path: '/profile', label: 'Profile', icon: User, feature: 'profile' },
];

const ROLE_LABELS: Record<Role, string> = {
  petugas: 'Petugas',
  warga: 'Warga',
};

export default function SidebarNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, canAccess, logout } = useAuth();

  const visibleItems = NAV_ITEMS.filter((item) => canAccess(item.feature));

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <aside className="hidden md:flex flex-col w-[240px] bg-white border-r border-gray-100 h-screen sticky top-0 print:hidden">
      {/* Brand */}
      <div className="p-5 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-400 rounded-xl flex items-center justify-center">
            <Recycle size={20} className="text-white" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-green-800 tracking-tight">
              EcoBottle
            </div>
            <div className="text-[11px] text-gray-400 font-medium">
              Monitoring System
            </div>
          </div>
        </div>
      </div>

      {/* User info */}
      {user && (
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="text-sm font-bold text-gray-800">{user.name}</div>
          <div className="text-xs text-gray-500 mt-0.5">
            {ROLE_LABELS[user.role]}
          </div>
        </div>
      )}

      {/* Nav items */}
      <nav className="flex-1 p-3 space-y-1">
        {visibleItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-app-sm text-sm font-semibold transition-all cursor-pointer border-none ${
                isActive
                  ? 'bg-green-50 text-green-700'
                  : 'bg-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-app-sm text-sm font-semibold text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer border-none bg-transparent"
        >
          <LogOut size={20} />
          Keluar
        </button>
      </div>
    </aside>
  );
}
