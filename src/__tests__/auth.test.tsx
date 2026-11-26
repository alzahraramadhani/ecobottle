import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { canRoleAccess } from '../context/authContextDef';

const mockSignInWithPassword = vi.fn();
const mockSignUp = vi.fn();
const mockSignOut = vi.fn();
const mockGetSession = vi.fn();
const mockOnAuthStateChange = vi.fn();
const mockMaybeSingle = vi.fn();

vi.mock('../lib/supabase', () => ({
  isSupabaseConfigured: true,
  supabase: {
    auth: {
      signInWithPassword: (...args: unknown[]) => mockSignInWithPassword(...args),
      signUp: (...args: unknown[]) => mockSignUp(...args),
      signOut: (...args: unknown[]) => mockSignOut(...args),
      getSession: (...args: unknown[]) => mockGetSession(...args),
      onAuthStateChange: (...args: unknown[]) => mockOnAuthStateChange(...args),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: () => mockMaybeSingle(),
        }),
      }),
    }),
  },
}));

import { AuthProvider } from '../context/AuthContext';
import { useAuth } from '../hooks/useAuth';

function wrapper({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

describe('Auth & RBAC', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetSession.mockResolvedValue({ data: { session: null } });
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });
    mockSignOut.mockResolvedValue({ error: null });
  });

  it('enforces role-based feature access matrix', () => {
    expect(canRoleAccess('petugas', 'dashboard')).toBe(true);
    expect(canRoleAccess('petugas', 'map')).toBe(true);
    expect(canRoleAccess('petugas', 'input')).toBe(true);
    expect(canRoleAccess('petugas', 'report')).toBe(true);
    expect(canRoleAccess('petugas', 'rangking')).toBe(false);
    expect(canRoleAccess('petugas', 'profile')).toBe(false);

    expect(canRoleAccess('warga', 'dashboard')).toBe(true);
    expect(canRoleAccess('warga', 'map')).toBe(true);
    expect(canRoleAccess('warga', 'rangking')).toBe(true);
    expect(canRoleAccess('warga', 'profile')).toBe(true);
    expect(canRoleAccess('warga', 'input')).toBe(false);
    expect(canRoleAccess('warga', 'report')).toBe(false);
  });

  it('starts unauthenticated when no Supabase session exists', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('logs in as petugas and grants petugas features', async () => {
    mockSignInWithPassword.mockResolvedValue({
      data: {
        session: {
          user: { id: 'u-petugas', email: 'petugas@um.ac.id', user_metadata: {} },
        },
      },
      error: null,
    });
    mockMaybeSingle.mockResolvedValue({
      data: {
        id: 'u-petugas',
        full_name: 'Petugas UM',
        role: 'petugas',
        points: 0,
        xp: 0,
        level: 1,
        bottles_saved: 0,
        emission_kg: 0,
        streak_days: 0,
      },
      error: null,
    });

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));

    let loginRes: { ok: boolean; error?: string };
    await act(async () => {
      loginRes = await result.current.login('petugas@um.ac.id', 'secret123');
    });

    expect(loginRes!.ok).toBe(true);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.role).toBe('petugas');
    expect(result.current.canAccess('input')).toBe(true);
    expect(result.current.canAccess('report')).toBe(true);
    expect(result.current.canAccess('profile')).toBe(false);
  });

  it('returns error when login fails', async () => {
    mockSignInWithPassword.mockResolvedValue({
      data: { session: null },
      error: { message: 'Invalid login credentials' },
    });

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));

    let loginRes: { ok: boolean; error?: string };
    await act(async () => {
      loginRes = await result.current.login('warga@um.ac.id', 'wrongpass');
    });

    expect(loginRes!.ok).toBe(false);
    expect(loginRes!.error).toBe('Invalid login credentials');
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('logs out cleanly', async () => {
    mockSignInWithPassword.mockResolvedValue({
      data: {
        session: {
          user: { id: 'u-warga', email: 'warga@um.ac.id', user_metadata: {} },
        },
      },
      error: null,
    });
    mockMaybeSingle.mockResolvedValue({
      data: {
        id: 'u-warga',
        full_name: 'Budi',
        role: 'warga',
        points: 100,
        xp: 150,
        level: 1,
        bottles_saved: 10,
        emission_kg: 0.15,
        streak_days: 1,
      },
      error: null,
    });

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.login('warga@um.ac.id', 'secret123');
    });
    expect(result.current.isAuthenticated).toBe(true);

    await act(async () => {
      await result.current.logout();
    });
    expect(mockSignOut).toHaveBeenCalledTimes(1);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });
});
