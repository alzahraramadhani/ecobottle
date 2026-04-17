import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  highlight?: boolean;
  delay?: number;
  iconColor?: string;
}

export default function StatCard({
  icon: Icon,
  value,
  label,
  highlight = false,
  delay = 0,
  iconColor,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
      className={`rounded-app p-[18px] px-4 shadow-app border ${
        highlight
          ? 'bg-gradient-to-br from-green-600 to-green-500 border-transparent'
          : 'bg-white border-gray-100'
      }`}
    >
      <div className="text-[28px] mb-2.5">
        <Icon
          size={28}
          className={
            highlight
              ? 'text-white/80'
              : iconColor || 'text-green-500'
          }
        />
      </div>
      <div
        className={`text-[26px] font-extrabold tracking-tight ${
          highlight ? 'text-white' : 'text-gray-900'
        }`}
      >
        {value}
      </div>
      <div
        className={`text-xs font-medium mt-0.5 ${
          highlight ? 'text-white' : 'text-gray-500'
        }`}
      >
        {label}
      </div>
    </motion.div>
  );
}
