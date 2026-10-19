import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  FileSpreadsheet,
  FileText,
  Printer,
  Calendar,
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatRupiah } from '../utils/currency';
import { formatDate } from '../utils/dates';
import { exportToExcel, exportToPDF } from '../services/exportService';

export default function CashBook() {
  const { accounts, payments, incomeTransactions, expenseTransactions, transfers, school } = useApp();

  const [selectedAccountId, setSelectedAccountId] = useState(accounts[0]?.id || '');

  const selectedAccount = useMemo(() => {
    return accounts.find(a => a.id === selectedAccountId) || accounts[0];
  }, [accounts, selectedAccountId]);

  // Build Chronological running ledger for this specific account
  const ledgerEntries = useMemo(() => {
    if (!selectedAccount) return [];

    const entries = [];

    // Verified Payments into this account
    payments.forEach(p => {
      if (p.accountId === selectedAccount.id && p.status === 'verified') {
        entries.push({
          date: p.paymentDate,
          code: p.receiptNumber,
          description: `Kas Siswa: ${p.studentName} (${p.className}) - ${p.feeName}`,
          inAmount: p.amount,
          outAmount: 0
        });
      }
    });

    // Other Income into this account
    incomeTransactions.forEach(inc => {
      if (inc.accountId === selectedAccount.id) {
        entries.push({
          date: inc.date,
          code: inc.transactionNumber,
          description: `Pemasukan Lain: ${inc.description} (${inc.source})`,
          inAmount: inc.amount,
          outAmount: 0
        });
      }
    });

    // Expenses from this account
    expenseTransactions.forEach(exp => {
      if (exp.accountId === selectedAccount.id && exp.status === 'approved') {
        entries.push({
          date: exp.date,
          code: exp.transactionNumber,
          description: `Pengeluaran: ${exp.description} (${exp.vendor})`,
          inAmount: 0,
          outAmount: exp.amount
        });
      }
    });

    // Transfers IN or OUT
    transfers.forEach(trf => {
      if (trf.fromAccountId === selectedAccount.id) {
        entries.push({
          date: trf.date,
          code: trf.transferNumber,
          description: `Transfer Keluar ke ${trf.toAccountName} (${trf.notes})`,
          inAmount: 0,
          outAmount: trf.amount
        });
      }
      if (trf.toAccountId === selectedAccount.id) {
        entries.push({
          date: trf.date,
          code: trf.transferNumber,
          description: `Transfer Masuk dari ${trf.fromAccountName} (${trf.notes})`,
          inAmount: trf.amount,
          outAmount: 0
        });
      }
    });

    // Sort ascending by date
    entries.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Calculate running balance
    let current = selectedAccount.initialBalance || 0;
    return entries.map(item => {
      current = current + item.inAmount - item.outAmount;
      return {
        ...item,
        runningBalance: current
      };
    });
  }, [selectedAccount, payments, incomeTransactions, expenseTransactions, transfers]);

  const handleExportExcel = () => {
    const data = ledgerEntries.map(e => ({
      'Tanggal': e.date,
      'No Bukti': e.code,
      'Uraian': e.description,
      'Debet / Masuk (Rp)': e.inAmount || '',
      'Kredit / Keluar (Rp)': e.outAmount || '',
      'Saldo Berjalan (Rp)': e.runningBalance
    }));
    exportToExcel(data, `Buku_Kas_${selectedAccount?.name.replace(/\s+/g, '_')}`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm no-print">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <span>Buku Kas & Mutasi Rekening</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Jurnal pembukuan kronologis debit, kredit, dan saldo berjalan per akun kas/bank
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            Excel
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Buku Kas</span>
          </button>
        </div>
      </div>

      {/* Account Selector (No-Print) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between flex-wrap gap-3 text-xs no-print">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700">Pilih Akun Kas:</span>
          <select
            value={selectedAccountId}
            onChange={(e) => setSelectedAccountId(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white font-bold text-slate-800"
          >
            {accounts.map(acc => (
              <option key={acc.id} value={acc.id}>
                {acc.name} ({acc.bankName})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 text-slate-600">
          <span>Saldo Awal Pembukuan:</span>
          <span className="font-bold text-slate-900">{formatRupiah(selectedAccount?.initialBalance || 0)}</span>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden p-6 print:p-0 print:border-none">
        {/* Letterhead in Print */}
        <div className="hidden print:block border-b-2 border-slate-900 pb-4 mb-4">
          <h1 className="text-base font-extrabold uppercase">{school.name}</h1>
          <h2 className="text-sm font-bold">BUKU KAS UMUM — {selectedAccount?.name}</h2>
          <p className="text-xs">{selectedAccount?.bankName} • No. {selectedAccount?.accountNumber}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-3">Tanggal</th>
                <th className="py-3 px-3">No. Bukti</th>
                <th className="py-3 px-3">Uraian / Keterangan</th>
                <th className="py-3 px-3 text-right">Debet (Masuk)</th>
                <th className="py-3 px-3 text-right">Kredit (Keluar)</th>
                <th className="py-3 px-3 text-right font-black">Saldo Berjalan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* Row 0: Saldo Awal */}
              <tr className="bg-slate-50 font-bold">
                <td className="py-3 px-3 text-slate-400">-</td>
                <td className="py-3 px-3 font-mono text-slate-400">-</td>
                <td className="py-3 px-3 text-slate-700">Saldo Awal Akun Kas</td>
                <td className="py-3 px-3 text-right text-slate-400">-</td>
                <td className="py-3 px-3 text-right text-slate-400">-</td>
                <td className="py-3 px-3 text-right font-black text-blue-700">
                  {formatRupiah(selectedAccount?.initialBalance || 0)}
                </td>
              </tr>

              {ledgerEntries.map((e, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-3 text-slate-600">{formatDate(e.date, 'short')}</td>
                  <td className="py-3 px-3 font-mono font-bold text-blue-600">{e.code}</td>
                  <td className="py-3 px-3 font-medium text-slate-800 max-w-sm">{e.description}</td>
                  <td className="py-3 px-3 text-right font-bold text-emerald-600">
                    {e.inAmount > 0 ? formatRupiah(e.inAmount) : '-'}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-rose-600">
                    {e.outAmount > 0 ? formatRupiah(e.outAmount) : '-'}
                  </td>
                  <td className="py-3 px-3 text-right font-black text-slate-900">
                    {formatRupiah(e.runningBalance)}
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
