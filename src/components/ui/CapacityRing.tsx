import type { CapacityStatus } from '../../types';

interface CapacityRingProps {
  capacity: number;
  status: CapacityStatus;
}

const statusColors: Record<CapacityStatus, string> = {
  low: 'bg-green-100 text-green-700',
  mid: 'bg-amber-100 text-amber-700',
  high: 'bg-red-100 text-red-600',
};

export default function CapacityRing({ capacity, status }: CapacityRingProps) {
  return (
    <div
      className={`w-12 h-12 rounded-full flex items-center justify-center text-[13px] font-extrabold flex-shrink-0 ${statusColors[status]}`}
    >
      {capacity}%
    </div>
  );
}
