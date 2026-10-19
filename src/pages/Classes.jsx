import React, { useState } from 'react';
import { GraduationCap, Plus, Users, Edit2, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatRupiah } from '../utils/currency';
import Modal from '../components/common/Modal';

export default function Classes() {
  const { classes, setClasses, students, invoices, logAudit, showToast } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    level: 'SD',
    homeroomTeacher: '',
    capacity: 30,
    academicYear: '2026/2027',
    status: 'active'
  });

  const handleOpenAdd = () => {
    setEditingClass(null);
    setFormData({
      name: '',
      level: 'SD',
      homeroomTeacher: '',
      capacity: 30,
      academicYear: '2026/2027',
      status: 'active'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cls) => {
    setEditingClass(cls);
    setFormData({ ...cls });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingClass) {
      setClasses(prev => prev.map(c => c.id === editingClass.id ? { ...c, ...formData } : c));
      logAudit('Edit Kelas', `Memperbarui data kelas ${formData.name}`);
      showToast('Data kelas berhasil diperbarui!');
    } else {
      const newClass = {
        id: `cls_${Date.now()}`,
        ...formData
      };
      setClasses(prev => [...prev, newClass]);
      logAudit('Tambah Kelas', `Menambahkan kelas baru ${formData.name}`);
      showToast('Kelas baru berhasil ditambahkan!');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id, name) => {
    const studentCount = students.filter(s => s.classId === id || s.className === name).length;
    if (studentCount > 0) {
      alert(`Kelas tidak dapat dihapus karena masih ada ${studentCount} siswa terdaftar di kelas ini.`);
      return;
    }
    if (window.confirm(`Hapus kelas ${name}?`)) {
      setClasses(prev => prev.filter(c => c.id !== id));
      logAudit('Hapus Kelas', `Menghapus kelas ${name}`);
      showToast('Kelas berhasil dihapus.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <GraduationCap className="w-6 h-6 text-blue-600" />
            <span>Data Kelas & Rombel</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pengaturan jenjang pendidikan, rombongan belajar (rombel), dan wali kelas
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Kelas Baru</span>
        </button>
      </div>

      {/* Grid of Classes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {classes.map(cls => {
          const classStudents = students.filter(s => s.classId === cls.id || s.className === cls.name);
          const classInvoices = invoices.filter(i => i.classId === cls.id || i.className === cls.name);
          const paidInvoices = classInvoices.filter(i => i.status === 'Lunas').length;
          const collectionRate = classInvoices.length > 0 ? Math.round((paidInvoices / classInvoices.length) * 100) : 0;

          return (
            <div key={cls.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-blue-300 transition flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 text-xs font-black bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
                    Kelas {cls.name}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">
                    {cls.level}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-800">
                  {cls.homeroomTeacher || 'Belum ada wali kelas'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Wali Kelas</p>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span>{classStudents.length} / {cls.capacity} Siswa</span>
                  </div>
                  <span className="text-emerald-600 font-bold">
                    {collectionRate}% Lunas
                  </span>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-1.5 rounded-full"
                    style={{ width: `${collectionRate}%` }}
                  />
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(cls)}
                  className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition"
                  title="Edit Kelas"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(cls.id, cls.name)}
                  className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                  title="Hapus Kelas"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Add / Edit Class */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingClass ? 'Edit Data Kelas' : 'Tambah Kelas Baru'}
        subtitle="Atur nama rombel, jenjang, kapasitas, dan wali kelas"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nama Kelas / Rombel <span className="text-rose-500">*</span></label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Contoh: 5A, 5B, 1C"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Jenjang Pendidikan</label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              >
                <option value="TK">TK / PAUD</option>
                <option value="SD">SD / MI</option>
                <option value="SMP">SMP / MTs</option>
                <option value="SMA">SMA / SMK / MA</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Nama Wali Kelas</label>
            <input
              type="text"
              value={formData.homeroomTeacher}
              onChange={(e) => setFormData({ ...formData, homeroomTeacher: e.target.value })}
              placeholder="Contoh: Ustadzah Maryam, S.Pd."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kapasitas Maksimal Siswa</label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value, 10) || 30 })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tahun Ajaran</label>
              <input
                type="text"
                value={formData.academicYear}
                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>
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
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm"
            >
              Simpan Kelas
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
