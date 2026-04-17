import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import WargaBottomNav from './WargaBottomNav';

export default function WargaLayout() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || user?.role !== 'warga') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans max-w-[430px] mx-auto relative overflow-x-hidden shadow-2xl flex flex-col items-stretch">
      <main className="flex-1 pb-[85px] w-full">
        <Outlet />
      </main>
      <WargaBottomNav />
    </div>
  );
}
