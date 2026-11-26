import type { CapacityStatus } from '../types';

/**
 * Determine capacity status consistently across frontend and backend:
 * - >= 100%: full
 * - >= 75%: high
 * - >= 35%: mid
 * - < 35%: low
 */
export function calculateCapacityStatus(capacity: number): CapacityStatus {
  if (capacity >= 100) return 'full';
  if (capacity >= 75) return 'high';
  if (capacity >= 35) return 'mid';
  return 'low';
}

/**
 * Compute capped bottle count, rounded percentage, and status from raw bottle counts.
 */
export function calculateLocationMetrics(
  bottles: number,
  maxBottles: number
): { bottles: number; capacity: number; status: CapacityStatus } {
  const safeMax = Math.max(1, maxBottles);
  const safeBottles = Math.min(Math.max(0, bottles), safeMax);
  const capacity = Math.round((safeBottles / safeMax) * 100);
  return {
    bottles: safeBottles,
    capacity,
    status: calculateCapacityStatus(capacity),
  };
}
