import React, { useState, useMemo } from 'react';
import {
  AlertOctagon,
  MessageSquare,
  Search,
  FileSpreadsheet,
  FileText,
  Clock,
  Send,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatRupiah } from '../utils/currency';
import { formatDate } from '../utils/dates';
import { exportToExcel, exportToPDF } from '../services/exportService';

export default function ArrearsReport() {
  const { invoices, students, school, classes } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState('all');

  // Filter only unpaid invoices
  const unpaidInvoices = useMemo(() => {
    return invoices.filter(inv => inv.status !== 'Lunas');
  }, [invoices]);

  const filteredArrears = useMemo(() => {
    return unpaidInvoices.filter(inv => {
      if (filterClass !== 'all' && inv.className !== filterClass) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          inv.studentName.toLowerCase().includes(q) ||
          inv.className.toLowerCase().includes(q) ||
          inv.feeName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [unpaidInvoices, filterClass, searchQuery]);

  const totalArrearsAmount = useMemo(() => {
    return filteredArrears.reduce((sum, inv) => sum + (inv.remainingAmount || 0), 0);
  }, [filteredArrears]);

  const handleSendReminderWA = (inv) => {
    const st = students.find(s => s.id === inv.studentId);
    if (!st || !st.parentPhone) {
      alert('Nomor WhatsApp wali siswa belum terdaftar.');
      return;
    }

    const message = `*PEMBERITAHUAN TAGIHAN KAS SISWA*\n` +
      `*${school.name}*\n` +
      `-----------------------------------------\n` +
      `Yth. Bapak/Ibu Wali dari Ananda *${inv.studentName}* (Kelas ${inv.className}),\n\n` +
      `Menginformasikan mengenai iuran kas sekolah:\n` +
      `• Jenis Kas: *${inv.feeName}*\n` +
      `• Periode: *${inv.periodName}*\n` +
      `• Total Tagihan: ${formatRupiah(inv.amount)}\n` +
      `• Sisa Tagihan: *${formatRupiah(inv.remainingAmount)}*\n` +
      `• Jatuh Tempo: ${formatDate(inv.dueDate, 'long')}\n\n` +
      `Pembayaran dapat dilakukan secara tunai kepada bendahara sekolah atau transfer melalui rekening resmi:\n` +
      `*BSI (Bank Syariah Indonesia)*: 7148920192\n` +
      `a.n. YYS BINA INSAN CENDEKIA KAS\n\n` +
      `Mohon konfirmasi setelah melakukan transfer. Terima kasih atas kerja samanya.\n` +
      `_Wassalamu'alaikum Wr. Wb._`;

    const cleanPhone = st.parentPhone.replace(/^0/, '62').replace(/[^0-9]/g, '');
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  const handleExportExcel = () => {
    const data = filteredArrears.map(inv => {
      const st = students.find(s => s.id === inv.studentId);
      return {
        'Nama Siswa': inv.studentName,
        'Kelas': inv.className,
        'Nama Wali': st?.parentName || '-',
        'No WhatsApp': st?.parentPhone || '-',
        'Jenis Kas': inv.feeName,
        'Periode': inv.periodName,
        'Total Tagihan (Rp)': inv.amount,
        'Sudah Dibayar (Rp)': inv.paidAmount || 0,
        'Sisa Tunggakan (Rp)': inv.remainingAmount,
        'Jatuh Tempo': inv.dueDate,
        'Status': inv.status
      };
    });
    exportToExcel(data, 'Daftar_Tunggakan_Kas_Siswa');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <AlertOctagon className="w-6 h-6 text-rose-600" />
            <span>Tunggakan Kas Siswa</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar siswa yang belum melunasi tagihan kas dan pengiriman surat / pesan pengingat via WhatsApp
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
        </div>
      </div>

      {/* Summary KPI Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-rose-800">Total Nominal Tunggakan</p>
            <p className="text-2xl font-black text-rose-900 mt-0.5">{formatRupiah(totalArrearsAmount)}</p>
          </div>
          <AlertTriangle className="w-8 h-8 text-rose-400" />
        </div>

        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-amber-800">Tagihan Belum Lunas</p>
            <p className="text-2xl font-black text-amber-900 mt-0.5">{filteredArrears.length} Tagihan</p>
          </div>
          <Clock className="w-8 h-8 text-amber-400" />
        </div>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-blue-800">Siswa Memiliki Tunggakan</p>
            <p className="text-2xl font-black text-blue-900 mt-0.5">
              {new Set(filteredArrears.map(i => i.studentId)).size} Siswa
            </p>
          </div>
          <AlertOctagon className="w-8 h-8 text-blue-400" />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="w-full sm:w-1/2 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama siswa, kelas, jenis kas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:outline-none transition"
          />
        </div>

        <div className="w-full sm:w-1/3">
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
      </div>

      {/* Arrears Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 pl-4">Nama Siswa</th>
                <th className="py-3.5">Kelas</th>
                <th className="py-3.5">Wali Siswa</th>
                <th className="py-3.5">Jenis Tagihan & Periode</th>
                <th className="py-3.5 text-right">Total Tagihan</th>
                <th className="py-3.5 text-right">Sudah Bayar</th>
                <th className="py-3.5 text-right">Sisa Tunggakan</th>
                <th className="py-3.5">Jatuh Tempo</th>
                <th className="py-3.5 text-right pr-4">Kirim Pengingat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredArrears.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-emerald-600 font-bold">
                    Alhamdulillah! Tidak ada tunggakan kas siswa pada kriteria ini.
                  </td>
                </tr>
              ) : (
                filteredArrears.map(inv => {
                  const st = students.find(s => s.id === inv.studentId);
                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 pl-4 font-bold text-slate-900">
                        {inv.studentName}
                      </td>
                      <td className="py-3.5">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                          {inv.className}
                        </span>
                      </td>
                      <td className="py-3.5 text-slate-700">
                        <p className="font-medium">{st?.parentName || '-'}</p>
                        <p className="text-[10px] text-slate-400">{st?.parentPhone || 'No WA belum ada'}</p>
                      </td>
                      <td className="py-3.5">
                        <p className="font-semibold text-slate-800">{inv.feeName}</p>
                        <span className="text-[10px] text-slate-500">{inv.periodName}</span>
                      </td>
                      <td className="py-3.5 text-right font-medium text-slate-700">
                        {formatRupiah(inv.amount)}
                      </td>
                      <td className="py-3.5 text-right font-medium text-emerald-600">
                        {formatRupiah(inv.paidAmount || 0)}
                      </td>
                      <td className="py-3.5 text-right font-black text-rose-600">
                        {formatRupiah(inv.remainingAmount)}
                      </td>
                      <td className="py-3.5 text-slate-600 font-medium">
                        {formatDate(inv.dueDate, 'short')}
                      </td>
                      <td className="py-3.5 text-right pr-4">
                        <button
                          onClick={() => handleSendReminderWA(inv)}
                          disabled={!st?.parentPhone}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 rounded-xl shadow-sm transition active:scale-95"
                          title="Kirim pesan WhatsApp penagihan ke wali murid"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Kirim WA</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
