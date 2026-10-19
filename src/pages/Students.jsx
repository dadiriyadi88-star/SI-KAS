import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Plus,
  FileSpreadsheet,
  FileText,
  Edit2,
  Trash2,
  Eye,
  MessageSquare,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatRupiah } from '../utils/currency';
import { formatDate } from '../utils/dates';
import Modal from '../components/common/Modal';
import { exportToExcel } from '../services/exportService';

export default function Students() {
  const { students, setStudents, classes, invoices, payments, logAudit, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [selectedStudentDetail, setSelectedStudentDetail] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    nis: '',
    nisn: '',
    name: '',
    gender: 'Laki-laki',
    level: 'SD',
    classId: '',
    className: '',
    academicYear: '2026/2027',
    parentName: '',
    parentPhone: '',
    status: 'Aktif'
  });

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      if (filterClass !== 'all' && s.className !== filterClass) return false;
      if (filterStatus !== 'all' && s.status !== filterStatus) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchName = s.name.toLowerCase().includes(q);
        const matchNis = s.nis.toLowerCase().includes(q);
        const matchNisn = (s.nisn || '').toLowerCase().includes(q);
        const matchParent = (s.parentName || '').toLowerCase().includes(q);
        return matchName || matchNis || matchNisn || matchParent;
      }
      return true;
    });
  }, [students, filterClass, filterStatus, searchQuery]);

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setFormData({
      nis: `2026${String(students.length + 101).slice(-3)}`,
      nisn: `0089234${String(students.length + 20).slice(-3)}`,
      name: '',
      gender: 'Laki-laki',
      level: 'SD',
      classId: classes[0]?.id || '',
      className: classes[0]?.name || '',
      academicYear: '2026/2027',
      parentName: '',
      parentPhone: '',
      status: 'Aktif'
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (student) => {
    setEditingStudent(student);
    setFormData({ ...student });
    setIsFormOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedCls = classes.find(c => c.id === formData.classId) || classes[0];

    if (editingStudent) {
      setStudents(prev => prev.map(s => s.id === editingStudent.id ? {
        ...formData,
        className: selectedCls?.name || formData.className
      } : s));
      logAudit('Edit Siswa', `Memperbarui data siswa ${formData.name}`);
      showToast('Data siswa berhasil diperbarui!');
    } else {
      const newSt = {
        id: `std_${Date.now()}`,
        ...formData,
        className: selectedCls?.name || '5A'
      };
      setStudents(prev => [newSt, ...prev]);
      logAudit('Tambah Siswa', `Menambahkan siswa baru ${formData.name}`);
      showToast('Siswa baru berhasil didaftarkan!');
    }
    setIsFormOpen(false);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Yakin ingin menonaktifkan atau menghapus siswa "${name}"?`)) {
      setStudents(prev => prev.filter(s => s.id !== id));
      logAudit('Hapus Siswa', `Menghapus siswa ${name}`);
      showToast(`Data siswa ${name} berhasil dihapus.`);
    }
  };

  const handleExportExcel = () => {
    const data = filteredStudents.map(s => ({
      'NIS': s.nis,
      'NISN': s.nisn,
      'Nama Siswa': s.name,
      'Jenis Kelamin': s.gender,
      'Kelas': s.className,
      'Jenjang': s.level,
      'Nama Wali': s.parentName,
      'No WhatsApp': s.parentPhone,
      'Status': s.status
    }));
    exportToExcel(data, 'Data_Siswa_Sikas');
  };

  // Student specific history
  const studentInvoices = useMemo(() => {
    if (!selectedStudentDetail) return [];
    return invoices.filter(inv => inv.studentId === selectedStudentDetail.id);
  }, [selectedStudentDetail, invoices]);

  const studentPayments = useMemo(() => {
    if (!selectedStudentDetail) return [];
    return payments.filter(p => p.studentId === selectedStudentDetail.id);
  }, [selectedStudentDetail, payments]);

  const studentTotalArrears = useMemo(() => {
    return studentInvoices.reduce((sum, inv) => sum + (inv.remainingAmount || 0), 0);
  }, [studentInvoices]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-blue-600" />
            <span>Data Siswa</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pengelolaan biodata siswa, kelas, nomor wali murid WhatsApp, dan riwayat tagihan kas
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            Ekspor Excel
          </button>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Siswa Baru</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama, NIS, NISN, atau wali siswa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:outline-none transition"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:outline-none transition"
            >
              <option value="all">Semua Kelas ({students.length})</option>
              {classes.map(c => (
                <option key={c.id} value={c.name}>Kelas {c.name}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:outline-none transition"
            >
              <option value="all">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Lulus">Lulus</option>
              <option value="Pindah">Pindah</option>
            </select>
          </div>
        </div>
      </div>

      {/* Student Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 pl-4">NIS / NISN</th>
                <th className="py-3.5">Nama Siswa</th>
                <th className="py-3.5">Kelas</th>
                <th className="py-3.5">Wali Murid</th>
                <th className="py-3.5">WhatsApp Wali</th>
                <th className="py-3.5 text-center">Status</th>
                <th className="py-3.5 text-right pr-4">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Tidak ada data siswa yang cocok dengan pencarian.
                  </td>
                </tr>
              ) : (
                filteredStudents.map(st => (
                  <tr key={st.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 pl-4 font-mono">
                      <p className="font-bold text-slate-900">{st.nis}</p>
                      <p className="text-[10px] text-slate-400">{st.nisn || '-'}</p>
                    </td>
                    <td className="py-3.5">
                      <p className="font-bold text-slate-900">{st.name}</p>
                      <span className="text-[10px] text-slate-400">{st.gender}</span>
                    </td>
                    <td className="py-3.5">
                      <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold">
                        {st.className}
                      </span>
                    </td>
                    <td className="py-3.5 font-medium text-slate-700">{st.parentName || '-'}</td>
                    <td className="py-3.5">
                      {st.parentPhone ? (
                        <a
                          href={`https://wa.me/${st.parentPhone.replace(/^0/, '62')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 font-medium"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{st.parentPhone}</span>
                        </a>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-3.5 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {st.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right pr-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedStudentDetail(st)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Lihat Histori Tagihan & Kas"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(st)}
                          className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition"
                          title="Edit Siswa"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(st.id, st.name)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Student Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingStudent ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}
        subtitle="Lengkapi data profil siswa, jenjang kelas, dan kontak wali"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">NIS <span className="text-rose-500">*</span></label>
              <input
                type="text"
                value={formData.nis}
                onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">NISN</label>
              <input
                type="text"
                value={formData.nisn}
                onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Nama Lengkap Siswa <span className="text-rose-500">*</span></label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Contoh: Muhammad Rayhan"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Jenis Kelamin</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              >
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kelas <span className="text-rose-500">*</span></label>
              <select
                value={formData.classId}
                onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
                required
              >
                {classes.map(c => (
                  <option key={c.id} value={c.id}>Kelas {c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              >
                <option value="Aktif">Aktif</option>
                <option value="Lulus">Lulus</option>
                <option value="Pindah">Pindah</option>
                <option value="Nonaktif">Nonaktif</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Wali Siswa</label>
              <input
                type="text"
                value={formData.parentName}
                onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                placeholder="Contoh: Bapak / Ibu Sukardi"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">No. WhatsApp Wali</label>
              <input
                type="text"
                value={formData.parentPhone}
                onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                placeholder="Contoh: 628123456789"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow-sm"
            >
              Simpan Data Siswa
            </button>
          </div>
        </form>
      </Modal>

      {/* Student Financial History Modal */}
      <Modal
        isOpen={Boolean(selectedStudentDetail)}
        onClose={() => setSelectedStudentDetail(null)}
        title={`Histori Keuangan: ${selectedStudentDetail?.name}`}
        subtitle={`Kelas ${selectedStudentDetail?.className} • Wali: ${selectedStudentDetail?.parentName || '-'}`}
        maxWidth="max-w-3xl"
      >
        <div className="space-y-6 text-xs">
          {/* Summary Mini Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Total Tagihan Kas</span>
              <p className="text-base font-extrabold text-slate-900 mt-0.5">
                {formatRupiah(studentInvoices.reduce((s, i) => s + i.amount, 0))}
              </p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <span className="text-[10px] text-emerald-700 uppercase font-semibold">Sudah Terbayar</span>
              <p className="text-base font-extrabold text-emerald-800 mt-0.5">
                {formatRupiah(studentPayments.reduce((s, p) => s + p.amount, 0))}
              </p>
            </div>
            <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
              <span className="text-[10px] text-rose-700 uppercase font-semibold">Sisa Tunggakan</span>
              <p className="text-base font-extrabold text-rose-800 mt-0.5">
                {formatRupiah(studentTotalArrears)}
              </p>
            </div>
          </div>

          {/* List of Invoices */}
          <div>
            <h4 className="font-bold text-slate-800 mb-2">Daftar Tagihan Kas Siswa</h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-500">
                  <tr>
                    <th className="py-2.5 px-3">Jenis Kas</th>
                    <th className="py-2.5 px-3">Periode</th>
                    <th className="py-2.5 px-3 text-right">Nominal</th>
                    <th className="py-2.5 px-3 text-right">Sisa</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentInvoices.map(inv => (
                    <tr key={inv.id}>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">{inv.feeName}</td>
                      <td className="py-2.5 px-3 text-slate-500">{inv.periodName}</td>
                      <td className="py-2.5 px-3 text-right font-medium">{formatRupiah(inv.amount)}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-rose-600">
                        {formatRupiah(inv.remainingAmount)}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          inv.status === 'Lunas' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* List of Payments */}
          <div>
            <h4 className="font-bold text-slate-800 mb-2">Histori Pembayaran Diterima</h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-500">
                  <tr>
                    <th className="py-2.5 px-3">No Kuitansi</th>
                    <th className="py-2.5 px-3">Tanggal</th>
                    <th className="py-2.5 px-3">Metode</th>
                    <th className="py-2.5 px-3 text-right">Nominal Diterima</th>
                    <th className="py-2.5 px-3">Petugas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentPayments.map(p => (
                    <tr key={p.id}>
                      <td className="py-2.5 px-3 font-mono font-bold text-blue-600">{p.receiptNumber}</td>
                      <td className="py-2.5 px-3 text-slate-500">{formatDate(p.paymentDate, 'short')}</td>
                      <td className="py-2.5 px-3 capitalize">{p.method}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-900">{formatRupiah(p.amount)}</td>
                      <td className="py-2.5 px-3 text-slate-500">{p.recordedBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
