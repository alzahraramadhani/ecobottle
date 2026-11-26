export type Role = 'petugas' | 'warga';

export type Feature = 'dashboard' | 'map' | 'input' | 'report' | 'rangking' | 'profile';

export type CapacityStatus = 'low' | 'mid' | 'high' | 'full';

export type PlasticType = 'PET' | 'HDPE' | 'PP' | 'Campuran';

export type BottleCondition = 'Baik' | 'Rusak' | 'Kotor';

export interface Location {
  id: number;
  name: string;
  lat: number;
  lng: number;
  capacity: number;
  bottles: number;
  maxBottles: number;
  status: CapacityStatus;
}

export interface WeeklyDataPoint {
  day: string;
  value: number;
}

export interface InputEntry {
  id: number;
  locationId: number;
  location: string;
  qty: number;
  weight: number;
  type: PlasticType;
  condition: BottleCondition;
  note: string;
  time: string;
  createdAt: string;
  pointsAwarded?: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  points: number;
  xp: number;
  level: number;
  bottlesSaved: number;
  emissionKg: number;
  streakDays: number;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  points: number;
  bottles: number;
  level: number;
}
