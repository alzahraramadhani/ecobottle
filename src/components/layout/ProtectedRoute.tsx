import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../../hooks/useAuth';
import type { Feature } from '../../types';

interface ProtectedRouteProps {
  feature: Feature;
  children: ReactNode;
}

export default function ProtectedRoute({ feature, children }: ProtectedRouteProps) {
  const { isAuthenticated, loading, canAccess } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!canAccess(feature)) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}
