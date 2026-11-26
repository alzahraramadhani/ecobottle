import { describe, it, expect } from 'vitest';
import {
  calculateCapacityStatus,
  calculateLocationMetrics,
} from '../utils/capacity';

describe('capacity utils', () => {
  it('maps percentage thresholds consistently', () => {
    expect(calculateCapacityStatus(0)).toBe('low');
    expect(calculateCapacityStatus(34)).toBe('low');
    expect(calculateCapacityStatus(35)).toBe('mid');
    expect(calculateCapacityStatus(74)).toBe('mid');
    expect(calculateCapacityStatus(75)).toBe('high');
    expect(calculateCapacityStatus(99)).toBe('high');
    expect(calculateCapacityStatus(100)).toBe('full');
  });

  it('computes capped location metrics accurately', () => {
    expect(calculateLocationMetrics(100, 400)).toEqual({
      bottles: 100,
      capacity: 25,
      status: 'low',
    });

    expect(calculateLocationMetrics(312, 400)).toEqual({
      bottles: 312,
      capacity: 78,
      status: 'high',
    });

    expect(calculateLocationMetrics(500, 400)).toEqual({
      bottles: 400,
      capacity: 100,
      status: 'full',
    });

    expect(calculateLocationMetrics(-10, 400)).toEqual({
      bottles: 0,
      capacity: 0,
      status: 'low',
    });
  });
});
