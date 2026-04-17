import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Map, ClipboardEdit, FileText, Trophy, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavItem {
  path: string;
  label: string;
  icon: typeof Home;
  feature: 'dashboard' | 'map' | 'input' | 'report' | 'rangking' | 'profile';
}

const NAV_ITEMS: NavItem[] = [
  { path: '/home', label: 'Beranda', icon: Home, feature: 'dashboard' },
  { path: '/map', label: 'Peta', icon: Map, feature: 'map' },
  { path: '/input', label: 'Input', icon: ClipboardEdit, feature: 'input' },
  { path: '/report', label: 'Laporan', icon: FileText, feature: 'report' },
  { path: '/rangking', label: 'Rangking', icon: Trophy, feature: 'rangking' },
  { path: '/profile', label: 'Profile', icon: User, feature: 'profile' },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { canAccess } = useAuth();

  const visibleItems = NAV_ITEMS.filter((item) => canAccess(item.feature));

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-mobile bg-white border-t border-gray-100 flex px-3 py-2 pb-3 z-[200] shadow-[0_-4px_20px_rgba(0,0,0,0.06)] md:hidden">
      {visibleItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex-1 flex flex-col items-center gap-1 py-1.5 border-none bg-transparent cursor-pointer font-sans text-[11px] font-semibold transition-colors rounded-app-sm ${
              isActive ? 'text-green-600' : 'text-gray-400'
            }`}
          >
            <item.icon size={22} />
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}
