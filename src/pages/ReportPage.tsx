import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Printer, Circle } from 'lucide-react';
import ReportCard from '../components/report/ReportCard';
import HistoryList from '../components/report/HistoryList';
import { useLocations } from '../hooks/useLocations';
import { useToast } from '../hooks/useToast';
import type { PlasticType } from '../types';

function escapeCsv(value: string | number): string {
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export default function ReportPage() {
  const { showToast } = useToast();
  const { locations, transactions } = useLocations();

  const now = useMemo(() => new Date(), []);
  const monthBadge = now.toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric',
  });

  const monthlyTransactions = useMemo(() => {
    const year = now.getFullYear();
    const month = now.getMonth();
    return transactions.filter((tx) => {
      const dt = new Date(tx.createdAt);
      return dt.getFullYear() === year && dt.getMonth() === month;
    });
  }, [transactions, now]);

  const summary = useMemo(() => {
    const totalBottles = monthlyTransactions.reduce((sum, tx) => sum + tx.qty, 0);
    const totalWeight = monthlyTransactions.reduce((sum, tx) => sum + tx.weight, 0);
    const dayOfMonth = Math.max(1, now.getDate());
    const avgPerDay = Math.round(totalBottles / dayOfMonth);

    const goodQty = monthlyTransactions
      .filter((tx) => tx.condition === 'Baik')
      .reduce((sum, tx) => sum + tx.qty, 0);
    const recycleRate =
      totalBottles > 0 ? Math.round((goodQty / totalBottles) * 100) : 0;

    const byPlastic: Record<PlasticType, number> = {
      PET: 0,
      HDPE: 0,
      PP: 0,
      Campuran: 0,
    };

    for (const tx of monthlyTransactions) {
      byPlastic[tx.type] += tx.qty;
    }

    return {
      totalBottles,
      totalWeight,
      avgPerDay,
      activeLocations: locations.length,
      recycleRate,
      byPlastic,
    };
  }, [monthlyTransactions, locations.length, now]);

  const handleDownloadCsv = () => {
    if (transactions.length === 0) {
      showToast('⚠️ Belum ada transaksi untuk diunduh');
      return;
    }

    const headers = ['Waktu', 'Lokasi', 'Jumlah Botol', 'Berat (kg)', 'Jenis Plastik', 'Kondisi', 'Catatan'];
    const rows = transactions.map((tx) => [
      escapeCsv(tx.time),
      escapeCsv(tx.location),
      escapeCsv(tx.qty),
      escapeCsv(tx.weight.toFixed(2)),
      escapeCsv(tx.type),
      escapeCsv(tx.condition),
      escapeCsv(tx.note),
    ]);

    const csvContent =
      '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `laporan-ecobottle-${now.toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('📥 Laporan CSV berhasil diunduh!');
  };

  const handlePrintPdf = () => {
    window.print();
  };

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
          Ringkasan data penampungan secara real-time
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
      >
        <ReportCard title="Ringkasan Bulan Ini" badge={monthBadge} badgeColor="green">
          <table className="w-full text-[13px]">
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-2.5 text-gray-600">Total Botol Terkumpul</td>
                <td className="py-2.5 text-right font-bold text-gray-800">
                  {summary.totalBottles.toLocaleString('id-ID')} unit
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2.5 text-gray-600">Total Berat</td>
                <td className="py-2.5 text-right font-bold text-gray-800">
                  {summary.totalWeight.toFixed(1).replace('.', ',')} kg
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2.5 text-gray-600">Rata-rata / Hari</td>
                <td className="py-2.5 text-right font-bold text-gray-800">
                  {summary.avgPerDay.toLocaleString('id-ID')} unit
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2.5 text-gray-600">Lokasi Aktif</td>
                <td className="py-2.5 text-right font-bold text-gray-800">
                  {summary.activeLocations} titik
                </td>
              </tr>
              <tr>
                <td className="py-2.5 text-gray-600">Tingkat Layak Daur Ulang</td>
                <td className="py-2.5 text-right font-bold text-gray-800">
                  {summary.recycleRate}%
                </td>
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
                <td className="py-2.5 text-right font-bold text-gray-800">
                  {summary.byPlastic.PET.toLocaleString('id-ID')} unit
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2.5 text-gray-600 flex items-center gap-1.5">
                  <Circle size={10} className="text-blue-500 fill-blue-500" />
                  HDPE (Botol sabun)
                </td>
                <td className="py-2.5 text-right font-bold text-gray-800">
                  {summary.byPlastic.HDPE.toLocaleString('id-ID')} unit
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2.5 text-gray-600 flex items-center gap-1.5">
                  <Circle size={10} className="text-yellow-500 fill-yellow-500" />
                  PP (Tutup botol)
                </td>
                <td className="py-2.5 text-right font-bold text-gray-800">
                  {summary.byPlastic.PP.toLocaleString('id-ID')} unit
                </td>
              </tr>
              <tr>
                <td className="py-2.5 text-gray-600 flex items-center gap-1.5">
                  <Circle size={10} className="text-gray-400 fill-gray-400" />
                  Campuran
                </td>
                <td className="py-2.5 text-right font-bold text-gray-800">
                  {summary.byPlastic.Campuran.toLocaleString('id-ID')} unit
                </td>
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
          <HistoryList entries={transactions} />
        </ReportCard>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.32 }}
        className="grid grid-cols-2 gap-3 mt-4 print:hidden"
      >
        <button
          type="button"
          onClick={handleDownloadCsv}
          className="py-3.5 bg-green-600 text-white border-none rounded-app-sm font-sans text-sm font-bold cursor-pointer flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
        >
          <Download size={18} />
          Unduh CSV
        </button>
        <button
          type="button"
          onClick={handlePrintPdf}
          className="py-3.5 bg-gray-900 text-white border-none rounded-app-sm font-sans text-sm font-bold cursor-pointer flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
        >
          <Printer size={18} />
          Cetak / PDF
        </button>
      </motion.div>
    </div>
  );
}
