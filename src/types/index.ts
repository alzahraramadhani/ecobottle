export type Role = 'petugas' | 'warga';

export type CapacityStatus = 'low' | 'mid' | 'high';

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
  location: string;
  qty: number;
  weight: number;
  type: string;
  condition: string;
  note: string;
  time: string;
}

export interface User {
  name: string;
  role: Role;
}
