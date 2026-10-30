// Clean Initial Zero (NOL) Data - Ready for Real School Production Input
export const initialSchoolData = {
  id: 'school_01',
  name: 'Nama Sekolah Anda',
  npsn: '-',
  address: 'Alamat Lengkap Sekolah',
  phone: '-',
  email: 'info@sekolah.sch.id',
  website: '-',
  principalName: 'Nama Kepala Sekolah',
  principalNip: '-',
  treasurerName: 'Nama Bendahara',
  treasurerNip: '-',
  activeAcademicYear: '2026/2027',
  receiptPrefix: 'KAS',
  expensePrefix: 'OUT',
  incomePrefix: 'INC'
};

export const initialAccounts = [
  {
    id: 'acc_cash_1',
    name: 'Kas Tunai Bendahara',
    type: 'cash',
    accountNumber: '-',
    bankName: 'Uang Fisik / Brankas',
    initialBalance: 0,
    currentBalance: 0,
    holderName: 'Bendahara Sekolah',
    status: 'active',
    note: 'Kas tunai fisik harian untuk operasional dan transaksi langsung'
  },
  {
    id: 'acc_bank_1',
    name: 'Rekening Bank Sekolah',
    type: 'bank',
    accountNumber: '-',
    bankName: 'Bank Operasional',
    initialBalance: 0,
    currentBalance: 0,
    holderName: 'Rekening Sekolah',
    status: 'active',
    note: 'Rekening bank penampung transfer kas & infaq siswa'
  }
];

export const initialCategories = [
  // Income categories
  { id: 'cat_inc_1', name: 'Kas Rutin Siswa', type: 'income', isSystem: true, color: 'blue' },
  { id: 'cat_inc_2', name: 'Kas Kegiatan / Proyek Siswa', type: 'income', isSystem: false, color: 'emerald' },
  { id: 'cat_inc_3', name: 'Sumbangan & Donasi Sukarela', type: 'income', isSystem: false, color: 'purple' },
  { id: 'cat_inc_4', name: 'Pengembalian Sisa Belanja', type: 'income', isSystem: false, color: 'teal' },
  { id: 'cat_inc_5', name: 'Penerimaan Lain yang Sah', type: 'income', isSystem: false, color: 'gray' },
  
  // Expense categories
  { id: 'cat_exp_1', name: 'ATK & Administrasi Kelas', type: 'expense', isSystem: false, color: 'indigo' },
  { id: 'cat_exp_2', name: 'Kegiatan & Lomba Siswa', type: 'expense', isSystem: false, color: 'amber' },
  { id: 'cat_exp_3', name: 'Kebersihan & Sanitasi Ruangan', type: 'expense', isSystem: false, color: 'emerald' },
  { id: 'cat_exp_4', name: 'Perlengkapan & Sarana Prasarana', type: 'expense', isSystem: false, color: 'orange' },
  { id: 'cat_exp_5', name: 'Operasional Kas & Konsumsi', type: 'expense', isSystem: false, color: 'rose' },
  { id: 'cat_exp_6', name: 'Pengeluaran Lain-lain', type: 'expense', isSystem: false, color: 'slate' }
];

export const initialClasses = [];
export const initialFeeTypes = [];
export const initialStudents = [];
export const initialInvoices = [];
export const initialPayments = [];
export const initialOtherIncomes = [];
export const initialExpenses = [];
export const initialTransfers = [];
export const initialReconciliations = [];
export const initialPeriodClosings = [];

export const initialUsers = [
  {
    id: 'usr_super',
    name: 'Administrator Sekolah',
    email: 'admin@sekolah.sch.id',
    role: 'Super Admin',
    roleLabel: 'Super Administrator',
    color: 'purple',
    permissions: ['all']
  },
  {
    id: 'usr_bendahara',
    name: 'Bendahara Sekolah',
    email: 'bendahara@sekolah.sch.id',
    role: 'Bendahara',
    roleLabel: 'Bendahara Sekolah',
    color: 'blue',
    permissions: ['manage_payments', 'manage_expenses', 'manage_income', 'reconciliation', 'reports', 'manage_invoices']
  },
  {
    id: 'usr_kepsek',
    name: 'Kepala Sekolah',
    email: 'kepsek@sekolah.sch.id',
    role: 'Kepala Sekolah',
    roleLabel: 'Kepala Sekolah',
    color: 'emerald',
    permissions: ['view_dashboard', 'view_reports', 'approve_expenses', 'period_closing']
  },
  {
    id: 'usr_petugas',
    name: 'Petugas Kas / Kasir',
    email: 'petugas@sekolah.sch.id',
    role: 'Petugas Kas',
    roleLabel: 'Petugas Kasir / Administrasi',
    color: 'amber',
    permissions: ['record_payments', 'view_students', 'view_invoices', 'print_receipts']
  },
  {
    id: 'usr_auditor',
    name: 'Pemeriksa / Komite Sekolah',
    email: 'komite@sekolah.sch.id',
    role: 'Pemeriksa / Auditor',
    roleLabel: 'Pemeriksa / Auditor Independen',
    color: 'slate',
    permissions: ['audit_view', 'view_reports', 'reconciliation_check']
  }
];
