import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Classes from './pages/Classes';
import Invoices from './pages/Invoices';
import Payments from './pages/Payments';
import Income from './pages/Income';
import Expenses from './pages/Expenses';
import Reconciliation from './pages/Reconciliation';
import Transactions from './pages/Transactions';
import CashReports from './pages/CashReports';
import ArrearsReport from './pages/ArrearsReport';
import CashBook from './pages/CashBook';
import PeriodClosing from './pages/PeriodClosing';
import Categories from './pages/Categories';
import Accounts from './pages/Accounts';
import Users from './pages/Users';
import SchoolSettings from './pages/SchoolSettings';

function AppContent() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isQuickPaymentTriggered, setIsQuickPaymentTriggered] = useState(false);

  const handleQuickPayment = () => {
    setCurrentTab('payments');
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return <Dashboard setCurrentTab={setCurrentTab} onQuickPayment={handleQuickPayment} />;
      case 'students':
        return <Students />;
      case 'classes':
        return <Classes />;
      case 'invoices':
        return <Invoices />;
      case 'payments':
        return <Payments />;
      case 'income':
        return <Income />;
      case 'expenses':
        return <Expenses />;
      case 'reconciliation':
        return <Reconciliation />;
      case 'transactions':
        return <Transactions />;
      case 'cash-reports':
        return <CashReports />;
      case 'arrears':
        return <ArrearsReport />;
      case 'cashbook':
        return <CashBook />;
      case 'period-closing':
        return <PeriodClosing />;
      case 'categories':
        return <Categories />;
      case 'accounts':
        return <Accounts />;
      case 'users':
        return <Users />;
      case 'school-settings':
        return <SchoolSettings />;
      default:
        return <Dashboard setCurrentTab={setCurrentTab} onQuickPayment={handleQuickPayment} />;
    }
  };

  return (
    <MainLayout
      currentTab={currentTab}
      setCurrentTab={setCurrentTab}
      onQuickPayment={handleQuickPayment}
    >
      {renderContent()}
    </MainLayout>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
