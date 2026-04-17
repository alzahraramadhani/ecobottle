import { motion } from 'framer-motion';
import type { WeeklyDataPoint } from '../../types';

interface BarChartProps {
  data: WeeklyDataPoint[];
}

export default function BarChart({ data }: BarChartProps) {
  const maxVal = Math.max(...data.map((d) => d.value));

  return (
    <div className="bg-white rounded-app p-5 shadow-app border border-gray-100">
      <div className="flex items-end gap-2 h-[130px] mt-4 pt-2.5">
        {data.map((d, i) => {
          const pct = (d.value / maxVal) * 100;
          return (
            <div
              key={d.day}
              className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end"
            >
              <span className="text-[10px] font-bold text-gray-700">
                {d.value}
              </span>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${pct}%` }}
                transition={{
                  delay: i * 0.08,
                  duration: 0.8,
                  type: 'spring',
                  stiffness: 80,
                  damping: 12,
                }}
                className="w-full max-w-[36px] rounded-t-lg rounded-b bg-gradient-to-t from-green-500 to-green-400"
              />
              <span className="text-[10px] font-semibold text-gray-500">
                {d.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
