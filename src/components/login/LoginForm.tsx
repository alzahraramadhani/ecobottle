import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { isSupabaseConfigured } from '../../lib/supabase';

type AuthMode = 'login' | 'register';

export default function LoginForm() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isSupabaseConfigured) {
      showToast('⚠️ Konfigurasi Supabase (.env) belum diisi.');
      return;
    }

    if (mode === 'register' && !name.trim()) {
      showToast('⚠️ Masukkan nama lengkap');
      return;
    }

    if (!email.trim()) {
      showToast('⚠️ Masukkan alamat email');
      return;
    }

    if (password.length < 6) {
      showToast('⚠️ Kata sandi minimal 6 karakter');
      return;
    }

    setSubmitting(true);
    try {
      if (mode === 'login') {
        const res = await login(email, password);
        if (res.ok) {
          showToast('✅ Berhasil masuk!');
          navigate('/home');
        } else {
          showToast(`❌ ${res.error || 'Email atau kata sandi salah'}`);
        }
      } else {
        const res = await register(name, email, password);
        if (res.ok && !res.error) {
          showToast('✅ Akun berhasil dibuat!');
          navigate('/home');
        } else if (res.ok && res.error) {
          showToast(`ℹ️ ${res.error}`);
          setMode('login');
        } else {
          showToast(`❌ ${res.error || 'Gagal mendaftar'}`);
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3 border-2 border-gray-200 rounded-app-sm font-sans text-[15px] text-gray-800 bg-gray-50 outline-none transition-colors focus:border-green-500 focus:bg-white';

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl p-8 px-6 shadow-app-lg"
    >
      {/* Mode switch */}
      <div className="flex bg-gray-100 p-1 rounded-app-sm mb-6">
        <button
          type="button"
          onClick={() => setMode('login')}
          className={`flex-1 py-2 rounded-lg text-sm font-bold border-none cursor-pointer transition-all ${
            mode === 'login'
              ? 'bg-white text-green-700 shadow-sm'
              : 'bg-transparent text-gray-500'
          }`}
        >
          Masuk
        </button>
        <button
          type="button"
          onClick={() => setMode('register')}
          className={`flex-1 py-2 rounded-lg text-sm font-bold border-none cursor-pointer transition-all ${
            mode === 'register'
              ? 'bg-white text-green-700 shadow-sm'
              : 'bg-transparent text-gray-500'
          }`}
        >
          Daftar Warga
        </button>
      </div>

      {!isSupabaseConfigured && (
        <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2">
          <AlertCircle size={16} className="shrink-0 mt-0.5 text-amber-600" />
          <span>
            Supabase belum dikonfigurasi. Salin <code>.env.example</code> ke{' '}
            <code>.env</code> dan isi URL &amp; Publishable Key project Supabase Anda.
          </span>
        </div>
      )}

      <h2 className="text-xl font-bold mb-1 text-gray-900">
        {mode === 'login' ? 'Masuk ke EcoBottle' : 'Buat Akun Warga'}
      </h2>
      <p className="text-[13px] text-gray-500 mb-5">
        {mode === 'login'
          ? 'Gunakan email dan kata sandi akun Anda'
          : 'Pendaftaran baru otomatis aktif sebagai Warga'}
      </p>

      {mode === 'register' && (
        <div className="mb-4">
          <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
            Nama Lengkap
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Budi Santoso"
            className={inputClass}
          />
        </div>
      )}

      <div className="mb-4">
        <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="nama@email.com"
          className={inputClass}
        />
      </div>

      <div className="mb-4">
        <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
          Kata Sandi
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Minimal 6 karakter"
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3.5 bg-gradient-to-br from-green-600 to-green-500 text-white border-none rounded-app-sm font-sans text-base font-bold cursor-pointer transition-transform active:scale-[0.98] shadow-[0_4px_16px_rgba(22,163,74,0.3)] mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitting
          ? 'Memproses...'
          : mode === 'login'
            ? 'Masuk ke Sistem →'
            : 'Daftar Sekarang →'}
      </button>
    </form>
  );
}
