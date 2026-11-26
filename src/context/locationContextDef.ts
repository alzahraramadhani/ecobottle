import { createContext } from 'react';
import type {
  BottleCondition,
  CapacityStatus,
  InputEntry,
  Location,
  PlasticType,
} from '../types';

export interface DepositParams {
  locationId: number;
  qty: number;
  type: PlasticType;
  weight?: number;
  condition?: BottleCondition;
  note?: string;
}

export interface DepositResult {
  ok: boolean;
  error?: string;
  pointsAwarded?: number;
}

export interface StatusUpdateResult {
  ok: boolean;
  error?: string;
}

export interface LocationContextType {
  locations: Location[];
  transactions: InputEntry[];
  loading: boolean;
  depositBottles: (params: DepositParams) => Promise<DepositResult>;
  updateLocationStatus: (id: number, status: CapacityStatus) => Promise<StatusUpdateResult>;
  refreshData: () => Promise<void>;
}

export const LocationContext = createContext<LocationContextType | undefined>(undefined);
