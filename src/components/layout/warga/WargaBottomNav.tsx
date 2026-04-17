import { Link, useLocation } from 'react-router-dom';
import { Home, Map, Trophy, User } from 'lucide-react';

export default function WargaBottomNav() {
  const location = useLocation();

  const navItems = [
    { path: '/warga/home', icon: Home, label: 'Beranda' },
    { path: '/warga/map', icon: Map, label: 'Peta' },
    { path: '/warga/rangking', icon: Trophy, label: 'Rangking' },
    { path: '/warga/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white flex justify-between px-2 py-1.5 pb-3.5 z-50 border-t border-slate-100 shadow-[0_-4px_24px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => {
        const isActive = location.pathname.startsWith(item.path);
        const Icon = item.icon;

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex-1 flex flex-col items-center gap-[3px] py-2 px-1 relative transition-colors rounded-xl font-semibold text-[10px] ${
              isActive ? 'text-emerald-600' : 'text-slate-400'
            }`}
          >
            {isActive && (
              <div className="absolute top-0 w-5 h-[3px] bg-emerald-500 rounded-b-sm" />
            )}
            <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
