import React from 'react';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  FileText,
  CreditCard,
  ArrowDownCircle,
  ArrowUpCircle,
  ArrowLeftRight,
  History,
  BarChart3,
  AlertOctagon,
  BookOpen,
  CheckSquare,
  Tag,
  Landmark,
  ShieldCheck,
  Settings,
  Wallet,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Sidebar({ currentTab, setCurrentTab, isOpen, setIsOpen }) {
  const { totals } = useApp();

  const menuGroups = [
    {
      title: 'MENU UTAMA',
      color: 'text-blue-400',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'students', label: 'Data Siswa', icon: Users, badge: totals.totalStudents },
        { id: 'classes', label: 'Data Kelas', icon: GraduationCap },
        { id: 'invoices', label: 'Tagihan Kas', icon: FileText }
      ]
    },
    {
      title: 'TRANSAKSI KEUANGAN',
      color: 'text-emerald-400',
      items: [
        { 
          id: 'payments', 
          label: 'Pembayaran Kas', 
          icon: CreditCard, 
          isPrimary: true,
          badge: totals.pendingTransfersCount > 0 ? `${totals.pendingTransfersCount} Cek` : null,
          badgeColor: 'bg-amber-500 text-white'
        },
        { id: 'income', label: 'Pemasukan Lain', icon: ArrowDownCircle },
        { id: 'expenses', label: 'Pengeluaran Kas', icon: ArrowUpCircle },
        { id: 'reconciliation', label: 'Transfer & Rekonsiliasi', icon: ArrowLeftRight },
        { id: 'transactions', label: 'Riwayat Transaksi', icon: History }
      ]
    },
    {
      title: 'LAPORAN',
      color: 'text-indigo-400',
      items: [
        { id: 'cash-reports', label: 'Laporan Kas', icon: BarChart3 },
        { 
          id: 'arrears', 
          label: 'Tunggakan Siswa', 
          icon: AlertOctagon,
          badge: totals.unpaidStudentsCount > 0 ? totals.unpaidStudentsCount : null,
          badgeColor: 'bg-rose-500 text-white'
        },
        { id: 'cashbook', label: 'Buku Kas', icon: BookOpen },
        { id: 'period-closing', label: 'Laporan Akhir Periode', icon: CheckSquare }
      ]
    },
    {
      title: 'PENGATURAN',
      color: 'text-amber-400',
      items: [
        { id: 'categories', label: 'Kategori Kas', icon: Tag },
        { id: 'accounts', label: 'Akun Kas & Bank', icon: Landmark },
        { id: 'users', label: 'Pengguna & Hak Akses', icon: ShieldCheck },
        { id: 'school-settings', label: 'Pengaturan Sekolah', icon: Settings }
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col
        transition-transform duration-300 ease-in-out border-r border-slate-800
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm text-white tracking-wide">
                SIKAS SISWA
              </h1>
              <p className="text-[11px] text-blue-400 font-medium">Keuangan Sekolah</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menus with Smooth Scroll */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {menuGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1">
              <h2 className={`px-3 text-[11px] font-bold uppercase tracking-wider ${group.color}`}>
                {group.title}
              </h2>
              <div className="space-y-0.5 mt-1.5">
                {group.items.map(item => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentTab(item.id);
                        if (window.innerWidth < 1024) setIsOpen(false);
                      }}
                      className={`
                        w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group
                        ${isActive 
                          ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30' 
                          : item.isPrimary
                            ? 'bg-slate-800/70 text-emerald-400 hover:bg-slate-800 hover:text-emerald-300 border border-emerald-900/40'
                            : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 transition-colors ${
                          isActive 
                            ? 'text-white' 
                            : item.isPrimary 
                              ? 'text-emerald-400' 
                              : 'text-slate-400 group-hover:text-slate-200'
                        }`} />
                        <span>{item.label}</span>
                      </div>

                      {item.badge && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          item.badgeColor || 'bg-slate-800 text-slate-300'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Quick Status Footer */}
        <div className="p-3.5 border-t border-slate-800/80 bg-slate-950/30 text-xs">
          <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
            <span>Kas Tersedia:</span>
            <span className="text-emerald-400 font-bold">
              Rp {((totals.totalBalance || 0) / 1000000).toFixed(1)} Jt
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(100, Math.max(15, (totals.totalBalance / 25000000) * 100))}%` }}
            />
          </div>
        </div>
      </aside>
    </>
  );
}
