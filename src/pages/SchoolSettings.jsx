import React, { useState } from 'react';
import {
  Settings,
  School,
  Save,
  RotateCcw,
  Flame,
  Globe,
  CheckCircle2,
  AlertTriangle,
  Key,
  Trash2,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { isFirebaseConfigured, getFirebaseConfig } from '../services/firebase';

export default function SchoolSettings() {
  const { school, setSchool, resetToZero, logAudit, showToast } = useApp();

  const [formData, setFormData] = useState({ ...school });
  const [firebaseConfig, setFirebaseConfig] = useState(() => getFirebaseConfig());
  const [isFirebaseModalOpen, setIsFirebaseModalOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSchool(formData);
    logAudit('Pengaturan Sekolah', 'Memperbarui identitas dan konfigurasi sekolah');
    showToast('Pengaturan identitas sekolah berhasil disimpan!');
  };

  const handleSaveFirebaseConfig = (e) => {
    e.preventDefault();
    localStorage.setItem('sikas_firebase_config', JSON.stringify(firebaseConfig));
    showToast('Konfigurasi Firebase berhasil disimpan! Muat ulang halaman untuk menerapkan koneksi live.');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-blue-600" />
            <span>Pengaturan Sekolah & Sistem</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Konfigurasi profil sekolah, tahun ajaran aktif, format kuitansi, dan integrasi online Firebase
          </p>
        </div>

        <button
          onClick={resetToZero}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black shadow-md shadow-rose-500/25 transition active:scale-95"
          title="Hapus seluruh data transaksi, siswa, dan kas agar mulai dari NOL"
        >
          <Trash2 className="w-4 h-4" />
          <span>KOSONGKAN DATA (SET KE NOL)</span>
        </button>
      </div>

      {/* School Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-xs">
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <School className="w-4 h-4 text-blue-600" />
            <span>Identitas Resmi Sekolah</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nama Lembaga / Sekolah <span className="text-rose-500">*</span></label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">NPSN</label>
              <input
                type="text"
                value={formData.npsn}
                onChange={(e) => setFormData({ ...formData, npsn: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-mono"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Alamat Lengkap</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nomor Telepon</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Resmi</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>
          </div>
        </div>

        {/* Pejabat Penandatangan */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 mb-3">
            Pejabat Penandatangan Kuitansi & Laporan
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nama Kepala Sekolah</label>
              <input
                type="text"
                value={formData.principalName}
                onChange={(e) => setFormData({ ...formData, principalName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
              />
              <input
                type="text"
                value={formData.principalNip}
                onChange={(e) => setFormData({ ...formData, principalNip: e.target.value })}
                placeholder="NIP Kepala Sekolah"
                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 font-mono text-[11px] mt-1.5"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nama Bendahara Sekolah</label>
              <input
                type="text"
                value={formData.treasurerName}
                onChange={(e) => setFormData({ ...formData, treasurerName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
              />
              <input
                type="text"
                value={formData.treasurerNip}
                onChange={(e) => setFormData({ ...formData, treasurerNip: e.target.value })}
                placeholder="NIP Bendahara Sekolah"
                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 font-mono text-[11px] mt-1.5"
              />
            </div>
          </div>
        </div>

        {/* Format Nomor & Periode */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 mb-3">
            Tahun Ajaran & Format Nomor Kuitansi
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tahun Ajaran Aktif</label>
              <input
                type="text"
                value={formData.activeAcademicYear}
                onChange={(e) => setFormData({ ...formData, activeAcademicYear: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Prefix Kuitansi</label>
              <input
                type="text"
                value={formData.receiptPrefix}
                onChange={(e) => setFormData({ ...formData, receiptPrefix: e.target.value })}
                placeholder="KAS"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Prefix Pengeluaran</label>
              <input
                type="text"
                value={formData.expensePrefix}
                onChange={(e) => setFormData({ ...formData, expensePrefix: e.target.value })}
                placeholder="OUT"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Prefix Pemasukan Lain</label>
              <input
                type="text"
                value={formData.incomePrefix}
                onChange={(e) => setFormData({ ...formData, incomePrefix: e.target.value })}
                placeholder="INC"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20 active:scale-95 transition"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan Identitas</span>
          </button>
        </div>
      </form>

      {/* Firebase Cloud & Vercel Publishing Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Konektivitas Cloud Database (Firebase)</h3>
              <p className="text-[11px] text-slate-500">Penyimpanan online Firestore, Authentication, dan hosting Vercel</p>
            </div>
          </div>

          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
            isFirebaseConfigured
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-blue-100 text-blue-800'
          }`}>
            <CheckCircle2 className="w-3.5 h-3.5" />
            {isFirebaseConfigured ? 'Firebase Live Connected' : 'Offline-First Local Storage Engine Aktif'}
          </span>
        </div>

        <p className="text-slate-600 leading-relaxed">
          Aplikasi saat ini berjalan menggunakan <strong>Offline-First Local Storage Engine</strong> dengan data tersimpan aman di browser Anda dan siap dipakai langsung. Anda dapat memasukkan API Key Firebase Anda kapan saja di bawah ini untuk sinkronisasi cloud multi-perangkat.
        </p>

        <form onSubmit={handleSaveFirebaseConfig} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
          <span className="font-bold text-slate-800 block text-xs">Konfigurasi Firebase Proyek Anda (Opsional):</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Firebase API Key</label>
              <input
                type="text"
                value={firebaseConfig.apiKey}
                onChange={(e) => setFirebaseConfig({ ...firebaseConfig, apiKey: e.target.value })}
                placeholder="AIzaSy..."
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-mono text-[11px]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Project ID</label>
              <input
                type="text"
                value={firebaseConfig.projectId}
                onChange={(e) => setFirebaseConfig({ ...firebaseConfig, projectId: e.target.value })}
                placeholder="sikas-siswa-xxx"
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-mono text-[11px]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Auth Domain</label>
              <input
                type="text"
                value={firebaseConfig.authDomain}
                onChange={(e) => setFirebaseConfig({ ...firebaseConfig, authDomain: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-mono text-[11px]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Storage Bucket</label>
              <input
                type="text"
                value={firebaseConfig.storageBucket}
                onChange={(e) => setFirebaseConfig({ ...firebaseConfig, storageBucket: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-mono text-[11px]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-sm transition"
            >
              Simpan Konfigurasi Firebase
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
