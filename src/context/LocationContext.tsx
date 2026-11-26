import { useState, useEffect, useCallback, type ReactNode } from 'react';
import type {
  BottleCondition,
  CapacityStatus,
  InputEntry,
  Location,
  PlasticType,
} from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import {
  LocationContext,
  type DepositParams,
  type DepositResult,
  type StatusUpdateResult,
} from './locationContextDef';

interface LocationRow {
  id: number;
  name: string;
  lat: number;
  lng: number;
  capacity: number;
  bottles: number;
  max_bottles: number;
  status: CapacityStatus;
}

interface TransactionRow {
  id: number;
  location_id: number;
  qty: number;
  weight_kg: number | string;
  plastic_type: PlasticType;
  condition: BottleCondition;
  note: string | null;
  points_awarded: number;
  created_at: string;
  locations: { name: string } | { name: string }[] | null;
}

interface DepositRpcResponse {
  points_awarded?: number;
}

export function LocationProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [locations, setLocations] = useState<Location[]>([]);
  const [transactions, setTransactions] = useState<InputEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const refreshData = useCallback(async () => {
    if (!supabase || !isAuthenticated) {
      setLocations([]);
      setTransactions([]);
      return;
    }

    setLoading(true);
    try {
      const [locRes, txRes] = await Promise.all([
        supabase
          .from('locations')
          .select('id, name, lat, lng, capacity, bottles, max_bottles, status')
          .order('id', { ascending: true }),
        supabase
          .from('bottle_transactions')
          .select(
            'id, location_id, qty, weight_kg, plastic_type, condition, note, points_awarded, created_at, locations(name)'
          )
          .order('created_at', { ascending: false })
          .limit(200),
      ]);

      if (!locRes.error && locRes.data) {
        const mappedLocations: Location[] = (locRes.data as LocationRow[]).map((row) => ({
          id: row.id,
          name: row.name,
          lat: row.lat,
          lng: row.lng,
          capacity: row.capacity,
          bottles: row.bottles,
          maxBottles: row.max_bottles,
          status: row.status,
        }));
        setLocations(mappedLocations);
      }

      if (!txRes.error && txRes.data) {
        const mappedTx: InputEntry[] = (txRes.data as TransactionRow[]).map((row) => {
          const locName = Array.isArray(row.locations)
            ? row.locations[0]?.name
            : row.locations?.name;
          return {
            id: row.id,
            locationId: row.location_id,
            location: locName ?? `Lokasi #${row.location_id}`,
            qty: row.qty,
            weight: Number(row.weight_kg) || 0,
            type: row.plastic_type,
            condition: row.condition,
            note: row.note ?? '',
            time: new Date(row.created_at).toLocaleString('id-ID'),
            createdAt: row.created_at,
            pointsAwarded: row.points_awarded,
          };
        });
        setTransactions(mappedTx);
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    void refreshData();
  }, [refreshData]);

  const depositBottles = useCallback(
    async ({
      locationId,
      qty,
      type,
      weight,
      condition = 'Baik',
      note = '',
    }: DepositParams): Promise<DepositResult> => {
      if (!supabase) {
        return { ok: false, error: 'Konfigurasi Supabase belum diatur.' };
      }

      const { data, error } = await supabase.rpc('deposit_bottles', {
        p_location_id: locationId,
        p_qty: qty,
        p_plastic_type: type,
        p_weight_kg: weight ?? null,
        p_condition: condition,
        p_note: note || null,
      });

      if (error) {
        return { ok: false, error: error.message };
      }

      await refreshData();
      const result = data as DepositRpcResponse | null;
      return {
        ok: true,
        pointsAwarded: result?.points_awarded ?? 0,
      };
    },
    [refreshData]
  );

  const updateLocationStatus = useCallback(
    async (id: number, status: CapacityStatus): Promise<StatusUpdateResult> => {
      if (!supabase) {
        return { ok: false, error: 'Konfigurasi Supabase belum diatur.' };
      }

      const { error } = await supabase.rpc('update_location_status', {
        p_location_id: id,
        p_status: status,
      });

      if (error) {
        return { ok: false, error: error.message };
      }

      await refreshData();
      return { ok: true };
    },
    [refreshData]
  );

  return (
    <LocationContext.Provider
      value={{
        locations,
        transactions,
        loading,
        depositBottles,
        updateLocationStatus,
        refreshData,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}
