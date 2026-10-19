import React, { useState } from 'react';
import {
  ArrowLeftRight,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Landmark,
  Wallet,
  ShieldCheck,
  History
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatRupiah } from '../utils/currency';
import { formatDate } from '../utils/dates';
import Modal from '../components/common/Modal';

export default function Reconciliation() {
  const {
    accounts,
    computedAccountBalances,
    transfers,
    reconciliations,
    recordTransfer,
    recordReconciliation,
    currentUser
  } = useApp();

  // Modals
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isReconciliationModalOpen, setIsReconciliationModalOpen] = useState(false);

  // Transfer Form State
  const [transferData, setTransferData] = useState({
    fromAccountId: accounts[0]?.id || '',
    toAccountId: accounts[1]?.id || '',
    amount: '',
    notes: ''
  });

  // Reconciliation Form State
  const [recData, setRecData] = useState({
    accountId: accounts[0]?.id || '',
    physicalBalance: '',
    notes: ''
  });

  // Handle Transfer Submit
  const handleTransferSubmit = (e) => {
    e.preventDefault();
    if (!transferData.amount || parseInt(transferData.amount, 10) <= 0) {
      alert('Nominal transfer harus lebih dari 0.');
      return;
    }
    const res = recordTransfer({
      fromAccountId: transferData.fromAccountId,
      toAccountId: transferData.toAccountId,
      amount: transferData.amount,
      notes: transferData.notes
    });
    if (res) setIsTransferModalOpen(false);
  };

  // Handle Reconciliation Submit
  const handleRecSubmit = (e) => {
    e.preventDefault();
    if (recData.physicalBalance === '') {
      alert('Masukkan hasil hitung fisik uang brankas atau saldo mutasi bank.');
      return;
    }
    const res = recordReconciliation({
      accountId: recData.accountId,
      physicalBalance: recData.physicalBalance,
      notes: recData.notes
    });
    if (res) setIsReconciliationModalOpen(false);
  };

  const selectedFromBal = computedAccountBalances[transferData.fromAccountId] || 0;
  const isTransferExceeded = parseInt(transferData.amount, 10) > selectedFromBal;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <ArrowLeftRight className="w-6 h-6 text-blue-600" />
            <span>Transfer & Rekonsiliasi Kas</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Perpindahan dana internal antar-akun kas & bank serta pencocokan saldo sistem dengan fisik brankas / mutasi
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsTransferModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition active:scale-95"
          >
            <ArrowLeftRight className="w-4 h-4" />
            <span>Transfer Antar-Akun</span>
          </button>
          <button
            onClick={() => {
              setRecData({
                accountId: accounts[0]?.id || '',
                physicalBalance: computedAccountBalances[accounts[0]?.id] || 0,
                notes: ''
              });
              setIsReconciliationModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-500/20 transition active:scale-95"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Lakukan Rekonsiliasi</span>
          </button>
        </div>
      </div>

      {/* Account Balances Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {accounts.map(acc => {
          const bal = computedAccountBalances[acc.id] || 0;
          return (
            <div key={acc.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  acc.type === 'cash' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {acc.type === 'cash' ? 'KAS FISIK / TUNAI' : 'REKENING BANK'}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {acc.accountNumber !== '-' ? acc.accountNumber : 'Brankas'}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-800">{acc.name}</h3>
              <p className="text-2xl font-black text-slate-900 mt-1">{formatRupiah(bal)}</p>
              <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Pemegang: {acc.holderName}</span>
                <span className="text-emerald-600 font-medium">Aktif</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tables: 1. Transfer Antar-Akun & 2. Riwayat Rekonsiliasi */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transfer History */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Riwayat Transfer Internal Antar-Akun</h3>
              <p className="text-xs text-slate-500">Mutasi kas tunai ke bank atau sebaliknya (tidak mengubah total kas)</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold">
                <tr>
                  <th className="py-2.5 px-3">No. Transfer</th>
                  <th className="py-2.5 px-3">Tanggal</th>
                  <th className="py-2.5 px-3">Dari ➔ Ke</th>
                  <th className="py-2.5 px-3 text-right">Nominal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transfers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400">
                      Belum ada mutasi transfer internal.
                    </td>
                  </tr>
                ) : (
                  transfers.map(trf => (
                    <tr key={trf.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-mono font-bold text-blue-600">{trf.transferNumber}</td>
                      <td className="py-3 px-3 text-slate-600">{formatDate(trf.date, 'short')}</td>
                      <td className="py-3 px-3">
                        <span className="font-semibold text-slate-800">{trf.fromAccountName}</span>
                        <span className="text-slate-400 mx-1">➔</span>
                        <span className="font-semibold text-emerald-700">{trf.toAccountName}</span>
                        <p className="text-[10px] text-slate-400 mt-0.5">{trf.notes}</p>
                      </td>
                      <td className="py-3 px-3 text-right font-black text-slate-900">
                        {formatRupiah(trf.amount)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Reconciliation History */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Riwayat Rekonsiliasi & Audit Kas</h3>
              <p className="text-xs text-slate-500">Perbandingan saldo buku kas vs penghitungan fisik brankas / mutasi bank</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold">
                <tr>
                  <th className="py-2.5 px-3">Tanggal</th>
                  <th className="py-2.5 px-3">Akun</th>
                  <th className="py-2.5 px-3 text-right">Buku Kas</th>
                  <th className="py-2.5 px-3 text-right">Fisik</th>
                  <th className="py-2.5 px-3 text-center">Hasil</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reconciliations.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      Belum ada audit pemeriksaan rekonsiliasi kas.
                    </td>
                  </tr>
                ) : (
                  reconciliations.map(rec => (
                    <tr key={rec.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 text-slate-600">{formatDate(rec.reconciliationDate, 'short')}</td>
                      <td className="py-3 px-3">
                        <p className="font-semibold text-slate-800">{rec.accountName}</p>
                        <p className="text-[10px] text-slate-400">Pemeriksa: {rec.examinerName}</p>
                      </td>
                      <td className="py-3 px-3 text-right font-medium text-slate-700">
                        {formatRupiah(rec.systemBalance)}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-slate-900">
                        {formatRupiah(rec.physicalBalance)}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          rec.status === 'Cocok'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {rec.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal: Transfer Antar-Akun */}
      <Modal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        title="Formulir Transfer Internal Antar-Akun"
        subtitle="Pindahkan saldo antara kas tunai dan rekening bank sekolah tanpa mengubah total kas"
      >
        <form onSubmit={handleTransferSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Dari Akun (Sumber) <span className="text-rose-500">*</span></label>
              <select
                value={transferData.fromAccountId}
                onChange={(e) => setTransferData({ ...transferData, fromAccountId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              >
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} ({formatRupiah(computedAccountBalances[acc.id] || 0)})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Ke Akun (Tujuan) <span className="text-rose-500">*</span></label>
              <select
                value={transferData.toAccountId}
                onChange={(e) => setTransferData({ ...transferData, toAccountId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              >
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} ({formatRupiah(computedAccountBalances[acc.id] || 0)})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Nominal Transfer (Rp) <span className="text-rose-500">*</span></label>
            <input
              type="number"
              value={transferData.amount}
              onChange={(e) => setTransferData({ ...transferData, amount: e.target.value })}
              placeholder="Contoh: 1000000"
              className={`w-full px-3 py-2.5 rounded-xl border text-base font-bold focus:outline-none ${
                isTransferExceeded
                  ? 'border-rose-500 bg-rose-50 text-rose-900'
                  : 'border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-500'
              }`}
              required
              min="1000"
            />
            {isTransferExceeded && (
              <p className="mt-1 text-xs text-rose-600 font-bold">
                Nominal transfer melebihi saldo akun sumber ({formatRupiah(selectedFromBal)}).
              </p>
            )}
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Keterangan / Tujuan Transfer</label>
            <input
              type="text"
              value={transferData.notes}
              onChange={(e) => setTransferData({ ...transferData, notes: e.target.value })}
              placeholder="Contoh: Setoran uang tunai kas kelas ke rekening bank sekolah"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsTransferModalOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isTransferExceeded}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold disabled:bg-slate-300"
            >
              Eksekusi Transfer
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Rekonsiliasi Kas */}
      <Modal
        isOpen={isReconciliationModalOpen}
        onClose={() => setIsReconciliationModalOpen(false)}
        title="Formulir Rekonsiliasi Fisik Kas & Bank"
        subtitle="Hitung fisik brankas / mutasi bank dan cocokkan dengan buku kas sistem"
      >
        <form onSubmit={handleRecSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Pilih Akun Kas yang Diperiksa <span className="text-rose-500">*</span></label>
            <select
              value={recData.accountId}
              onChange={(e) => setRecData({ ...recData, accountId: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
              required
            >
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>{acc.name} ({acc.bankName})</option>
              ))}
            </select>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-slate-600 font-medium">Saldo Menurut Sistem Buku Kas:</span>
              <span className="text-sm font-extrabold text-blue-700">
                {formatRupiah(computedAccountBalances[recData.accountId] || 0)}
              </span>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Hasil Penghitungan Fisik Uang / Rekening Koran (Rp) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              value={recData.physicalBalance}
              onChange={(e) => setRecData({ ...recData, physicalBalance: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-base font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              required
            />
            {recData.physicalBalance !== '' && (
              <div className="mt-2 text-xs">
                {parseInt(recData.physicalBalance, 10) === (computedAccountBalances[recData.accountId] || 0) ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Status: COCOK 100% (Tidak ada selisih)
                  </span>
                ) : (
                  <span className="text-rose-600 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" />
                    Terdapat Selisih: {formatRupiah(parseInt(recData.physicalBalance, 10) - (computedAccountBalances[recData.accountId] || 0))}
                  </span>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Catatan Hasil Pemeriksaan</label>
            <textarea
              rows={2}
              value={recData.notes}
              onChange={(e) => setRecData({ ...recData, notes: e.target.value })}
              placeholder="Keterangan audit atau rincian pecahan uang brankas..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsReconciliationModalOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
            >
              Simpan Hasil Rekonsiliasi
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
