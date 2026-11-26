import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardEdit, CheckCircle } from 'lucide-react';
import { useLocations } from '../hooks/useLocations';
import { useToast } from '../hooks/useToast';
import type { BottleCondition, PlasticType } from '../types';

export default function InputPage() {
  const { showToast } = useToast();
  const { locations, depositBottles } = useLocations();
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [locationId, setLocationId] = useState('');
  const [qty, setQty] = useState('');
  const [weight, setWeight] = useState('');
  const [type, setType] = useState<PlasticType>('PET');
  const [condition, setCondition] = useState<BottleCondition>('Baik');
  const [note, setNote] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!locationId) {
      showToast('⚠️ Pilih lokasi dulu');
      return;
    }

    const parsedQty = parseInt(qty, 10);
    if (!qty || Number.isNaN(parsedQty) || parsedQty <= 0) {
      showToast('⚠️ Masukkan jumlah botol');
      return;
    }

    const parsedWeight = weight ? parseFloat(weight) : undefined;
    if (parsedWeight !== undefined && (Number.isNaN(parsedWeight) || parsedWeight < 0)) {
      showToast('⚠️ Berat tidak boleh negatif');
      return;
    }

    setSubmitting(true);
    try {
      const res = await depositBottles({
        locationId: Number(locationId),
        qty: parsedQty,
        weight: parsedWeight,
        type,
        condition,
        note,
      });

      if (!res.ok) {
        showToast(`❌ ${res.error || 'Gagal menyimpan data'}`);
        return;
      }

      setShowSuccess(true);
      showToast('✅ Data berhasil disimpan!');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setShowSuccess(false);
    setLocationId('');
    setQty('');
    setWeight('');
    setNote('');
  };

  const inputClass =
    'w-full px-4 py-3 border-2 border-gray-200 rounded-app-sm font-sans text-[15px] text-gray-800 bg-gray-50 outline-none transition-colors focus:border-green-500 focus:bg-white';

  return (
    <div className="p-5 max-w-xl mx-auto">
      <AnimatePresence mode="wait">
        {!showSuccess ? (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            onSubmit={handleSubmit}
            className="bg-white rounded-app p-6 px-5 shadow-app border border-gray-100"
          >
            <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
              <ClipboardEdit size={20} className="text-green-600" />
              Input Data Sampah
            </h3>
            <p className="text-[13px] text-gray-500 mb-5">
              Catat data pengumpulan botol plastik harian
            </p>

            <div className="mb-4">
              <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                Lokasi Penampungan
              </label>
              <select
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                className={inputClass}
              >
                <option value="">-- Pilih Lokasi --</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} ({loc.capacity}%)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                  Jumlah Botol
                </label>
                <input
                  type="number"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  placeholder="0"
                  min="1"
                  max="5000"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                  Berat (kg)
                </label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="Otomatis jika kosong"
                  step="0.1"
                  min="0"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                Jenis Plastik
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as PlasticType)}
                className={inputClass}
              >
                <option value="PET">PET (Botol minum)</option>
                <option value="HDPE">HDPE (Botol susu/sabun)</option>
                <option value="PP">PP (Tutup botol)</option>
                <option value="Campuran">Campuran</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                Kondisi
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as BottleCondition)}
                className={inputClass}
              >
                <option value="Baik">Baik (layak daur ulang)</option>
                <option value="Rusak">Rusak (perlu sortir)</option>
                <option value="Kotor">Kotor (perlu cuci)</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                Catatan (opsional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                placeholder="Catatan tambahan..."
                className={inputClass + ' resize-none'}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-gradient-to-br from-green-600 to-green-500 text-white border-none rounded-app-sm font-sans text-base font-bold cursor-pointer transition-transform active:scale-[0.98] shadow-[0_4px_16px_rgba(22,163,74,0.3)] mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? 'Menyimpan...' : 'Simpan Data ✓'}
            </button>
          </motion.form>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-green-50 border-2 border-green-200 rounded-app p-5 text-center"
          >
            <CheckCircle size={48} className="text-green-500 mx-auto mb-2" />
            <h3 className="text-green-700 text-base font-bold">
              Data Berhasil Disimpan!
            </h3>
            <p className="text-green-600 text-[13px] mt-1">
              Entri baru telah tercatat ke dalam sistem
            </p>
            <button
              type="button"
              onClick={resetForm}
              className="w-full py-3.5 bg-gradient-to-br from-green-600 to-green-500 text-white border-none rounded-app-sm font-sans text-base font-bold cursor-pointer transition-transform active:scale-[0.98] shadow-[0_4px_16px_rgba(22,163,74,0.3)] mt-4"
            >
              Input Data Lagi
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
