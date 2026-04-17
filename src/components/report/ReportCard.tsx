import type { ReactNode } from 'react';

interface ReportCardProps {
  title: string;
  badge?: string;
  badgeColor?: 'green' | 'yellow';
  children: ReactNode;
  delay?: number;
}

const badgeStyles = {
  green: 'bg-green-100 text-green-700',
  yellow: 'bg-amber-100 text-amber-700',
};

export default function ReportCard({
  title,
  badge,
  badgeColor = 'green',
  children,
  delay = 0,
}: ReportCardProps) {
  return (
    <div
      className="bg-white rounded-app p-5 shadow-app border border-gray-100 mb-3"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-bold">{title}</h3>
        {badge && (
          <span
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${badgeStyles[badgeColor]}`}
          >
            {badge}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
