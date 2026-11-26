import { useState, useCallback, useEffect, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import type { Feature, Role, User } from '../types';
import { supabase } from '../lib/supabase';
import { AuthContext, canRoleAccess, type AuthResult } from './authContextDef';

interface ProfileRow {
  id: string;
  full_name: string;
  role: Role;
  points: number;
  xp: number;
  level: number;
  bottles_saved: number;
  emission_kg: number | string;
  streak_days: number;
}

async function fetchUserProfile(session: Session): Promise<User | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, role, points, xp, level, bottles_saved, emission_kg, streak_days')
    .eq('id', session.user.id)
    .maybeSingle<ProfileRow>();

  if (error) {
    console.error('Failed to fetch profile:', error.message);
    return null;
  }

  if (!data) {
    return {
      id: session.user.id,
      email: session.user.email ?? '',
      name:
        (session.user.user_metadata?.full_name as string | undefined) ||
        session.user.email?.split('@')[0] ||
        'Pengguna',
      role: 'warga',
      points: 0,
      xp: 0,
      level: 1,
      bottlesSaved: 0,
      emissionKg: 0,
      streakDays: 0,
    };
  }

  return {
    id: data.id,
    email: session.user.email ?? '',
    name: data.full_name,
    role: data.role,
    points: data.points,
    xp: data.xp,
    level: data.level,
    bottlesSaved: data.bottles_saved,
    emissionKg: Number(data.emission_kg) || 0,
    streakDays: data.streak_days,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(Boolean(supabase));

  const syncSession = useCallback(async (session: Session | null) => {
    if (!session) {
      setUser(null);
      setLoading(false);
      return;
    }

    const profile = await fetchUserProfile(session);
    setUser(profile);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        void syncSession(data.session);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        void syncSession(session);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [syncSession]);

  const login = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      if (!supabase) {
        return { ok: false, error: 'Konfigurasi Supabase belum diatur.' };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        return { ok: false, error: error.message };
      }

      await syncSession(data.session);
      return { ok: true };
    },
    [syncSession]
  );

  const register = useCallback(
    async (name: string, email: string, password: string): Promise<AuthResult> => {
      if (!supabase) {
        return { ok: false, error: 'Konfigurasi Supabase belum diatur.' };
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: name.trim(),
          },
        },
      });

      if (error) {
        return { ok: false, error: error.message };
      }

      if (data.session) {
        await syncSession(data.session);
        return { ok: true };
      }

      return {
        ok: true,
        error: 'Pendaftaran berhasil. Silakan cek email untuk verifikasi sebelum masuk.',
      };
    },
    [syncSession]
  );

  const logout = useCallback(async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!supabase) return;
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      const profile = await fetchUserProfile(data.session);
      setUser(profile);
    }
  }, []);

  const canAccess = useCallback(
    (feature: Feature): boolean => {
      if (!user) return false;
      return canRoleAccess(user.role, feature);
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshProfile,
        canAccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
