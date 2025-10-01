
import React, { useState, useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './components/dashboard/Dashboard';
import StudentList from './components/students/StudentList';
import Reports from './components/reports/Reports';
import Configuration from './components/configuration/Configuration';
import ToastContainer from './components/common/Toast';
import { UserRole, Student, ToastMessage, Account } from './types';
import { MOCK_STUDENTS, MOCK_CHART_OF_ACCOUNTS } from './constants';

export type View = 'dashboard' | 'students' | 'reports' | 'configuration';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentUserRole] = useState<UserRole>(UserRole.Administrator);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [chartOfAccounts, setChartOfAccounts] = useState<Account[]>(MOCK_CHART_OF_ACCOUNTS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  const addToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents(prevStudents => 
      prevStudents.map(s => s.id === updatedStudent.id ? updatedStudent : s)
    );
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard students={students} setCurrentView={setCurrentView} />;
      case 'students':
        return <StudentList students={students} onUpdateStudent={handleUpdateStudent} addToast={addToast} chartOfAccounts={chartOfAccounts} />;
      case 'reports':
        return <Reports students={students} chartOfAccounts={chartOfAccounts} />;
      case 'configuration':
        return <Configuration chartOfAccounts={chartOfAccounts} />;
      default:
        return <Dashboard students={students} setCurrentView={setCurrentView} />;
    }
  };

  return (
    <div className="flex h-screen bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          userRole={currentUserRole} 
          isDarkMode={isDarkMode} 
          setIsDarkMode={setIsDarkMode} 
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-8">
          {renderView()}
        </main>
      </div>
      <ToastContainer toasts={toasts} />
    </div>
  );
};

export default App;
