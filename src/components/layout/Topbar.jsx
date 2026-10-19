import React, { useState } from 'react';
import { Menu, Plus, UserCheck, ChevronDown, Bell, School, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Topbar({ onToggleSidebar, onQuickPayment }) {
  const { school, currentUser, setCurrentUser, users, totals } = useApp();
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const roleColors = {
    'Super Admin': 'bg-purple-100 text-purple-700 border-purple-200',
    'Bendahara': 'bg-blue-100 text-blue-700 border-blue-200',
    'Kepala Sekolah': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'Petugas Kas': 'bg-amber-100 text-amber-700 border-amber-200',
    'Pemeriksa / Auditor': 'bg-slate-100 text-slate-700 border-slate-200'
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between no-print">
      {/* Left: Mobile Toggle & School Identity */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition"
          aria-label="Buka Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-100/80 rounded-xl text-xs font-semibold text-slate-700 border border-slate-200/60">
            <School className="w-3.5 h-3.5 text-blue-600" />
            <span>{school.name}</span>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            TA {school.activeAcademicYear}
          </span>
        </div>
      </div>

      {/* Right: Quick Payment CTA + Role Switcher & User Profile */}
      <div className="flex items-center gap-3">
        {/* Quick Payment Button */}
        <button
          onClick={onQuickPayment}
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-bold hover:shadow-lg hover:shadow-blue-500/25 transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>+ Catat Bayar</span>
        </button>

        {/* Role Switcher Menu */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition text-xs"
          >
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
              {currentUser.name.charAt(0)}
            </div>
            <div className="hidden md:block text-left">
              <p className="font-semibold text-slate-800 leading-tight">{currentUser.name}</p>
              <span className={`inline-block text-[10px] font-bold px-1.5 py-0.2 rounded border ${roleColors[currentUser.role] || 'bg-slate-100 text-slate-700'}`}>
                {currentUser.role}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Role Dropdown */}
          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-700">Simulasi Ganti Hak Akses (Role)</p>
                <p className="text-[10px] text-slate-400">Pilih peran pengguna untuk menguji batasan akses</p>
              </div>
              <div className="p-1 space-y-0.5">
                {users.map(u => (
                  <button
                    key={u.id}
                    onClick={() => {
                      setCurrentUser(u);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left transition ${
                      currentUser.id === u.id ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <p className="font-semibold">{u.name}</p>
                      <p className="text-[10px] text-slate-400">{u.role}</p>
                    </div>
                    {currentUser.id === u.id && <UserCheck className="w-4 h-4 text-blue-600" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
