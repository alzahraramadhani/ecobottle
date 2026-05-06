import CapacityRing from './CapacityRing';
import type { Location } from '../../types';
import type { CapacityStatus } from '../../types';

interface LocationStatusCardProps {
  location: Location;
}

const fillColors: Record<CapacityStatus, string> = {
  low: 'bg-green-500',
  mid: 'bg-amber-400',
  high: 'bg-red-500',
  full: 'bg-slate-500',
};

export default function LocationStatusCard({ location }: LocationStatusCardProps) {
  return (
    <div className="bg-white rounded-app p-4 shadow-app flex items-center gap-3.5 border border-gray-100">
      <CapacityRing capacity={location.capacity} status={location.status} />
      <div className="flex-1">
        <div className="text-sm font-bold text-gray-800">{location.name}</div>
        <div className="text-xs text-gray-500 mt-0.5">
          {location.bottles} / {location.maxBottles} botol
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-600 ${fillColors[location.status]}`}
            style={{ width: `${location.capacity}%` }}
          />
        </div>
      </div>
    </div>
  );
}
