import React, { useState } from 'react';
import {
  CheckSquare,
  Lock,
  Unlock,
  Plus,
  ShieldCheck,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatRupiah } from '../utils/currency';
import { formatDate } from '../utils/dates';
import Modal from '../components/common/Modal';

export default function PeriodClosing() {
  const { periodClosings, setPeriodClosings, accounts, totals, currentUser, school, logAudit, showToast } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    periodName: 'Oktober 2026',
    startDate: '2026-10-01',
    endDate: '2026-10-31',
    notes: 'Penutupan buku kas rutin bulan berjalan telah selesai diverifikasi oleh bendahara dan kepala sekolah.'
  });

  const handleClosePeriod = (e) => {
    e.preventDefault();

    const initialBal = accounts.reduce((sum, a) => sum + (a.initialBalance || 0), 0);

    const newClosing = {
      id: `close_${Date.now()}`,
      periodName: formData.periodName,
      startDate: formData.startDate,
      endDate: formData.endDate,
      initialBalance: initialBal,
      totalIncome: totals.totalIncome,
      totalExpense: totals.totalExpense,
      closingBalance: totals.totalBalance,
      totalArrears: totals.totalArrears,
      closedBy: `${currentUser.name} (${currentUser.role})`,
      closedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      isLocked: true,
      notes: formData.notes
    };

    setPeriodClosings(prev => [newClosing, ...prev]);
    logAudit('Tutup Buku Periode', `Mengunci buku kas periode ${formData.periodName}`);
    showToast(`Buku kas periode ${formData.periodName} berhasil ditutup dan dikunci!`);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <CheckSquare className="w-6 h-6 text-blue-600" />
            <span>Laporan Akhir Periode & Tutup Buku</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Verifikasi saldo akhir, simpan ringkasan pembukuan bulanan/tahunan, dan kunci periode dari pengeditan ilegal
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition active:scale-95"
        >
          <Lock className="w-4 h-4" />
          <span>+ Tutup Buku Periode Ini</span>
        </button>
      </div>

      {/* History of Closed Periods */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {periodClosings.map(cp => (
          <div key={cp.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Periode Resmi</span>
                <h3 className="text-lg font-extrabold text-slate-900">{cp.periodName}</h3>
                <p className="text-xs text-slate-400">Rentang: {cp.startDate} s/d {cp.endDate}</p>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-emerald-100 text-emerald-800 rounded-full">
                  <Lock className="w-3.5 h-3.5" />
                  TERKUNCI
                </span>
                <p className="text-[10px] text-slate-400 mt-1">{cp.closedAt}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-500 text-[11px]">Total Kas Masuk:</span>
                <p className="font-extrabold text-emerald-600 text-sm mt-0.5">
                  +{formatRupiah(cp.totalIncome)}
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-500 text-[11px]">Total Kas Keluar:</span>
                <p className="font-extrabold text-rose-600 text-sm mt-0.5">
                  -{formatRupiah(cp.totalExpense)}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                <span className="text-blue-700 text-[11px] font-semibold">Saldo Akhir Resmi:</span>
                <p className="font-black text-blue-900 text-base mt-0.5">
                  {formatRupiah(cp.closingBalance)}
                </p>
              </div>
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-100">
                <span className="text-rose-700 text-[11px] font-semibold">Sisa Tagihan (Tunggakan):</span>
                <p className="font-black text-rose-900 text-base mt-0.5">
                  {formatRupiah(cp.totalArrears)}
                </p>
              </div>
            </div>

            <div className="pt-2 text-xs text-slate-600 italic bg-slate-50/60 p-3 rounded-xl border border-slate-100">
              "{cp.notes}"
            </div>

            <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-100">
              <span>Pengesah: {cp.closedBy}</span>
              <span className="text-emerald-600 font-semibold">Dokumen Sah Yayasan</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Tutup Buku */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Pengesahan Penutupan Buku Kas (Tutup Periode)"
        subtitle="Simpan rekapitulasi permanen saldo kas akhir dan kunci perubahan pada periode ini"
      >
        <form onSubmit={handleClosePeriod} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Nama Periode Penutupan <span className="text-rose-500">*</span></label>
            <input
              type="text"
              value={formData.periodName}
              onChange={(e) => setFormData({ ...formData, periodName: e.target.value })}
              placeholder="Contoh: Oktober 2026 atau Semester 1 2026/2027"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tanggal Mulai Periode</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tanggal Akhir Periode</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
                required
              />
            </div>
          </div>

          <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 space-y-1">
            <span className="text-[11px] font-bold text-blue-900 block">Ringkasan Saldo yang Akan Dikunci:</span>
            <div className="flex justify-between text-xs">
              <span>Total Pemasukan Berjalan:</span>
              <span className="font-bold text-emerald-700">{formatRupiah(totals.totalIncome)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Total Pengeluaran Berjalan:</span>
              <span className="font-bold text-rose-700">{formatRupiah(totals.totalExpense)}</span>
            </div>
            <div className="flex justify-between text-xs border-t border-blue-200 pt-1">
              <span className="font-bold">Saldo Akhir Seluruh Akun Kas:</span>
              <span className="font-extrabold text-blue-800">{formatRupiah(totals.totalBalance)}</span>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Catatan Berita Acara Penutupan</label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Sahkan & Kunci Periode</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
