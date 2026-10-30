import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  Calendar,
  FileSpreadsheet,
  FileText,
  Printer,
  TrendingUp,
  TrendingDown,
  Wallet,
  Filter
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatRupiah } from '../utils/currency';
import { formatDate } from '../utils/dates';
import { exportToExcel, exportToPDF } from '../services/exportService';

export default function CashReports() {
  const { school, payments, incomeTransactions, expenseTransactions, accounts, totals, currentUser } = useApp();

  const [reportType, setReportType] = useState('monthly'); // 'daily' | 'monthly' | 'custom'
  const [selectedMonth, setSelectedMonth] = useState('10'); // Oktober
  const [selectedYear, setSelectedYear] = useState('2026');

  // Filtered payments for this period
  const periodPayments = useMemo(() => {
    return payments.filter(p => {
      if (p.status !== 'verified') return false;
      if (!p.paymentDate) return false;
      const [y, m] = p.paymentDate.split('-');
      if (reportType === 'monthly') {
        return y === selectedYear && m === selectedMonth;
      }
      return true;
    });
  }, [payments, reportType, selectedMonth, selectedYear]);

  // Filtered income for this period
  const periodIncome = useMemo(() => {
    return incomeTransactions.filter(inc => {
      if (!inc.date) return false;
      const [y, m] = inc.date.split('-');
      if (reportType === 'monthly') {
        return y === selectedYear && m === selectedMonth;
      }
      return true;
    });
  }, [incomeTransactions, reportType, selectedMonth, selectedYear]);

  // Filtered expenses for this period
  const periodExpenses = useMemo(() => {
    return expenseTransactions.filter(exp => {
      if (exp.status !== 'approved') return false;
      if (!exp.date) return false;
      const [y, m] = exp.date.split('-');
      if (reportType === 'monthly') {
        return y === selectedYear && m === selectedMonth;
      }
      return true;
    });
  }, [expenseTransactions, reportType, selectedMonth, selectedYear]);

  // Calculations for period
  const totalPeriodKasSiswa = useMemo(() => periodPayments.reduce((s, p) => s + p.amount, 0), [periodPayments]);
  const totalPeriodOtherIncome = useMemo(() => periodIncome.reduce((s, i) => s + i.amount, 0), [periodIncome]);
  const totalPeriodIncome = totalPeriodKasSiswa + totalPeriodOtherIncome;
  const totalPeriodExpenses = useMemo(() => periodExpenses.reduce((s, e) => s + e.amount, 0), [periodExpenses]);
  const netSurplus = totalPeriodIncome - totalPeriodExpenses;

  // Initial balance calculated from accounts initial balances
  const initialBalance = useMemo(() => {
    return accounts.reduce((sum, a) => sum + (a.initialBalance || 0), 0);
  }, [accounts]);
  const closingBalance = initialBalance + totalPeriodIncome - totalPeriodExpenses;

  const handlePrint = () => {
    window.print();
  };

  const handleExportExcel = () => {
    const rows = [
      { Uraian: 'Saldo Awal Periode', 'Nominal (Rp)': initialBalance },
      { Uraian: 'Penerimaan Kas Siswa', 'Nominal (Rp)': totalPeriodKasSiswa },
      { Uraian: 'Penerimaan Lain yang Sah', 'Nominal (Rp)': totalPeriodOtherIncome },
      { Uraian: 'TOTAL PEMASUKAN', 'Nominal (Rp)': totalPeriodIncome },
      { Uraian: 'TOTAL PENGELUARAN', 'Nominal (Rp)': totalPeriodExpenses },
      { Uraian: 'SURPLUS / (DEFISIT)', 'Nominal (Rp)': netSurplus },
      { Uraian: 'SALDO AKHIR PERIODE', 'Nominal (Rp)': closingBalance }
    ];
    exportToExcel(rows, `Laporan_Kas_${selectedMonth}_${selectedYear}`);
  };

  const handleExportPDF = () => {
    const columns = ['Uraian Pos Keuangan', 'Nominal (Rupiah)', 'Keterangan'];
    const data = [
      ['Saldo Awal Bulan', formatRupiah(initialBalance), 'Saldo kas per awal bulan berjalan'],
      ['Pemasukan Kas Siswa', formatRupiah(totalPeriodKasSiswa), `${periodPayments.length} transaksi pembayaran kas`],
      ['Pemasukan Lain yang Sah', formatRupiah(totalPeriodOtherIncome), `${periodIncome.length} transaksi donasi/infaq`],
      ['Total Pemasukan', formatRupiah(totalPeriodIncome), 'Kas masuk disahkan'],
      ['Total Pengeluaran Kas', formatRupiah(totalPeriodExpenses), `${periodExpenses.length} transaksi pengeluaran`],
      ['Saldo Akhir Kas', formatRupiah(closingBalance), 'Saldo akhir seluruh akun kas']
    ];
    exportToPDF({
      title: `Laporan Keuangan Kas Siswa - Bulan ${selectedMonth}/${selectedYear}`,
      subtitle: `Tahun Ajaran: ${school.activeAcademicYear} | Bendahara: ${school.treasurerName}`,
      schoolInfo: school,
      columns,
      data,
      fileName: `Laporan_Kas_Bulan_${selectedMonth}_${selectedYear}`
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm no-print">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <span>Laporan Rekapitulasi Kas</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Rekap pemasukan, pengeluaran, saldo awal, saldo akhir, dan cetak laporan resmi sekolah
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
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Dokumen</span>
          </button>
        </div>
      </div>

      {/* Filter Period (No-Print) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between flex-wrap gap-3 text-xs no-print">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700">Pilih Periode Laporan:</span>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white font-semibold"
          >
            <option value="07">Juli</option>
            <option value="08">Agustus</option>
            <option value="09">September</option>
            <option value="10">Oktober</option>
            <option value="11">November</option>
            <option value="12">Desember</option>
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white font-semibold"
          >
            <option value="2026">2026</option>
            <option value="2027">2027</option>
          </select>
        </div>

        <span className="text-slate-500">
          Format standar laporan keuangan komite dan yayasan sekolah
        </span>
      </div>

      {/* Printable Report Sheet */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm print:shadow-none print:border-none">
        {/* Letterhead */}
        <div className="border-b-2 border-slate-900 pb-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-extrabold text-2xl shadow-sm">
                SK
              </div>
              <div>
                <h1 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                  {school.name}
                </h1>
                <p className="text-xs text-slate-600">{school.address}</p>
                <p className="text-xs text-slate-500">
                  NPSN: {school.npsn} | Telp: {school.phone} | Email: {school.email}
                </p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-base font-extrabold text-slate-800">
                LAPORAN REKAPITULASI KAS
              </h2>
              <p className="text-xs text-slate-500">Periode: Bulan {selectedMonth}/{selectedYear}</p>
              <p className="text-xs text-slate-500">TA: {school.activeAcademicYear}</p>
            </div>
          </div>
        </div>

        {/* Financial Recap Table */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            A. Rekapitulasi Arus Kas Masuk & Keluar
          </h3>
          <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-4 border-b border-slate-200">Uraian Transaksi</th>
                <th className="py-2.5 px-4 border-b border-slate-200 text-right">Nominal</th>
                <th className="py-2.5 px-4 border-b border-slate-200 text-slate-500">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="bg-slate-50/50">
                <td className="py-2.5 px-4 font-bold text-slate-800">Saldo Awal Bulan</td>
                <td className="py-2.5 px-4 text-right font-bold text-slate-800">{formatRupiah(initialBalance)}</td>
                <td className="py-2.5 px-4 text-slate-500">Sisa saldo periode sebelumnya</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 pl-8 text-slate-700">• Pemasukan Kas Siswa Rutin & Kegiatan</td>
                <td className="py-2.5 px-4 text-right font-medium text-emerald-600">+{formatRupiah(totalPeriodKasSiswa)}</td>
                <td className="py-2.5 px-4 text-slate-500">{periodPayments.length} kuitansi sah</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 pl-8 text-slate-700">• Pemasukan Lain / Sumbangan Sah</td>
                <td className="py-2.5 px-4 text-right font-medium text-emerald-600">+{formatRupiah(totalPeriodOtherIncome)}</td>
                <td className="py-2.5 px-4 text-slate-500">{periodIncome.length} donasi / koreksi</td>
              </tr>
              <tr className="bg-emerald-50/40 font-bold">
                <td className="py-2.5 px-4 text-emerald-900">Total Kas Masuk</td>
                <td className="py-2.5 px-4 text-right text-emerald-800 font-black">{formatRupiah(totalPeriodIncome)}</td>
                <td className="py-2.5 px-4 text-slate-500">Subtotal penerimaan</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 text-slate-700">• Pengeluaran Kas Operasional & Kegiatan</td>
                <td className="py-2.5 px-4 text-right font-medium text-rose-600">-{formatRupiah(totalPeriodExpenses)}</td>
                <td className="py-2.5 px-4 text-slate-500">{periodExpenses.length} nota belanja disetujui</td>
              </tr>
              <tr className="bg-rose-50/40 font-bold">
                <td className="py-2.5 px-4 text-rose-900">Total Kas Keluar</td>
                <td className="py-2.5 px-4 text-right text-rose-800 font-black">{formatRupiah(totalPeriodExpenses)}</td>
                <td className="py-2.5 px-4 text-slate-500">Subtotal penggunaan dana</td>
              </tr>
              <tr className="bg-blue-50/70 border-t-2 border-blue-600 text-sm font-extrabold text-blue-950">
                <td className="py-3 px-4">SALDO AKHIR BULAN</td>
                <td className="py-3 px-4 text-right font-black text-blue-800">{formatRupiah(closingBalance)}</td>
                <td className="py-3 px-4 text-xs font-normal text-slate-600">Saldo Awal + Masuk - Keluar</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Posisi Saldo Per Akun Kas */}
        <div className="mt-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            B. Posisi Saldo Kas Per Akun Penyimpanan
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {accounts.map(acc => (
              <div key={acc.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-800">{acc.name}</span>
                  <span className="text-[10px] font-bold text-slate-400">{acc.type.toUpperCase()}</span>
                </div>
                <p className="text-base font-black text-slate-900 mt-1">
                  {formatRupiah(totals.totalBalance > 0 ? (acc.type === 'cash' ? totals.totalCashBalance : totals.totalBankBalance) : 0)}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">{acc.bankName}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Legal Signatures */}
        <div className="mt-12 pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-xs">
          <div>
            <p className="text-slate-500">Mengetahui,</p>
            <p className="text-slate-700 font-semibold mt-0.5">Kepala Sekolah</p>
            <div className="h-16" />
            <p className="font-bold text-slate-900 border-t border-slate-400 inline-block px-6">
              {school.principalName}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">NIP: {school.principalNip}</p>
          </div>

          <div>
            <p className="text-slate-500">Bandung, {formatDate(new Date(), 'long')}</p>
            <p className="text-slate-700 font-semibold mt-0.5">Bendahara Sekolah</p>
            <div className="h-16" />
            <p className="font-bold text-slate-900 border-t border-slate-400 inline-block px-6">
              {school.treasurerName}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">NIP: {school.treasurerNip}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
