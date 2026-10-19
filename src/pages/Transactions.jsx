import React, { useState, useMemo } from 'react';
import {
  History,
  Search,
  Filter,
  FileSpreadsheet,
  FileText,
  Printer,
  ArrowDownCircle,
  ArrowUpCircle,
  ArrowLeftRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatRupiah } from '../utils/currency';
import { formatDate } from '../utils/dates';
import ReceiptModal from '../components/common/ReceiptModal';
import { exportToExcel, exportToPDF } from '../services/exportService';

export default function Transactions() {
  const { payments, incomeTransactions, expenseTransactions, transfers, students, invoices, school, currentUser } = useApp();

  const [filterType, setFilterType] = useState('all'); // all, payment, income, expense, transfer
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // Combine all ledger transactions chronologically
  const allTransactions = useMemo(() => {
    const list = [];

    // Payments
    payments.forEach(p => {
      list.push({
        id: p.id,
        code: p.receiptNumber,
        date: p.paymentDate,
        type: 'payment',
        typeLabel: 'Pembayaran Kas Siswa',
        description: `${p.feeName} - ${p.studentName} (${p.className})`,
        party: p.payerName,
        account: p.accountName,
        method: p.method === 'cash' ? 'Tunai' : 'Transfer',
        inAmount: p.amount,
        outAmount: 0,
        status: p.status,
        rawObj: p
      });
    });

    // Other income
    incomeTransactions.forEach(inc => {
      list.push({
        id: inc.id,
        code: inc.transactionNumber,
        date: inc.date,
        type: 'income',
        typeLabel: 'Pemasukan Lain',
        description: inc.description,
        party: inc.source,
        account: inc.accountName,
        method: 'Kas',
        inAmount: inc.amount,
        outAmount: 0,
        status: 'verified',
        rawObj: inc
      });
    });

    // Expenses
    expenseTransactions.forEach(exp => {
      list.push({
        id: exp.id,
        code: exp.transactionNumber,
        date: exp.date,
        type: 'expense',
        typeLabel: 'Pengeluaran Kas',
        description: exp.description,
        party: exp.vendor,
        account: exp.accountName,
        method: 'Kas',
        inAmount: 0,
        outAmount: exp.amount,
        status: exp.status,
        rawObj: exp
      });
    });

    // Sort descending by date
    return list.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [payments, incomeTransactions, expenseTransactions]);

  const filteredTransactions = useMemo(() => {
    return allTransactions.filter(tx => {
      if (filterType !== 'all' && tx.type !== filterType) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          tx.code.toLowerCase().includes(q) ||
          tx.description.toLowerCase().includes(q) ||
          tx.party.toLowerCase().includes(q) ||
          tx.account.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [allTransactions, filterType, searchQuery]);

  const handleExportExcel = () => {
    const data = filteredTransactions.map(tx => ({
      'No Referensi': tx.code,
      'Tanggal': tx.date,
      'Jenis': tx.typeLabel,
      'Uraian': tx.description,
      'Pihak Terkait': tx.party,
      'Akun Kas': tx.account,
      'Kas Masuk (Rp)': tx.inAmount || '',
      'Kas Keluar (Rp)': tx.outAmount || '',
      'Status': tx.status
    }));
    exportToExcel(data, 'Riwayat_Semua_Transaksi_Kas');
  };

  const handleExportPDF = () => {
    const columns = ['No Referensi', 'Tanggal', 'Jenis', 'Uraian', 'Akun', 'Masuk', 'Keluar'];
    const data = filteredTransactions.map(tx => [
      tx.code,
      formatDate(tx.date, 'short'),
      tx.typeLabel,
      tx.description,
      tx.account,
      tx.inAmount ? formatRupiah(tx.inAmount) : '-',
      tx.outAmount ? formatRupiah(tx.outAmount) : '-'
    ]);
    exportToPDF({
      title: 'Buku Riwayat Seluruh Transaksi Kas Siswa',
      subtitle: `Total: ${filteredTransactions.length} Transaksi Terfilter`,
      schoolInfo: school,
      columns,
      data,
      fileName: 'Riwayat_Transaksi_Kas'
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <History className="w-6 h-6 text-blue-600" />
            <span>Riwayat Seluruh Transaksi</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Jurnal pembukuan gabungan seluruh mutasi kas masuk, kas keluar, dan bukti transaksi
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
            onClick={handleExportPDF}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
          >
            <FileText className="w-4 h-4 text-rose-600" />
            PDF
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Cari kode referensi, nama siswa, keterangan transaksi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:outline-none transition"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:outline-none transition font-medium"
            >
              <option value="all">Semua Jenis Transaksi ({allTransactions.length})</option>
              <option value="payment">Hanya Pembayaran Siswa ({payments.length})</option>
              <option value="income">Hanya Pemasukan Lain ({incomeTransactions.length})</option>
              <option value="expense">Hanya Pengeluaran Kas ({expenseTransactions.length})</option>
            </select>
          </div>
        </div>
      </div>

      {/* Unified Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 pl-4">No. Bukti / Ref</th>
                <th className="py-3.5">Tanggal</th>
                <th className="py-3.5">Jenis Transaksi</th>
                <th className="py-3.5">Uraian / Deskripsi</th>
                <th className="py-3.5">Akun Kas</th>
                <th className="py-3.5 text-right">Uang Masuk</th>
                <th className="py-3.5 text-right">Uang Keluar</th>
                <th className="py-3.5 text-right pr-4">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    Tidak ada transaksi yang cocok.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map(tx => (
                  <tr key={tx.code + tx.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 pl-4 font-mono font-bold text-blue-600">
                      {tx.code}
                    </td>
                    <td className="py-3.5 text-slate-600">{formatDate(tx.date, 'short')}</td>
                    <td className="py-3.5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        tx.type === 'expense'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : tx.type === 'payment'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {tx.type === 'expense' ? <ArrowUpCircle className="w-3 h-3 text-rose-500" /> : <ArrowDownCircle className="w-3 h-3 text-emerald-500" />}
                        {tx.typeLabel}
                      </span>
                    </td>
                    <td className="py-3.5 max-w-xs">
                      <p className="font-semibold text-slate-800 truncate">{tx.description}</p>
                      <p className="text-[10px] text-slate-400">{tx.party}</p>
                    </td>
                    <td className="py-3.5 text-slate-600">{tx.account}</td>
                    <td className="py-3.5 text-right font-bold text-emerald-600">
                      {tx.inAmount > 0 ? `+${formatRupiah(tx.inAmount)}` : '-'}
                    </td>
                    <td className="py-3.5 text-right font-bold text-rose-600">
                      {tx.outAmount > 0 ? `-${formatRupiah(tx.outAmount)}` : '-'}
                    </td>
                    <td className="py-3.5 text-right pr-4">
                      {tx.type === 'payment' && (
                        <button
                          onClick={() => setSelectedReceipt(tx.rawObj)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Cetak Kuitansi"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receipt Modal if clicked */}
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
