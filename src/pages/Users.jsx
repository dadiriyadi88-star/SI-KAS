import React from 'react';
import { ShieldCheck, UserCheck, Check, X, Shield, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Users() {
  const { users, currentUser, setCurrentUser, showToast } = useApp();

  const permissionsMatrix = [
    { name: 'Melihat Dashboard & Statistik Ringkas', superAdmin: true, kepsek: true, bendahara: true, petugas: true, auditor: true },
    { name: 'Mencatat Pembayaran Kas Siswa & Cetak Kuitansi', superAdmin: true, kepsek: false, bendahara: true, petugas: true, auditor: false },
    { name: 'Verifikasi Mutasi Transfer Bank Masuk', superAdmin: true, kepsek: false, bendahara: true, petugas: false, auditor: false },
    { name: 'Mencatat Pemasukan Lain (Sumbangan/Donasi)', superAdmin: true, kepsek: false, bendahara: true, petugas: false, auditor: false },
    { name: 'Mencatat Pengeluaran Kas (Belanja & Nota)', superAdmin: true, kepsek: false, bendahara: true, petugas: false, auditor: false },
    { name: 'Menyetujui Pengeluaran Kas Sekolah', superAdmin: true, kepsek: true, bendahara: false, petugas: false, auditor: false },
    { name: 'Melakukan Transfer Internal Antar-Akun', superAdmin: true, kepsek: false, bendahara: true, petugas: false, auditor: false },
    { name: 'Melakukan Audit Rekonsiliasi Fisik Kas & Bank', superAdmin: true, kepsek: true, bendahara: true, petugas: false, auditor: true },
    { name: 'Melihat Laporan Keuangan Lengkap & Ekspor', superAdmin: true, kepsek: true, bendahara: true, petugas: false, auditor: true },
    { name: 'Menutup & Mengunci Periode Pembukuan', superAdmin: true, kepsek: true, bendahara: false, petugas: false, auditor: false },
    { name: 'Konfigurasi Sekolah, Akun Kas, & Pengguna', superAdmin: true, kepsek: false, bendahara: false, petugas: false, auditor: false }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-blue-600" />
            <span>Pengguna & Hak Akses (RBAC)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manajemen peran pengguna, simulasi izin akses (Role-Based Access Control), dan jejak otorisasi
          </p>
        </div>
      </div>

      {/* User Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {users.map(u => {
          const isActive = currentUser.id === u.id;
          return (
            <div
              key={u.id}
              className={`p-4 rounded-2xl border transition relative flex flex-col justify-between ${
                isActive
                  ? 'bg-blue-50/50 border-blue-500 shadow-md ring-2 ring-blue-500/20'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                    {u.name.charAt(0)}
                  </div>
                  {isActive && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white">
                      Aktif
                    </span>
                  )}
                </div>

                <h3 className="text-xs font-bold text-slate-900 leading-tight">{u.name}</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">{u.email}</p>
                <div className="mt-2">
                  <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    {u.role}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setCurrentUser(u);
                  showToast(`Berhasil beralih peran ke ${u.name} (${u.role})`);
                }}
                disabled={isActive}
                className={`w-full mt-4 py-1.5 px-3 rounded-xl text-xs font-bold transition ${
                  isActive
                    ? 'bg-blue-600 text-white cursor-default'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {isActive ? 'Sedang Dipakai' : 'Ganti ke Akun Ini'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Permissions Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-slate-900">Matriks Hak Akses Kewenangan SIKAS SISWA</h3>
          <p className="text-xs text-slate-500">Standar pemisahan tugas pembukuan (Separation of Duties) untuk mencegah kecurangan</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-3">Fitur / Hak Akses Sistem</th>
                <th className="py-3 px-2 text-center text-purple-700">Super Admin</th>
                <th className="py-3 px-2 text-center text-emerald-700">Kepala Sekolah</th>
                <th className="py-3 px-2 text-center text-blue-700">Bendahara</th>
                <th className="py-3 px-2 text-center text-amber-700">Petugas Kas</th>
                <th className="py-3 px-2 text-center text-slate-700">Auditor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {permissionsMatrix.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-medium text-slate-800">{item.name}</td>
                  <td className="py-2.5 px-2 text-center">
                    {item.superAdmin ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    {item.kepsek ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    {item.bendahara ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    {item.petugas ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    {item.auditor ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
