import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import RoleSelector from './RoleSelector';
import type { Role } from '../../types';

export default function LoginForm() {
  const [role, setRole] = useState<Role>('petugas');
  const [name, setName] = useState('Petugas UM');
  const [password, setPassword] = useState('petugas123');
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast('⚠️ Masukkan nama pengguna');
      return;
    }

    if (!password) {
      showToast('⚠️ Masukkan kata sandi');
      return;
    }

    const success = login(name.trim(), password, role);
    if (success) {
      showToast('✅ Berhasil masuk!');
      navigate('/home');
    } else {
      showToast('❌ Kata sandi salah!');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl p-8 px-6 shadow-app-lg"
    >
      <h2 className="text-xl font-bold mb-1 text-gray-900">Masuk</h2>
      <p className="text-[13px] text-gray-500 mb-6">
        Pilih peran dan masuk ke sistem
      </p>

      <RoleSelector selected={role} onSelect={setRole} />

      <div className="mb-4">
        <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
          Nama Pengguna
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Masukkan nama..."
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-app-sm font-sans text-[15px] text-gray-800 bg-gray-50 outline-none transition-colors focus:border-green-500 focus:bg-white"
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
          placeholder="Masukkan kata sandi..."
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-app-sm font-sans text-[15px] text-gray-800 bg-gray-50 outline-none transition-colors focus:border-green-500 focus:bg-white"
        />
      </div>

      <button
        type="submit"
        className="w-full py-3.5 bg-gradient-to-br from-green-600 to-green-500 text-white border-none rounded-app-sm font-sans text-base font-bold cursor-pointer transition-transform active:scale-[0.98] shadow-[0_4px_16px_rgba(22,163,74,0.3)] mt-2"
      >
        Masuk ke Sistem →
      </button>
    </form>
  );
}
