export const initialSchoolData = {
  id: 'school_01',
  name: 'SDIT Bina Insan Cendekia',
  npsn: '20256789',
  address: 'Jl. Pendidikan No. 45, Sukajadi, Kota Bandung, Jawa Barat',
  phone: '022-7561234',
  email: 'info@binainsan.sch.id',
  website: 'https://binainsan.sch.id',
  principalName: 'Dr. H. Mulyadi, M.Pd.',
  principalNip: '19750812 200003 1 002',
  treasurerName: 'Siti Nurhaliza, S.Ak.',
  treasurerNip: '19850420 200801 2 005',
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
    bankName: 'Uang Fisik di Brankas',
    initialBalance: 2500000,
    currentBalance: 3250000,
    holderName: 'Siti Nurhaliza (Bendahara)',
    status: 'active',
    note: 'Kas fisik harian untuk operasional dan transaksi tunai siswa'
  },
  {
    id: 'acc_bank_bsi',
    name: 'Rekening BSI Operasional Siswa',
    type: 'bank',
    accountNumber: '7148920192',
    bankName: 'Bank Syariah Indonesia (BSI)',
    initialBalance: 12000000,
    currentBalance: 15450000,
    holderName: 'YYS BINA INSAN CENDEKIA KAS',
    status: 'active',
    note: 'Rekening utama penampung transfer kas & infaq siswa'
  },
  {
    id: 'acc_bank_mandiri',
    name: 'Rekening Mandiri Cadangan',
    type: 'bank',
    accountNumber: '1310029384711',
    bankName: 'Bank Mandiri',
    initialBalance: 5000000,
    currentBalance: 5000000,
    holderName: 'YYS BINA INSAN CENDEKIA',
    status: 'active',
    note: 'Rekening cadangan darurat kas sekolah'
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

export const initialClasses = [
  { id: 'cls_5a', name: '5A', level: 'SD', homeroomTeacher: 'Ustadzah Maryam, S.Pd.', capacity: 28, academicYear: '2026/2027', status: 'active' },
  { id: 'cls_5b', name: '5B', level: 'SD', homeroomTeacher: 'Ustadz Farid Ridwan, S.Pd.I.', capacity: 30, academicYear: '2026/2027', status: 'active' },
  { id: 'cls_4a', name: '4A', level: 'SD', homeroomTeacher: 'Fatimah Az-Zahra, S.Pd.', capacity: 28, academicYear: '2026/2027', status: 'active' },
  { id: 'cls_6a', name: '6A', level: 'SD', homeroomTeacher: 'Bambang Kusuma, M.Pd.', capacity: 25, academicYear: '2026/2027', status: 'active' }
];

export const initialFeeTypes = [
  {
    id: 'fee_kas_bulanan',
    name: 'Kas Siswa Bulanan',
    amount: 25000,
    frequency: 'Bulanan',
    academicYear: '2026/2027',
    target: 'Semua Siswa',
    dueDay: 10, // tanggal 10 tiap bulan
    description: 'Iuran kas bulanan untuk operasional kegiatan dan kebutuhan kelas'
  },
  {
    id: 'fee_kas_kegiatan',
    name: 'Kas Praktikum & Kegiatan Siswa Semester 1',
    amount: 50000,
    frequency: 'Satu Kali',
    academicYear: '2026/2027',
    target: 'Kelas 5A, 5B',
    dueDay: 25,
    description: 'Iuran kegiatan praktikum sains dan kunjungan edukasi semester ganjil'
  }
];

export const initialStudents = [
  {
    id: 'std_001',
    nis: '2026101',
    nisn: '0089234512',
    name: 'Ahmad Abdullah',
    gender: 'Laki-laki',
    level: 'SD',
    classId: 'cls_5a',
    className: '5A',
    academicYear: '2026/2027',
    parentName: 'Bapak Abdullah Hasan',
    parentPhone: '6281234567890',
    status: 'Aktif'
  },
  {
    id: 'std_002',
    nis: '2026102',
    nisn: '0089234513',
    name: 'Siti Rahma Nur Aulia',
    gender: 'Perempuan',
    level: 'SD',
    classId: 'cls_5a',
    className: '5A',
    academicYear: '2026/2027',
    parentName: 'Ibu Rahmawati',
    parentPhone: '6281298765432',
    status: 'Aktif'
  },
  {
    id: 'std_003',
    nis: '2026103',
    nisn: '0089234514',
    name: 'Budi Santoso',
    gender: 'Laki-laki',
    level: 'SD',
    classId: 'cls_5a',
    className: '5A',
    academicYear: '2026/2027',
    parentName: 'Bapak Santoso Prabowo',
    parentPhone: '6285211223344',
    status: 'Aktif'
  },
  {
    id: 'std_004',
    nis: '2026104',
    nisn: '0089234515',
    name: 'Raisa Putri Ananda',
    gender: 'Perempuan',
    level: 'SD',
    classId: 'cls_5a',
    className: '5A',
    academicYear: '2026/2027',
    parentName: 'Bapak Ananda Sukardi',
    parentPhone: '6281344556677',
    status: 'Aktif'
  },
  {
    id: 'std_005',
    nis: '2026105',
    nisn: '0089234516',
    name: 'Muhammad Fatih Al-Ayyubi',
    gender: 'Laki-laki',
    level: 'SD',
    classId: 'cls_5b',
    className: '5B',
    academicYear: '2026/2027',
    parentName: 'Ibu Fauziah',
    parentPhone: '6282133445566',
    status: 'Aktif'
  },
  {
    id: 'std_006',
    nis: '2026106',
    nisn: '0089234517',
    name: 'Annisa Zahra Firdaus',
    gender: 'Perempuan',
    level: 'SD',
    classId: 'cls_5b',
    className: '5B',
    academicYear: '2026/2027',
    parentName: 'Bapak Firdaus Mansur',
    parentPhone: '6287812349988',
    status: 'Aktif'
  },
  {
    id: 'std_007',
    nis: '2026107',
    nisn: '0089234518',
    name: 'Fauzan Pratama',
    gender: 'Laki-laki',
    level: 'SD',
    classId: 'cls_4a',
    className: '4A',
    academicYear: '2026/2027',
    parentName: 'Bapak Pratama',
    parentPhone: '6289655443322',
    status: 'Aktif'
  },
  {
    id: 'std_008',
    nis: '2026108',
    nisn: '0089234519',
    name: 'Nayla Salsabila',
    gender: 'Perempuan',
    level: 'SD',
    classId: 'cls_6a',
    className: '6A',
    academicYear: '2026/2027',
    parentName: 'Ibu Salsabila',
    parentPhone: '6285777889900',
    status: 'Aktif'
  }
];

export const initialInvoices = [
  // Ahmad Abdullah
  {
    id: 'inv_101',
    invoiceNumber: 'TAG-2026-101',
    feeTypeId: 'fee_kas_bulanan',
    feeName: 'Kas Siswa Bulanan',
    periodName: 'Oktober 2026',
    studentId: 'std_001',
    studentName: 'Ahmad Abdullah',
    classId: 'cls_5a',
    className: '5A',
    amount: 25000,
    paidAmount: 25000,
    remainingAmount: 0,
    dueDate: '2026-10-10',
    status: 'Lunas' // Lunas, Cicilan, Belum Bayar
  },
  {
    id: 'inv_102',
    invoiceNumber: 'TAG-2026-102',
    feeTypeId: 'fee_kas_kegiatan',
    feeName: 'Kas Praktikum & Kegiatan Siswa',
    periodName: 'Semester 1 2026/2027',
    studentId: 'std_001',
    studentName: 'Ahmad Abdullah',
    classId: 'cls_5a',
    className: '5A',
    amount: 50000,
    paidAmount: 25000,
    remainingAmount: 25000,
    dueDate: '2026-10-25',
    status: 'Cicilan'
  },
  // Siti Rahma
  {
    id: 'inv_103',
    invoiceNumber: 'TAG-2026-103',
    feeTypeId: 'fee_kas_bulanan',
    feeName: 'Kas Siswa Bulanan',
    periodName: 'Oktober 2026',
    studentId: 'std_002',
    studentName: 'Siti Rahma Nur Aulia',
    classId: 'cls_5a',
    className: '5A',
    amount: 25000,
    paidAmount: 25000,
    remainingAmount: 0,
    dueDate: '2026-10-10',
    status: 'Lunas'
  },
  // Budi Santoso
  {
    id: 'inv_104',
    invoiceNumber: 'TAG-2026-104',
    feeTypeId: 'fee_kas_bulanan',
    feeName: 'Kas Siswa Bulanan',
    periodName: 'Oktober 2026',
    studentId: 'std_003',
    studentName: 'Budi Santoso',
    classId: 'cls_5a',
    className: '5A',
    amount: 25000,
    paidAmount: 0,
    remainingAmount: 25000,
    dueDate: '2026-10-10',
    status: 'Belum Bayar'
  },
  // Raisa Putri
  {
    id: 'inv_105',
    invoiceNumber: 'TAG-2026-105',
    feeTypeId: 'fee_kas_bulanan',
    feeName: 'Kas Siswa Bulanan',
    periodName: 'Oktober 2026',
    studentId: 'std_004',
    studentName: 'Raisa Putri Ananda',
    classId: 'cls_5a',
    className: '5A',
    amount: 25000,
    paidAmount: 25000,
    remainingAmount: 0,
    dueDate: '2026-10-10',
    status: 'Lunas'
  },
  // Muhammad Fatih
  {
    id: 'inv_106',
    invoiceNumber: 'TAG-2026-106',
    feeTypeId: 'fee_kas_bulanan',
    feeName: 'Kas Siswa Bulanan',
    periodName: 'Oktober 2026',
    studentId: 'std_005',
    studentName: 'Muhammad Fatih Al-Ayyubi',
    classId: 'cls_5b',
    className: '5B',
    amount: 25000,
    paidAmount: 0,
    remainingAmount: 25000,
    dueDate: '2026-10-10',
    status: 'Belum Bayar'
  },
  // Annisa Zahra
  {
    id: 'inv_107',
    invoiceNumber: 'TAG-2026-107',
    feeTypeId: 'fee_kas_bulanan',
    feeName: 'Kas Siswa Bulanan',
    periodName: 'Oktober 2026',
    studentId: 'std_006',
    studentName: 'Annisa Zahra Firdaus',
    classId: 'cls_5b',
    className: '5B',
    amount: 25000,
    paidAmount: 25000,
    remainingAmount: 0,
    dueDate: '2026-10-10',
    status: 'Lunas'
  }
];

export const initialPayments = [
  {
    id: 'pay_001',
    receiptNumber: 'KAS-2026-000001',
    paymentDate: '2026-10-19',
    studentId: 'std_001',
    studentName: 'Ahmad Abdullah',
    className: '5A',
    payerName: 'Bapak Abdullah Hasan',
    payerType: 'Wali Murid',
    feeTypeId: 'fee_kas_bulanan',
    feeName: 'Kas Siswa Bulanan - Oktober 2026',
    invoiceId: 'inv_101',
    amount: 25000,
    method: 'cash',
    accountId: 'acc_cash_1',
    accountName: 'Kas Tunai Bendahara',
    referenceNumber: '-',
    proofUrl: '',
    status: 'verified', // verified, pending, cancelled
    recordedBy: 'Siti Nurhaliza (Bendahara)',
    verifiedBy: 'Siti Nurhaliza (Bendahara)',
    notes: 'Pembayaran kas bulan Oktober diterima tunai di meja bendahara'
  },
  {
    id: 'pay_002',
    receiptNumber: 'KAS-2026-000002',
    paymentDate: '2026-10-19',
    studentId: 'std_002',
    studentName: 'Siti Rahma Nur Aulia',
    className: '5A',
    payerName: 'Ibu Rahmawati',
    payerType: 'Wali Murid',
    feeTypeId: 'fee_kas_bulanan',
    feeName: 'Kas Siswa Bulanan - Oktober 2026',
    invoiceId: 'inv_103',
    amount: 25000,
    method: 'transfer',
    accountId: 'acc_bank_bsi',
    accountName: 'Rekening BSI Operasional Siswa',
    referenceNumber: 'BSI-TX9928174',
    proofUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400',
    status: 'verified',
    recordedBy: 'Siti Nurhaliza (Bendahara)',
    verifiedBy: 'Siti Nurhaliza (Bendahara)',
    notes: 'Transfer via BSI Mobile, mutasi telah dicek dan cocok'
  },
  {
    id: 'pay_003',
    receiptNumber: 'KAS-2026-000003',
    paymentDate: '2026-10-18',
    studentId: 'std_004',
    studentName: 'Raisa Putri Ananda',
    className: '5A',
    payerName: 'Raisa Putri Ananda',
    payerType: 'Siswa',
    feeTypeId: 'fee_kas_bulanan',
    feeName: 'Kas Siswa Bulanan - Oktober 2026',
    invoiceId: 'inv_105',
    amount: 25000,
    method: 'cash',
    accountId: 'acc_cash_1',
    accountName: 'Kas Tunai Bendahara',
    referenceNumber: '-',
    proofUrl: '',
    status: 'verified',
    recordedBy: 'Farah (Petugas Kas)',
    verifiedBy: 'Siti Nurhaliza (Bendahara)',
    notes: 'Uang pas diterima di kelas'
  },
  {
    id: 'pay_004',
    receiptNumber: 'KAS-2026-000004',
    paymentDate: '2026-10-19',
    studentId: 'std_001',
    studentName: 'Ahmad Abdullah',
    className: '5A',
    payerName: 'Bapak Abdullah Hasan',
    payerType: 'Wali Murid',
    feeTypeId: 'fee_kas_kegiatan',
    feeName: 'Kas Praktikum & Kegiatan Siswa',
    invoiceId: 'inv_102',
    amount: 25000,
    method: 'cash',
    accountId: 'acc_cash_1',
    accountName: 'Kas Tunai Bendahara',
    referenceNumber: '-',
    proofUrl: '',
    status: 'verified',
    recordedBy: 'Siti Nurhaliza (Bendahara)',
    verifiedBy: 'Siti Nurhaliza (Bendahara)',
    notes: 'Cicilan 1 dari total Rp 50.000'
  },
  {
    id: 'pay_005',
    receiptNumber: 'KAS-2026-000005',
    paymentDate: '2026-10-19',
    studentId: 'std_006',
    studentName: 'Annisa Zahra Firdaus',
    className: '5B',
    payerName: 'Bapak Firdaus Mansur',
    payerType: 'Wali Murid',
    feeTypeId: 'fee_kas_bulanan',
    feeName: 'Kas Siswa Bulanan - Oktober 2026',
    invoiceId: 'inv_107',
    amount: 25000,
    method: 'transfer',
    accountId: 'acc_bank_bsi',
    accountName: 'Rekening BSI Operasional Siswa',
    referenceNumber: 'REF-BSI-8827361',
    proofUrl: '',
    status: 'pending', // Menunggu verifikasi mutasi bank
    recordedBy: 'Farah (Petugas Kas)',
    verifiedBy: '-',
    notes: 'Wali murid mengabarkan via WhatsApp sudah transfer, bukti sedang diverifikasi'
  }
];

export const initialOtherIncomes = [
  {
    id: 'inc_001',
    transactionNumber: 'INC-2026-000001',
    date: '2026-10-12',
    categoryId: 'cat_inc_3',
    categoryName: 'Sumbangan & Donasi Sukarela',
    description: 'Sumbangan sukarela wali murid untuk pengadaan proyektor mini kelas',
    source: 'Hamba Allah (Wali Siswa Kelas 5A)',
    amount: 750000,
    accountId: 'acc_bank_bsi',
    accountName: 'Rekening BSI Operasional Siswa',
    proofNumber: 'DON-2026-10',
    recordedBy: 'Siti Nurhaliza (Bendahara)'
  },
  {
    id: 'inc_002',
    transactionNumber: 'INC-2026-000002',
    date: '2026-10-15',
    categoryId: 'cat_inc_4',
    categoryName: 'Pengembalian Sisa Belanja',
    description: 'Pengembalian kelebihan uang belanja fotokopi modul sains kelas 5',
    source: 'Toko Grafika Sejahtera',
    amount: 35000,
    accountId: 'acc_cash_1',
    accountName: 'Kas Tunai Bendahara',
    proofNumber: 'NOTA-GRAF-441',
    recordedBy: 'Siti Nurhaliza (Bendahara)'
  }
];

export const initialExpenses = [
  {
    id: 'exp_001',
    transactionNumber: 'OUT-2026-000001',
    date: '2026-10-14',
    categoryId: 'cat_exp_1',
    categoryName: 'ATK & Administrasi Kelas',
    description: 'Buku jurnal presensi kas, spidol whiteboard 3 warna, dan map binder keuangan',
    vendor: 'Toko Buku Gramedia / Jaya ATK',
    amount: 145000,
    accountId: 'acc_cash_1',
    accountName: 'Kas Tunai Bendahara',
    proofNumber: 'NOTA-JAYA-9182',
    status: 'approved', // pending, approved, rejected
    recordedBy: 'Siti Nurhaliza (Bendahara)',
    approvedBy: 'Dr. H. Mulyadi, M.Pd. (Kepsek)'
  },
  {
    id: 'exp_002',
    transactionNumber: 'OUT-2026-000002',
    date: '2026-10-16',
    categoryId: 'cat_exp_3',
    categoryName: 'Kebersihan & Sanitasi Ruangan',
    description: 'Pengadaan sapu ijuk baru (4 unit), pembersih lantai refill, dan hand sanitizer',
    vendor: 'Toserba Griya Sukajadi',
    amount: 85000,
    accountId: 'acc_cash_1',
    accountName: 'Kas Tunai Bendahara',
    proofNumber: 'STRUK-GRY-7712',
    status: 'approved',
    recordedBy: 'Siti Nurhaliza (Bendahara)',
    approvedBy: 'Dr. H. Mulyadi, M.Pd. (Kepsek)'
  },
  {
    id: 'exp_003',
    transactionNumber: 'OUT-2026-000003',
    date: '2026-10-17',
    categoryId: 'cat_exp_2',
    categoryName: 'Kegiatan & Lomba Siswa',
    description: 'Hadiah piagam dan bingkisan snack lomba cerdas cermat antar-kelas',
    vendor: 'Snack Corner Prima',
    amount: 220000,
    accountId: 'acc_bank_bsi',
    accountName: 'Rekening BSI Operasional Siswa',
    proofNumber: 'TRF-SNACK-221',
    status: 'approved',
    recordedBy: 'Siti Nurhaliza (Bendahara)',
    approvedBy: 'Dr. H. Mulyadi, M.Pd. (Kepsek)'
  }
];

export const initialTransfers = [
  {
    id: 'trf_001',
    transferNumber: 'TRF-2026-000001',
    date: '2026-10-15',
    fromAccountId: 'acc_cash_1',
    fromAccountName: 'Kas Tunai Bendahara',
    toAccountId: 'acc_bank_bsi',
    toAccountName: 'Rekening BSI Operasional Siswa',
    amount: 500000,
    notes: 'Setoran tunai ke rekening bank BSI dari hasil penerimaan kas awal pekan',
    recordedBy: 'Siti Nurhaliza (Bendahara)'
  }
];

export const initialReconciliations = [
  {
    id: 'rec_001',
    reconciliationDate: '2026-10-18',
    accountId: 'acc_cash_1',
    accountName: 'Kas Tunai Bendahara',
    systemBalance: 3250000,
    physicalBalance: 3250000,
    difference: 0,
    status: 'Cocok',
    examinerName: 'H. Anwar Nasihin (Auditor / Komite)',
    notes: 'Penghitungan fisik uang brankas sesuai 100% dengan buku kas.'
  }
];

export const initialUsers = [
  {
    id: 'usr_super',
    name: 'Super Admin TI',
    email: 'admin@binainsan.sch.id',
    role: 'Super Admin',
    roleLabel: 'Super Administrator',
    color: 'purple',
    permissions: ['all']
  },
  {
    id: 'usr_bendahara',
    name: 'Siti Nurhaliza, S.Ak.',
    email: 'bendahara@binainsan.sch.id',
    role: 'Bendahara',
    roleLabel: 'Bendahara Sekolah',
    color: 'blue',
    permissions: ['manage_payments', 'manage_expenses', 'manage_income', 'reconciliation', 'reports', 'manage_invoices']
  },
  {
    id: 'usr_kepsek',
    name: 'Dr. H. Mulyadi, M.Pd.',
    email: 'kepsek@binainsan.sch.id',
    role: 'Kepala Sekolah',
    roleLabel: 'Kepala Sekolah',
    color: 'emerald',
    permissions: ['view_dashboard', 'view_reports', 'approve_expenses', 'period_closing']
  },
  {
    id: 'usr_petugas',
    name: 'Farah Diba, A.Md.',
    email: 'kasir@binainsan.sch.id',
    role: 'Petugas Kas',
    roleLabel: 'Petugas Kasir / Administrasi',
    color: 'amber',
    permissions: ['record_payments', 'view_students', 'view_invoices', 'print_receipts']
  },
  {
    id: 'usr_auditor',
    name: 'H. Anwar Nasihin (Komite)',
    email: 'auditor@binainsan.sch.id',
    role: 'Pemeriksa / Auditor',
    roleLabel: 'Pemeriksa / Auditor Independen',
    color: 'slate',
    permissions: ['audit_view', 'view_reports', 'reconciliation_check']
  }
];

export const initialPeriodClosings = [
  {
    id: 'close_sep_2026',
    periodName: 'September 2026',
    startDate: '2026-09-01',
    endDate: '2026-09-30',
    initialBalance: 17500000,
    totalIncome: 3450000,
    totalExpense: 1250000,
    closingBalance: 19700000,
    totalArrears: 150000,
    closedBy: 'Dr. H. Mulyadi, M.Pd. (Kepsek)',
    closedAt: '2026-10-01 10:00:00',
    isLocked: true,
    notes: 'Penutupan buku September 2026 telah diverifikasi komite sekolah.'
  }
];
