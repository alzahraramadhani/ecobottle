# EcoBottle — Sistem Monitoring Sampah Botol Plastik

Aplikasi web monitoring pengumpulan sampah botol plastik berbasis **React + TypeScript + Vite + Tailwind CSS + Leaflet + Supabase**.

## Fitur Utama

### Warga
- **Beranda Warga**: Ringkasan dampak pribadi (botol diselamatkan, Eco Poin, estimasi emisi CO₂ dicegah) dan rekomendasi dropbox aktif.
- **Peta Interaktif + Pencarian & Filter**: Cari titik dropbox terdekat, filter status (`Semua`, `Tersedia`, `Hampir Penuh`), dan setor botol langsung melalui modal setor (otomatis menambah kapasitas dropbox, poin, XP, dan streak).
- **Papan Peringkat**: Leaderboard real-time berdasarkan Eco Poin warga.
- **Profil**: Level, progress XP, statistik kontribusi, dan riwayat setoran pribadi.

### Petugas
- **Dashboard Operasional**: Statistik total botol, jumlah titik lokasi, persentase layak daur ulang, jumlah lokasi perlu angkut, grafik pengumpulan 7 hari terakhir, dan status kapasitas semua dropbox.
- **Peta Kontrol**: Memantau kapasitas dropbox, menutup dropbox penuh, atau mengosongkan & membuka kembali dropbox.
- **Input Data Sampah**: Mencatat pengumpulan botol harian beserta berat, jenis plastik (`PET`, `HDPE`, `PP`, `Campuran`), kondisi, dan catatan.
- **Laporan & Ekspor**: Ringkasan bulanan dinamis, rincian per jenis plastik, riwayat transaksi, **Unduh CSV**, dan **Cetak / Simpan PDF**.

---

## Setup Lokal & Supabase

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Siapkan Project Supabase**
   - Buat project baru di [Supabase](https://supabase.com).
   - Jalankan SQL migration dari [`supabase/migrations/20261126000000_init_ecobottle.sql`](supabase/migrations/20261126000000_init_ecobottle.sql) di SQL Editor Supabase.
   - Jalankan seed lokasi awal dari [`supabase/seed.sql`](supabase/seed.sql).

3. **Konfigurasi Environment**
   - Salin `.env.example` menjadi `.env`:
     ```bash
     cp .env.example .env
     ```
   - Isi `VITE_SUPABASE_URL` dan `VITE_SUPABASE_PUBLISHABLE_KEY` dari Dashboard Supabase (*Project Settings → API*).

4. **Menetapkan Akun Petugas**
   - Semua akun baru yang mendaftar lewat aplikasi otomatis berstatus `warga`.
   - Untuk mengubah akun tertentu menjadi `petugas`, jalankan SQL berikut di Supabase SQL Editor:
     ```sql
     update public.profiles
     set role = 'petugas'
     where id = (
       select id from auth.users where email = 'petugas@domain.com'
     );
     ```

5. **Jalankan Aplikasi**
   ```bash
   npm run dev
   ```

## Scripts
- `npm run dev` — Menjalankan server pengembangan Vite
- `npm run build` — Type-check TypeScript (`tsc -b`) dan build produksi (`vite build`)
- `npm run lint` — Menjalankan ESLint
- `npm test` — Menjalankan unit test dengan Vitest
