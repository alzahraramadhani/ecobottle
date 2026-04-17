import type { InputEntry } from '../../types';
import { MapPin } from 'lucide-react';

interface HistoryListProps {
  entries: InputEntry[];
}

export default function HistoryList({ entries }: HistoryListProps) {
  if (entries.length === 0) {
    return (
      <p className="text-center text-gray-400 py-3 text-sm">
        Belum ada data input
      </p>
    );
  }

  return (
    <div className="text-[13px] text-gray-600">
      {entries.slice(0, 5).map((entry, i) => (
        <div
          key={i}
          className="py-2.5 border-b border-gray-100 last:border-b-0"
        >
          <div className="font-bold text-gray-800 text-[13px] flex items-center gap-1">
            <MapPin size={12} className="text-green-600" />
            {entry.location}
          </div>
          <div className="text-gray-500 text-xs mt-0.5">
            {entry.qty} botol · {entry.weight} kg · {entry.type} · {entry.time}
          </div>
        </div>
      ))}
    </div>
  );
}
