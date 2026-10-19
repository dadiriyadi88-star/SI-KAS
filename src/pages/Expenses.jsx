import React, { useState, useMemo } from 'react';
import {
  ArrowUpCircle,
  Plus,
  Search,
  FileSpreadsheet,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Tag
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatRupiah, terbilang } from '../utils/currency';
import { formatDate } from '../utils/dates';
import Modal from '../components/common/Modal';
import { exportToExcel, exportToPDF } from '../services/exportService';

export default function Expenses() {
  const {
    expenseTransactions,
    categories,
    accounts,
    computedAccountBalances,
    school,
    recordExpense,
    currentUser
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const expenseCategories = useMemo(() => {
    return categories.filter(c => c.type === 'expense');
  }, [categories]);

  // Form State
  const [formData, setFormData] = useState({
    categoryId: '',
    amount: '',
    accountId: '',
    description: '',
    vendor: '',
    proofNumber: ''
  });

  const handleOpenAdd = () => {
    setFormData({
      categoryId: expenseCategories[0]?.id || '',
      amount: '',
      accountId: accounts[0]?.id || '',
      description: '',
      vendor: '',
      proofNumber: `NOTA-${new Date().getFullYear()}-${String(expenseTransactions.length + 1).padStart(3, '0')}`
    });
    setIsModalOpen(true);
  };

  // Selected account available balance for real-time check in form
  const selectedAccBalance = useMemo(() => {
    if (!formData.accountId) return 0;
    return computedAccountBalances[formData.accountId] || 0;
  }, [formData.accountId, computedAccountBalances]);

  const isBalanceInsufficient = useMemo(() => {
    const amt = parseInt(formData.amount, 10) || 0;
    return amt > selectedAccBalance;
  }, [formData.amount, selectedAccBalance]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || parseInt(formData.amount, 10) <= 0) {
      alert('Nominal harus lebih dari 0.');
      return;
    }

    if (isBalanceInsufficient) {
      alert(`Saldo tidak mencukupi! Saldo akun ${formatRupiah(selectedAccBalance)}, pengeluaran yang diajukan ${formatRupiah(formData.amount)}.`);
      return;
    }

    const res = recordExpense({
      categoryId: formData.categoryId,
      amount: formData.amount,
      accountId: formData.accountId,
      description: formData.description,
      vendor: formData.vendor,
      proofNumber: formData.proofNumber
    });

    if (res) {
      setIsModalOpen(false);
    }
  };

  const filteredExpenses = useMemo(() => {
    return expenseTransactions.filter(exp => {
      if (filterCategory !== 'all' && exp.categoryId !== filterCategory) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          exp.description.toLowerCase().includes(q) ||
          exp.vendor.toLowerCase().includes(q) ||
          exp.transactionNumber.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [expenseTransactions, filterCategory, searchQuery]);

  const totalFilteredExpense = useMemo(() => {
    return filteredExpenses.reduce((s, e) => s + e.amount, 0);
  }, [filteredExpenses]);

  const handleExportExcel = () => {
    const data = filteredExpenses.map(exp => ({
      'No Transaksi': exp.transactionNumber,
      'Tanggal': exp.date,
      'Kategori': exp.categoryName,
      'Uraian': exp.description,
      'Penerima / Toko': exp.vendor,
      'Nominal (Rp)': exp.amount,
      'Sumber Kas': exp.accountName,
      'No Bukti': exp.proofNumber,
      'Status': exp.status,
      'Pencatat': exp.recordedBy,
      'Penyetujui': exp.approvedBy
    }));
    exportToExcel(data, 'Pengeluaran_Kas_Siswa');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <ArrowUpCircle className="w-6 h-6 text-rose-600" />
            <span>Pengeluaran Kas</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pencatatan penggunaan kas siswa dengan validasi saldo kas (saldo tidak boleh negatif) dan bukti nota sah
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            Excel
          </button>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-500/20 transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Catat Pengeluaran Baru</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="w-full sm:w-1/2 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Cari uraian, toko penerima, nomor transaksi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:outline-none transition"
          />
        </div>

        <div className="w-full sm:w-1/3">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:outline-none transition"
          >
            <option value="all">Semua Kategori Pengeluaran</option>
            {expenseCategories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="text-right shrink-0">
          <span className="text-slate-400 text-[11px] block">Total Pengeluaran:</span>
          <span className="font-extrabold text-rose-600 text-sm">{formatRupiah(totalFilteredExpense)}</span>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 pl-4">No. Transaksi</th>
                <th className="py-3.5">Tanggal</th>
                <th className="py-3.5">Kategori</th>
                <th className="py-3.5">Uraian Penggunaan</th>
                <th className="py-3.5">Penerima / Toko</th>
                <th className="py-3.5">Sumber Akun</th>
                <th className="py-3.5 text-right">Nominal</th>
                <th className="py-3.5 text-center">No Bukti</th>
                <th className="py-3.5 text-right pr-4">Persetujuan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    Belum ada pengeluaran kas yang tercatat.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map(exp => (
                  <tr key={exp.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 pl-4 font-mono font-bold text-rose-700">
                      {exp.transactionNumber}
                    </td>
                    <td className="py-3.5 text-slate-600">{formatDate(exp.date, 'short')}</td>
                    <td className="py-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        {exp.categoryName}
                      </span>
                    </td>
                    <td className="py-3.5 font-medium text-slate-800 max-w-xs">{exp.description}</td>
                    <td className="py-3.5 text-slate-600">{exp.vendor}</td>
                    <td className="py-3.5 text-slate-600 font-medium">{exp.accountName}</td>
                    <td className="py-3.5 text-right font-black text-rose-600">
                      -{formatRupiah(exp.amount)}
                    </td>
                    <td className="py-3.5 text-center font-mono text-[11px] text-slate-500">
                      {exp.proofNumber}
                    </td>
                    <td className="py-3.5 text-right pr-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        Disetujui
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Record Expense with Balance Protection */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Catat Pengeluaran Kas Siswa"
        subtitle="Validasi otomatis saldo kas (saldo tidak boleh negatif) dan persetujuan transaksi"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Kategori Pengeluaran <span className="text-rose-500">*</span></label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-rose-500 focus:outline-none"
                required
              >
                {expenseCategories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Sumber Akun Kas <span className="text-rose-500">*</span></label>
              <select
                value={formData.accountId}
                onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-rose-500 focus:outline-none"
                required
              >
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} — Saldo: {formatRupiah(computedAccountBalances[acc.id] || 0)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Saldo Akun Warning Banner */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <span className="text-slate-600 font-medium">Saldo Kas Tersedia di Akun Terpilih:</span>
            <span className="font-extrabold text-blue-700 text-sm">
              {formatRupiah(selectedAccBalance)}
            </span>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Uraian / Tujuan Penggunaan Dana <span className="text-rose-500">*</span></label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Contoh: Pembelian spidol whiteboard 3 box dan kertas HVS laporan kas"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Penerima Uang / Nama Toko <span className="text-rose-500">*</span></label>
              <input
                type="text"
                value={formData.vendor}
                onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                placeholder="Contoh: Toko ATK Sejahtera"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nomor Nota / Kuitansi Belanja</label>
              <input
                type="text"
                value={formData.proofNumber}
                onChange={(e) => setFormData({ ...formData, proofNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Nominal Pengeluaran (Rp) <span className="text-rose-500">*</span></label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="Contoh: 150000"
              className={`w-full px-3 py-2.5 rounded-xl border text-base font-bold focus:outline-none ${
                isBalanceInsufficient
                  ? 'border-rose-500 bg-rose-50/50 text-rose-900 focus:ring-2 focus:ring-rose-500'
                  : 'border-slate-300 text-slate-900 focus:ring-2 focus:ring-rose-500'
              }`}
              required
              min="1000"
            />
            {formData.amount > 0 && !isBalanceInsufficient && (
              <p className="mt-1 text-[11px] italic text-rose-600 font-medium">
                Terbilang: {terbilang(formData.amount)}
              </p>
            )}

            {/* Insufficient balance alert */}
            {isBalanceInsufficient && (
              <div className="mt-2 p-3 bg-rose-50 rounded-xl border border-rose-200 text-rose-800 flex items-start gap-2 text-xs">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Peringatan Saldo Tidak Cukup!</strong>
                  <p>Saldo akun kas saat ini ({formatRupiah(selectedAccBalance)}) lebih kecil dari pengeluaran yang diajukan ({formatRupiah(formData.amount)}). Sistem menolak pengeluaran yang menyebabkan saldo negatif.</p>
                </div>
              </div>
            )}
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
              disabled={isBalanceInsufficient}
              className={`px-5 py-2.5 rounded-xl font-bold shadow-md transition active:scale-95 ${
                isBalanceInsufficient
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/20'
              }`}
            >
              Simpan Pengeluaran
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
