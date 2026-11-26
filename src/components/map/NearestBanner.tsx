import { AnimatePresence, motion } from 'framer-motion';
import { X, MapPin } from 'lucide-react';
import type { Location } from '../../types';

interface NearestBannerProps {
  show: boolean;
  nearest: Location | null;
  distance: number;
  onClose: () => void;
}

export default function NearestBanner({
  show,
  nearest,
  distance,
  onClose,
}: NearestBannerProps) {
  return (
    <AnimatePresence>
      {show && nearest && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="absolute top-[104px] left-3 right-3 max-w-md z-[450] bg-white rounded-app p-3.5 px-4 shadow-app-lg flex gap-3 items-center border-l-4 border-green-500"
        >
          <MapPin size={20} className="text-green-600 flex-shrink-0" />
          <div className="flex-1">
            <div className="text-sm font-bold text-gray-800">
              {nearest.name}
            </div>
            <div className="text-xs text-gray-500 mt-0.5">
              Jarak: {distance} meter · Kapasitas: {nearest.capacity}%
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-transparent border-none text-gray-400 cursor-pointer p-1 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
