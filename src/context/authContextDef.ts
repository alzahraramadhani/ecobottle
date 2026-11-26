import { createContext } from 'react';
import type { Feature, Role, User } from '../types';

export const ROLE_ACCESS: Record<Role, Feature[]> = {
  petugas: ['dashboard', 'map', 'input', 'report'],
  warga: ['dashboard', 'map', 'rangking', 'profile'],
};

export function canRoleAccess(role: Role, feature: Feature): boolean {
  return ROLE_ACCESS[role].includes(feature);
}

export interface AuthResult {
  ok: boolean;
  error?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (name: string, email: string, password: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  canAccess: (feature: Feature) => boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);
