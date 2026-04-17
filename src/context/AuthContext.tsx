import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { User, Role } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (name: string, password: string, role: Role) => boolean;
  logout: () => void;
  canAccess: (feature: 'dashboard' | 'map' | 'input' | 'report' | 'rangking' | 'profile') => boolean;
}

const PASSWORDS: Record<Role, string> = {
  petugas: 'petugas123',
  warga: 'warga123',
};

const ROLE_ACCESS: Record<Role, string[]> = {
  petugas: ['dashboard', 'map', 'input', 'report'],
  warga: ['dashboard', 'map', 'rangking', 'profile'],
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback((name: string, password: string, role: Role): boolean => {
    if (PASSWORDS[role] !== password) {
      return false;
    }
    setUser({ name, role });
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const canAccess = useCallback(
    (feature: 'dashboard' | 'map' | 'input' | 'report' | 'rangking' | 'profile'): boolean => {
      if (!user) return false;
      return ROLE_ACCESS[user.role].includes(feature);
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        canAccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
