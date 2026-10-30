import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  initialSchoolData,
  initialAccounts,
  initialCategories,
  initialClasses,
  initialFeeTypes,
  initialStudents,
  initialInvoices,
  initialPayments,
  initialOtherIncomes,
  initialExpenses,
  initialTransfers,
  initialReconciliations,
  initialUsers,
  initialPeriodClosings
} from '../services/mockData';
import { generateTransactionCode, generateId } from '../utils/codeGenerators';

const AppContext = createContext();

const STORAGE_KEYS = {
  SCHOOL: 'sikas_school',
  ACCOUNTS: 'sikas_accounts',
  CATEGORIES: 'sikas_categories',
  CLASSES: 'sikas_classes',
  FEE_TYPES: 'sikas_fee_types',
  STUDENTS: 'sikas_students',
  INVOICES: 'sikas_invoices',
  PAYMENTS: 'sikas_payments',
  INCOME: 'sikas_income',
  EXPENSES: 'sikas_expenses',
  TRANSFERS: 'sikas_transfers',
  RECONCILIATIONS: 'sikas_reconciliations',
  USERS: 'sikas_users',
  CURRENT_USER: 'sikas_current_user',
  CLOSINGS: 'sikas_closings',
  AUDIT_LOGS: 'sikas_audit_logs'
};

function loadStored(key, fallback) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (e) {
    console.error(`Failed to load ${key} from localStorage:`, e);
    return fallback;
  }
}

export function AppProvider({ children }) {
  const [school, setSchool] = useState(() => loadStored(STORAGE_KEYS.SCHOOL, initialSchoolData));
  const [accounts, setAccounts] = useState(() => loadStored(STORAGE_KEYS.ACCOUNTS, initialAccounts));
  const [categories, setCategories] = useState(() => loadStored(STORAGE_KEYS.CATEGORIES, initialCategories));
  const [classes, setClasses] = useState(() => loadStored(STORAGE_KEYS.CLASSES, initialClasses));
  const [feeTypes, setFeeTypes] = useState(() => loadStored(STORAGE_KEYS.FEE_TYPES, initialFeeTypes));
  const [students, setStudents] = useState(() => loadStored(STORAGE_KEYS.STUDENTS, initialStudents));
  const [invoices, setInvoices] = useState(() => loadStored(STORAGE_KEYS.INVOICES, initialInvoices));
  const [payments, setPayments] = useState(() => loadStored(STORAGE_KEYS.PAYMENTS, initialPayments));
  const [incomeTransactions, setIncomeTransactions] = useState(() => loadStored(STORAGE_KEYS.INCOME, initialOtherIncomes));
  const [expenseTransactions, setExpenseTransactions] = useState(() => loadStored(STORAGE_KEYS.EXPENSES, initialExpenses));
  const [transfers, setTransfers] = useState(() => loadStored(STORAGE_KEYS.TRANSFERS, initialTransfers));
  const [reconciliations, setReconciliations] = useState(() => loadStored(STORAGE_KEYS.RECONCILIATIONS, initialReconciliations));
  const [users, setUsers] = useState(() => loadStored(STORAGE_KEYS.USERS, initialUsers));
  const [currentUser, setCurrentUser] = useState(() => loadStored(STORAGE_KEYS.CURRENT_USER, initialUsers[1])); // Default: Bendahara
  const [periodClosings, setPeriodClosings] = useState(() => loadStored(STORAGE_KEYS.CLOSINGS, initialPeriodClosings));
  const [auditLogs, setAuditLogs] = useState(() => loadStored(STORAGE_KEYS.AUDIT_LOGS, []));

  // Notification toast state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 4000);
  };

  // Sync state to localStorage
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.SCHOOL, JSON.stringify(school)); }, [school]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts)); }, [accounts]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(classes)); }, [classes]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.FEE_TYPES, JSON.stringify(feeTypes)); }, [feeTypes]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students)); }, [students]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices)); }, [invoices]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments)); }, [payments]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.INCOME, JSON.stringify(incomeTransactions)); }, [incomeTransactions]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenseTransactions)); }, [expenseTransactions]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.TRANSFERS, JSON.stringify(transfers)); }, [transfers]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.RECONCILIATIONS, JSON.stringify(reconciliations)); }, [reconciliations]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser)); }, [currentUser]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.CLOSINGS, JSON.stringify(periodClosings)); }, [periodClosings]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(auditLogs)); }, [auditLogs]);

  // Log an audit trail
  const logAudit = (action, details) => {
    const newLog = {
      id: generateId('log'),
      timestamp: new Date().toISOString(),
      user: currentUser.name,
      role: currentUser.role,
      action,
      details
    };
    setAuditLogs(prev => [newLog, ...prev.slice(0, 99)]);
  };

  /**
   * Recalculate dynamic account balances safely from ledger
   */
  const computedAccountBalances = useMemo(() => {
    const balances = {};
    accounts.forEach(acc => {
      balances[acc.id] = acc.initialBalance || 0;
    });

    // Add verified payments
    payments.forEach(p => {
      if (p.status === 'verified' && balances[p.accountId] !== undefined) {
        balances[p.accountId] += p.amount;
      }
    });

    // Add other incomes
    incomeTransactions.forEach(inc => {
      if (balances[inc.accountId] !== undefined) {
        balances[inc.accountId] += inc.amount;
      }
    });

    // Subtract approved expenses
    expenseTransactions.forEach(exp => {
      if (exp.status === 'approved' && balances[exp.accountId] !== undefined) {
        balances[exp.accountId] -= exp.amount;
      }
    });

    // Handle internal transfers
    transfers.forEach(trf => {
      if (balances[trf.fromAccountId] !== undefined) {
        balances[trf.fromAccountId] -= trf.amount;
      }
      if (balances[trf.toAccountId] !== undefined) {
        balances[trf.toAccountId] += trf.amount;
      }
    });

    return balances;
  }, [accounts, payments, incomeTransactions, expenseTransactions, transfers]);

  /**
   * Financial Summary Totals
   */
  const totals = useMemo(() => {
    // Total income = verified payments + other incomes
    const totalPayments = payments
      .filter(p => p.status === 'verified')
      .reduce((sum, p) => sum + p.amount, 0);

    const totalOtherIncome = incomeTransactions
      .reduce((sum, inc) => sum + inc.amount, 0);

    const totalIncome = totalPayments + totalOtherIncome;

    // Total expenses = approved expenses
    const totalExpense = expenseTransactions
      .filter(e => e.status === 'approved')
      .reduce((sum, e) => sum + e.amount, 0);

    // Total Balances
    const totalBalance = Object.values(computedAccountBalances).reduce((sum, b) => sum + b, 0);

    // Cash vs Bank balances
    let totalCashBalance = 0;
    let totalBankBalance = 0;
    accounts.forEach(acc => {
      const b = computedAccountBalances[acc.id] || 0;
      if (acc.type === 'cash') totalCashBalance += b;
      else totalBankBalance += b;
    });

    // Today's transactions
    const today = new Date().toISOString().split('T')[0];
    const todayPayments = payments.filter(p => p.paymentDate?.startsWith(today)).length;
    const todayExpenses = expenseTransactions.filter(e => e.date?.startsWith(today)).length;
    const todayTransactionsCount = todayPayments + todayExpenses;

    // Student payment statistics
    const totalStudents = students.filter(s => s.status === 'Aktif').length;
    const unpaidInvoices = invoices.filter(inv => inv.status !== 'Lunas');
    const totalArrears = unpaidInvoices.reduce((sum, inv) => sum + (inv.remainingAmount || 0), 0);
    const unpaidStudentsCount = new Set(unpaidInvoices.map(inv => inv.studentId)).size;
    const paidStudentsCount = Math.max(0, totalStudents - unpaidStudentsCount);

    // Pending bank transfer verification
    const pendingTransfersCount = payments.filter(p => p.status === 'pending').length;

    return {
      totalIncome,
      totalPayments,
      totalOtherIncome,
      totalExpense,
      totalBalance,
      totalCashBalance,
      totalBankBalance,
      todayTransactionsCount,
      totalStudents,
      paidStudentsCount,
      unpaidStudentsCount,
      totalArrears,
      pendingTransfersCount
    };
  }, [payments, incomeTransactions, expenseTransactions, computedAccountBalances, accounts, students, invoices]);

  /**
   * Record Kas Payment
   */
  const recordPayment = ({
    studentId,
    invoiceId,
    amount,
    method, // 'cash' | 'transfer'
    accountId,
    payerName,
    payerType = 'Wali Murid',
    referenceNumber = '-',
    proofUrl = '',
    notes = ''
  }) => {
    const student = students.find(s => s.id === studentId);
    const invoice = invoices.find(inv => inv.id === invoiceId);
    const account = accounts.find(a => a.id === accountId);

    if (!student || !account) {
      showToast('Data siswa atau akun kas tidak valid', 'error');
      return null;
    }

    const receiptNumber = generateTransactionCode(school.receiptPrefix || 'KAS', payments.length + 1);
    const isTransfer = method === 'transfer';
    // Cash is immediately verified, transfer can be verified or pending
    const status = isTransfer ? 'verified' : 'verified'; // or default to verified if entered by treasurer

    const newPayment = {
      id: generateId('pay'),
      receiptNumber,
      paymentDate: new Date().toISOString().split('T')[0],
      studentId,
      studentName: student.name,
      className: student.className,
      payerName: payerName || student.parentName || student.name,
      payerType,
      feeTypeId: invoice?.feeTypeId || 'fee_kas_bulanan',
      feeName: invoice ? `${invoice.feeName} - ${invoice.periodName}` : 'Kas Siswa',
      invoiceId: invoiceId || null,
      amount: parseInt(amount, 10),
      method,
      accountId,
      accountName: account.name,
      referenceNumber: referenceNumber || '-',
      proofUrl: proofUrl || '',
      status,
      recordedBy: `${currentUser.name} (${currentUser.role})`,
      verifiedBy: status === 'verified' ? `${currentUser.name} (${currentUser.role})` : '-',
      notes: notes || 'Pembayaran kas siswa diterima'
    };

    setPayments(prev => [newPayment, ...prev]);

    // Update invoice status atomically
    if (invoice) {
      setInvoices(prev => prev.map(inv => {
        if (inv.id === invoiceId) {
          const newPaid = (inv.paidAmount || 0) + parseInt(amount, 10);
          const newRemaining = Math.max(0, inv.amount - newPaid);
          const newStatus = newRemaining === 0 ? 'Lunas' : 'Cicilan';
          return {
            ...inv,
            paidAmount: newPaid,
            remainingAmount: newRemaining,
            status: newStatus
          };
        }
        return inv;
      }));
    }

    logAudit('Pembayaran Kas Siswa', `Kuitansi ${receiptNumber}: ${student.name} sejumlah Rp ${amount.toLocaleString('id-ID')}`);
    showToast(`Pembayaran ${receiptNumber} berhasil disimpan!`);
    return newPayment;
  };

  /**
   * Verify pending transfer
   */
  const verifyPayment = (paymentId) => {
    setPayments(prev => prev.map(p => {
      if (p.id === paymentId) {
        return {
          ...p,
          status: 'verified',
          verifiedBy: `${currentUser.name} (${currentUser.role})`
        };
      }
      return p;
    }));
    logAudit('Verifikasi Transfer Bank', `Pembayaran ${paymentId} disahkan oleh ${currentUser.name}`);
    showToast('Transfer bank berhasil diverifikasi dan masuk ke saldo kas!');
  };

  /**
   * Record Other Income
   */
  const recordOtherIncome = ({
    categoryId,
    amount,
    accountId,
    description,
    source,
    proofNumber = ''
  }) => {
    const category = categories.find(c => c.id === categoryId);
    const account = accounts.find(a => a.id === accountId);
    const transactionNumber = generateTransactionCode(school.incomePrefix || 'INC', incomeTransactions.length + 1);

    const newIncome = {
      id: generateId('inc'),
      transactionNumber,
      date: new Date().toISOString().split('T')[0],
      categoryId,
      categoryName: category?.name || 'Pemasukan Lain',
      description,
      source: source || 'Sumbangan / Penerimaan',
      amount: parseInt(amount, 10),
      accountId,
      accountName: account?.name || 'Kas',
      proofNumber: proofNumber || `BUKTI-${Date.now()}`,
      recordedBy: `${currentUser.name} (${currentUser.role})`
    };

    setIncomeTransactions(prev => [newIncome, ...prev]);
    logAudit('Pemasukan Lain', `${transactionNumber}: ${description} sejumlah Rp ${amount.toLocaleString('id-ID')}`);
    showToast(`Pemasukan ${transactionNumber} berhasil dicatat!`);
    return newIncome;
  };

  /**
   * Record Expense with Insufficient Balance Check
   */
  const recordExpense = ({
    categoryId,
    amount,
    accountId,
    description,
    vendor,
    proofNumber = ''
  }) => {
    const expenseAmount = parseInt(amount, 10);
    const currentAccBalance = computedAccountBalances[accountId] || 0;

    // Safety rule: Rejection if insufficient balance
    if (currentAccBalance < expenseAmount) {
      showToast(
        `Saldo akun kas tidak mencukupi! Saldo saat ini: Rp ${currentAccBalance.toLocaleString('id-ID')}, pengeluaran: Rp ${expenseAmount.toLocaleString('id-ID')}. Transaksi ditolak.`,
        'error'
      );
      return null;
    }

    const category = categories.find(c => c.id === categoryId);
    const account = accounts.find(a => a.id === accountId);
    const transactionNumber = generateTransactionCode(school.expensePrefix || 'OUT', expenseTransactions.length + 1);

    const newExpense = {
      id: generateId('exp'),
      transactionNumber,
      date: new Date().toISOString().split('T')[0],
      categoryId,
      categoryName: category?.name || 'Pengeluaran Kas',
      description,
      vendor: vendor || 'Penerima Uang',
      amount: expenseAmount,
      accountId,
      accountName: account?.name || 'Kas',
      proofNumber: proofNumber || `NOTA-${Date.now()}`,
      status: 'approved',
      recordedBy: `${currentUser.name} (${currentUser.role})`,
      approvedBy: currentUser.role === 'Kepala Sekolah' ? currentUser.name : `${school.principalName} (Kepsek)`
    };

    setExpenseTransactions(prev => [newExpense, ...prev]);
    logAudit('Pengeluaran Kas', `${transactionNumber}: ${description} sejumlah Rp ${expenseAmount.toLocaleString('id-ID')}`);
    showToast(`Pengeluaran ${transactionNumber} berhasil dicatat!`);
    return newExpense;
  };

  /**
   * Internal Inter-Account Transfer (Kas <-> Bank)
   */
  const recordTransfer = ({
    fromAccountId,
    toAccountId,
    amount,
    notes = ''
  }) => {
    if (fromAccountId === toAccountId) {
      showToast('Akun sumber dan akun tujuan tidak boleh sama!', 'error');
      return null;
    }

    const transferAmount = parseInt(amount, 10);
    const fromBalance = computedAccountBalances[fromAccountId] || 0;

    if (fromBalance < transferAmount) {
      showToast(`Saldo akun sumber tidak cukup untuk transfer! Saldo: Rp ${fromBalance.toLocaleString('id-ID')}`, 'error');
      return null;
    }

    const fromAcc = accounts.find(a => a.id === fromAccountId);
    const toAcc = accounts.find(a => a.id === toAccountId);
    const transferNumber = generateTransactionCode('TRF', transfers.length + 1);

    const newTransfer = {
      id: generateId('trf'),
      transferNumber,
      date: new Date().toISOString().split('T')[0],
      fromAccountId,
      fromAccountName: fromAcc?.name,
      toAccountId,
      toAccountName: toAcc?.name,
      amount: transferAmount,
      notes: notes || `Transfer internal dari ${fromAcc?.name} ke ${toAcc?.name}`,
      recordedBy: `${currentUser.name} (${currentUser.role})`
    };

    setTransfers(prev => [newTransfer, ...prev]);
    logAudit('Transfer Antar-Akun', `${transferNumber}: Rp ${transferAmount.toLocaleString('id-ID')} dari ${fromAcc?.name} ke ${toAcc?.name}`);
    showToast(`Transfer antar-akun ${transferNumber} berhasil dilakukan!`);
    return newTransfer;
  };

  /**
   * Physical Cash & Bank Reconciliation
   */
  const recordReconciliation = ({
    accountId,
    physicalBalance,
    notes = ''
  }) => {
    const account = accounts.find(a => a.id === accountId);
    const sysBalance = computedAccountBalances[accountId] || 0;
    const phys = parseInt(physicalBalance, 10);
    const diff = phys - sysBalance;

    const newRec = {
      id: generateId('rec'),
      reconciliationDate: new Date().toISOString().split('T')[0],
      accountId,
      accountName: account?.name,
      systemBalance: sysBalance,
      physicalBalance: phys,
      difference: diff,
      status: diff === 0 ? 'Cocok' : (diff > 0 ? 'Lebih Fisik' : 'Kurang Fisik'),
      examinerName: `${currentUser.name} (${currentUser.role})`,
      notes: notes || (diff === 0 ? 'Hasil fisik dan buku kas sesuai 100%' : `Terdapat selisih Rp ${diff.toLocaleString('id-ID')}`)
    };

    setReconciliations(prev => [newRec, ...prev]);
    logAudit('Rekonsiliasi Kas', `Pemeriksaan ${account?.name}: Selisih Rp ${diff.toLocaleString('id-ID')}`);
    showToast('Hasil rekonsiliasi kas berhasil disimpan!');
    return newRec;
  };

  /**
   * Generate Bulk Invoices for a Period
   */
  const generateBulkInvoices = ({
    feeTypeId,
    periodName,
    classId = 'all',
    dueDate
  }) => {
    const fee = feeTypes.find(f => f.id === feeTypeId);
    if (!fee) return 0;

    const targetStudents = students.filter(s => {
      if (s.status !== 'Aktif') return false;
      if (classId !== 'all' && s.classId !== classId) return false;
      return true;
    });

    let generatedCount = 0;
    const newInvoices = [];

    targetStudents.forEach(st => {
      // Check duplicate invoice for same fee and period
      const exists = invoices.some(
        inv => inv.studentId === st.id && inv.feeTypeId === feeTypeId && inv.periodName === periodName
      );

      if (!exists) {
        newInvoices.push({
          id: generateId('inv'),
          invoiceNumber: `TAG-${new Date().getFullYear()}-${invoices.length + newInvoices.length + 1}`,
          feeTypeId,
          feeName: fee.name,
          periodName,
          studentId: st.id,
          studentName: st.name,
          classId: st.classId,
          className: st.className,
          amount: fee.amount,
          paidAmount: 0,
          remainingAmount: fee.amount,
          dueDate: dueDate || new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
          status: 'Belum Bayar'
        });
        generatedCount++;
      }
    });

    if (newInvoices.length > 0) {
      setInvoices(prev => [...prev, ...newInvoices]);
      logAudit('Generate Tagihan Massal', `${generatedCount} tagihan dibuat untuk periode ${periodName}`);
      showToast(`${generatedCount} tagihan kas berhasil dibuat!`);
    } else {
      showToast('Tidak ada tagihan baru dibuat (seluruh tagihan periode ini sudah ada).', 'info');
    }

    return generatedCount;
  };

  /**
   * Reset data back to default clean zero
   */
  const resetToZero = () => {
    if (window.confirm('PERINGATAN: Apakah Anda yakin ingin MENGOSONGKAN SELURUH DATA menjadi NOL untuk memulai pengisian data nyata sekolah Anda?')) {
      localStorage.clear();
      setSchool(initialSchoolData);
      setAccounts(initialAccounts);
      setCategories(initialCategories);
      setClasses([]);
      setFeeTypes([]);
      setStudents([]);
      setInvoices([]);
      setPayments([]);
      setIncomeTransactions([]);
      setExpenseTransactions([]);
      setTransfers([]);
      setReconciliations([]);
      setUsers(initialUsers);
      setCurrentUser(initialUsers[1]);
      setPeriodClosings([]);
      setAuditLogs([]);
      showToast('Seluruh data berhasil DIKOSONGKAN (NOL)! Anda sekarang dapat mulai mengisi data sesungguhnya.');
    }
  };

  const resetToDefault = resetToZero;

  const value = {
    // State
    school,
    setSchool,
    accounts,
    setAccounts,
    categories,
    setCategories,
    classes,
    setClasses,
    feeTypes,
    setFeeTypes,
    students,
    setStudents,
    invoices,
    setInvoices,
    payments,
    setPayments,
    incomeTransactions,
    setIncomeTransactions,
    expenseTransactions,
    setExpenseTransactions,
    transfers,
    setTransfers,
    reconciliations,
    setReconciliations,
    users,
    setUsers,
    currentUser,
    setCurrentUser,
    periodClosings,
    setPeriodClosings,
    auditLogs,
    toast,
    showToast,
    // Computed calculations
    computedAccountBalances,
    totals,
    // Operations
    recordPayment,
    verifyPayment,
    recordOtherIncome,
    recordExpense,
    recordTransfer,
    recordReconciliation,
    generateBulkInvoices,
    logAudit,
    resetToZero,
    resetToDefault
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
