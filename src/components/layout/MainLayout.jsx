import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Toast from '../common/Toast';
import { useApp } from '../../context/AppContext';

export default function MainLayout({ currentTab, setCurrentTab, children, onQuickPayment }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { toast } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar navigation */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Topbar
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onQuickPayment={onQuickPayment}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Toast alert */}
      <Toast toast={toast} />
    </div>
  );
}
