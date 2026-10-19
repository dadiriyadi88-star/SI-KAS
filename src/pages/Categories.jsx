import React, { useState } from 'react';
import { Tag, Plus, Edit2, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Modal from '../components/common/Modal';

export default function Categories() {
  const { categories, setCategories, logAudit, showToast } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'income',
    color: 'blue'
  });

  const incomeCats = categories.filter(c => c.type === 'income');
  const expenseCats = categories.filter(c => c.type === 'expense');

  const handleOpenAdd = (type) => {
    setFormData({
      name: '',
      type,
      color: type === 'income' ? 'emerald' : 'rose'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newCat = {
      id: `cat_${Date.now()}`,
      name: formData.name,
      type: formData.type,
      isSystem: false,
      color: formData.color
    };

    setCategories(prev => [...prev, newCat]);
    logAudit('Tambah Kategori', `Menambahkan kategori ${formData.name}`);
    showToast(`Kategori ${formData.name} berhasil ditambahkan!`);
    setIsModalOpen(false);
  };

  const handleDelete = (id, name, isSystem) => {
    if (isSystem) {
      alert('Kategori bawaan sistem tidak dapat dihapus.');
      return;
    }
    if (window.confirm(`Hapus kategori "${name}"?`)) {
      setCategories(prev => prev.filter(c => c.id !== id));
      logAudit('Hapus Kategori', `Menghapus kategori ${name}`);
      showToast('Kategori berhasil dihapus.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Tag className="w-6 h-6 text-blue-600" />
            <span>Kategori Kas & Transaksi</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pengelolaan klasifikasi penerimaan kas dan pos penggunaan pengeluaran sekolah
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Income Categories */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Kategori Kas Masuk (Pemasukan)</h3>
              <p className="text-xs text-slate-400">Klasifikasi sumber penerimaan uang kas</p>
            </div>
            <button
              onClick={() => handleOpenAdd('income')}
              className="px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition"
            >
              + Tambah
            </button>
          </div>

          <div className="space-y-2">
            {incomeCats.map(c => (
              <div key={c.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="font-semibold text-slate-800">{c.name}</span>
                  {c.isSystem && (
                    <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.2 rounded">Sistem</span>
                  )}
                </div>
                {!c.isSystem && (
                  <button
                    onClick={() => handleDelete(c.id, c.name, c.isSystem)}
                    className="text-slate-400 hover:text-rose-500 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Expense Categories */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Kategori Kas Keluar (Pengeluaran)</h3>
              <p className="text-xs text-slate-400">Klasifikasi pos belanja dan kegiatan</p>
            </div>
            <button
              onClick={() => handleOpenAdd('expense')}
              className="px-3 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition"
            >
              + Tambah
            </button>
          </div>

          <div className="space-y-2">
            {expenseCats.map(c => (
              <div key={c.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="font-semibold text-slate-800">{c.name}</span>
                </div>
                {!c.isSystem && (
                  <button
                    onClick={() => handleDelete(c.id, c.name, c.isSystem)}
                    className="text-slate-400 hover:text-rose-500 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Tambah Kategori Kas Baru"
        subtitle="Buat nama pos kategori transaksi kas"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Nama Kategori <span className="text-rose-500">*</span></label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Contoh: Modul & Fotokopi Siswa"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Jenis Transaksi</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300"
            >
              <option value="income">Kas Masuk (Pemasukan)</option>
              <option value="expense">Kas Keluar (Pengeluaran)</option>
            </select>
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
              Simpan Kategori
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
