import { motion } from 'framer-motion';
import { Droplets, MapPin, Recycle, AlertTriangle, BarChart3, Pin } from 'lucide-react';
import StatCard from '../components/ui/StatCard';
import BarChart from '../components/ui/BarChart';
import LocationStatusCard from '../components/ui/LocationStatusCard';
import { useAuth } from '../context/AuthContext';
import { locations } from '../data/locations';
import { weeklyData } from '../data/weeklyData';

export default function HomePage() {
  const { user } = useAuth();

  const now = new Date();
  const dateString = now.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="p-5 max-w-3xl mx-auto">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-[22px] font-extrabold text-gray-900 tracking-tight">
          Halo, {user?.name}!
        </h2>
        <p className="text-[13px] text-gray-500 mt-0.5">{dateString}</p>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard
          icon={Droplets}
          value="1.248"
          label="Total Botol"
          highlight
          delay={0.08}
        />
        <StatCard
          icon={MapPin}
          value={locations.length}
          label="Titik Lokasi"
          delay={0.16}
          iconColor="text-blue-500"
        />
        <StatCard
          icon={Recycle}
          value="78%"
          label="Daur Ulang"
          delay={0.24}
          iconColor="text-emerald-500"
        />
        <StatCard
          icon={AlertTriangle}
          value={locations.filter((l) => l.status === 'high').length}
          label="Perlu Angkut"
          delay={0.32}
          iconColor="text-amber-500"
        />
      </div>

      {/* Bar chart */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.24 }}
      >
        <h3 className="text-base font-bold text-gray-900 mb-3.5 flex items-center gap-2">
          <BarChart3 size={18} className="text-green-600" />
          Pengumpulan Minggu Ini
        </h3>
        <div className="mb-6">
          <BarChart data={weeklyData} />
        </div>
      </motion.div>

      {/* Status list */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.32 }}
      >
        <h3 className="text-base font-bold text-gray-900 mb-3.5 flex items-center gap-2">
          <Pin size={18} className="text-green-600" />
          Status Penampungan
        </h3>
        <div className="flex flex-col gap-2.5">
          {locations.map((loc) => (
            <LocationStatusCard key={loc.id} location={loc} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
