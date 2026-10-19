import React, { useState, useMemo } from 'react';
import {
  CreditCard,
  Search,
  Plus,
  CheckCircle2,
  Clock,
  Printer,
  FileSpreadsheet,
  FileText,
  Filter,
  Eye,
  Check,
  X,
  AlertCircle,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatRupiah, terbilang } from '../utils/currency';
import { formatDate } from '../utils/dates';
import ReceiptModal from '../components/common/ReceiptModal';
import Modal from '../components/common/Modal';
import { exportToExcel, exportToPDF } from '../services/exportService';

export default function Payments({ isQuickModalOpen, setIsQuickModalOpen }) {
  const {
    payments,
    students,
    invoices,
    accounts,
    school,
    recordPayment,
    verifyPayment,
    currentUser
  } = useApp();

  // Active tab in Payments page: 'all' | 'pending'
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState('all');
  const [filterMethod, setFilterMethod] = useState('all');

  // Receipt Modal
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // New Payment Form Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedInvoiceId, setSelectedInvoiceId] = useState('');
  const [payerName, setPayerName] = useState('');
  const [payerType, setPayerType] = useState('Wali Murid');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('cash'); // 'cash' | 'transfer'
  const [accountId, setAccountId] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [notes, setNotes] = useState('');

  // Selected student's unpaid invoices
  const studentInvoices = useMemo(() => {
    if (!selectedStudentId) return [];
    return invoices.filter(inv => inv.studentId === selectedStudentId && inv.status !== 'Lunas');
  }, [selectedStudentId, invoices]);

  // Handle student selection in form
  const handleSelectStudent = (stId) => {
    setSelectedStudentId(stId);
    const st = students.find(s => s.id === stId);
    if (st) {
      setPayerName(st.parentName || st.name);
      // Auto-select first unpaid invoice if available
      const unpaid = invoices.filter(inv => inv.studentId === stId && inv.status !== 'Lunas');
      if (unpaid.length > 0) {
        setSelectedInvoiceId(unpaid[0].id);
        setAmount(unpaid[0].remainingAmount);
      } else {
        setSelectedInvoiceId('');
        setAmount('');
      }
    }
  };

  // Set default account when method changes
  const handleMethodChange = (newMethod) => {
    setMethod(newMethod);
    if (newMethod === 'cash') {
      const cashAcc = accounts.find(a => a.type === 'cash');
      if (cashAcc) setAccountId(cashAcc.id);
    } else {
      const bankAcc = accounts.find(a => a.type === 'bank');
      if (bankAcc) setAccountId(bankAcc.id);
    }
  };

  // Open modal handler
  const handleOpenNewPayment = () => {
    if (students.length > 0) {
      const defaultStudent = students[0];
      handleSelectStudent(defaultStudent.id);
      const cashAcc = accounts.find(a => a.type === 'cash');
      if (cashAcc) setAccountId(cashAcc.id);
      setMethod('cash');
      setReferenceNumber('');
      setNotes('');
    }
    setIsModalOpen(true);
  };

  // Submit payment
  const handleSubmitPayment = (e) => {
    e.preventDefault();
    if (!selectedStudentId) {
      alert('Silakan pilih siswa terlebih dahulu.');
      return;
    }
    if (!amount || parseInt(amount, 10) <= 0) {
      alert('Nominal pembayaran harus lebih besar dari 0.');
      return;
    }
    if (!accountId) {
      alert('Silakan pilih akun kas / bank penerima.');
      return;
    }

    const createdPayment = recordPayment({
      studentId: selectedStudentId,
      invoiceId: selectedInvoiceId,
      amount: parseInt(amount, 10),
      method,
      accountId,
      payerName,
      payerType,
      referenceNumber,
      notes
    });

    if (createdPayment) {
      setIsModalOpen(false);
      // Automatically pop up the receipt modal!
      setSelectedReceipt(createdPayment);
    }
  };

  // Filtered payments list
  const filteredPayments = useMemo(() => {
    return payments.filter(p => {
      // Tab filter
      if (activeTab === 'pending' && p.status !== 'pending') return false;

      // Class filter
      if (filterClass !== 'all' && p.className !== filterClass) return false;

      // Method filter
      if (filterMethod !== 'all' && p.method !== filterMethod) return false;

      // Search query
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchName = p.studentName.toLowerCase().includes(q);
        const matchReceipt = p.receiptNumber.toLowerCase().includes(q);
        const matchPayer = p.payerName.toLowerCase().includes(q);
        const matchClass = p.className.toLowerCase().includes(q);
        return matchName || matchReceipt || matchPayer || matchClass;
      }

      return true;
    });
  }, [payments, activeTab, filterClass, filterMethod, searchQuery]);

  // Export handlers
  const handleExportExcel = () => {
    const data = filteredPayments.map(p => ({
      'No Kuitansi': p.receiptNumber,
      'Tanggal': p.paymentDate,
      'Nama Siswa': p.studentName,
      'Kelas': p.className,
      'Pembayar': `${p.payerName} (${p.payerType})`,
      'Jenis Kas': p.feeName,
      'Metode': p.method === 'cash' ? 'Tunai' : 'Transfer',
      'Akun Kas': p.accountName,
      'Nominal (Rp)': p.amount,
      'Status': p.status === 'verified' ? 'Sah' : 'Pending',
      'Petugas': p.recordedBy
    }));
    exportToExcel(data, 'Riwayat_Pembayaran_Kas_Siswa');
  };

  const handleExportPDF = () => {
    const columns = ['No Kuitansi', 'Tanggal', 'Nama Siswa', 'Kelas', 'Metode', 'Nominal', 'Status'];
    const data = filteredPayments.map(p => [
      p.receiptNumber,
      formatDate(p.paymentDate, 'short'),
      p.studentName,
      p.className,
      p.method === 'cash' ? 'Tunai' : 'Transfer',
      formatRupiah(p.amount),
      p.status === 'verified' ? 'SAH' : 'PENDING'
    ]);
    exportToPDF({
      title: 'Laporan Penerimaan Pembayaran Kas Siswa',
      subtitle: `Total: ${filteredPayments.length} Transaksi | Dicetak oleh: ${currentUser.name}`,
      schoolInfo: school,
      columns,
      data,
      fileName: 'Penerimaan_Kas_Siswa'
    });
  };

  const pendingCount = payments.filter(p => p.status === 'pending').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <CreditCard className="w-6 h-6 text-blue-600" />
            <span>Pembayaran Kas Siswa</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pencatatan uang masuk kas siswa via Tunai (Cash) & Transfer Bank, cetak kuitansi, dan verifikasi
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
            onClick={handleExportPDF}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
          >
            <FileText className="w-4 h-4 text-rose-600" />
            PDF
          </button>
          <button
            onClick={handleOpenNewPayment}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Terima Pembayaran Kas</span>
          </button>
        </div>
      </div>

      {/* Tabs & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        {/* Tabs */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition ${
                activeTab === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Semua Pembayaran ({payments.length})
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition flex items-center gap-1.5 ${
                activeTab === 'pending'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Perlu Verifikasi Mutasi</span>
              {pendingCount > 0 && (
                <span className="px-1.5 py-0.2 bg-white text-amber-600 rounded-full text-[10px] font-black">
                  {pendingCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama siswa, NISN, no kuitansi, atau wali..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:outline-none transition"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:outline-none transition"
            >
              <option value="all">Semua Kelas</option>
              <option value="5A">Kelas 5A</option>
              <option value="5B">Kelas 5B</option>
              <option value="4A">Kelas 4A</option>
              <option value="6A">Kelas 6A</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:outline-none transition"
            >
              <option value="all">Semua Metode</option>
              <option value="cash">Tunai (Cash)</option>
              <option value="transfer">Transfer Bank</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 pl-4">No. Kuitansi</th>
                <th className="py-3.5">Tanggal</th>
                <th className="py-3.5">Siswa / Kelas</th>
                <th className="py-3.5">Pembayar</th>
                <th className="py-3.5">Jenis Tagihan</th>
                <th className="py-3.5">Metode & Akun</th>
                <th className="py-3.5 text-right">Nominal</th>
                <th className="py-3.5 text-center">Status</th>
                <th className="py-3.5 text-right pr-4">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <p className="text-sm font-semibold">Belum ada transaksi pembayaran yang cocok.</p>
                    <p className="text-xs text-slate-400 mt-1">Gunakan tombol "+ Terima Pembayaran Kas" untuk mencatat pembayaran baru.</p>
                  </td>
                </tr>
              ) : (
                filteredPayments.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 pl-4 font-mono font-bold text-blue-600">
                      {p.receiptNumber}
                    </td>
                    <td className="py-3.5 text-slate-600">{formatDate(p.paymentDate, 'short')}</td>
                    <td className="py-3.5">
                      <p className="font-bold text-slate-900">{p.studentName}</p>
                      <span className="text-[11px] text-slate-500">Kelas {p.className}</span>
                    </td>
                    <td className="py-3.5 text-slate-700">
                      <p className="font-medium">{p.payerName}</p>
                      <span className="text-[10px] text-slate-400">{p.payerType}</span>
                    </td>
                    <td className="py-3.5 text-slate-600 max-w-[160px] truncate">
                      {p.feeName}
                    </td>
                    <td className="py-3.5">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                        p.method === 'cash' ? 'bg-amber-50 text-amber-800' : 'bg-blue-50 text-blue-800'
                      }`}>
                        {p.method === 'cash' ? '💵 Tunai' : '💳 Transfer'}
                      </span>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">{p.accountName}</p>
                    </td>
                    <td className="py-3.5 text-right font-black text-slate-900">
                      {formatRupiah(p.amount)}
                    </td>
                    <td className="py-3.5 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        p.status === 'verified'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800 animate-pulse'
                      }`}>
                        {p.status === 'verified' ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            SAH
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3" />
                            PENDING
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-3.5 text-right pr-4">
                      <div className="flex items-center justify-end gap-1">
                        {p.status === 'pending' && (
                          <button
                            onClick={() => verifyPayment(p.id)}
                            className="px-2.5 py-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition"
                            title="Verifikasi Mutasi Bank"
                          >
                            Verifikasi
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedReceipt(p)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Cetak Kuitansi"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Terima Pembayaran Kas Siswa (Praktis & Lengkap) */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Formulir Penerimaan Kas Siswa"
        subtitle="Alur cepat pencatatan pembayaran kas siswa secara tunai maupun transfer bank"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmitPayment} className="space-y-4 text-xs">
          {/* Step 1: Cari & Pilih Siswa */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              1. Pilih Siswa Pembayar <span className="text-rose-500">*</span>
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => handleSelectStudent(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            >
              <option value="">-- Pilih Nama Siswa --</option>
              {students.map(st => (
                <option key={st.id} value={st.id}>
                  {st.name} ({st.className} - NIS: {st.nis}) - Wali: {st.parentName}
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: Pilih Tagihan Kas */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              2. Tagihan yang Dibayarkan <span className="text-rose-500">*</span>
            </label>
            {studentInvoices.length > 0 ? (
              <select
                value={selectedInvoiceId}
                onChange={(e) => {
                  setSelectedInvoiceId(e.target.value);
                  const inv = studentInvoices.find(i => i.id === e.target.value);
                  if (inv) setAmount(inv.remainingAmount);
                }}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              >
                {studentInvoices.map(inv => (
                  <option key={inv.id} value={inv.id}>
                    {inv.feeName} ({inv.periodName}) — Tagihan: {formatRupiah(inv.amount)}, Sisa: {formatRupiah(inv.remainingAmount)}
                  </option>
                ))}
              </select>
            ) : (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800">
                Siswa ini tidak memiliki tagihan tertunggak (atau akan dicatat sebagai kas bebas/sukarela).
              </div>
            )}
          </div>

          {/* Pembayar & Jenis Pembayar */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Pembayar</label>
              <input
                type="text"
                value={payerName}
                onChange={(e) => setPayerName(e.target.value)}
                placeholder="Nama penyetor..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Hubungan Pembayar</label>
              <select
                value={payerType}
                onChange={(e) => setPayerType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="Wali Murid">Wali Murid</option>
                <option value="Siswa Sendiri">Siswa Sendiri</option>
                <option value="Keluarga / Kerabat">Keluarga / Kerabat</option>
              </select>
            </div>
          </div>

          {/* Nominal Pembayaran */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              3. Nominal Pembayaran Diterima (Rp) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Contoh: 25000"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-base font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
              min="1000"
            />
            {amount > 0 && (
              <p className="mt-1 text-[11px] italic text-blue-600 font-medium">
                Terbilang: {terbilang(amount)}
              </p>
            )}
          </div>

          {/* Metode & Akun Kas Tujuan */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                4. Metode Pembayaran <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleMethodChange('cash')}
                  className={`py-2 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition ${
                    method === 'cash'
                      ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>💵 Tunai</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleMethodChange('transfer')}
                  className={`py-2 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition ${
                    method === 'transfer'
                      ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>💳 Transfer</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Akun Kas Penerima <span className="text-rose-500">*</span>
              </label>
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              >
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} ({acc.bankName})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Transfer Reference (Optional for bank transfer) */}
          {method === 'transfer' && (
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nomor Referensi Transfer Bank (Opsional)
              </label>
              <input
                type="text"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                placeholder="Contoh: REF-BSI-992812 atau 4 digit akhir rekening"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          )}

          {/* Catatan / Keterangan */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Keterangan / Catatan</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Catatan tambahan pembayaran kas..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/25 transition active:scale-95"
            >
              Simpan & Cetak Kuitansi
            </button>
          </div>
        </form>
      </Modal>

      {/* Official Receipt Modal */}
      <ReceiptModal
        isOpen={Boolean(selectedReceipt)}
        onClose={() => setSelectedReceipt(null)}
        payment={selectedReceipt}
        student={students.find(s => s.id === selectedReceipt?.studentId)}
        invoice={invoices.find(inv => inv.id === selectedReceipt?.invoiceId)}
      />
    </div>
  );
}
