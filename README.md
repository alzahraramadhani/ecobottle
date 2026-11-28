# ♻️ EcoBottle — Sistem Monitoring Sampah Botol Plastik

![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?logo=leaflet&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Postgres_&_Auth-3FCF8E?logo=supabase&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-4.1-6E9F18?logo=vitest&logoColor=white)

**EcoBottle** adalah aplikasi web monitoring dan pengelolaan sampah botol plastik berbasis peta interaktif dan gamifikasi yang dibangun dengan **React, TypeScript, Tailwind CSS, Leaflet, dan Supabase**.

---

## 📖 Tentang Proyek & Latar Belakang

Proyek ini dikembangkan dalam rangka mata kuliah **Pendidikan Pancasila** di **Universitas Negeri Malang (UM)** sebagai wujud nyata penerapan nilai-nilai Pancasila—khususnya semangat gotong royong, kepedulian terhadap kelestarian lingkungan kampus, dan tanggung jawab sosial berkelanjutan.

Melalui EcoBottle:
- **Warga kampus** dapat memantau keterisian tempat penampungan (dropbox) botol plastik terdekat secara real-time, menyetor botol plastik, serta memperoleh **Eco Poin**, **XP**, dan peringkat kontribusi.
- **Petugas kebersihan/pengelola** dapat memantau status kapasitas seluruh titik dropbox, mengatur buka/tutup penampungan penuh, mencatat pengumpulan harian, serta mengunduh laporan operasional dalam format **CSV** maupun **PDF**.

---

## 🌐 Live Demo & Tampilan

- **Live Demo (Vercel)**: _Belum ditautkan — isi dengan URL deployment Vercel Anda (mis. `https://ecobottle.vercel.app`)_
- **Tangkapan Layar**:

| Login & Daftar | Beranda Warga | Peta Interaktif | Dashboard & Laporan Petugas |
| :---: | :---: | :---: | :---: |
| _Tambahkan screenshot halaman login_ | _Tambahkan screenshot beranda warga_ | _Tambahkan screenshot peta dropbox_ | _Tambahkan screenshot dashboard/laporan_ |

---

## 🛠️ Tech Stack

| Lapisan | Teknologi |
| :--- | :--- |
| **Frontend Framework** | React 19, TypeScript, Vite 8 |
| **Routing & Animasi** | React Router DOM 7, Framer Motion 12 |
| **Styling & Ikon** | Tailwind CSS 3.4, Lucide React |
| **Peta & Geolokasi** | Leaflet 1.9, React Leaflet 5, OpenStreetMap, rumus Haversine |
| **Backend & Database** | Supabase (`@supabase/supabase-js` v2), PostgreSQL, Row-Level Security (RLS), PL/pgSQL RPC |
| **Testing & Linting** | Vitest 4, Testing Library, ESLint 9 |
| **Hosting** | Vercel (konfigurasi SPA rewrite di `vercel.json`) |

---

## ✨ Fitur Utama

### 1. Peran Warga (`warga`)
- **Beranda Warga (`/home`)**: Menampilkan ringkasan dampak pribadi (botol diselamatkan, Eco Poin, estimasi emisi $\text{CO}_2$ yang dicegah), kartu rekomendasi dropbox teratas, dan *Eco Tips*.
- **Peta Interaktif (`/map`)**:
  - Pencarian lokasi dropbox berdasarkan nama dan filter status (`Semua`, `Tersedia`, `Hampir Penuh`).
  - Deteksi dropbox terdekat menggunakan Geolocation API (dengan fallback koordinat kampus UM jika izin lokasi tidak aktif).
  - Navigasi langsung ke Google Maps dan modal **Tukar Botol Plastik** (1–100 botol per setor; jenis `PET`, `HDPE`, `PP`, `Campuran`).
  - Otomatis memperbarui kapasitas dropbox serta memberi **+10 Eco Poin/botol**, **+15 XP/botol**, estimasi emisi, dan **streak harian**.
- **Papan Peringkat (`/rangking`)**: Leaderboard warga secara real-time berdasarkan total Eco Poin dan jumlah botol yang diselamatkan.
- **Profil Warga (`/profile`)**: Menampilkan level, progress XP menuju level berikutnya, streak harian, statistik kontribusi, riwayat penukaran pribadi, dan tombol keluar akun.

### 2. Peran Petugas (`petugas`)
- **Dashboard Operasional (`/home`)**: Menampilkan total botol di seluruh titik, jumlah titik aktif, persentase botol layak daur ulang, jumlah lokasi yang perlu segera diangkut, grafik pengumpulan 7 hari terakhir, dan status kapasitas tiap dropbox.
- **Peta Kontrol (`/map`)**: Memantau status keterisian setiap titik, menutup dropbox penuh secara manual, atau mengosongkan & membuka kembali dropbox yang sudah diangkut.
- **Input Data Sampah (`/input`)**: Form pencatatan pengumpulan botol (lokasi, jumlah `1–5000` botol, berat kg opsional/otomatis, jenis plastik, kondisi `Baik`/`Rusak`/`Kotor`, dan catatan).
- **Laporan & Ekspor (`/report`)**: Ringkasan data bulan berjalan secara dinamis, rincian per jenis plastik, riwayat input terakhir, **Unduh CSV**, serta **Cetak / Simpan PDF**.

---

## 📍 Daftar 9 Titik Dropbox Awal (Kampus UM)

Data awal lokasi penampungan pada `supabase/seed.sql` (masing-masing berkapasitas maksimal **400 botol**):

1. Belakang Kantin FMIPA
2. Selasar B12
3. Parkiran Selatan Gracak
4. Sebelah Kantin FS
5. Taman Perpustakaan
6. Depan Gedung D19
7. Samping Gedung C6
8. Depan Gedung D3
9. Depan Gedung A20

**Indikator Status Kapasitas** (`src/utils/capacity.ts` & RPC database):
- 🟢 **Tersedia (`low`)**: `< 35%`
- 🟡 **Sebagian Penuh (`mid`)**: `35% – 74%`
- 🔴 **Hampir Penuh (`high`)**: `75% – 99%`
- ⚫ **Penuh / Tutup (`full`)**: `100%` (atau ditutup manual oleh petugas)

---

## 🗄️ Arsitektur Database & Keamanan (Supabase)

Skema produksi berada di [`supabase/migrations/20261126000000_init_ecobottle.sql`](supabase/migrations/20261126000000_init_ecobottle.sql):
- **Tabel Utama**:
  - `public.profiles` — data pengguna, peran (`warga` / `petugas`), poin, XP, level, botol terselamatkan, emisi, dan streak.
  - `public.locations` — daftar dropbox, koordinat lat/lng, jumlah botol, kapasitas maksimal, persentase, dan status.
  - `public.bottle_transactions` — riwayat setiap transaksi penyetoran/input botol.
- **Keamanan & RLS**:
  - Seluruh tabel `public` mengaktifkan **Row-Level Security (RLS)** dengan kebijakan `TO authenticated`.
  - Pendaftaran akun baru melalui aplikasi otomatis mendapatkan role `warga` lewat trigger `private.handle_new_user()`.
  - Trigger `private.prevent_profile_tampering()` mencegah perubahan kolom sensitif (`role`, `points`, `xp`, `level`, `bottles_saved`, `emission_kg`, `streak_days`) secara langsung dari client.
  - Perubahan jumlah botol, poin, dan status dropbox berjalan atomik melalui Postgres RPC `public.deposit_bottles` dan `public.update_location_status`.

---

## 📁 Struktur Direktori

```text
ecobottle-app/
├── public/                        # Aset statis (favicon, icons)
├── supabase/
│   ├── migrations/                # Skema SQL, RLS, trigger, dan RPC
│   └── seed.sql                   # Data awal 9 titik dropbox UM
├── src/
│   ├── __tests__/                 # Unit test (auth, capacity, distance)
│   ├── components/
│   │   ├── layout/                # AppLayout, AppHeader, BottomNav, SidebarNav, ProtectedRoute
│   │   ├── login/                 # LoginForm (Masuk & Daftar Warga)
│   │   ├── map/                   # MapView, LocationMarker, NearestBanner
│   │   ├── report/                # ReportCard, HistoryList
│   │   └── ui/                    # StatCard, BarChart, CapacityRing, LocationStatusCard
│   ├── context/                   # AuthContext, LocationContext, ToastContext
│   ├── data/                      # Data referensi lokal
│   ├── hooks/                     # useAuth, useLocations, useToast, useGeolocation
│   ├── lib/                       # Inisialisasi Supabase client
│   ├── pages/                     # Halaman Petugas & Warga (pages/warga/*)
│   ├── types/                     # Definisi tipe TypeScript
│   └── utils/                     # Kalkulasi jarak Haversine & metrik kapasitas
├── .env.example                   # Template environment variables
├── vercel.json                    # Konfigurasi SPA rewrite untuk Vercel
└── package.json
```

---

## 🚀 Setup Lokal & Supabase

1. **Clone repository dan install dependencies**
   ```bash
   git clone https://github.com/alzahraramadhani/ecobottle.git
   cd ecobottle
   npm install
   ```

2. **Siapkan Project Supabase**
   - Buat project baru di [Supabase](https://supabase.com).
   - Buka **SQL Editor**, lalu jalankan isi file [`supabase/migrations/20261126000000_init_ecobottle.sql`](supabase/migrations/20261126000000_init_ecobottle.sql).
   - Lanjutkan menjalankan [`supabase/seed.sql`](supabase/seed.sql) untuk mengisi 9 lokasi dropbox awal.

3. **Konfigurasi Environment Variables**
   - Salin `.env.example` menjadi `.env`:
     ```bash
     cp .env.example .env
     ```
   - Isi `VITE_SUPABASE_URL` dan `VITE_SUPABASE_PUBLISHABLE_KEY` dari Dashboard Supabase (*Project Settings → API*).

4. **Menetapkan Akun Petugas**
   - Semua pengguna yang mendaftar lewat form registrasi otomatis berstatus `warga`.
   - Untuk mempromosikan akun tertentu menjadi `petugas`, jalankan SQL berikut di Supabase SQL Editor:
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

---

## ☁️ Deploy ke Vercel

1. Hubungkan repository GitHub ke [Vercel](https://vercel.com) (framework preset: **Vite**).
2. Tambahkan Environment Variables di pengaturan project Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
3. File [`vercel.json`](vercel.json) sudah dikonfigurasi untuk menangani *client-side routing* React Router agar tidak `404` saat halaman di-refresh.

---

## 🧪 Scripts

- `npm run dev` — Menjalankan server pengembangan Vite
- `npm run build` — Type-check TypeScript (`tsc -b`) dan build produksi (`vite build`)
- `npm run lint` — Memeriksa kualitas kode dengan ESLint
- `npm test` — Menjalankan seluruh unit test dengan Vitest
- `npm run preview` — Pratinjau hasil build produksi secara lokal

---

## 👥 Kredit & Kontributor

- **Pengelola Repository**: [@alzahraramadhani](https://github.com/alzahraramadhani)
- **Konteks Proyek**: Proyek Mata Kuliah Pendidikan Pancasila — Universitas Negeri Malang
- **Anggota Tim**:
  - _Tambahkan nama anggota & NIM di sini sesuai kebutuhan kelompok_
