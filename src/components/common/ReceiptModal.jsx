import React, { useRef } from 'react';
import { Printer, Download, Share2, CheckCircle2, Building, X, MessageSquare } from 'lucide-react';
import { formatRupiah, terbilang } from '../../utils/currency';
import { formatDate } from '../../utils/dates';
import { useApp } from '../../context/AppContext';

export default function ReceiptModal({ isOpen, onClose, payment, student, invoice }) {
  const { school } = useApp();
  const receiptRef = useRef(null);

  if (!isOpen || !payment) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    const parentPhone = student?.parentPhone || '';
    if (!parentPhone) {
      alert('Nomor WhatsApp wali siswa belum terdaftar.');
      return;
    }

    const message = `*BUKTI PEMBAYARAN KAS SISWA*\n` +
      `*${school.name}*\n` +
      `-----------------------------------------\n` +
      `No. Kuitansi: *${payment.receiptNumber}*\n` +
      `Tanggal: ${formatDate(payment.paymentDate)}\n` +
      `Nama Siswa: *${payment.studentName}* (${payment.className})\n` +
      `Pembayar: ${payment.payerName} (${payment.payerType})\n` +
      `Untuk: ${payment.feeName}\n` +
      `Metode: ${payment.method === 'cash' ? 'Tunai (Cash)' : 'Transfer Bank'}\n` +
      `Jumlah Diterima: *${formatRupiah(payment.amount)}*\n` +
      `Terbilang: _${terbilang(payment.amount)}_\n` +
      `Status: *LUNAS / SAH*\n` +
      `Petugas: ${payment.recordedBy}\n` +
      `-----------------------------------------\n` +
      `_Terima kasih atas pembayaran kas keuangan sekolah tepat waktu._`;

    const cleanPhone = parentPhone.replace(/^0/, '62').replace(/[^0-9]/g, '');
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity no-print" 
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-2xl transition-all border border-slate-200">
          
          {/* Action Bar (No-Print) */}
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-3.5 bg-slate-50 no-print">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Pratinjau Kuitansi Pembayaran</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleWhatsAppShare}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition"
                title="Kirim ke WhatsApp Wali"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Kirim WA
              </button>
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
              >
                <Printer className="w-3.5 h-3.5" />
                Cetak Kuitansi
              </button>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Printable Receipt Paper */}
          <div ref={receiptRef} className="p-8 bg-white print:p-4 text-slate-800">
            {/* School Header */}
            <div className="border-b-2 border-slate-800 pb-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-sm">
                    SK
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold tracking-tight text-slate-900 uppercase">
                      {school.name}
                    </h2>
                    <p className="text-xs text-slate-600">{school.address}</p>
                    <p className="text-xs text-slate-500">
                      NPSN: {school.npsn} | Telp: {school.phone}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2.5 py-1 text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 rounded">
                    KUITANSI RESMI
                  </span>
                  <p className="text-xs font-mono font-bold text-slate-800 mt-1">
                    {payment.receiptNumber}
                  </p>
                </div>
              </div>
            </div>

            {/* Receipt Details */}
            <div className="space-y-3 text-xs leading-relaxed">
              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-4 text-slate-500">Telah Terima Dari</span>
                <span className="col-span-1 text-slate-400">:</span>
                <span className="col-span-7 font-semibold text-slate-800">
                  {payment.payerName} <span className="text-slate-500 font-normal">({payment.payerType})</span>
                </span>
              </div>

              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-4 text-slate-500">Nama Siswa / Kelas</span>
                <span className="col-span-1 text-slate-400">:</span>
                <span className="col-span-7 font-bold text-slate-900">
                  {payment.studentName} <span className="font-normal text-slate-600">({payment.className})</span>
                </span>
              </div>

              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-4 text-slate-500">Tanggal Pembayaran</span>
                <span className="col-span-1 text-slate-400">:</span>
                <span className="col-span-7 text-slate-800">
                  {formatDate(payment.paymentDate, 'long')}
                </span>
              </div>

              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-4 text-slate-500">Untuk Pembayaran</span>
                <span className="col-span-1 text-slate-400">:</span>
                <span className="col-span-7 font-medium text-slate-800">
                  {payment.feeName}
                </span>
              </div>

              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-4 text-slate-500">Metode & Akun</span>
                <span className="col-span-1 text-slate-400">:</span>
                <span className="col-span-7 text-slate-800 capitalize">
                  {payment.method === 'cash' ? 'Tunai (Cash)' : 'Transfer Bank'} — {payment.accountName}
                  {payment.referenceNumber !== '-' && ` (Ref: ${payment.referenceNumber})`}
                </span>
              </div>

              {/* Amount Box */}
              <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-slate-500 font-medium">Jumlah Diterima:</span>
                    <div className="text-xl font-extrabold text-blue-700 tracking-tight mt-0.5">
                      {formatRupiah(payment.amount)}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {payment.status === 'verified' ? 'SAH / LUNAS' : 'PENDING'}
                    </span>
                  </div>
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-200/80 text-xs italic text-slate-600">
                  <span className="font-semibold not-italic text-slate-500">Terbilang: </span>
                  "{terbilang(payment.amount)}"
                </div>
              </div>

              {/* Signatures */}
              <div className="mt-8 pt-4 grid grid-cols-2 gap-8 text-center text-xs">
                <div>
                  <p className="text-slate-500">Penyetor / Wali Murid,</p>
                  <div className="h-14" />
                  <p className="font-semibold text-slate-800 border-t border-slate-300 inline-block px-4">
                    {payment.payerName}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Bandung, {formatDate(payment.paymentDate, 'short')}</p>
                  <p className="text-slate-500">Petugas / Bendahara,</p>
                  <div className="h-10 flex items-center justify-center">
                    <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      DIGITALLY VERIFIED
                    </span>
                  </div>
                  <p className="font-semibold text-slate-800 border-t border-slate-300 inline-block px-4">
                    {payment.recordedBy}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-dashed border-slate-200 text-center text-[10px] text-slate-400">
                Simpan kuitansi ini sebagai bukti pembayaran yang sah. Dicetak otomatis oleh sistem SIKAS SISWA.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
