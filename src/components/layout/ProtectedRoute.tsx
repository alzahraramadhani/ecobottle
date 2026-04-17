import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  feature: 'dashboard' | 'map' | 'input' | 'report';
  children: ReactNode;
}

export default function ProtectedRoute({ feature, children }: ProtectedRouteProps) {
  const { canAccess } = useAuth();

  if (!canAccess(feature)) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}
