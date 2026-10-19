import React, { useState, useMemo } from 'react';
import {
  ArrowDownCircle,
  Plus,
  Search,
  FileSpreadsheet,
  FileText,
  Calendar,
  Tag
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatRupiah, terbilang } from '../utils/currency';
import { formatDate } from '../utils/dates';
import Modal from '../components/common/Modal';
import { exportToExcel, exportToPDF } from '../services/exportService';

export default function Income() {
  const {
    incomeTransactions,
    categories,
    accounts,
    school,
    recordOtherIncome,
    currentUser
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const incomeCategories = useMemo(() => {
    return categories.filter(c => c.type === 'income');
  }, [categories]);

  // Form State
  const [formData, setFormData] = useState({
    categoryId: '',
    amount: '',
    accountId: '',
    description: '',
    source: '',
    proofNumber: ''
  });

  const handleOpenAdd = () => {
    setFormData({
      categoryId: incomeCategories[0]?.id || '',
      amount: '',
      accountId: accounts[0]?.id || '',
      description: '',
      source: '',
      proofNumber: `BUKTI-${new Date().getFullYear()}-${String(incomeTransactions.length + 1).padStart(3, '0')}`
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || parseInt(formData.amount, 10) <= 0) {
      alert('Nominal harus lebih dari 0.');
      return;
    }

    recordOtherIncome({
      categoryId: formData.categoryId,
      amount: formData.amount,
      accountId: formData.accountId,
      description: formData.description,
      source: formData.source,
      proofNumber: formData.proofNumber
    });

    setIsModalOpen(false);
  };

  const filteredIncome = useMemo(() => {
    return incomeTransactions.filter(inc => {
      if (filterCategory !== 'all' && inc.categoryId !== filterCategory) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          inc.description.toLowerCase().includes(q) ||
          inc.source.toLowerCase().includes(q) ||
          inc.transactionNumber.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [incomeTransactions, filterCategory, searchQuery]);

  const totalFilteredIncome = useMemo(() => {
    return filteredIncome.reduce((s, i) => s + i.amount, 0);
  }, [filteredIncome]);

  const handleExportExcel = () => {
    const data = filteredIncome.map(inc => ({
      'No Transaksi': inc.transactionNumber,
      'Tanggal': inc.date,
      'Kategori': inc.categoryName,
      'Uraian': inc.description,
      'Sumber Penerimaan': inc.source,
      'Nominal (Rp)': inc.amount,
      'Akun Penerima': inc.accountName,
      'No Bukti': inc.proofNumber,
      'Petugas': inc.recordedBy
    }));
    exportToExcel(data, 'Pemasukan_Lain_Kas_Siswa');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <ArrowDownCircle className="w-6 h-6 text-emerald-600" />
            <span>Pemasukan Lain</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pencatatan sumbangan sukarela, infaq kegiatan, pengembalian belanja, atau koreksi saldo sah di luar tagihan siswa
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
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-500/20 transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Catat Pemasukan Baru</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="w-full sm:w-1/2 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Cari uraian, sumber dana, nomor transaksi..."
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
            <option value="all">Semua Kategori Pemasukan</option>
            {incomeCategories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="text-right shrink-0">
          <span className="text-slate-400 text-[11px] block">Total Terfilter:</span>
          <span className="font-extrabold text-emerald-600 text-sm">{formatRupiah(totalFilteredIncome)}</span>
        </div>
      </div>

      {/* Income Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 pl-4">No. Transaksi</th>
                <th className="py-3.5">Tanggal</th>
                <th className="py-3.5">Kategori</th>
                <th className="py-3.5">Uraian / Deskripsi</th>
                <th className="py-3.5">Sumber Dana</th>
                <th className="py-3.5">Akun Tujuan</th>
                <th className="py-3.5 text-right">Nominal</th>
                <th className="py-3.5 text-right pr-4">No Bukti</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredIncome.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    Belum ada data pemasukan lain yang tercatat.
                  </td>
                </tr>
              ) : (
                filteredIncome.map(inc => (
                  <tr key={inc.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 pl-4 font-mono font-bold text-emerald-700">
                      {inc.transactionNumber}
                    </td>
                    <td className="py-3.5 text-slate-600">{formatDate(inc.date, 'short')}</td>
                    <td className="py-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {inc.categoryName}
                      </span>
                    </td>
                    <td className="py-3.5 font-medium text-slate-800 max-w-xs">{inc.description}</td>
                    <td className="py-3.5 text-slate-600">{inc.source}</td>
                    <td className="py-3.5 text-slate-600 font-medium">{inc.accountName}</td>
                    <td className="py-3.5 text-right font-black text-emerald-600">
                      +{formatRupiah(inc.amount)}
                    </td>
                    <td className="py-3.5 text-right pr-4 font-mono text-[11px] text-slate-500">
                      {inc.proofNumber}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Record Other Income */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Catat Pemasukan Kas Lain"
        subtitle="Pemasukan di luar tagihan kas siswa (sumbangan, infaq, pengembalian sisa belanja)"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Kategori Pemasukan <span className="text-rose-500">*</span></label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              >
                {incomeCategories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Akun Kas Penerima <span className="text-rose-500">*</span></label>
              <select
                value={formData.accountId}
                onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              >
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>{acc.name} ({acc.bankName})</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Uraian / Deskripsi Pemasukan <span className="text-rose-500">*</span></label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Contoh: Sumbangan sukarela wali murid untuk proyektor kelas"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Sumber Dana / Donatur <span className="text-rose-500">*</span></label>
              <input
                type="text"
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                placeholder="Contoh: Hamba Allah / Nama Toko"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nomor Bukti Transaksi</label>
              <input
                type="text"
                value={formData.proofNumber}
                onChange={(e) => setFormData({ ...formData, proofNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Nominal Penerimaan (Rp) <span className="text-rose-500">*</span></label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="Contoh: 500000"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-base font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              required
              min="1000"
            />
            {formData.amount > 0 && (
              <p className="mt-1 text-[11px] italic text-emerald-600 font-medium">
                Terbilang: {terbilang(formData.amount)}
              </p>
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
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-500/20 active:scale-95"
            >
              Simpan Pemasukan
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
