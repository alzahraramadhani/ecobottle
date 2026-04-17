import { describe, it, expect } from 'vitest';
import { getDistance } from '../utils/distance';

describe('getDistance (Haversine formula)', () => {
  it('should return 0 for identical coordinates', () => {
    const d = getDistance(-7.9553, 112.6149, -7.9553, 112.6149);
    expect(d).toBeCloseTo(0, 0);
  });

  it('should calculate distance between two campus locations', () => {
    // Depan Kantin FT → Gedung Rektorat
    const d = getDistance(-7.9553, 112.6149, -7.9547, 112.6135);
    // Should be roughly 150-160 meters
    expect(d).toBeGreaterThan(100);
    expect(d).toBeLessThan(250);
  });

  it('should calculate distance between two campus locations (reverse)', () => {
    const d1 = getDistance(-7.9553, 112.6149, -7.9547, 112.6135);
    const d2 = getDistance(-7.9547, 112.6135, -7.9553, 112.6149);
    expect(d1).toBeCloseTo(d2, 2);
  });

  it('should return a positive number', () => {
    const d = getDistance(-7.9553, 112.6149, -7.9561, 112.6128);
    expect(d).toBeGreaterThan(0);
  });
});
