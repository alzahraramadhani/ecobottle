import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import type { ReactNode } from 'react';

function wrapper({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

describe('AuthContext', () => {
  it('should start as unauthenticated', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('should login successfully with correct admin password', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    let success: boolean;
    act(() => {
      success = result.current.login('Admin UM', 'admin123', 'admin');
    });

    expect(success!).toBe(true);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.name).toBe('Admin UM');
    expect(result.current.user?.role).toBe('admin');
  });

  it('should fail login with wrong password', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    let success: boolean;
    act(() => {
      success = result.current.login('Admin', 'wrongpassword', 'admin');
    });

    expect(success!).toBe(false);
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should login as petugas with correct password', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    let success: boolean;
    act(() => {
      success = result.current.login('Petugas 1', 'petugas123', 'petugas');
    });

    expect(success!).toBe(true);
    expect(result.current.user?.role).toBe('petugas');
  });

  it('should login as warga with correct password', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    let success: boolean;
    act(() => {
      success = result.current.login('Warga 1', 'warga123', 'warga');
    });

    expect(success!).toBe(true);
    expect(result.current.user?.role).toBe('warga');
  });

  it('admin should access all features', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.login('Admin', 'admin123', 'admin');
    });

    expect(result.current.canAccess('dashboard')).toBe(true);
    expect(result.current.canAccess('map')).toBe(true);
    expect(result.current.canAccess('input')).toBe(true);
    expect(result.current.canAccess('report')).toBe(true);
  });

  it('petugas should not access reports', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.login('Petugas', 'petugas123', 'petugas');
    });

    expect(result.current.canAccess('dashboard')).toBe(true);
    expect(result.current.canAccess('map')).toBe(true);
    expect(result.current.canAccess('input')).toBe(true);
    expect(result.current.canAccess('report')).toBe(false);
  });

  it('warga should only access dashboard and map', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.login('Warga', 'warga123', 'warga');
    });

    expect(result.current.canAccess('dashboard')).toBe(true);
    expect(result.current.canAccess('map')).toBe(true);
    expect(result.current.canAccess('input')).toBe(false);
    expect(result.current.canAccess('report')).toBe(false);
  });

  it('should logout correctly', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.login('Admin', 'admin123', 'admin');
    });
    expect(result.current.isAuthenticated).toBe(true);

    act(() => {
      result.current.logout();
    });
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });
});
