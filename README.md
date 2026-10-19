# SIKAS SISWA — Sistem Informasi Kas Keuangan Siswa

Aplikasi Administrasi Keuangan Sekolah Modern berbasis **React + Vite**, **Tailwind CSS**, **Firebase Firestore / Storage**, dan siap dipublikasikan ke **Vercel**.

![SIKAS SISWA](https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&auto=format&fit=crop&q=80)

---

## 🌟 Fitur Utama

1. **Dashboard Eksekutif & Informatif**
   - Kartu metrik: Total Pemasukan, Total Pengeluaran, Saldo Kas (Seluruh Akun), Transaksi Hari Ini.
   - Ringkasan siswa: Siswa Aktif, Sudah Lunas, Belum Lunas (Tunggakan), Transfer Belum Verifikasi.
   - Visualisasi grafik bulanan perbandingan arus kas masuk vs kas keluar menggunakan **Recharts**.
   - Posisi kas tunai brankas vs saldo rekening bank secara *real-time*.

2. **Pembayaran Kas Siswa (Modul Utama Bendahara)**
   - Alur cepat 4 langkah: Pilih Siswa ➔ Pilih Tagihan ➔ Input Nominal ➔ Pilih Metode (Cash / Transfer Bank).
   - Verifikasi mutasi transfer bank masuk.
   - **Kuitansi Resmi Otomatis**: Dilengkapi kop sekolah, nomor kuitansi unik, rincian tagihan, nominal angka, konversi **Terbilang Bahasa Indonesia** (*"Dua Puluh Lima Ribu Rupiah"*), tanda tangan digital, tombol cetak (*thermal & A4*), dan **Kirim Bukti Pembayaran Langsung ke WhatsApp Wali Siswa** via tautan `wa.me`.

3. **Data Siswa & Rombel (Kelas)**
   - Manajemen siswa dengan NIS, NISN, nama lengkap, jenjang, kelas, kontak WhatsApp wali murid.
   - Histori komprehensif tagihan, pembayaran, dan tunggakan per siswa.
   - Ekspor data siswa ke **Excel (.xlsx)**.

4. **Tagihan Kas & Generator Massal**
   - Penetapan tarif kas bulanan atau kas kegiatan.
   - **Fitur Generate Tagihan Massal**: Membuat tagihan satu angkatan/kelas secara otomatis tanpa risiko duplikasi.
   - Status tagihan dinamis: *Belum Bayar*, *Cicilan*, dan *Lunas*.

5. **Pemasukan Lain & Pengeluaran Kas Terkontrol**
   - Pencatatan sumbangan sukarela, donasi komite, dan pengembalian uang belanja.
   - Pencatatan pos pengeluaran (ATK, Kegiatan, Kebersihan, Sarana, Operasional).
   - **Aturan Keamanan Saldo Kas**: Sistem menolak pengeluaran jika saldo akun kas tidak mencukupi (mencegah saldo minus).

6. **Transfer Internal & Rekonsiliasi Kas Fisik**
   - Transfer antar-akun kas tunai brankas dan rekening bank tanpa mendistorsi total pemasukan/pengeluaran.
   - Berita acara rekonsiliasi kas: Pencocokan buku kas dengan penghitungan uang fisik brankas / mutasi bank.

7. **Laporan Keuangan & Buku Kas Lengkap**
   - **Laporan Kas Bulanan / Harian**: Format resmi dengan kop sekolah dan tanda tangan Kepala Sekolah & Bendahara.
   - **Laporan Tunggakan Siswa**: Lengkap dengan tombol kirim surat penagihan via WhatsApp ke wali siswa.
   - **Buku Kas Umum (Ledger)**: Saldo berjalan (*running balance*) per akun kas.
   - **Tutup Buku Periode**: Kunci periode pembukuan untuk mencegah manipulasi data masa lalu.
   - Ekspor seluruh laporan ke **PDF** dan **Excel (.xlsx)**.

8. **Hak Akses Pengguna (Role-Based Access Control)**
   - *Super Admin*, *Kepala Sekolah*, *Bendahara*, *Petugas Kasir*, dan *Auditor / Pemeriksa*.
   - Dilengkapi *Quick Role Switcher* pada topbar untuk pengujian simulasi izin akses.

---

## 🛠️ Teknologi yang Digunakan

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Ikon**: Lucide React
- **Grafik Keuangan**: Recharts
- **Ekspor Dokumen**: SheetJS (`xlsx`), `jspdf`, `jspdf-autotable`
- **Database & Auth**: Firebase Firestore, Firebase Authentication, Firebase Storage
- **Hosting**: Vercel

---

## 🚀 Panduan Menjalankan di Komputer Lokal

### 1. Masuk ke direktori proyek
```bash
cd sikas-siswa
```

### 2. Jalankan Server Development
```bash
npm run dev
```
Buka browser di `http://localhost:3000`.

### 3. Build untuk Produksi
```bash
npm run build
```
File siap rilis akan berada di folder `dist/`.

---

## ☁️ Integrasi Firebase & Publikasi ke Vercel

### A. Pengaturan Firebase
1. Buka [Firebase Console](https://console.firebase.google.com/) dan buat proyek baru (misal: `sikas-siswa`).
2. Aktifkan:
   - **Firestore Database** (Mode: Production).
   - **Firebase Authentication** (Metode: Email/Password).
   - **Firebase Storage** (Untuk nota bukti transfer).
3. Salin konfigurasi web SDK dari Firebase Console ke file `.env` (atau masukkan langsung melalui menu **Pengaturan Sekolah** di dalam aplikasi).
4. Terapkan aturan keamanan yang telah disediakan pada file:
   - `firestore.rules` ➔ Tempel pada tab Rules Cloud Firestore.
   - `storage.rules` ➔ Tempel pada tab Rules Firebase Storage.

### B. Publikasi ke Vercel
1. Unggah proyek ini ke repositori GitHub / GitLab.
2. Buka [Vercel](https://vercel.com/) dan klik **Add New Project** ➔ Pilih repositori `sikas-siswa`.
3. Pengaturan build di Vercel:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Masukkan *Environment Variables* sesuai file `.env.example`.
5. Klik **Deploy**! Aplikasi Anda kini dapat diakses secara publik melalui URL resmi Vercel.
