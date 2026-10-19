import React, { useState, useMemo } from 'react';
import {
  FileText,
  Plus,
  Zap,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  Calendar,
  FileSpreadsheet
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatRupiah } from '../utils/currency';
import { formatDate } from '../utils/dates';
import Modal from '../components/common/Modal';
import { exportToExcel } from '../services/exportService';

export default function Invoices() {
  const {
    invoices,
    setInvoices,
    feeTypes,
    classes,
    students,
    generateBulkInvoices,
    logAudit,
    showToast
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterClass, setFilterClass] = useState('all');
  const [filterFeeType, setFilterFeeType] = useState('all');

  // Bulk Generator Modal State
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkFeeTypeId, setBulkFeeTypeId] = useState(feeTypes[0]?.id || '');
  const [bulkPeriodName, setBulkPeriodName] = useState('November 2026');
  const [bulkClassId, setBulkClassId] = useState('all');
  const [bulkDueDate, setBulkDueDate] = useState('2026-11-10');

  // Single Invoice Modal State
  const [isSingleModalOpen, setIsSingleModalOpen] = useState(false);
  const [singleStudentId, setSingleStudentId] = useState('');
  const [singleFeeTypeId, setSingleFeeTypeId] = useState(feeTypes[0]?.id || '');
  const [singlePeriodName, setSinglePeriodName] = useState('');
  const [singleAmount, setSingleAmount] = useState('');
  const [singleDueDate, setSingleDueDate] = useState('');

  // Filtered Invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      if (filterStatus !== 'all' && inv.status !== filterStatus) return false;
      if (filterClass !== 'all' && inv.className !== filterClass) return false;
      if (filterFeeType !== 'all' && inv.feeTypeId !== filterFeeType) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchName = inv.studentName.toLowerCase().includes(q);
        const matchNumber = inv.invoiceNumber.toLowerCase().includes(q);
        const matchPeriod = inv.periodName.toLowerCase().includes(q);
        return matchName || matchNumber || matchPeriod;
      }
      return true;
    });
  }, [invoices, filterStatus, filterClass, filterFeeType, searchQuery]);

  // Handle Bulk Generation
  const handleGenerateBulk = (e) => {
    e.preventDefault();
    generateBulkInvoices({
      feeTypeId: bulkFeeTypeId,
      periodName: bulkPeriodName,
      classId: bulkClassId,
      dueDate: bulkDueDate
    });
    setIsBulkModalOpen(false);
  };

  // Handle Single Invoice Submission
  const handleCreateSingle = (e) => {
    e.preventDefault();
    const st = students.find(s => s.id === singleStudentId);
    const fee = feeTypes.find(f => f.id === singleFeeTypeId);
    if (!st || !fee) return;

    const amt = parseInt(singleAmount, 10) || fee.amount;
    const newInv = {
      id: `inv_${Date.now()}`,
      invoiceNumber: `TAG-${new Date().getFullYear()}-${invoices.length + 1}`,
      feeTypeId: fee.id,
      feeName: fee.name,
      periodName: singlePeriodName || 'Oktober 2026',
      studentId: st.id,
      studentName: st.name,
      classId: st.classId,
      className: st.className,
      amount: amt,
      paidAmount: 0,
      remainingAmount: amt,
      dueDate: singleDueDate || new Date().toISOString().split('T')[0],
      status: 'Belum Bayar'
    };

    setInvoices(prev => [newInv, ...prev]);
    logAudit('Buat Tagihan', `Tagihan ${newInv.invoiceNumber} untuk ${st.name}`);
    showToast(`Tagihan ${newInv.invoiceNumber} berhasil dibuat!`);
    setIsSingleModalOpen(false);
  };

  const handleExportExcel = () => {
    const data = filteredInvoices.map(inv => ({
      'No Tagihan': inv.invoiceNumber,
      'Nama Siswa': inv.studentName,
      'Kelas': inv.className,
      'Jenis Kas': inv.feeName,
      'Periode': inv.periodName,
      'Total Tagihan (Rp)': inv.amount,
      'Terbayar (Rp)': inv.paidAmount,
      'Sisa Tagihan (Rp)': inv.remainingAmount,
      'Jatuh Tempo': inv.dueDate,
      'Status': inv.status
    }));
    exportToExcel(data, 'Daftar_Tagihan_Kas_Siswa');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-blue-600" />
            <span>Tagihan Kas Siswa</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Penetapan nominal kas, pembuatan tagihan massal per periode, dan pemantauan status pelunasan
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
            onClick={() => setIsSingleModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition"
          >
            <Plus className="w-4 h-4" />
            + Tagihan Tunggal
          </button>
          <button
            onClick={() => setIsBulkModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition active:scale-95"
          >
            <Zap className="w-4 h-4" />
            <span>Generate Tagihan Massal</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama siswa, no tagihan, atau periode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:outline-none transition"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:outline-none transition"
            >
              <option value="all">Semua Status Tagihan</option>
              <option value="Belum Bayar">Belum Bayar</option>
              <option value="Cicilan">Cicilan</option>
              <option value="Lunas">Lunas</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:outline-none transition"
            >
              <option value="all">Semua Kelas</option>
              {classes.map(c => (
                <option key={c.id} value={c.name}>Kelas {c.name}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <select
              value={filterFeeType}
              onChange={(e) => setFilterFeeType(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:outline-none transition"
            >
              <option value="all">Semua Jenis Kas</option>
              {feeTypes.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 pl-4">No. Tagihan</th>
                <th className="py-3.5">Nama Siswa</th>
                <th className="py-3.5">Kelas</th>
                <th className="py-3.5">Jenis Kas & Periode</th>
                <th className="py-3.5">Jatuh Tempo</th>
                <th className="py-3.5 text-right">Nominal</th>
                <th className="py-3.5 text-right">Terbayar</th>
                <th className="py-3.5 text-right">Sisa Tagihan</th>
                <th className="py-3.5 text-center pr-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    Tidak ada tagihan yang sesuai kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 pl-4 font-mono font-bold text-slate-700">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-3.5 font-bold text-slate-900">{inv.studentName}</td>
                    <td className="py-3.5">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                        {inv.className}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <p className="font-semibold text-slate-800">{inv.feeName}</p>
                      <span className="text-[10px] text-slate-500">{inv.periodName}</span>
                    </td>
                    <td className="py-3.5 text-slate-600">{formatDate(inv.dueDate, 'short')}</td>
                    <td className="py-3.5 text-right font-medium text-slate-800">
                      {formatRupiah(inv.amount)}
                    </td>
                    <td className="py-3.5 text-right font-medium text-emerald-600">
                      {formatRupiah(inv.paidAmount || 0)}
                    </td>
                    <td className="py-3.5 text-right font-black text-rose-600">
                      {formatRupiah(inv.remainingAmount || 0)}
                    </td>
                    <td className="py-3.5 text-center pr-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        inv.status === 'Lunas'
                          ? 'bg-emerald-100 text-emerald-800'
                          : inv.status === 'Cicilan'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Generate Bulk Invoices */}
      <Modal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        title="Generate Tagihan Massal Kas Siswa"
        subtitle="Buat tagihan kas untuk seluruh siswa aktif atau kelas tertentu sekaligus tanpa risiko duplikasi"
      >
        <form onSubmit={handleGenerateBulk} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Pilih Jenis Kas <span className="text-rose-500">*</span></label>
            <select
              value={bulkFeeTypeId}
              onChange={(e) => setBulkFeeTypeId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            >
              {feeTypes.map(f => (
                <option key={f.id} value={f.id}>
                  {f.name} — {formatRupiah(f.amount)} / {f.frequency}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Periode Tagihan <span className="text-rose-500">*</span></label>
              <input
                type="text"
                value={bulkPeriodName}
                onChange={(e) => setBulkPeriodName(e.target.value)}
                placeholder="Contoh: November 2026"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tanggal Jatuh Tempo <span className="text-rose-500">*</span></label>
              <input
                type="date"
                value={bulkDueDate}
                onChange={(e) => setBulkDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Berlaku Untuk Kelas</label>
            <select
              value={bulkClassId}
              onChange={(e) => setBulkClassId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300"
            >
              <option value="all">Seluruh Siswa Aktif Semua Kelas</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>Khusus Kelas {c.name}</option>
              ))}
            </select>
          </div>

          <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-blue-900 leading-relaxed text-[11px]">
            💡 <strong>Pencegahan Duplikasi Otomatis:</strong> Siswa yang sudah memiliki tagihan untuk jenis kas dan periode yang sama tidak akan dibuatkan tagihan ganda.
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsBulkModalOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-sm active:scale-95"
            >
              Proses Generate Tagihan
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Single Invoice */}
      <Modal
        isOpen={isSingleModalOpen}
        onClose={() => setIsSingleModalOpen(false)}
        title="Buat Tagihan Kas Tunggal"
        subtitle="Buat tagihan khusus untuk satu siswa tertentu"
      >
        <form onSubmit={handleCreateSingle} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Pilih Siswa <span className="text-rose-500">*</span></label>
            <select
              value={singleStudentId}
              onChange={(e) => setSingleStudentId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
              required
            >
              <option value="">-- Pilih Siswa --</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.className})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Jenis Kas <span className="text-rose-500">*</span></label>
            <select
              value={singleFeeTypeId}
              onChange={(e) => {
                setSingleFeeTypeId(e.target.value);
                const f = feeTypes.find(ft => ft.id === e.target.value);
                if (f) setSingleAmount(f.amount);
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
              required
            >
              {feeTypes.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Periode</label>
              <input
                type="text"
                value={singlePeriodName}
                onChange={(e) => setSinglePeriodName(e.target.value)}
                placeholder="Contoh: Oktober 2026"
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nominal (Rp)</label>
              <input
                type="number"
                value={singleAmount}
                onChange={(e) => setSingleAmount(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                required
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsSingleModalOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
            >
              Buat Tagihan
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
