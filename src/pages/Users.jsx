import React, { useState } from 'react';
import { ShieldCheck, UserCheck, Check, X, Plus, Edit2, Trash2, Shield, UserPlus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Modal from '../components/common/Modal';

export default function Users() {
  const { users, setUsers, currentUser, setCurrentUser, logAudit, showToast } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Bendahara',
    roleLabel: 'Bendahara Sekolah',
    color: 'blue'
  });

  const roleConfigs = {
    'Super Admin': { label: 'Super Administrator', color: 'purple', permissions: ['all'] },
    'Bendahara': { label: 'Bendahara Sekolah', color: 'blue', permissions: ['manage_payments', 'manage_expenses', 'manage_income', 'reconciliation', 'reports', 'manage_invoices'] },
    'Kepala Sekolah': { label: 'Kepala Sekolah', color: 'emerald', permissions: ['view_dashboard', 'view_reports', 'approve_expenses', 'period_closing'] },
    'Petugas Kas': { label: 'Petugas Kasir / Administrasi', color: 'amber', permissions: ['record_payments', 'view_students', 'view_invoices', 'print_receipts'] },
    'Pemeriksa / Auditor': { label: 'Pemeriksa / Auditor Independen', color: 'slate', permissions: ['audit_view', 'view_reports', 'reconciliation_check'] }
  };

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'Bendahara',
      roleLabel: 'Bendahara Sekolah',
      color: 'blue'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      roleLabel: user.roleLabel || roleConfigs[user.role]?.label || user.role,
      color: user.color || roleConfigs[user.role]?.color || 'blue'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const config = roleConfigs[formData.role] || roleConfigs['Bendahara'];

    if (editingUser) {
      const updated = {
        ...editingUser,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        roleLabel: config.label,
        color: config.color,
        permissions: config.permissions
      };

      setUsers(prev => prev.map(u => u.id === editingUser.id ? updated : u));

      // If updating current logged in user
      if (currentUser.id === editingUser.id) {
        setCurrentUser(updated);
      }

      logAudit('Edit Pengguna', `Memperbarui akun pengguna ${formData.name}`);
      showToast(`Data pengguna ${formData.name} berhasil diperbarui!`);
    } else {
      const newUser = {
        id: `usr_${Date.now()}`,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        roleLabel: config.label,
        color: config.color,
        permissions: config.permissions
      };

      setUsers(prev => [...prev, newUser]);
      logAudit('Tambah Pengguna', `Menambahkan pengguna baru ${formData.name}`);
      showToast(`Pengguna baru ${formData.name} berhasil ditambahkan!`);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (user) => {
    if (users.length <= 1) {
      alert('Sistem harus memiliki minimal satu pengguna.');
      return;
    }

    if (currentUser.id === user.id) {
      alert('Anda tidak dapat menghapus akun yang sedang aktif digunakan.');
      return;
    }

    if (window.confirm(`Yakin ingin menghapus pengguna "${user.name}" (${user.role})?`)) {
      setUsers(prev => prev.filter(u => u.id !== user.id));
      logAudit('Hapus Pengguna', `Menghapus akun pengguna ${user.name}`);
      showToast(`Pengguna ${user.name} berhasil dihapus.`);
    }
  };

  const permissionsMatrix = [
    { name: 'Melihat Dashboard & Statistik Ringkas', superAdmin: true, kepsek: true, bendahara: true, petugas: true, auditor: true },
    { name: 'Mencatat Pembayaran Kas Siswa & Cetak Kuitansi', superAdmin: true, kepsek: false, bendahara: true, petugas: true, auditor: false },
    { name: 'Verifikasi Mutasi Transfer Bank Masuk', superAdmin: true, kepsek: false, bendahara: true, petugas: false, auditor: false },
    { name: 'Mencatat Pemasukan Lain (Sumbangan/Donasi)', superAdmin: true, kepsek: false, bendahara: true, petugas: false, auditor: false },
    { name: 'Mencatat Pengeluaran Kas (Belanja & Nota)', superAdmin: true, kepsek: false, bendahara: true, petugas: false, auditor: false },
    { name: 'Menyetujui Pengeluaran Kas Sekolah', superAdmin: true, kepsek: true, bendahara: false, petugas: false, auditor: false },
    { name: 'Melakukan Transfer Internal Antar-Akun', superAdmin: true, kepsek: false, bendahara: true, petugas: false, auditor: false },
    { name: 'Melakukan Audit Rekonsiliasi Fisik Kas & Bank', superAdmin: true, kepsek: true, bendahara: true, petugas: false, auditor: true },
    { name: 'Melihat Laporan Keuangan Lengkap & Ekspor', superAdmin: true, kepsek: true, bendahara: true, petugas: false, auditor: true },
    { name: 'Menutup & Mengunci Periode Pembukuan', superAdmin: true, kepsek: true, bendahara: false, petugas: false, auditor: false },
    { name: 'Konfigurasi Sekolah, Akun Kas, & Pengguna', superAdmin: true, kepsek: false, bendahara: false, petugas: false, auditor: false }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-blue-600" />
            <span>Pengguna & Hak Akses (RBAC)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola nama petugas, bendahara, kepala sekolah, serta hak akses pembukuan keuangan
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Tambah Pengguna Baru</span>
        </button>
      </div>

      {/* User Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map(u => {
          const isActive = currentUser.id === u.id;
          return (
            <div
              key={u.id}
              className={`p-5 rounded-2xl border transition relative flex flex-col justify-between ${
                isActive
                  ? 'bg-blue-50/50 border-blue-500 shadow-md ring-2 ring-blue-500/20'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                      {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 leading-tight">{u.name}</h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">{u.email}</p>
                    </div>
                  </div>

                  {isActive && (
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-600 text-white shadow-sm">
                      Aktif
                    </span>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="inline-block text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                    {u.role}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(u)}
                      className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition"
                      title="Ubah Nama & Data Pengguna"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    {!isActive && (
                      <button
                        onClick={() => handleDelete(u)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                        title="Hapus Pengguna"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setCurrentUser(u);
                  showToast(`Berhasil beralih peran ke ${u.name} (${u.role})`);
                }}
                disabled={isActive}
                className={`w-full mt-4 py-2 px-3 rounded-xl text-xs font-bold transition ${
                  isActive
                    ? 'bg-blue-600 text-white cursor-default'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {isActive ? '✓ Sedang Dipakai Login' : 'Ganti ke Akun Ini'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Modal Add / Edit User */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? 'Edit Data Pengguna' : 'Tambah Pengguna Baru'}
        subtitle="Atur nama asli petugas, alamat email, dan tingkat kewenangan akun"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Nama Lengkap Pengguna <span className="text-rose-500">*</span></label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Contoh: Dadi Riyadi, S.Pd."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Alamat Email <span className="text-rose-500">*</span></label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Contoh: bendahara@sekolah.sch.id"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Peran / Hak Akses (Role) <span className="text-rose-500">*</span></label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
              required
            >
              <option value="Bendahara">Bendahara (Mencatat kas, kuitansi, & laporan)</option>
              <option value="Kepala Sekolah">Kepala Sekolah (Melihat laporan, persetujuan, & tutup buku)</option>
              <option value="Petugas Kas">Petugas Kasir (Penerimaan kas & cetak kuitansi)</option>
              <option value="Super Admin">Super Admin (Akses penuh seluruh konfigurasi)</option>
              <option value="Pemeriksa / Auditor">Pemeriksa / Auditor (Melihat transaksi & audit kas)</option>
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
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm"
            >
              {editingUser ? 'Simpan Perubahan' : 'Tambahkan Pengguna'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Permissions Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-slate-900">Matriks Hak Akses Kewenangan SIKAS SISWA</h3>
          <p className="text-xs text-slate-500">Standar pemisahan tugas pembukuan (Separation of Duties) untuk mencegah kecurangan</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-3">Fitur / Hak Akses Sistem</th>
                <th className="py-3 px-2 text-center text-purple-700">Super Admin</th>
                <th className="py-3 px-2 text-center text-emerald-700">Kepala Sekolah</th>
                <th className="py-3 px-2 text-center text-blue-700">Bendahara</th>
                <th className="py-3 px-2 text-center text-amber-700">Petugas Kas</th>
                <th className="py-3 px-2 text-center text-slate-700">Auditor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {permissionsMatrix.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-medium text-slate-800">{item.name}</td>
                  <td className="py-2.5 px-2 text-center">
                    {item.superAdmin ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    {item.kepsek ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    {item.bendahara ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    {item.petugas ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    {item.auditor ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
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
