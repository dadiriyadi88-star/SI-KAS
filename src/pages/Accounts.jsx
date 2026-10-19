import React, { useState } from 'react';
import { Landmark, Plus, Edit2, Wallet, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatRupiah } from '../utils/currency';
import Modal from '../components/common/Modal';

export default function Accounts() {
  const { accounts, setAccounts, computedAccountBalances, logAudit, showToast } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'bank',
    bankName: '',
    accountNumber: '',
    holderName: '',
    initialBalance: 0,
    note: ''
  });

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      type: 'bank',
      bankName: 'Bank Syariah Indonesia (BSI)',
      accountNumber: '',
      holderName: '',
      initialBalance: 0,
      note: ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newAccount = {
      id: `acc_${Date.now()}`,
      name: formData.name,
      type: formData.type,
      bankName: formData.bankName,
      accountNumber: formData.accountNumber || '-',
      holderName: formData.holderName,
      initialBalance: parseInt(formData.initialBalance, 10) || 0,
      status: 'active',
      note: formData.note
    };

    setAccounts(prev => [...prev, newAccount]);
    logAudit('Tambah Akun Kas', `Menambahkan akun baru ${formData.name}`);
    showToast(`Akun ${formData.name} berhasil ditambahkan!`);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Landmark className="w-6 h-6 text-blue-600" />
            <span>Akun Kas & Rekening Bank</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pemisahan kas tunai brankas dan rekening bank resmi agar saldo pembukuan presisi
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Akun Kas Baru</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {accounts.map(acc => {
          const bal = computedAccountBalances[acc.id] || 0;
          return (
            <div key={acc.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    acc.type === 'cash' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {acc.type === 'cash' ? '💵 KAS TUNAI' : '🏦 REKENING BANK'}
                  </span>
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Aktif
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mt-3">{acc.name}</h3>
                <p className="text-xs text-slate-500">{acc.bankName}</p>

                <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Saldo Berjalan Real-time:</span>
                  <p className="text-xl font-black text-slate-900 mt-0.5">{formatRupiah(bal)}</p>
                </div>

                <div className="mt-4 space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">No. Rekening:</span>
                    <span className="font-mono font-medium">{acc.accountNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Atas Nama:</span>
                    <span className="font-medium text-right">{acc.holderName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Saldo Awal:</span>
                    <span className="font-medium">{formatRupiah(acc.initialBalance || 0)}</span>
                  </div>
                </div>
              </div>

              {acc.note && (
                <p className="text-[11px] text-slate-400 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100 mt-2">
                  {acc.note}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal Add Account */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Tambah Akun Kas / Bank Baru"
        subtitle="Daftarkan brankas fisik atau rekening bank penampung dana kas siswa"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nama Akun <span className="text-rose-500">*</span></label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Contoh: Rekening BRI Kas Siswa"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tipe Akun</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
              >
                <option value="bank">Rekening Bank</option>
                <option value="cash">Kas Fisik Tunai (Brankas)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Bank / Lokasi</label>
              <input
                type="text"
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                placeholder="Contoh: Bank Syariah Indonesia"
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nomor Rekening</label>
              <input
                type="text"
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                placeholder="Contoh: 7148920192"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Atas Nama Rekening</label>
              <input
                type="text"
                value={formData.holderName}
                onChange={(e) => setFormData({ ...formData, holderName: e.target.value })}
                placeholder="Contoh: YAYASAN BINA INSAN KAS"
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Saldo Awal (Rp)</label>
              <input
                type="number"
                value={formData.initialBalance}
                onChange={(e) => setFormData({ ...formData, initialBalance: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Catatan Akun</label>
            <input
              type="text"
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              placeholder="Keterangan peruntukan rekening ini..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300"
            />
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
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
            >
              Simpan Akun
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
