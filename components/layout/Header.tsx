
import React from 'react';
import { UserRole } from '../../types';

interface HeaderProps {
  userRole: UserRole;
  isDarkMode: boolean;
  setIsDarkMode: (isDark: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ userRole, isDarkMode, setIsDarkMode }) => {
  return (
    <header className="flex items-center justify-between p-4 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
      <div>
        <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100">Bienvenido, {userRole}</h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">Sistema de Gestión de Cobranza Inteligente</p>
      </div>
      <div className="flex items-center space-x-4">
        <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Toggle dark mode"
        >
          {isDarkMode ? <SunIcon /> : <MoonIcon />}
        </button>
        <div className="flex items-center space-x-3">
          <img src="https://picsum.photos/seed/admin/40/40" alt="Admin" className="w-10 h-10 rounded-full" />
          <div>
            <p className="font-semibold text-sm">Director Financiero</p>
            <p className="text-xs text-neutral-500">{userRole}</p>
          </div>
        </div>
      </div>
    </header>
  );
};


const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m4.93 19.07 1.41-1.41"/><path d="m17.66 6.34 1.41-1.41"/></svg>
);
const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
);


export default Header;
