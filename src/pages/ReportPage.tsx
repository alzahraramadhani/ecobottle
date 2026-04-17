import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Circle } from 'lucide-react';
import ReportCard from '../components/report/ReportCard';
import HistoryList from '../components/report/HistoryList';
import { useToast } from '../context/ToastContext';
import { getInputHistory, subscribeInputHistory } from './InputPage';

export default function ReportPage() {
  const { showToast } = useToast();
  const [history, setHistory] = useState(getInputHistory());

  useEffect(() => {
    const unsubscribe = subscribeInputHistory(() => {
      setHistory([...getInputHistory()]);
    });
    return unsubscribe;
  }, []);

  return (
    <div className="p-5 max-w-xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-5"
      >
        <h2 className="text-[22px] font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
          <FileText size={22} className="text-green-600" />
          Laporan
        </h2>
        <p className="text-[13px] text-gray-500 mt-0.5">
          Ringkasan data penampungan
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
      >
        <ReportCard title="Ringkasan Bulan Ini" badge="April 2026" badgeColor="green">
          <table className="w-full text-[13px]">
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-2.5 text-gray-600">Total Botol Terkumpul</td>
                <td className="py-2.5 text-right font-bold text-gray-800">1.248 unit</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2.5 text-gray-600">Total Berat</td>
                <td className="py-2.5 text-right font-bold text-gray-800">62,4 kg</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2.5 text-gray-600">Rata-rata / Hari</td>
                <td className="py-2.5 text-right font-bold text-gray-800">83 unit</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2.5 text-gray-600">Lokasi Aktif</td>
                <td className="py-2.5 text-right font-bold text-gray-800">5 titik</td>
              </tr>
              <tr>
                <td className="py-2.5 text-gray-600">Tingkat Daur Ulang</td>
                <td className="py-2.5 text-right font-bold text-gray-800">78%</td>
              </tr>
            </tbody>
          </table>
        </ReportCard>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16 }}
      >
        <ReportCard title="Per Jenis Plastik" badge="Detail" badgeColor="yellow">
          <table className="w-full text-[13px]">
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-2.5 text-gray-600 flex items-center gap-1.5">
                  <Circle size={10} className="text-green-500 fill-green-500" />
                  PET (Botol minum)
                </td>
                <td className="py-2.5 text-right font-bold text-gray-800">812 unit</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2.5 text-gray-600 flex items-center gap-1.5">
                  <Circle size={10} className="text-blue-500 fill-blue-500" />
                  HDPE (Botol sabun)
                </td>
                <td className="py-2.5 text-right font-bold text-gray-800">246 unit</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2.5 text-gray-600 flex items-center gap-1.5">
                  <Circle size={10} className="text-yellow-500 fill-yellow-500" />
                  PP (Tutup botol)
                </td>
                <td className="py-2.5 text-right font-bold text-gray-800">134 unit</td>
              </tr>
              <tr>
                <td className="py-2.5 text-gray-600 flex items-center gap-1.5">
                  <Circle size={10} className="text-gray-400 fill-gray-400" />
                  Campuran
                </td>
                <td className="py-2.5 text-right font-bold text-gray-800">56 unit</td>
              </tr>
            </tbody>
          </table>
        </ReportCard>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.24 }}
      >
        <ReportCard title="Riwayat Input Terakhir">
          <HistoryList entries={history} />
        </ReportCard>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.32 }}
        onClick={() => showToast('📥 Laporan berhasil diunduh!')}
        className="w-full py-3.5 bg-gray-900 text-white border-none rounded-app-sm font-sans text-sm font-bold cursor-pointer mt-4 flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
      >
        <Download size={18} />
        Unduh Laporan PDF
      </motion.button>
    </div>
  );
}
