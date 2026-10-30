import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Clock,
  Users,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  PlusCircle,
  ArrowRight,
  Filter,
  CreditCard,
  Printer,
  ChevronRight
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useApp } from '../context/AppContext';
import { formatRupiah } from '../utils/currency';
import { formatDate } from '../utils/dates';
import ReceiptModal from '../components/common/ReceiptModal';

export default function Dashboard({ setCurrentTab, onQuickPayment }) {
  const { school, totals, payments, expenseTransactions, students, invoices, accounts, computedAccountBalances } = useApp();

  // Filters
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedClass, setSelectedClass] = useState('all');

  // Receipt modal state
  const [selectedReceiptPayment, setSelectedReceiptPayment] = useState(null);

  // Monthly Chart Data (Jul - Des for active school semester)
  const monthlyData = useMemo(() => {
    const months = [
      { key: '07', name: 'Jul' },
      { key: '08', name: 'Agu' },
      { key: '09', name: 'Sep' },
      { key: '10', name: 'Okt' },
      { key: '11', name: 'Nov' },
      { key: '12', name: 'Des' }
    ];

    return months.map(m => {
      // Calculate income for this month
      const monthPayments = payments
        .filter(p => p.status === 'verified' && p.paymentDate && p.paymentDate.split('-')[1] === m.key)
        .reduce((sum, p) => sum + p.amount, 0);

      // Add other income if any
      const monthExpenses = expenseTransactions
        .filter(e => e.status === 'approved' && e.date && e.date.split('-')[1] === m.key)
        .reduce((sum, e) => sum + e.amount, 0);

      return {
        bulan: m.name,
        Pemasukan: monthPayments,
        Pengeluaran: monthExpenses
      };
    });
  }, [payments, expenseTransactions]);

  // Recent 6 transactions
  const recentTransactions = useMemo(() => {
    return payments.slice(0, 6);
  }, [payments]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Dashboard Keuangan Kas Siswa
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Ringkasan saldo, pemasukan, pengeluaran, dan status pembayaran kas {school.name}
          </p>
        </div>

        {/* Action Shortcuts */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onQuickPayment}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            Catat Pembayaran
          </button>
          <button
            onClick={() => setCurrentTab('cash-reports')}
            className="inline-flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            Cetak Laporan
          </button>
        </div>
      </div>

      {/* Main Financial KPI Cards (Row 1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Pemasukan */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden group hover:border-emerald-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Pemasukan</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-slate-900 tracking-tight">
              {formatRupiah(totals.totalIncome)}
            </p>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-emerald-600 font-medium">
              <span>Kas Siswa & Sumbangan Sah</span>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500" />
        </div>

        {/* Total Pengeluaran */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden group hover:border-rose-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Pengeluaran</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-slate-900 tracking-tight">
              {formatRupiah(totals.totalExpense)}
            </p>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-rose-600 font-medium">
              <span>ATK, Kegiatan, & Kebersihan</span>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-rose-500" />
        </div>

        {/* Saldo Akhir Kas */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden group hover:border-blue-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Saldo Kas (Seluruh Akun)</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-blue-700 tracking-tight">
              {formatRupiah(totals.totalBalance)}
            </p>
            <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
              <span>Tunai: {formatRupiah(totals.totalCashBalance)}</span>
              <span>Bank: {formatRupiah(totals.totalBankBalance)}</span>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600" />
        </div>

        {/* Transaksi Hari Ini */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden group hover:border-purple-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Transaksi Hari Ini</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-slate-900 tracking-tight">
              {totals.todayTransactionsCount} <span className="text-sm font-semibold text-slate-500">Transaksi</span>
            </p>
            <p className="mt-1 text-[11px] text-purple-600 font-medium">
              Tercatat pada {formatDate(new Date(), 'short')}
            </p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-500" />
        </div>
      </div>

      {/* Student Payment Status Summary (Row 2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Siswa Terdata */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/70 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Siswa Aktif Terdata</p>
            <p className="text-lg font-bold text-slate-900">{totals.totalStudents} Siswa</p>
          </div>
        </div>

        {/* Sudah Membayar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/70 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Sudah Lunas</p>
            <p className="text-lg font-bold text-emerald-600">{totals.paidStudentsCount} Siswa</p>
          </div>
        </div>

        {/* Belum Lunas / Tunggakan */}
        <div 
          onClick={() => setCurrentTab('arrears')}
          className="bg-white p-4 rounded-xl border border-rose-200/70 flex items-center gap-3.5 cursor-pointer hover:bg-rose-50/30 transition group"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-slate-500">Siswa Menunggak</p>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
            </div>
            <p className="text-lg font-bold text-rose-600">
              {totals.unpaidStudentsCount} Siswa ({formatRupiah(totals.totalArrears)})
            </p>
          </div>
        </div>

        {/* Transfer Belum Diverifikasi */}
        <div 
          onClick={() => setCurrentTab('payments')}
          className="bg-white p-4 rounded-xl border border-amber-200/70 flex items-center gap-3.5 cursor-pointer hover:bg-amber-50/30 transition group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <FileCheck className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-slate-500">Transfer Belum Verifikasi</p>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
            </div>
            <p className="text-lg font-bold text-amber-600">
              {totals.pendingTransfersCount} Transaksi
            </p>
          </div>
        </div>
      </div>

      {/* Middle Section: Monthly Chart & Cash Accounts Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Comparison Chart (2 Cols) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Grafik Pemasukan vs Pengeluaran</h3>
              <p className="text-xs text-slate-500">Perbandingan arus kas masuk dan keluar per bulan</p>
            </div>
            <span className="text-xs font-medium px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg">
              Semester Ganjil 2026/2027
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="bulan" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis 
                  tickFormatter={(val) => `Rp ${(val / 1000).toFixed(0)}k`} 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                  axisLine={false} 
                  tickLine={false} 
                />
                <Tooltip 
                  formatter={(val) => [formatRupiah(val), '']} 
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', color: '#fff', border: 'none', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="Pemasukan" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={32} />
                <Bar dataKey="Pengeluaran" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Real-time Cash Accounts (1 Col) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">Posisi Akun Kas & Bank</h3>
              <button 
                onClick={() => setCurrentTab('accounts')}
                className="text-xs text-blue-600 font-semibold hover:underline"
              >
                Kelola
              </button>
            </div>

            <div className="space-y-3">
              {accounts.map(acc => {
                const bal = computedAccountBalances[acc.id] || 0;
                return (
                  <div key={acc.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-slate-800">{acc.name}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        acc.type === 'cash' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {acc.type === 'cash' ? 'KAS TUNAI' : 'BANK'}
                      </span>
                    </div>
                    <p className="text-base font-extrabold text-slate-900">
                      {formatRupiah(bal)}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {acc.bankName} {acc.accountNumber !== '-' && `• ${acc.accountNumber}`}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => setCurrentTab('reconciliation')}
            className="w-full mt-4 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition"
          >
            <span>Rekonsiliasi & Transfer Antar-Akun</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom Section: Recent Payments Ledger */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Penerimaan Pembayaran Kas Terbaru</h3>
            <p className="text-xs text-slate-500">Daftar transaksi kas siswa yang baru dicatat</p>
          </div>
          <button
            onClick={() => setCurrentTab('payments')}
            className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
          >
            <span>Lihat Semua Pembayaran</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="pb-3 pl-2">No. Kuitansi</th>
                <th className="pb-3">Tanggal</th>
                <th className="pb-3">Nama Siswa</th>
                <th className="pb-3">Kelas</th>
                <th className="pb-3">Jenis Kas</th>
                <th className="pb-3">Metode</th>
                <th className="pb-3 text-right">Nominal</th>
                <th className="pb-3 text-center">Status</th>
                <th className="pb-3 text-right pr-2">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentTransactions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-slate-400">
                    <p className="font-semibold text-sm">Belum ada transaksi pembayaran kas yang tercatat.</p>
                    <p className="text-xs text-slate-400 mt-1">Sistem saat ini bersih (NOL). Klik tombol "+ Catat Pembayaran" di atas untuk memulai transaksi pertama.</p>
                  </td>
                </tr>
              ) : (
                recentTransactions.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 pl-2 font-mono font-bold text-blue-600">
                      {p.receiptNumber}
                    </td>
                    <td className="py-3 text-slate-600">{formatDate(p.paymentDate, 'short')}</td>
                    <td className="py-3 font-semibold text-slate-900">{p.studentName}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                        {p.className}
                      </span>
                    </td>
                    <td className="py-3 text-slate-600">{p.feeName}</td>
                    <td className="py-3 capitalize text-slate-700">
                      {p.method === 'cash' ? '💵 Tunai' : '💳 Transfer'}
                    </td>
                    <td className="py-3 font-bold text-slate-900 text-right">
                      {formatRupiah(p.amount)}
                    </td>
                    <td className="py-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.status === 'verified'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {p.status === 'verified' ? 'SAH' : 'PENDING'}
                      </span>
                    </td>
                    <td className="py-3 text-right pr-2">
                      <button
                        onClick={() => setSelectedReceiptPayment(p)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Lihat Kuitansi"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Receipt Modal */}
      <ReceiptModal
        isOpen={Boolean(selectedReceiptPayment)}
        onClose={() => setSelectedReceiptPayment(null)}
        payment={selectedReceiptPayment}
        student={students.find(s => s.id === selectedReceiptPayment?.studentId)}
        invoice={invoices.find(inv => inv.id === selectedReceiptPayment?.invoiceId)}
      />
    </div>
  );
}
